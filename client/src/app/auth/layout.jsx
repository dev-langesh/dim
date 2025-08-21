import React, { Suspense } from "react";

export default function AuthLayout({ children }) {
  return <Suspense fallback={<div></div>}>{children}</Suspense>;
}
