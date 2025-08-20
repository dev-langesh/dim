"use client";

import { repoApi } from "@/api/repoApi";
import { FullPageLoading } from "@/components/ui/CircularProgress";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  async function handleOAuthCallback() {
    await repoApi.githubInstallAppCallback(searchParams.toString());

    router.push("/project/new");
  }

  // useEffect(() => {
  //   handleOAuthCallback();
  // }, []);

  return <FullPageLoading />;
}
