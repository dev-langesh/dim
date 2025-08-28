import ChangeStep from "@/components/project/common/ChangeStep";
import ProjectStepper from "@/components/project/common/ProjectStepper";
import { ProjectFormProvider } from "@/context/ProjectFormProvider";
import React from "react";

export default function CreateProjectLayout({ children }) {
  return (
    <div className="md:px-16 px-10 pt-10">
      <ProjectFormProvider>
        <ProjectStepper />
        <br />
        <br />
        {children}
        <br />
        <br />
        <ChangeStep />
      </ProjectFormProvider>
    </div>
  );
}
