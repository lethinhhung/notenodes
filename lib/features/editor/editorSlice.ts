import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EditorBackgroundMode = "default" | "muted" | "glass";
export type GridMode = "off" | "normal" | "loose";

interface EditorState {
  backgroundMode: EditorBackgroundMode;
  gridMode: GridMode;
  content: unknown[];
}

const initialState: EditorState = {
  backgroundMode: "default",
  gridMode: "off",
  content: [],
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    cycleBackgroundMode: (state) => {
      const modes: EditorBackgroundMode[] = ["default", "muted", "glass"];
      const currentIndex = modes.indexOf(state.backgroundMode);
      state.backgroundMode = modes[(currentIndex + 1) % modes.length];
    },
    setBackgroundMode: (state, action: PayloadAction<EditorBackgroundMode>) => {
      state.backgroundMode = action.payload;
    },
    cycleGridMode: (state) => {
      const modes: GridMode[] = ["off", "normal", "loose"];
      const currentIndex = modes.indexOf(state.gridMode);
      state.gridMode = modes[(currentIndex + 1) % modes.length];
    },
    setGridMode: (state, action: PayloadAction<GridMode>) => {
      state.gridMode = action.payload;
    },
    setContent: (state, action: PayloadAction<unknown[]>) => {
      state.content = action.payload;
    },
  },
});

export const { cycleBackgroundMode, setBackgroundMode, cycleGridMode, setGridMode, setContent } = editorSlice.actions;
export default editorSlice.reducer;