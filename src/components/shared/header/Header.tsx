"use client";

import logo from "@/assets/banner.jpg";
import Container from "@/utils/Container";
import { useProfileQuery } from "@/redux/features/auth/authApi";
import { JWTDecode } from "@/utils/jwt";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const { decoded } = JWTDecode();
  const { data } = useProfileQuery("");

  const role = decoded?.role as AppRole | undefined;
  const navItems = role
    ? roleNavItems[role]
    : [{ label: "Overview", href: "/" }];

  const profileImage = data?.result?.profileImage as string | undefined;

  return (
    <div className="border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur-md">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              className="h-9 w-9 rounded-full object-cover"
              src={logo}
              alt="Logo"
              height={40}
              width={40}
            />
            <h1 className="text-lg font-semibold tracking-tight text-stone-800">
              abiola
            </h1>
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
                      ? "bg-orange-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.35)]"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {role && (
              <Link href="/profile" className="ml-1" aria-label="Go to profile">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-stone-200 bg-stone-100 ring-2 ring-transparent transition hover:ring-orange-200">
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
