"use client";
import { create } from "zustand";
import { getRandomAvatarOption, initializeCollapsedState } from "@/utils";
import { WrapperShape } from "@/enums";
import { SCREEN } from "@/constants";
import { AppActions, AppState, AvatarOption } from "@/types";

const useStore = create<AppState & AppActions>((set, get) => ({
  flipped: false,
  history: {
    past: [],
    present: getRandomAvatarOption({ wrapperShape: WrapperShape.Squircle }),
    future: [],
  },
  isCollapsed: initializeCollapsedState(),

  setAvatarOption: (option: AvatarOption) => {
    const { past, present } = get().history;
    set((state: AppState) => ({
      history: {
        past: [...past, present],
        present: option,
        future: [],
      },
    }));
  },

  undo: () => {
    console.log("in here");
    const { past, present, future } = get().history;
    if (past.length > 0) {
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      set(() => ({
        history: {
          past: newPast,
          present: previous,
          future: [present, ...future],
        },
      }));
    }
  },

  redo: () => {
    const { past, present, future } = get().history;
    if (future.length > 0) {
      const next = future[0];
      const newFuture = future.slice(1);
      set(() => ({
        history: {
          past: [...past, present],
          present: next,
          future: newFuture,
        },
      }));
    }
  },

  setSidebarStatus: (isCollapsed: boolean) => {
    set(() => ({ isCollapsed }));
  },

  setFlipped: (flipped) => set({ flipped }),
}));

export default useStore;
