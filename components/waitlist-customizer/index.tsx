"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  WaitlistCustomizerProps,
  CustomizationOptions,
  deviceSizes,
} from "./types";
import { ControlPanel } from "./ControlPanel";
import { PreviewPanel } from "./PreviewPanel";

export function WaitlistCustomizer({
  waitlistName,
  waitlistSlug,
}: WaitlistCustomizerProps) {
  const [options, setOptions] = useState<CustomizationOptions>({
    theme: "light",
    formWidth: 400,
    buttonColor: "#3b82f6",
    buttonTextColor: "#ffffff",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: 8,
    includeLeaderboard: true,
    referrerTracking: true,
    includeBrandBadge: false,
    includeNameField: true,
    buttonText: "Join Waitlist",
    headerText: `Join ${waitlistName}`,
    descriptionText: "Be the first to know when we launch!",
    placeholderText: "Enter your email",
    embedType: "iframe",
    animation: "fade",
    fontSize: 16,
    padding: 24,
    shadowIntensity: 2,
  });

  const [initialOptions, setInitialOptions] =
    useState<CustomizationOptions | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewDevice, setPreviewDevice] =
    useState<keyof typeof deviceSizes>("desktop");
  const [activeSection, setActiveSection] = useState("appearance");
  const [isSaving, setIsSaving] = useState(false);
  const [waitlistId, setWaitlistId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSavingButtonHovered, setIsSavingButtonHovered] = useState(false);

  useEffect(() => {
    const loadWaitlistData = async () => {
      try {
        const response = await fetch(`/api/waitlist/${waitlistSlug}`);
        if (response.ok) {
          const waitlist = await response.json();
          setWaitlistId(waitlist.id);

          if (waitlist.customization) {
            const mergedOptions = { ...options, ...waitlist.customization };
            setOptions(mergedOptions);
            setInitialOptions(mergedOptions);
          } else {
            setInitialOptions(options);
          }
        }
      } catch (error) {
        console.error("Failed to load waitlist data:", error);
        toast.error("Failed to load waitlist customization");
      }
    };

    loadWaitlistData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitlistSlug]);

  useEffect(() => {
    if (!initialOptions) return;

    const optionsChanged =
      JSON.stringify(options) !== JSON.stringify(initialOptions);
    setHasChanges(optionsChanged);
  }, [options, initialOptions]);

  const saveCustomization = async () => {
    if (!waitlistId || !hasChanges) return;

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/waitlists/${waitlistId}/customization`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(options),
        }
      );

      if (!response.ok) throw new Error("Failed to save changes");

      toast.success("Customization saved successfully!");
      setInitialOptions(options);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save customization:", error);
      toast.error("Failed to save customization");
    } finally {
      setIsSaving(false);
    }
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const generateSimpleEmbedCode = () => {
    return `<div id="waitlist-widget-${waitlistSlug}" data-waitlist-slug="${waitlistSlug}"></div>
<script src="${baseUrl}/api/widget/script"></script>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateSimpleEmbedCode());
      setCopied(true);
      toast.success("Embed code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy embed code");
    }
  };

  const updateOption = <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-full overflow-hidden">
      <PreviewPanel
        options={options}
        waitlistName={waitlistName}
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={saveCustomization}
        isSavingButtonHovered={isSavingButtonHovered}
        setIsSavingButtonHovered={setIsSavingButtonHovered}
      />
      <ControlPanel
        options={options}
        updateOption={updateOption}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        copied={copied}
        onCopyEmbedCode={copyToClipboard}
        embedCode={generateSimpleEmbedCode()}
        hasChanges={hasChanges}
      />
    </div>
  );
}
