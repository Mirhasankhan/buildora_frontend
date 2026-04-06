"use client";

import logo from "@/assets/banner.jpg";
import Container from "@/utils/Container";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { JWTDecode } from "@/utils/jwt";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { decoded } = JWTDecode();

  const role = decoded?.role as AppRole | undefined;
  const navItems = role
    ? roleNavItems[role]
    : [{ label: "Overview", href: "/" }];

  const handleLogout = () => {
    dispatch(
      setUser({
        name: "",
        email: "",
        role: "",
        token: "",
      }),
    );
    Cookies.remove("token");
    router.push("/");
  };

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
              <button
                onClick={handleLogout}
                className="ml-1 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
