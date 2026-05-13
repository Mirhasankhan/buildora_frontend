"use client";

import logo from "@/assets/logo.buil.jpg";
import Container from "@/utils/Container";
import { useProfileQuery } from "@/redux/features/auth/authApi";
import { JWTDecode } from "@/utils/jwt";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

type AppRole = "ADMIN" | "SITE_MANAGER" | "WORKER";

type NavItem = {
  label: string;
  href: string;
};

const roleNavItems: Record<AppRole, NavItem[]> = {
  ADMIN: [
    { label: "Overview", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Workers", href: "/workers" },
    { label: "Withdraw Requests", href: "/withdraw-requests" },
    { label: "Messages", href: "/messages" },
  ],
  SITE_MANAGER: [
    { label: "Overview", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Messages", href: "/messages" },
  ],
  WORKER: [
    { label: "Overview", href: "/" },
    { label: "Earnings", href: "/earnings" },
    { label: "Withdraws", href: "/withdraws" },
    { label: "Messages", href: "/messages" },
  ],
};

const isRouteActive = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const Header = () => {
  const pathname = usePathname();
  const { decoded, token } = JWTDecode();
  const { data } = useProfileQuery(token ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const router = useRouter();

  // Validate that role is one of the expected values
  const isValidRole = (r: any): r is AppRole => {
    return ["ADMIN", "SITE_MANAGER", "WORKER"].includes(r);
  };

  const role = isValidRole(decoded?.role) ? decoded.role : undefined;
  const navItems =
    role && roleNavItems[role]
      ? roleNavItems[role]
      : [{ label: "Overview", href: "/" }];

  const profileImage = data?.result?.profileImage as string | undefined;
  useEffect(() => {
    if (!role) {
      router.push("/auth/login");
    }
  }, [role, router]);

  if (!role) return null;

  return (
    <div className="border-b border-stone-200 bg-white/90 px-4 py-1 backdrop-blur-md">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              className="h-24 w-24 rounded-full object-cover"
              src={logo}
              alt="Logo"
              height={70}
              width={70}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const active = isRouteActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {role && (
              <Link href="/profile" className="ml-1" aria-label="Go to profile">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-stone-200 bg-stone-100 ring-2 ring-transparent transition hover:ring-orange-200">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-stone-500">
                      {decoded?.userName?.[0] || "U"}
                    </div>
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
