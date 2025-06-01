"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportWaitlistSignups } from "@/lib/api";

interface ExportButtonProps {
  waitlistId: string;
  waitlistSlug: string;
}

export function ExportButton({ waitlistId, waitlistSlug }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportWaitlistSignups(waitlistId);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${waitlistSlug}-signups.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      <Download className="w-4 h-4 mr-2" />
      {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  );
}
