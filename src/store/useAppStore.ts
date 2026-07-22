import { create } from "zustand";

type CursorVariant = "default" | "view" | "drag" | "hidden";

type AppState = {
  menuOpen: boolean;
  cursorVariant: CursorVariant;
  transitionActive: boolean;
  loaderComplete: boolean;
  setMenuOpen: (value: boolean) => void;
  setCursorVariant: (variant: CursorVariant) => void;
  setTransitionActive: (value: boolean) => void;
  setLoaderComplete: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  menuOpen: false,
  cursorVariant: "default",
  transitionActive: false,
  loaderComplete: false,
  setMenuOpen: (value) => set({ menuOpen: value }),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  setTransitionActive: (value) => set({ transitionActive: value }),
  setLoaderComplete: (value) => set({ loaderComplete: value }),
}));
