"use client";

import { userApi } from "@/api/userApi";
import React, { useEffect } from "react";

export default function UserDashboard() {
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await userApi.fetchUserData();
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
      
    fetchUser();
  }, []);
  return <div>Page</div>;
}
