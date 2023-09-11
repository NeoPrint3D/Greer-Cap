import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const gameCodeAtom = atom<string>("");

export const gameUIDAtom = atomWithStorage<string>("gameUid", "");
export const lastGameCodeAtom = atomWithStorage<string>("lastGameCode", "");
