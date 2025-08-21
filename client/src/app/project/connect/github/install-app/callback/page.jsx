"use client";

import { repoApi } from "@/api/repoApi";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GithubInstallAppCallback() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  async function handleOAuthCallback() {
    try {
      await repoApi.githubInstallAppCallback(searchParams.toString());
    } catch (e) {
      setError(true);
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
          Failed to install GitHub App. Redirecting...
        </div>
      )}
      {!error && !loading && (
        <div className="mt-4 text-green-500 font-semibold">
          Successfully installed GitHub App. Redirecting...
        </div>
      )}
    </div>
  );
}
