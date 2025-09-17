"use client";

import { useAuth } from "@/context/AuthProvider";
import Button from "@/components/ui/Button";
import AccountCircle from "@/components/ui/AccountCircle";
import { Dropdown } from "@/components/ui/Dropdown";
import { authApi } from "@/app/auth/api/authApi";
import Link from "next/link";

export default function Header() {
  const { auth } = useAuth();

  const isAuthenticated = auth?.isAuthenticated;
  const user = auth?.user;

  async function logout() {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    window.location.href = `/auth/login`;
  }

  return (
    <nav className="bg-white w-full h-[45px] flex items-center justify-between px-4 md:px-6 shadow-sm">
      <Link href="/" className="font-semibold">
        DIM
      </Link>

      {!isAuthenticated ? (
        <div className="flex gap-3">
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/project/new" className="">
            <Button size="sm">New Project</Button>
          </Link>

          <Dropdown>
            <Dropdown.Trigger>
              <AccountCircle
                picture={user?.picture}
                caption={user?.name || user?.email}
              />
            </Dropdown.Trigger>

            <Dropdown.Content>
              <div className="px-3 py-2 border-b border-border mb-2">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
              </div>

              <Dropdown.Item onSelect={logout}>Sign out</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>
      )}
    </nav>
  );
}
