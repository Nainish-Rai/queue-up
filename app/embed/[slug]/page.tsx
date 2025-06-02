import { getWaitlistBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { EmbeddableWaitlistForm } from "../../../components/embeddable-form";

interface EmbedPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    theme?: "light" | "dark" | "auto";
    formWidth?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    includeLeaderboard?: string;
    referrerTracking?: string;
    includeBrandBadge?: string;
    buttonText?: string;
    headerText?: string;
    descriptionText?: string;
    placeholderText?: string;
    animation?: "none" | "fade" | "slide" | "bounce";
    fontSize?: string;
    padding?: string;
    shadowIntensity?: string;
  }>;
}

export default async function EmbedPage({
  params,
  searchParams,
}: EmbedPageProps) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;

  const customization = {
    theme: searchParamsResolved.theme || "light",
    formWidth: parseInt(searchParamsResolved.formWidth || "400"),
    buttonColor: decodeURIComponent(
      searchParamsResolved.buttonColor || "#3b82f6"
    ),
    buttonTextColor: decodeURIComponent(
      searchParamsResolved.buttonTextColor || "#ffffff"
    ),
    backgroundColor: decodeURIComponent(
      searchParamsResolved.backgroundColor || "#ffffff"
    ),
    textColor: decodeURIComponent(searchParamsResolved.textColor || "#1f2937"),
    borderRadius: parseInt(searchParamsResolved.borderRadius || "8"),
    includeLeaderboard: searchParamsResolved.includeLeaderboard === "true",
    referrerTracking: searchParamsResolved.referrerTracking === "true",
    includeBrandBadge: searchParamsResolved.includeBrandBadge === "true",
    buttonText: searchParamsResolved.buttonText || "Join Waitlist",
    headerText: searchParamsResolved.headerText || "",
    descriptionText:
      searchParamsResolved.descriptionText ||
      "Be the first to know when we launch!",
    placeholderText: searchParamsResolved.placeholderText || "Enter your email",
    animation: searchParamsResolved.animation || "fade",
    fontSize: parseInt(searchParamsResolved.fontSize || "16"),
    padding: parseInt(searchParamsResolved.padding || "24"),
    shadowIntensity: parseInt(searchParamsResolved.shadowIntensity || "2"),
  };

  let waitlist;
  try {
    waitlist = await getWaitlistBySlug(slug);
  } catch (error: unknown) {
    console.error("Error fetching waitlist:", error);
    notFound();
  }

  const isDarkTheme =
    customization.theme === "dark" ||
    (customization.theme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const backgroundClass = isDarkTheme
    ? "min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    : "min-h-full bg-gradient-to-br from-background via-background to-muted/10";

  return (
    <div
      className={backgroundClass}
      style={{ backgroundColor: customization.backgroundColor }}
    >
      <div style={{ padding: `${customization.padding}px` }}>
        <EmbeddableWaitlistForm
          waitlistSlug={slug}
          waitlistName={waitlist.name}
          signupCount={waitlist._count.signups}
          customization={customization}
        />
      </div>
    </div>
  );
}
