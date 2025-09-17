"use client";

import Platform from "@/components/project/steps/platform/Platform";
import SourceCode from "@/components/project/steps/sourceCode/SourceCode";
import { getCurrentStep } from "@/redux/slices/projectSlice";
import React from "react";
import { useSelector } from "react-redux";

export default function CreateProjectPage() {
  const currentStep = useSelector(getCurrentStep);
  let CurrentComponent = SourceCode;

  switch (currentStep) {
    case 1:
      CurrentComponent = SourceCode;
      break;
    case 2:
      CurrentComponent = Platform;
      break;
    case 3:
      CurrentComponent = Platform;
      break;
    case 4:
      CurrentComponent = Platform;
      break;
    default:
      CurrentComponent = SourceCode;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <CurrentComponent />
    </div>
  );
}
