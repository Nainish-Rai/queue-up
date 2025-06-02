import { getWaitlistBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { EmbeddableWaitlistForm } from "../../../components/embeddable-form";

interface EmbedPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { slug } = await params;

  let waitlist;
  try {
    waitlist = await getWaitlistBySlug(slug);
    console.log("waitlist", waitlist);
  } catch (error: unknown) {
    console.error("Error fetching waitlist:", error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4">
      <EmbeddableWaitlistForm waitlistSlug={slug} />
    </div>
  );
}
