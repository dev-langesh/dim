"use client";

import React, { useEffect, useImperativeHandle, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import Input from "@/components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  getGithubRepo,
  getProjectState,
  putState,
  setState,
} from "@/redux/slices/projectSlice";
import { useProjectForm } from "@/context/ProjectFormProvider";
import { toast } from "react-toastify";
import Switch from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";

export default function Nodejs({ provider, methods }) {
  const [scripts, setScripts] = useState({
    build: false,
    test: false,
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { projectFormRef } = useProjectForm();
  const state = useSelector(getProjectState);

  useEffect(() => {
    if (state.build_script) setScripts((p) => ({ ...p, build: true }));
    if (state.test_script) setScripts((p) => ({ ...p, test: true }));
  }, [state]);

  useEffect(() => {
    console.log(scripts);
  }, [scripts]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: state,
  });

  useImperativeHandle(projectFormRef, () => ({
    submitForm: () =>
      new Promise((resolve) => {
        handleSubmit(
          (data) => {
            console.log("data", data);
            const payload = { ...data };
            ["build", "test"].forEach((script) => {
              if (!scripts[script]) {
                delete payload[`${script}_script`];
              } else if (!payload[`${script}_script`]) {
                payload[`${script}_script`] = `npm run ${script}`;
              }
            });
            console.log("payload", payload);
            dispatch(putState(payload));
            resolve(true);
          },
          (err) => {
            resolve(false);
          }
        )();
      }),
  }));

  function toogleScript(script) {
    setScripts((prev) => ({
      ...prev,
      [script]: !prev[script],
    }));
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Platform: Node JS</h2>

      <form className="space-y-4">
        <Input
          label="Install Script"
          placeholder="default : npm install"
          {...register("install_script")}
          error={errors.install_script}
          helperText={errors.install_script?.message}
        />
        <div>
          <Label className="pb-2">Build Script</Label>
          <div className="flex items-center gap-4">
            <Input
              placeholder="default : npm run build"
              {...register("build_script")}
              error={errors.build_script}
              helperText={errors.build_script?.message}
              disabled={!scripts["build"]}
            />
            <Switch
              checked={scripts["build"]}
              onClick={() => toogleScript("build")}
            />
          </div>
        </div>
        <div>
          <Label className="pb-2">Test Script</Label>
          <div className="flex items-center gap-4">
            <Input
              placeholder="default : npm run test"
              {...register("test_script")}
              error={errors.test_script}
              helperText={errors.test_script?.message}
              disabled={!scripts["test"]}
            />
            <Switch
              checked={scripts["test"]}
              onClick={() => toogleScript("test")}
            />
          </div>
        </div>
        <Input
          label="Start Script"
          placeholder="default : npm start"
          {...register("start_script")}
          error={errors.start_script}
          helperText={errors.start_script?.message}
        />
      </form>
    </div>
  );
}
