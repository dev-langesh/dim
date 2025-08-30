import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    currentStep: 1,
    app_id: null,
    app_name: null,
    github_repo: null,
    git_branch: null,
    source_dir: "",
    platform: null
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    nextStep: (state) => {
      state.value.currentStep += 1;
    },
    prevStep: (state) => {
      state.value.currentStep -= 1;
    },
    resetStep: (state) => {
      state.value.currentStep = 1;
    },
    setStep: (state, action) => {
      state.value.currentStep = action.payload;
    },
    setState: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    resetState: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { nextStep, prevStep, resetStep, setStep, setState, resetState } =
  projectSlice.actions;

export const getCurrentStep = (state) => state.project.value.currentStep;
export const getGithubRepo = (state) => state.project.value.github_repo;

export default projectSlice.reducer;
