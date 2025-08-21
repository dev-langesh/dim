"use client";

import { useEffect, useState } from "react";
import ConnectRemoteRepository from "./ConnectRemoteRepository";
import { repoApi } from "@/api/repoApi";

export default function SourceCode() {
  const [repos, setRepos] = useState([]);
  const [repoConnected, setRepoConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  async function getRepos() {
    try {
      setLoading(true);
      const response = await repoApi.getGitRepos("bitbucket","q=d");
      setRepos(response.data);
    } catch (error) {
      setRepoConnected(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRepos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!repoConnected) {
    return <ConnectRemoteRepository />;
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
