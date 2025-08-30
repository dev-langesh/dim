"use client";

import React, { useEffect, useImperativeHandle, useState } from "react";
import {
  Controller,
  useFormContext,
} from "react-hook-form";
import Input from "@/components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { getGithubRepo, setState } from "@/redux/slices/projectSlice";
import { useProjectForm } from "@/context/ProjectFormProvider";
import { repoApi } from "@/api/repoApi";
import { toast } from "react-toastify";
import { SelectInput } from "@/components/ui/Select";
import SelectRepoPath from "./SelectRepoPath";
import { supportedPlatforms } from "../../constants";

export default function ProjectInfoForm({ provider, methods }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const { watch } = useFormContext();
  const source_dir = watch("source_dir");

  const dispatch = useDispatch();
  const selectedRepo = useSelector(getGithubRepo);
  const { projectFormRef } = useProjectForm();

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
            console.log(data);
            dispatch(
              setState({
                ...data,
                source_dir,
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

        <Controller
          name="platform"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectInput
              label="Platform"
              value={value}
              onChange={onChange}
              options={supportedPlatforms}
              error={errors.platform}
              helperText={errors.platform?.message}
              placeholder={"Select a platform"}
            />
          )}
        />
      </form>
    </div>
  );
}
