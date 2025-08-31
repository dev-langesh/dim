import { repoApi } from "@/api/repoApi";
import { HelperText } from "@/components/ui/HelperText";
import Tooltip from "@/components/ui/Tooltip";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaBitbucket, FaGithub, FaGitlab } from "react-icons/fa";

export default function SwitchGitProvider({
  provider,
  connectedRepo,
  setProvider,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function beginOAuthFlow(provider) {
    switch (provider) {
      case "github":
        return router.push(
          `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_OAUTH_CALLBACK}&scope=user repo`
        );
      case "gitlab":
        return router.push(
          `https://gitlab.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITLAB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITLAB_OAUTH_CALLBACK}&response_type=code&scope=read_user+read_api`
        );
      case "bitbucket":
        return router.push(
          `https://bitbucket.org/site/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_BITBUCKET_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_BITBUCKET_OAUTH_CALLBACK}`
        );
    }
  }

  async function switchProvider(newProvider) {
    if (provider === newProvider) {
      beginOAuthFlow(newProvider);
    }
    if (!connectedRepo[newProvider]) {
      try {
        setLoading(true);
        await repoApi.switchGitProvider({
          newProvider,
        });

        setProvider(newProvider);
      } catch (error) {
        beginOAuthFlow(newProvider);
      } finally {
        setLoading(false);
      }
    } else {
      beginOAuthFlow(newProvider);
    }
  }

  if (loading) {
    return <HelperText text="Switching Provider..." className="mt-0" />;
  }

  return (
    <div className="flex items-center gap-4">
      <HelperText text="Switch Git Providers" className="mt-0" />
      <div className="flex items-center gap-2">
        <Tooltip
          text={provider === "github" ? "Change Github" : "Switch to Github"}
        >
          <button
            onClick={() => switchProvider("github")}
            className="cursor-pointer"
          >
            <FaGithub />
          </button>
        </Tooltip>
        <Tooltip
          text={provider === "gitlab" ? "Change Gitlab" : "Switch to Gitlab"}
        >
          <button
            onClick={() => switchProvider("gitlab")}
            className="cursor-pointer"
          >
            <FaGitlab className="text-orange-600" />
          </button>
        </Tooltip>
        <Tooltip
          text={
            provider === "bitbucket"
              ? "Change Bitbucket"
              : "Switch to Bitbucket"
          }
        >
          <button
            onClick={() => switchProvider("bitbucket")}
            className="cursor-pointer"
          >
            <FaBitbucket className="text-blue-600" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
