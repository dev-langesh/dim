import ProjectStepper from "@/components/project/common/ProjectStepper";
import React from "react";

export default function CreateProjectLayout({ children }) {
  return (
    <div>
      <ProjectStepper />
      {children}
    </div>
  );
}
