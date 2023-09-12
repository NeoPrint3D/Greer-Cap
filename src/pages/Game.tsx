import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useAnimationFrame,
} from "framer-motion";
import Face from "../assets/face.png";
import BG from "../assets/bg.png";
import { data } from "../assets/questions";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { atom, useAtom, useAtomValue } from "jotai";
import Laser from "../assets/laser.svg";
import { useSearchParam, useWindowSize } from "react-use";
import {
  Timestamp,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { gameUIDAtom, lastGameCodeAtom } from "../utils/Atoms";
import { firestore } from "../utils/firebase";
import {
  useCollection,
  useDocument,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import QRCode from "react-qr-code";
import { Blobs } from "../components/Blobs";
import { BiMoney, BiSolidCrown } from "react-icons/bi";
const previousQuestionsAtom = atom<number[]>([]);
const difficultyEnum = {
  15: "Easy",
  25: "Medium",
  50: "Hard",
} as const;

function getRemainingTime(endDate: Date) {
  const total = endDate.getTime() - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  return {
    seconds: minutes * 60 + seconds,
    text: "0" + minutes + ":" + (seconds < 10 ? "0" : "") + seconds,
  };
}

const GameViews = {
  user: <UserView />,
  host: <HostView />,
  loading: <StatusScreen>Loading...</StatusScreen>,
  notFound: <StatusScreen>Game not found</StatusScreen>,
};

const UserViews = {
  game: <GameView />,
  ended: <StatusScreen>Game Ended!</StatusScreen>,
  loading: <StatusScreen>Loading...</StatusScreen>,
  waitForHost: <StatusScreen>Waiting for host...</StatusScreen>,
  playerNotFound: <StatusScreen>Player not found</StatusScreen>,
};

export default function Game() {
  const gameCode = useParams<{ gameId: string }>().gameId!;
  const isHost = useSearchParam("host");
  const [gameSnapshot, loading] = useDocument(
    doc(firestore, "games", gameCode)
  );

  // move greer from left to right in a loop

  return (
    <BackGroundWrapper>
      {
        GameViews[
          loading
            ? "loading"
            : !gameSnapshot?.exists()
            ? "notFound"
            : isHost
            ? "host"
            : "user"
        ]
      }
    </BackGroundWrapper>
  );
}

function UserView() {
  const gameCode = useParams<{ gameId: string }>().gameId!;
  const gameUid = useAtomValue(gameUIDAtom);
  const [gameSnapshot] = useDocument(doc(firestore, "games", gameCode));
  const [userDoc, loadingUser] = useDocumentOnce(
    doc(firestore, "games", gameCode, "users", gameUid || "null")
  );
  return UserViews[
    loadingUser
      ? "loading"
      : !userDoc?.exists()
      ? "playerNotFound"
      : gameSnapshot?.data()?.ended
      ? "ended"
      : gameSnapshot?.data()?.started
      ? "game"
      : "waitForHost"
  ];
}

function HostView() {
  const gameCode = useParams<{ gameId: string }>().gameId!;
  const lastGameCode = useAtomValue(lastGameCodeAtom);
  const greerRef = useRef<HTMLImageElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);

  // realtime for the players
  const [userSnapshot] = useCollection(
    collection(firestore, "games", gameCode, "users")
  );
  const [gameSnapshot] = useDocument(doc(firestore, "games", gameCode));
  const remainingTime = useTimeString(gameSnapshot);
  useEffect(() => {
    // move the laser to greer

    if (laserRef.current && greerRef.current) {
      laserRef.current.style.transform = `translate(${
        greerRef.current?.getBoundingClientRect().x + 36
      }px, ${greerRef.current?.getBoundingClientRect().y + 36}px)`;
    }

    const main = async () => {
      if (remainingTime === "00:00") {
        await updateDoc(doc(firestore, "games", gameCode), {
          ended: true,
        });
      }

      const { seconds } = getRemainingTime(
        new Date(gameSnapshot?.data()?.endAt.seconds * 1000)
      );

      const userUIDs = userSnapshot?.docs.map((doc) => doc.id);
      const randomUserUID =
        userUIDs?.[Math.floor(Math.random() * userUIDs.length)];
      // if the remaing time is an interval of 60 seconds
      if (
        seconds % 60 === 0 &&
        seconds !== 0 &&
        seconds !== 600 &&
        randomUserUID
      ) {
        // get the users

        // subtract 50 points from a random user
        await updateDoc(
          doc(firestore, "games", gameCode, "users", randomUserUID),
          {
            points: increment(-50),
          }
        );
        const takenAwayUsername = userSnapshot?.docs
          .find((doc) => doc.id === randomUserUID)
          ?.data().username;
        toast.error(
          `Greer's wrath 🔥 took away 50 points from ${takenAwayUsername} `
        );

        // shoot the laser at the player
        // get the player's position
        const playerRef = document.getElementById(randomUserUID);
        if (playerRef && greerRef.current && laserRef.current) {
          const { x, y } = playerRef.getBoundingClientRect();
          const { x: greerX, y: greerY } =
            greerRef.current.getBoundingClientRect();
          const angle = Math.atan2(y - greerY, x - greerX) * (180 / Math.PI);
          laserRef.current.style.transform = `translate(${x + 32}px, ${
            y + 48
          }px) rotate(${angle + 90}deg)`;
          laserRef.current.style.opacity = "1";
          await new Promise((resolve) => setTimeout(resolve, 500));
          laserRef.current.style.opacity = "0";
        }
      }
    };
    main();
  }, [remainingTime, gameCode]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden text-white">
      <motion.div className="absolute z-50 flex opacity-0" ref={laserRef}>
        <img src={Laser} alt="" />
        <img src={Laser} alt="" />
      </motion.div>
      <div className="flex items-center justify-evenly">
        <div className="mt-10 flex items-end justify-center text-6xl">
          {gameSnapshot?.data()?.ended
            ? "Game Ended"
            : gameSnapshot?.data()?.started
            ? "Game Started"
            : "Waiting for players..."}
        </div>
        <div className="mt-5 flex items-center justify-center gap-3 text-9xl">
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
          <motion.img
            initial={{ rotate: 0, scale: 0 }}
            animate={{ rotate: [1020, 0], scale: 1 }}
            transition={{
              duration: 3,
              delay: 2.5,
            }}
            ref={greerRef}
            src={Face}
            alt="Face"
            className="h-32 w-32"
          />
        </div>
        <div>
          {gameSnapshot?.data()?.started && (
            <div className="mt-10 flex items-center justify-center text-6xl">
              <div className="flex flex-col items-center gap-5">
                <h1 className="text-3xl">Game Time Left</h1>
                <h1 className="text-3xl">
                  {remainingTime === "00:00" ? "Time's Up!" : remainingTime}
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-full w-full items-center justify-evenly">
        <div className="main-container flex h-[50vh] flex-col items-center">
          <h1 className="mb-10 text-center text-5xl font-black">Join Game?</h1>
          <div className="flex h-full flex-col items-center justify-center  gap-5">
            <h1 className="text-center text-5xl font-black">
              Game Code: {gameCode || lastGameCode}
            </h1>
            <QRCode
              className="rounded-xl sm:mt-10"
              value={`${window.origin}/?code=${gameCode || lastGameCode}`}
            />
          </div>
        </div>
        {/* <!-- leaderboard --> */}
        <div className="main-container flex h-[50vh] w-1/2  flex-col gap-5 overflow-y-scroll">
          <h1 className="mb-10 text-center text-5xl font-black">Leaderboard</h1>
          <AnimatePresence>
            <LayoutGroup>
              {userSnapshot?.docs
                .sort((a, b) => b.data().points - a.data().points)
                .map((doc, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: -1000 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -1000 }}
                    transition={{ delay: index * 0.25 }}
                    className="flex h-40 items-center justify-between rounded-xl bg-primary/40 p-5  shadow-xl shadow-primary/50 backdrop-blur-3xl backdrop-brightness-50"
                    layoutId={doc.id}
                    id={doc.id}
                    key={doc.id}
                  >
                    <div className="flex items-center gap-5">
                      {[0, 1, 2].includes(index) && doc.data().points > 0 && (
                        <BiSolidCrown
                          className={`${
                            index === 0
                              ? "text-yellow-300"
                              : index === 1
                              ? "text-gray-300"
                              : "text-orange-300"
                          }`}
                          size={64}
                        />
                      )}
                      <h1 className="text-center text-5xl font-bold">
                        {doc.data().username}
                      </h1>
                    </div>

                    <h1 className="flex items-center justify-center gap-3 text-4xl">
                      {doc.data().points}
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                        <img src={Face} alt="Greer" className="z-10" />
                        <div className="absolute text-black opacity-70">
                          <BiMoney size={48} />
                        </div>
                      </div>
                    </h1>
                  </motion.div>
                ))}
            </LayoutGroup>
          </AnimatePresence>
        </div>
      </div>
      <div className="mb-20 flex items-center justify-center">
        {remainingTime === "00:00" && (
          <Link to="/">
            <button className="btn btn-primary btn-lg">Go Home</button>
          </Link>
        )}
        {!gameSnapshot?.data()?.started && (
          <button
            className="btn btn-primary btn-lg"
            onClick={async () => {
              await updateDoc(doc(firestore, "games", gameCode), {
                started: true,
                endAt: Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000)),
              });
            }}
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useTimeString(gameSnapshot: any) {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    if (!gameSnapshot?.data()?.started) return;
    const interval = setInterval(() => {
      const remainingTime = getRemainingTime(
        new Date(gameSnapshot?.data()?.endAt.seconds * 1000)
      );
      console.log(remainingTime);
      if (remainingTime.seconds <= 0) {
        clearInterval(interval);
        setRemainingTime("00:00");
      } else {
        setRemainingTime(remainingTime.text);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameSnapshot?.data()?.endAt, gameSnapshot?.data()?.started]);
  return remainingTime;
}

function StatusScreen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex h-screen w-screen flex-col items-center  justify-center gap-5 ">
        <div className="text-3xl">{children}</div>
        <Link to="/">
          <button className="link">Go Home</button>
        </Link>
      </div>
    </motion.div>
  );
}

function GameView() {
  const gameId = useParams<{ gameId: string }>().gameId;
  const gameUid = useAtomValue(gameUIDAtom);
  const [sameId, setSameId] = useState(false);
  const [isCorrect, setIsCorrect] = useState<"yes" | "no" | "">("");

  const [questionIndex, setQuestionIndex] = useState(
    Math.floor(Math.random() * data.questions.length)
  );

  const [previousQuestions, setPreviousQuestions] = useAtom(
    previousQuestionsAtom
  );
  const [userResponse, setUserResponse] = useState("");
  const [answeringQuestion, setAnsweringQuestion] = useState(false);

  const greerRef = useRef<HTMLImageElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  async function submitAnswer(userResponse: string) {
    setUserResponse(userResponse);
    console.log(userResponse);
    if (answeringQuestion) return;
    setAnsweringQuestion(true);

    const randomIndex = Math.floor(Math.random() * data.questions.length);
    // see if the question has been asked before
    if (previousQuestions.includes(randomIndex)) {
      // if it has, try again
      submitAnswer(userResponse);
      return;
    }

    setPreviousQuestions([...previousQuestions, randomIndex]);
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(data.questions[questionIndex].answer === userResponse);

    if (userResponse === "" || !gameId || !gameUid || sameId) return;
    try {
      if (data.questions[questionIndex].answer === userResponse) {
        ///games/342160/users/IZdQanpVKHLSCUdYOMs
        setIsCorrect("yes");

        await updateDoc(doc(firestore, "games", gameId, "users", gameUid), {
          points: increment(data.questions[questionIndex].points),
        });
        toast.success("Correct!");
        setAnsweringQuestion(false);

        setSameId(false);
      } else {
        setIsCorrect("no");
        await updateDoc(doc(firestore, "games", gameId, "users", gameUid), {
          points: increment(-10),
        });
        setAnsweringQuestion(false);
        setSameId(false);

        toast.error("Incorrect!");
      }
    } catch (e) {
      console.log(e);
      toast.error(`Error: ${e}`);
    }
    setAnsweringQuestion(false);
    setQuestionIndex(randomIndex);
    setIsCorrect("");
  }
  useAnimationFrame(async () => {
    if (greerRef.current && focusRef.current && laserRef.current) {
      const { x, y } = greerRef.current.getBoundingClientRect();
      const { x: focusX, y: focusY } = focusRef.current.getBoundingClientRect();

      // roate the laser

      if (userResponse !== "") {
        const userResponseIndex =
          data.questions[questionIndex].options.indexOf(userResponse);
        const answerY = document
          .getElementById(`answer-${userResponseIndex}`)
          ?.getBoundingClientRect().y;

        if (answerY) {
          // add a transition

          laserRef.current.style.transition =
            "all 0.5s cubic-bezier(0, 0, 0, 1)";
          laserRef.current.style.opacity = "1";
          laserRef.current.style.transform = `translate(${width / 2 - 32}px, ${
            answerY - 96
          }px) rotate(${
            Math.atan2(answerY - y, focusX - x) * (180 / Math.PI) + 90
          }deg)`;
          await new Promise((resolve) => setTimeout(resolve, 500));
          laserRef.current.style.opacity = "0";
        }
        return;
      }

      const angle = Math.atan2(focusY - y, focusX - x) * (180 / Math.PI);

      laserRef.current.style.transform = `translate(${x + 32}px, ${
        y + 48
      }px) rotate(${angle + 90}deg)`;
    }
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key="game"
      className="min-h-screen w-screen overflow-y-auto overflow-x-hidden"
    >
      <motion.div className="absolute z-10 flex opacity-0" ref={laserRef}>
        <img src={Laser} alt="" />
        <img src={Laser} alt="" />
      </motion.div>
      <div className="mb-10 grid h-screen w-full grid-rows-2 overflow-x-hidden">
        <div className="mt-20 flex flex-col">
          <div className="flex flex-col items-center  gap-5">
            <h1 className="text-center text-2xl font-bold">
              {data.questions[questionIndex].question.toUpperCase()}
            </h1>

            <h2 className="w-fit rounded-md bg-blue-900 px-2 py-1 text-center text-xl font-bold text-white">
              Difficulty:{" "}
              <span
                className={`
            ${
              data.questions[questionIndex].points === 15
                ? "text-green-300"
                : data.questions[questionIndex].points === 25
                ? "text-yellow-300"
                : "text-red-300"
            }
                
                `}
              >
                {difficultyEnum[data.questions[questionIndex].points]} +
                {data.questions[questionIndex].points}
              </span>
            </h2>
          </div>

          <div className="mt-10 flex">
            <motion.div
              className="h-32 w-32"
              animate={{
                x: [0, width - 128, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              ref={greerRef}
            >
              <motion.div
                className="h-32 w-32"
                animate={{
                  rotate: [0, 45, 0, -45, 0, 360],
                  scale: [1, 1, 1],
                }}
                style={{ originX: 0.5, originY: 0.5 }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              >
                <img src={Face} alt="Face" className="h-32 w-32" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        <motion.div
          layout
          className="mb-10 mt-auto flex w-full flex-col gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mx-auto h-10 w-10" ref={focusRef} />
          <AnimatePresence>
            {!answeringQuestion && (
              <motion.div
                className="flex w-full flex-col items-center gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {data.questions[questionIndex].options.map((answer, index) => (
                  <button
                    id={`answer-${index}`}
                    key={index}
                    className={` mx-5 w-5/6 scale-100 rounded-md px-2 py-4  text-black transition-all duration-300 hover:scale-105 active:scale-90
                ${
                  //   answer === userResponse &&
                  isCorrect === "yes" && answer === userResponse
                    ? "animate-ping bg-green-300"
                    : isCorrect === "no" && answer === userResponse
                    ? "animate-ping bg-red-300"
                    : "bg-secondary"
                }
                
                `}
                    onClick={() => submitAnswer(answer)}
                  >
                    {answer}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

function BackGroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Blobs />
      <div
        style={{
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="overflow-x-hidden bg-blue-300/40 text-white backdrop-blur-sm">
          {children}
        </div>
      </div>
    </>
  );
}
