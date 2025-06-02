"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Palette,
  Layout,
  Settings2,
  Sparkles,
} from "lucide-react";
import { CustomizationOptions } from "./types";
import { AppearanceSection } from "./AppearanceSection";
import { LayoutSection } from "./LayoutSection";
import { ContentSection } from "./ContentSection";
import { FeaturesSection } from "./FeaturesSection";

interface ControlPanelProps {
  options: CustomizationOptions;
  updateOption: <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  copied: boolean;
  onCopyEmbedCode: () => void;
  embedCode: string;
  hasChanges: boolean;
}

const sections = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "layout", label: "Layout", icon: Layout },
  { id: "content", label: "Content", icon: Settings2 },
  { id: "features", label: "Features", icon: Sparkles },
];

export function ControlPanel({
  options,
  updateOption,
  activeSection,
  setActiveSection,
  copied,
  onCopyEmbedCode,
  embedCode,
  hasChanges,
}: ControlPanelProps) {
  const renderActiveSection = () => {
    switch (activeSection) {
      case "appearance":
        return (
          <AppearanceSection options={options} updateOption={updateOption} />
        );
      case "layout":
        return <LayoutSection options={options} updateOption={updateOption} />;
      case "content":
        return <ContentSection options={options} updateOption={updateOption} />;
      case "features":
        return (
          <FeaturesSection options={options} updateOption={updateOption} />
        );
      default:
        return (
          <AppearanceSection options={options} updateOption={updateOption} />
        );
    }
  };

  return (
    <div className="w-80 lg:w-80 md:w-72 sm:w-64 border-r bg-muted/30 flex flex-col flex-shrink-0 overflow-hidden">
      <div className="p-3 md:p-4 border-b flex-shrink-0">
        <h2 className="font-semibold text-base md:text-lg">Customize</h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Adjust settings to match your brand
        </p>
      </div>

      <div className="p-3 md:p-4 border-b flex-shrink-0">
        <div className="grid grid-cols-2 gap-1 md:gap-2">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className="justify-start gap-1 md:gap-2 text-xs md:text-sm p-2"
              >
                <IconComponent className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span className="truncate">{section.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-4 border-t">
        <Button onClick={onCopyEmbedCode} className="w-full" size="lg">
          {copied ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? "Copied!" : "Copy Embed Code"}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 md:p-4 border-t bg-muted/30 flex-shrink-0"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium truncate">Embed Code</span>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              Simple
            </Badge>
          </div>

          {hasChanges && (
            <Badge
              variant="outline"
              className="text-xs text-amber-600 border-amber-600"
            >
              Unsaved Changes
            </Badge>
          )}
        </div>

        <div className="bg-slate-900 text-slate-100 p-3 md:p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-32 overflow-y-auto w-full">
          <code className="whitespace-pre-wrap break-all">{embedCode}</code>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          <p>
            ✨ Styles automatically update in the preview - click Save Changes
            to persist your customizations.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
