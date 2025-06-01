import { getWaitlistBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { EmbeddableWaitlistForm } from "../../../components/embeddable-form";

interface EmbedPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    buttonText?: string;
    color?: string;
  }>;
}

export default async function EmbedPage({
  params,
  searchParams,
}: EmbedPageProps) {
  const { slug } = await params;
  const { buttonText = "Join Waitlist", color = "#3b82f6" } =
    await searchParams;

  let waitlist;
  try {
    waitlist = await getWaitlistBySlug(slug);
  } catch (error: unknown) {
    console.error("Error fetching waitlist:", error);
    notFound();
  }

  const decodedColor = decodeURIComponent(color);

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/10">
      <div className="p-4">
        <EmbeddableWaitlistForm
          waitlistSlug={slug}
          waitlistName={waitlist.name}
          signupCount={waitlist._count.signups}
          buttonText={buttonText}
          primaryColor={decodedColor}
        />
      </div>
    </div>
  );
}
