"use client";

import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { cn } from "@/utils/cn";
import { Label } from "@/components/ui/Label";
import { getGithubRepo } from "@/redux/slices/projectSlice";
import { repoApi } from "@/api/repoApi";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import TreeNode from "@/components/project/steps/sourceCode/TreeNode";

export default function SelectRepoPath() {
  const { control, watch } = useFormContext();
  const selectedRepo = useSelector(getGithubRepo);
  const branch = watch("git_branch");

  const [rootNodes, setRootNodes] = useState([]);
  const [openTree, setOpenTree] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchChildren(path = "") {
    try {
      const res = await repoApi.getRepoContents(
        `repository=${selectedRepo}&branch=${branch}&returnFormat=folders&path=${path}`
      );
      return res.data || [];
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch repo contents"
      );
      return [];
    }
  }

  async function loadRoot() {
    setLoading(true);
    try {
      const res = await fetchChildren("");
      setRootNodes(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedRepo && branch) {
      loadRoot();
    }
  }, [branch]);

  function toggleTree() {
    setOpenTree((prev) => !prev);
  }

  return (
    <div className="w-full">
      <Label className="pb-2">Source Directory</Label>
      <Controller
        name="source_dir"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Input value={field.value || ""} placeholder="./" readOnly />
              <Button
                disabled={!selectedRepo || !branch}
                type="button"
                onClick={toggleTree}
              >
                {openTree ? "Done" : "Change"}
              </Button>
            </div>{" "}
            <div
              className={cn(
                "border border-border rounded-[6px] bg-white shadow-xs max-h-64 overflow-auto ",
                loading && "border-none",
                !openTree && "hidden"
              )}
            >
              {loading ? (
                <div className="space-y-1">
                  <div className="h-8 w-full bg-zinc-200 animate-pulse rounded-[6px]"></div>{" "}
                  <div className="h-8 w-full bg-zinc-200 animate-pulse rounded-[6px]"></div>
                </div>
              ) : rootNodes.length === 0 ? (
                <div className="text-sm text-on-muted p-2">
                  No folders found
                </div>
              ) : (
                rootNodes.map((node) => (
                  <TreeNode
                    key={node.path}
                    node={node}
                    onSelect={(path) => field.onChange(path)}
                    fetchChildren={fetchChildren}
                    selectedPath={field.value}
                    open={openTree}
                  />
                ))
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}
