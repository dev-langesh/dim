import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    currentStep: 2,
    app_id: null,
    app_name: null,
    git_repo: null,
    git_branch: null,
    source_dir: "",
    platform: null,
    install_script: "",
    build_script: "",
    test_script: "",
    start_script: "",
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
    putState: (state, action) => {
      state.value = action.payload;
    },
    resetState: (state) => {
      state.value = initialState.value;
    },
  },
});

export const {
  nextStep,
  prevStep,
  resetStep,
  setStep,
  setState,
  resetState,
  putState,
} = projectSlice.actions;

export const getCurrentStep = (state) => state.project.value.currentStep;
export const getGithubRepo = (state) => state.project.value.git_repo;
export const getPlatform = (state) => state.project.value.platform;
export const getProjectState = (state) => state.project.value;

export default projectSlice.reducer;
