"use client";

import React, { useEffect, useImperativeHandle, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { getGithubRepo, setState } from "@/redux/slices/projectSlice";
import { useProjectForm } from "@/context/ProjectFormProvider";
import { repoApi } from "@/api/repoApi";
import { toast } from "react-toastify";
import { SelectInput } from "@/components/ui/Select";
import { projectInfoSchema } from "@/schemas/project.schema";
import SelectRepoPath from "./SelectRepoPath";

export default function ProjectInfoForm({ provider }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const selectedRepo = useSelector(getGithubRepo);
  const { projectFormRef } = useProjectForm();

  const methods = useForm({
    resolver: zodResolver(projectInfoSchema),
    defaultValues: {
      app_name: "",
      git_repo: "",
      git_branch: "",
      source_dir: "", 
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = methods;

  useImperativeHandle(projectFormRef, () => ({
    submitForm: () =>
      new Promise((resolve) => {
        handleSubmit(
          (data) => {
            dispatch(
              setState({
                app_name: data.projectName,
                github_repo: data.repoUrl,
              })
            );
            resolve(true);
          },
          (err) => {
            resolve(false);
          }
        )();
      }),
  }));

  useEffect(() => {
    setValue("repoUrl", selectedRepo || "");
  }, [selectedRepo, setValue]);

  useEffect(() => {
    setBranches([]);
    setValue("git_branch", "");
    if (!selectedRepo?.trim()) return;
    getRepoBranches();
  }, [selectedRepo, provider]);

  useEffect(() => {
    for (const branch of branches) {
      if (branch === "main" || branch === "master") {
        setValue("git_branch", branch);
        break;
      }
    }
  }, [branches]);

  async function getRepoBranches() {
    try {
      setLoading(true);
      const res = await repoApi.getRepoBranches(
        `repository=${selectedRepo}&provider=${provider}`
      );

      if (!res.data?.length) {
        setBranches([]);
        return toast.error("No branches found in the repository");
      }

      setBranches(res.data);
    } catch (error) {
      toast.error(error.response?.data.message || "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Project Information</h2>

      <FormProvider {...methods}>
        <form className="space-y-4">
          <Input
            label="Project Name"
            placeholder="Project Name"
            {...register("app_name")}
            error={errors.app_name}
            helperText={errors.app_name?.message}
          />

          <Controller
            name="git_branch"
            control={control}
            rules={{ required: "Branch selection is required" }}
            render={({ field: { onChange, value } }) => (
              <SelectInput
                label="Git Branch"
                value={value}
                onChange={onChange}
                options={branches.map((branch) => ({
                  value: branch,
                  label: branch,
                }))}
                error={errors.git_branch}
                helperText={errors.git_branch?.message}
                placeholder={loading ? "Loading..." : "Select a branch"}
                disabled={branches.length === 0 || loading}
              />
            )}
          />

          <SelectRepoPath provider={provider} />
        </form>
      </FormProvider>
    </div>
  );
}
