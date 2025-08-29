import ChangeStep from "@/components/project/common/ChangeStep";
import ProjectStepper from "@/components/project/common/ProjectStepper";
import { ProjectFormProvider } from "@/context/ProjectFormProvider";
import React from "react";

export default function CreateProjectLayout({ children }) {
  return (
    <div className="md:px-16 p-10 max-w-[1700px] mx-auto">
      <ProjectFormProvider>
        <ProjectStepper />
        <br />
        <br />
        <div className="min-h-[60vh]">{children}</div>
        <br />
        <br />
        <ChangeStep />
      </ProjectFormProvider>
    </div>
  );
}
