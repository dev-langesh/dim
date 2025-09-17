import Card from "@/components/ui/Card";
import { getPlatform } from "@/redux/slices/projectSlice";
import React from "react";
import { useSelector } from "react-redux";
import Nodejs from "./Nodejs";

export default function Platform() {
  const currentPlatform = useSelector(getPlatform);

  let PlatformComponent = null;
  switch (currentPlatform) {
    case "nodejs":
      PlatformComponent = Nodejs;
      break;
    default:
      PlatformComponent = Nodejs;
      break;
  }

  return (
    <Card className="w-full lg:w-[900px] space-y-4 shadow-md">
      <PlatformComponent />
    </Card>
  );
}
