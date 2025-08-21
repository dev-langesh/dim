import React, { Suspense } from "react";

export default function ConnectLayout({ children }) {
  return <Suspense fallback={<div></div>}>{children}</Suspense>;
}
