import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

function getExpectedToken(): string | null {
  const secret = process.env.REVALIDATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update("atpdev-portal-revalidate").digest("hex");
}

export async function POST(req: NextRequest) {
  const expected = getExpectedToken();
  const provided = req.headers.get("x-revalidate-token") || "";
  if (!expected || provided.length !== expected.length) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const match = crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  if (!match) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let paths: string[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.paths)) {
      paths = body.paths.filter((p: unknown): p is string => typeof p === "string" && p.startsWith("/"));
    }
  } catch {
    // body opcional
  }

  revalidatePath("/", "layout");
  for (const p of paths) {
    revalidatePath(p);
  }

  return NextResponse.json({ ok: true, revalidatedAt: Date.now() });
}
