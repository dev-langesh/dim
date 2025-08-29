"use client";

import { repoApi } from "@/api/repoApi";
import Input from "@/components/ui/Input";
import {  getGithubRepo, setState } from "@/redux/slices/projectSlice";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaGithub, FaGitlab, FaBitbucket } from "react-icons/fa";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Tooltip from "@/components/ui/Tooltip";

export default function SelectRepository({ setConnectedRepo, provider }) {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const githubRepo = useSelector(getGithubRepo);
  const dispatch = useDispatch();

  const Icon =
    provider === "github"
      ? FaGithub
      : provider === "gitlab"
      ? FaGitlab
      : provider === "bitbucket"
      ? FaBitbucket
      : null;

  // store AbortController to cancel old requests
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // cancel previous request immediately when query changes
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const handler = setTimeout(() => {
      getRepos(query, controller.signal);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  async function getRepos(searchQuery, signal) {
    setLoading(true);

    try {
      const response = await repoApi.getGitRepos(`q=${searchQuery}`, {
        signal,
      });
      setRepos(response.data);
    } catch (error) {
      if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED")
        return;
      setConnectedRepo?.(false);
      if (error.response?.data?.errorCode === 4001) return;
      toast.error(
        error.response?.data?.message || "Failed to fetch repositories"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(repo) {
    dispatch(setState({ github_repo: repo }));
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold  capitalize">
          <Icon className="text-xl" /> Select {provider} Repository
        </h2>
        <div className="flex items-center gap-2">
          {provider !== "github" && (
            <Tooltip text="Connect Github">
              <Link
                href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_OAUTH_CALLBACK}&scope=user`}
              >
                <FaGithub />
              </Link>
            </Tooltip>
          )}
          {provider !== "gitlab" && (
            <Tooltip text="Connect Gitlab">
              <Link
                href={`https://gitlab.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITLAB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITLAB_OAUTH_CALLBACK}&response_type=code&scope=read_user+read_api`}
              >
                <FaGitlab className="text-orange-600" />
              </Link>
            </Tooltip>
          )}
          {provider !== "bitbucket" && (
            <Tooltip text="Connect Bitbucket">
              <Link
                href={`https://bitbucket.org/site/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_BITBUCKET_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_BITBUCKET_OAUTH_CALLBACK}`}
              >
                <FaBitbucket className="text-blue-600" />
              </Link>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories..."
        />
      </div>

      {loading && (
        <ul className="mt-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              className="h-10 w-full animate-pulse bg-zinc-200 rounded-[6px]"
            />
          ))}
        </ul>
      )}

      {!loading && (
        <ul className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
          {repos.map((repo) => {
            const isSelected = githubRepo === repo;
            return (
              <li
                key={repo.id ?? repo.name}
                onClick={() => handleSelect(repo)}
                aria-selected={isSelected}
                className={cn(
                  "px-4 py-2 rounded-[6px] border border-border bg-zinc-50 transition-colors cursor-pointer flex items-center gap-2",
                  "hover:bg-zinc-100",
                  isSelected && "bg-zinc-200 border-zinc-400 hover:bg-zinc-200"
                )}
              >
                <Icon className="text-sm" /> {repo}
              </li>
            );
          })}
        </ul>
      )}

      {!loading && repos.length === 0 && query && (
        <p className="mt-3 text-sm text-muted-foreground">
          No repositories found.
        </p>
      )}
    </div>
  );
}
