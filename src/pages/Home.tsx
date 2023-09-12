import { useEffect, useMemo, useState } from "react";
import { Blobs } from "../components/Blobs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Filter from "bad-words";
import { toast } from "react-hot-toast";
import { useDebounce, useSearchParam } from "react-use";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../utils/firebase";
import Greer from "../assets/greer.png";
import { motion } from "framer-motion";
import { atom, useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { gameCodeAtom, gameUIDAtom, lastGameCodeAtom } from "../utils/Atoms";

type FormType = "join" | "username";
// type this
const FromEnum = {
  join: <JoinGameView />,
  username: <UsernameView />,
};

const formTypeAtom = atom<FormType>("join");

export default function Home() {
  const queryCode = useSearchParam("code");
  const [, setgameCode] = useAtom(gameCodeAtom);
  const [, setFormType] = useAtom(formTypeAtom);
  const formType = useAtomValue(formTypeAtom);
  const Form = useMemo(() => FromEnum[formType], [formType]);

  useEffect(() => {
    console.log(queryCode);
    if (queryCode) {
      setgameCode(queryCode);
      setFormType("username");
    }
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <Blobs />
      <div className="flex h-full w-full flex-col items-center sm:justify-center">
        <motion.div
          className="mt-10 h-48 w-48"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 90, 0, -90, 0, 360], scale: [1, 1, 1] }}
          style={{ originX: 0.5, originY: 0.5 }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        >
          <img
            src={Greer}
            alt="Greer"
            className="h-48 w-48 rounded-full bg-primary/40 shadow-2xl shadow-primary backdrop-hue-rotate-180"
          />
        </motion.div>
        <div className="z-50 flex w-full flex-col items-center justify-center">
          <div className="py-10 text-center text-4xl font-bold ">
            WELCOME TO{" "}
            <div className="flex items-center justify-center gap-2 text-5xl font-black text-purple-900">
              {"GREER CAP".split("").map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -1000, scale: 0, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.25 }}
                >
                  {letter}
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            className="main-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            key={String(formType)}
          >
            {Form}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function UsernameView() {
  const navigate = useNavigate();
  const filter = new Filter({ placeHolder: "x" });
  const [gameCode] = useAtom(gameCodeAtom);

  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [, setGameUID] = useAtom(gameUIDAtom);
  const [, setLastgameCode] = useAtom(lastGameCodeAtom);
  const [creatingUser, setCreatingUser] = useState(false);

  useDebounce(
    async () => {
      console.log(gameCode);
      if (username.length === 0) return;
      if (username.length < 3) {
        toast.error("Username must be at least 3 characters");
        setIsUsernameValid(false);
        return;
      }
      if (filter.isProfane(username)) {
        toast.error("Username contains profanity");
        setIsUsernameValid(false);
        return;
      }
      // see if the username exists
      const users = await getDocs(
        query(
          collection(firestore, "games", gameCode, "users"),
          where("username", "==", username)
        )
      );
      if (users.docs.length > 0) {
        toast.error("Username already exists");
        setIsUsernameValid(false);
        return;
      }
      // get all of the users with the same username in

      toast.success("Username is valid");
      setIsUsernameValid(true);
    },
    1000,
    [username]
  );

  async function joinGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // see if the username exists
    if (!isUsernameValid || creatingUser) return;
    setCreatingUser(true);
    // create the user
    const res = await addDoc(
      collection(firestore, "games", gameCode, "users"),
      {
        username: filter.clean(username[0].toUpperCase() + username.slice(1)),
        createdAt: new Date().toISOString(),
        ready: false,
        points: 0,
      }
    );
    setGameUID(res.id);
    setLastgameCode(gameCode);
    navigate(`/game/${gameCode}`);
  }
  return (
    <form className="flex flex-col items-center gap-5" onSubmit={joinGame}>
      <input
        type="text"
        value={
          username
            ? filter
                .clean(username[0].toUpperCase() + username.slice(1))
                .replace(" ", "")
            : ""
        }
        onChange={(e) => setUsername(e.target.value)}
        className="input input-primary w-full text-black"
        placeholder="Enter your name"
      />
      <button
        className="btn btn-primary w-full"
        type="submit"
        disabled={!isUsernameValid}
      >
        Join Game
      </button>
    </form>
  );
}

function JoinGameView() {
  const [, setFormType] = useAtom(formTypeAtom);
  const [, setgameCode] = useAtom(gameCodeAtom);
  const [isgameCodeValid, setIsgameCodeValid] = useState(false);
  const [currentgameCode, setCurrentgameCode] = useState("");
  const navigate = useNavigate();
  async function createGame() {
    // generate a new 6 digit code
    // end in 15 minutes this needs to be a timestamp
    const code = Math.floor(100000 + Math.random() * 900000);
    await setDoc(doc(firestore, "games", code.toString()), {
      createdAt: Timestamp.fromDate(new Date(Date.now() + 7 * 60 * 1000)),
      endAt: null,
      started: false,
    });
    setgameCode(code.toString());
    navigate(`/game/${code}?host=true`);
  }

  async function handlegameCodes(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isgameCodeValid) return;
    setIsgameCodeValid(true);
    setFormType("username");
    setgameCode(currentgameCode);
  }

  useDebounce(
    async () => {
      if (currentgameCode.length === 0) return;
      if (currentgameCode.length !== 6) {
        toast.error("game code must be 6 digits");
        setIsgameCodeValid(false);
        return;
      }
      const doesgameExist = (
        await getDoc(doc(firestore, "games", currentgameCode))
      ).exists();
      if (!doesgameExist) {
        toast.error("game does not exist");
        setIsgameCodeValid(false);
        return;
      }
      toast.success("game code is valid");
      setIsgameCodeValid(true);
    },
    1000,
    [currentgameCode]
  );

  return (
    <>
      <form
        className="flex flex-col items-center gap-5"
        onSubmit={handlegameCodes}
      >
        <input
          type="text"
          value={currentgameCode.replace(/\D/g, "")}
          onChange={(e) =>
            setCurrentgameCode(e.target.value.replace(/\D/g, ""))
          }
          maxLength={6}
          className="input input-primary w-full text-black"
          placeholder="Enter game code"
        />
        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={!isgameCodeValid}
        >
          Join game
        </button>
      </form>
      <div className="divider">OR</div>
      <button
        className="btn btn-secondary w-full shadow-2xl shadow-primary"
        onClick={createGame}
      >
        Create Game
      </button>
    </>
  );
}
