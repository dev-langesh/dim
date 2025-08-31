"use client";

import { repoApi } from "@/api/repoApi";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function GithubOAuthCallback() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  async function handleOAuthCallback() {
    try {
      await repoApi.githubOauthCallback(searchParams.toString());
      // router.push(
      //   `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`
      // );
    } catch (e) {
      setError(true);
      toast.error(e.response?.data?.message);
    } finally {
      setLoading(false);
    }

    router.push("/project/new");
  }

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      <CircularProgress />
      {error && (
        <div className="mt-4 text-red-500 font-semibold">
          Failed to authorize GitHub OAuth. Redirecting...
        </div>
      )}
      {!error && !loading && (
        <div className="mt-4 text-green-500 font-semibold">
          Successfully authorized GitHub OAuth. Redirecting...
        </div>
      )}
    </div>
  );
}
