import { NextResponse, type NextRequest } from "next/server";

/** Only the real domain is indexed: preview and *.vercel.app hosts get
 * `X-Robots-Tag: noindex` so they never compete with www.dmatek.ng. */
export function proxy(request: NextRequest) {
  const res = NextResponse.next();
  const host = (request.headers.get("host") ?? "").split(":")[0];
  if (!/(^|\.)dmatek\.ng$/.test(host)) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
