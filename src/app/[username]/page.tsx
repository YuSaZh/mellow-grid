import { PageRenderer } from "@/components/page/page-renderer";
import { getPageStorage } from "@/lib/storage";

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const config = await getPageStorage().getPage(username);

  return <PageRenderer config={config} />;
}
