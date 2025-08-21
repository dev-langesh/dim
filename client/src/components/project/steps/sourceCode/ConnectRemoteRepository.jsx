"use client";

import Link from "next/link";
import React from "react";

export default function ConnectRemoteRepository() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Link
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_OAUTH_CALLBACK}&scope=user`}
      >
        <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition">
          Connect GitHub Repository
        </button>
      </Link>

      <Link
        href={`https://bitbucket.org/site/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_BITBUCKET_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_BITBUCKET_OAUTH_CALLBACK}`}
      >
        <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition">
          Connect Bitbucket
        </button>
      </Link>
    </div>
  );
}
