"use client";

import { useEffect, useState } from "react";
import ConnectRemoteRepository from "./ConnectRemoteRepository";
import { repoApi } from "@/api/repoApi";
import { toast } from "react-toastify";

export default function SourceCode() {
  const [repos, setRepos] = useState([]);
  const [repoConnected, setRepoConnected] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingRepos, setLoadingRepos] = useState(true);

  async function getRepoConnection() {
    try {
      setLoading(true);
      const res = await repoApi.getRepoConnectionStatus();
      setRepoConnected(res.data.connected);
      const host = res.data.repo.github
        ? "github"
        : res.data.repo.bitbucket
        ? "bitbucket"
        : "gitlab";
      setLoading(false);
      await getRepos(host);
    } catch (error) {
      setRepoConnected(false);
    } finally {
      setLoading(false);
    }
  }

  async function getRepos(query = "") {
    try {
      const response = await repoApi.getGitRepos(`q=${query}`);
      setRepos(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch repositories"
      );
    } finally {
      setLoadingRepos(false);
    }
  }

  useEffect(() => {
    getRepoConnection();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!repoConnected) {
    return <ConnectRemoteRepository className="mt-14" />;
  }

  return (
    <div>
      <h2>Connected Repositories</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>{repo}</li>
        ))}
      </ul>
    </div>
  );
}
