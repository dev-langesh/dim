"use client";

import { repoApi } from "@/api/repoApi";
import { FullPageLoading } from "@/components/ui/CircularProgress";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  async function handleOAuthCallback() {
    await repoApi.githubOauthCallback(searchParams.toString());

    router.push(
      `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`
    );
  }

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  return <FullPageLoading />;
}
