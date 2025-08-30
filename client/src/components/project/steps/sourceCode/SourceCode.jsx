"use client";

import { useEffect, useState } from "react";
import ConnectRemoteRepository from "./ConnectRemoteRepository";
import { repoApi } from "@/api/repoApi";
import SelectRepository from "./SelectRepository";
import Card from "@/components/ui/Card";
import ProjectInfoForm from "./ProjectInfoForm";
import Separator from "@/components/ui/Separator";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectInfoSchema } from "@/schemas/project.schema";

export default function SourceCode() {
  const [connectedRepo, setConnectedRepo] = useState(true);
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(true);

  const methods = useForm({
    resolver: zodResolver(projectInfoSchema),
  });

  async function getRepoConnection() {
    try {
      setLoading(true);
      const res = await repoApi.getRepoConnectionStatus();
      setProvider(
        res.data.repo?.github
          ? "github"
          : res.data.repo?.gitlab
          ? "gitlab"
          : res.data.repo?.bitbucket
          ? "bitbucket"
          : ""
      );
      setConnectedRepo(res.data.repo);
      setLoading(false);
    } catch (error) {
      setConnectedRepo(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRepoConnection();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (!connectedRepo) {
    return <ConnectRemoteRepository className="mt-14" />;
  }

  return (
    <Card className="flex items-start justify-center w-full md:w-[700px] lg:w-[800px] gap-4 shadow-md max-md:flex-col flex-shrink-0">
      <FormProvider {...methods}>
        <SelectRepository
          setConnectedRepo={setConnectedRepo}
          provider={provider}
        />
        {/* <div className="h-[350px] w-[1px] bg-zinc-400"></div> */}
        <Separator
          orientation="vertical"
          className="self-stretch h-auto max-md:hidden"
        />
        <Separator className="md:hidden" />
        <ProjectInfoForm provider={provider} methods={methods} />
      </FormProvider>
    </Card>
  );
}
