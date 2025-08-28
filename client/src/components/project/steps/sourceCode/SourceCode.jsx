"use client";

import { useEffect, useState } from "react";
import ConnectRemoteRepository from "./ConnectRemoteRepository";
import { repoApi } from "@/api/repoApi";
import SelectRepository from "./SelectRepository";
import Card from "@/components/ui/Card";
import ProjectInfoForm from "./ProjectInfoForm";

export default function SourceCode() {
  const [connectedRepo, setConnectedRepo] = useState(true);
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(true);

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
    return <div>Loading...</div>;
  }

  if (!connectedRepo) {
    return <ConnectRemoteRepository className="mt-14" />;
  }

  return (
    <Card className="flex items-start justify-center md:w-5/6 gap-4 mx-auto shadow-md">
      <SelectRepository
        setConnectedRepo={setConnectedRepo}
        provider={provider}
      />
      <div className="h-[350px] w-[1px] bg-zinc-400"></div>
      <ProjectInfoForm provider={provider} />
    </Card>
  );
}
