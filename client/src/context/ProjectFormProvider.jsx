"use client";

import React, { createContext, useContext, useRef } from "react";

const ProjectFormContext = createContext(null);

export function ProjectFormProvider({ children }) {
  const projectFormRef = useRef(null);

  return (
    <ProjectFormContext.Provider value={{ projectFormRef }}>
      {children}
    </ProjectFormContext.Provider>
  );
}

export function useProjectForm() {
  return useContext(ProjectFormContext);
}
