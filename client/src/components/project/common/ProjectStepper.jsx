"use client";

import React from "react";
import { Stepper } from "@/components/ui/Stepper";
import { getCurrentStep } from "@/redux/slices/projectSlice";
import { useSelector } from "react-redux";
import { FaCode } from "react-icons/fa";
import { FaHashnode } from "react-icons/fa6";
import { SiNginxproxymanager } from "react-icons/si";
import { IoShieldCheckmark } from "react-icons/io5";

export default function ProjectStepper() {
  const currentStep = useSelector(getCurrentStep);

  return (
    <Stepper
      steps={[
        { name: "Source Code", icon: <FaCode /> },
        { name: "Platform", icon: <FaHashnode /> },
        { name: "Web Server", icon: <SiNginxproxymanager /> },
        { name: "Review", icon: <IoShieldCheckmark /> },
      ]}
      currentStep={currentStep}
      className="md:px-24 py-4"
    />
  );
}
