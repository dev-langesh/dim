"use client";

import React, { useEffect, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { getGithubRepo, setState } from "@/redux/slices/projectSlice";
import { useProjectForm } from "@/context/ProjectFormProvider";
import { repoApi } from "@/api/repoApi";
import { toast } from "react-toastify";
import { SelectInput } from "@/components/ui/Select";

// Zod schema for validation
const projectInfoSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  repoUrl: z.string().url("Enter a valid repository URL"),
});

export default function ProjectInfoForm({ provider }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const selectedRepo = useSelector(getGithubRepo);
  const { projectFormRef } = useProjectForm();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(projectInfoSchema),
    defaultValues: {
      projectName: "",
      repoUrl: selectedRepo || "",
    },
  });

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
    if (!selectedRepo?.trim()) return;
    getRepoBranches();
  }, [selectedRepo, provider]);

  async function getRepoBranches() {
    try {
      setLoading(true);
      const res = await repoApi.getRepoBranches(
        `repository=${selectedRepo}&provider=${provider}`
      );

      if (!res.data?.length)
        return toast.error("No branches found in the repository");
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
          placeholder="Project Name"
          {...register("projectName")}
          error={errors.projectName}
          helperText={errors.projectName?.message}
        />

        <Controller
          name="branch"
          control={control}
          rules={{ required: "Branch selection is required" }}
          render={({ field: { onChange, value } }) => (
            <SelectInput
              label="Branch"
              value={value}
              onChange={onChange}
              options={branches.map((branch) => ({
                value: branch,
                label: branch,
              }))}
              helperText={errors.branch?.message}
              placeholder={loading ? "Loading..." : "Select a branch"}
              disabled={branches.length === 0 || loading}
            />
          )}
        />
      </form>
    </div>
  );
}
