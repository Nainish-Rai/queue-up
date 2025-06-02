"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Monitor, Smartphone, Tablet, Loader2 } from "lucide-react";
import { CustomizationOptions, deviceSizes } from "./types";
import { LivePreviewForm } from "./LivePreviewForm";

interface PreviewPanelProps {
  options: CustomizationOptions;
  waitlistName: string;
  previewDevice: keyof typeof deviceSizes;
  setPreviewDevice: (device: keyof typeof deviceSizes) => void;
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  isSavingButtonHovered: boolean;
  setIsSavingButtonHovered: (hovered: boolean) => void;
}

const deviceIcons = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

export function PreviewPanel({
  options,
  waitlistName,
  previewDevice,
  setPreviewDevice,
  hasChanges,
  isSaving,
  onSave,
  isSavingButtonHovered,
  setIsSavingButtonHovered,
}: PreviewPanelProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="p-3 md:p-2 md:px-4 border-b bg-red-300 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <h3 className="font-semibold text-sm md:text-base truncate">
              Live Preview
            </h3>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              Instant
            </Badge>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="flex items-center gap-1 md:gap-2">
              {Object.entries(deviceSizes).map(([device]) => {
                const Icon = deviceIcons[device as keyof typeof deviceIcons];
                return (
                  <Button
                    key={device}
                    variant={previewDevice === device ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setPreviewDevice(device as keyof typeof deviceSizes)
                    }
                    className="p-1.5 md:p-2"
                  >
                    <Icon className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                );
              })}
            </div>

            <motion.div
              animate={{
                scale: hasChanges && isSavingButtonHovered ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                variant={hasChanges ? "default" : "outline"}
                size="sm"
                onClick={onSave}
                disabled={!hasChanges || isSaving}
                className={`h-8 px-3 ${hasChanges ? " " : ""}`}
                onMouseEnter={() => setIsSavingButtonHovered(true)}
                onMouseLeave={() => setIsSavingButtonHovered(false)}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : hasChanges ? (
                  "Save Changes"
                ) : (
                  "Saved"
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="overflow-auto min-h-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          key={previewDevice}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center justify-center pt-4 px-4 min-h-full h-[calc(100vh-10rem)] w-full"
        >
          <div
            className="bg-white overflow-y-scroll flex-1 dark:bg-slate-900 rounded-lg shadow-2xl border   "
            style={{
              width: deviceSizes[previewDevice].width,
              height: deviceSizes[previewDevice].height,
              maxWidth: "calc(100vw - 2rem)",
              maxHeight: "calc(100vh - 12rem)",
              backgroundColor: options.backgroundColor,
              padding: `${options.padding}px`,
            }}
          >
            <LivePreviewForm options={options} waitlistName={waitlistName} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
