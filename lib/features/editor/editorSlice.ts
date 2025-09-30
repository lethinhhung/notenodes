import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  isMuted: boolean;
}

const initialState: EditorState = {
  isMuted: false,
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
  },
});

export const { toggleMuted, setMuted } = editorSlice.actions;
export default editorSlice.reducer;