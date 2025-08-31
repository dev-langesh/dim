"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import React from "react";
import { FaBitbucket, FaGithub, FaGitlab } from "react-icons/fa";

export default function ConnectRemoteRepository({ className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 flex-wrap",
        className
      )}
    >
      <RepoCard
        Icon={FaGithub}
        repoName="Github"
        OAuthUri={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_OAUTH_CALLBACK}&scope=user repo`}
      ></RepoCard>{" "}
      <RepoCard
        Icon={FaBitbucket}
        repoName="Bitbucket"
        OAuthUri={`https://bitbucket.org/site/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_BITBUCKET_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_BITBUCKET_OAUTH_CALLBACK}`}
        className="bg-blue-600 hover:bg-blue-700 "
      ></RepoCard>
      <RepoCard
        Icon={FaGitlab}
        repoName="GitLab"
        OAuthUri={`https://gitlab.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITLAB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITLAB_OAUTH_CALLBACK}&response_type=code&scope=read_user+read_api`}
        className="bg-orange-600 hover:bg-orange-700"
      />
    </div>
  );
}

function RepoCard({ OAuthUri, className, repoName, Icon }) {
  return (
    <Link
      href={OAuthUri}
      className={cn(
        "px-6 py-3 w-[200px] bg-gray-900 text-white font-semibold rounded-md shadow-md hover:bg-gray-950 transition inline-flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      <Icon className="text-2xl" />
      <span>Connect {repoName}</span>
    </Link>
  );
}
