import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    currentStep: 1,
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
    updateState: (state, action) => {
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
  updateState,
  resetState,
} = projectSlice.actions;

export const getCurrentStep = (state) => state.project.value.currentStep;

export default projectSlice.reducer;
