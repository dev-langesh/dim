"use client";

import Button from "@/components/ui/Button";
import { useProjectForm } from "@/context/ProjectFormProvider";
import {
  getCurrentStep,
  nextStep,
  prevStep,
} from "@/redux/slices/projectSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ChangeStep() {
  const currentStep = useSelector(getCurrentStep);
  const dispatch = useDispatch();
  const lastStep = 4;
  const { projectFormRef } = useProjectForm();

  async function handleChange(action) {
    if (action === "next" && currentStep < lastStep) {
      const success = await projectFormRef.current?.submitForm();
      if (success) {
        dispatch(nextStep());
      }
    } else if (action === "back" && currentStep > 1) {
      dispatch(prevStep());
    }
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Button
        onClick={() => handleChange("back")}
        disabled={currentStep === 1}
        className="px-6"
      >
        Back
      </Button>
      <Button onClick={() => handleChange("next")} className="px-6">
        Next
      </Button>
    </div>
  );
}
