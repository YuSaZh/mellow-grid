import { getDeploymentMode, getPageStorage } from "@/lib/storage";
import type { PageConfig } from "@/lib/page-config/types";

export async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const config = await getPageStorage().getPage(username);

  return Response.json(config);
}

export async function POST(request: Request, { params }: { params: Promise<{ username: string }> }) {
  if (getDeploymentMode() === "static") {
    return Response.json({ error: "Static mode cannot persist public page changes." }, { status: 400 });
  }

  const { username } = await params;
  const config = (await request.json()) as PageConfig;
  const saved = await getPageStorage().savePage(username, config);

  return Response.json(saved);
}
