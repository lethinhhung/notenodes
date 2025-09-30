import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  isMuted: boolean;
  content: unknown[];
}

const initialState: EditorState = {
  isMuted: false,
  content: [],
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    toggleMuted: (state) => {
      state.isMuted = !state.isMuted;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    setContent: (state, action: PayloadAction<unknown[]>) => {
      state.content = action.payload;
    },
  },
});

export const { toggleMuted, setMuted, setContent } = editorSlice.actions;
export default editorSlice.reducer;