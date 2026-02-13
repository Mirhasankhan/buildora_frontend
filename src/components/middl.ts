import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface ExtendedJwtPayload {
  role?: "User" | "Lawyer";
}

export async function middleware(req: Request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const pathname = new URL(req.url).pathname;

  let role: ExtendedJwtPayload["role"] | null = null;

  if (tokenCookie?.value) {
    try {
      const decoded = jwtDecode<ExtendedJwtPayload>(tokenCookie.value);
      role = decoded.role ?? null;
    } catch {
      role = null; // treat invalid token as guest
    }
  }

  const loginUrl = new URL("/auth/login", req.url);

  // Helpers
  const is = (path: string) => pathname.startsWith(path);

  // --------- ACCESS CONTROL ---------

  // Guest
  if (!role) {
    const guestBlocked = ["/messages", "/book", "/premium"];
    if (guestBlocked.some((p) => is(p))) {
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Lawyer
  if (role === "Lawyer") {
    const lawyerBlocked = ["/lawyer", "/book", "/create-post"];
    if (is("/lawyer") || lawyerBlocked.some((p) => is(p))) {
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // User
  if (role === "User") {
    const userBlocked = ["/premium"];
    if (userBlocked.some((p) => is(p))) {
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
