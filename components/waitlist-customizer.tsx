"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  Check,
  Palette,
  Layout,
  Code2,
  Eye,
  Settings2,
  Monitor,
  Smartphone,
  Tablet,
  Crown,
  BarChart3,
  Link,
  Sparkles,
  Mail,
  Users,
  Trophy,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface WaitlistCustomizerProps {
  waitlistName: string;
  waitlistSlug: string;
}

interface CustomizationOptions {
  theme: "light" | "dark" | "auto";
  formWidth: number;
  buttonColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  includeLeaderboard: boolean;
  referrerTracking: boolean;
  includeBrandBadge: boolean;
  buttonText: string;
  headerText: string;
  descriptionText: string;
  placeholderText: string;
  embedType: "iframe" | "script";
  animation: "none" | "fade" | "slide" | "bounce";
  fontSize: number;
  padding: number;
  shadowIntensity: number;
}

const colorPresets = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Red", value: "#ef4444" },
  { name: "Pink", value: "#ec4899" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Teal", value: "#14b8a6" },
];

const deviceSizes = {
  desktop: { width: "100%", height: "600px", icon: Monitor },
  tablet: { width: "768px", height: "500px", icon: Tablet },
  mobile: { width: "375px", height: "400px", icon: Smartphone },
};

const animationVariants = {
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
};

function LivePreviewForm({
  options,
  waitlistName,
}: {
  options: CustomizationOptions;
  waitlistName: string;
}) {
  const [previewState, setPreviewState] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const animation = animationVariants[options.animation];
  const signupCount = 1234; // Mock signup count for preview

  const cardStyle = {
    maxWidth: `${options.formWidth}px`,
    borderRadius: `${options.borderRadius}px`,
    boxShadow: `0 ${options.shadowIntensity * 2}px ${options.shadowIntensity * 8}px rgba(0,0,0,${options.shadowIntensity * 0.1})`,
    fontSize: `${options.fontSize}px`,
    color: options.textColor,
  };

  const handlePreviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setPreviewState("success");
      setTimeout(() => setPreviewState("form"), 3000);
    }, 1500);
  };

  if (previewState === "success") {
    return (
      <motion.div
        {...animation}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto"
        style={cardStyle}
      >
        <Card className="border-green-200 bg-green-50/50" style={cardStyle}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${options.buttonColor}20` }}
              >
                <CheckCircle2
                  className="w-8 h-8"
                  style={{ color: options.buttonColor }}
                />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  Welcome aboard!
                </h3>
                <p className="text-green-700 mt-2">
                  You&apos;ve been added to the waitlist!
                </p>

                {options.includeLeaderboard && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge
                      className="mt-3 text-sm font-medium py-2 px-4"
                      style={{
                        backgroundColor: options.buttonColor,
                        color: options.buttonTextColor,
                      }}
                    >
                      <Trophy className="w-4 h-4 mr-1" />
                      #42 on the waitlist
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
          {options.includeBrandBadge && (
            <div className="px-6 pb-4">
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  Powered by Waitlist
                </Badge>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...animation}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto"
      style={cardStyle}
    >
      <Card
        className="hover:shadow-xl transition-shadow duration-300"
        style={cardStyle}
      >
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${options.buttonColor}20`,
                borderRadius: `${options.borderRadius * 0.6}px`,
              }}
            >
              <Mail
                className="w-5 h-5"
                style={{ color: options.buttonColor }}
              />
            </motion.div>
            <div>
              <CardTitle
                className="text-lg"
                style={{ color: options.textColor }}
              >
                {options.headerText || waitlistName}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{signupCount.toLocaleString()} joined</span>
              </div>
            </div>
          </div>
          {options.descriptionText && (
            <p
              className="text-sm"
              style={{ color: options.textColor, opacity: 0.8 }}
            >
              {options.descriptionText}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handlePreviewSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="preview-email"
                className="text-sm font-medium"
                style={{ color: options.textColor }}
              >
                Email Address
              </Label>
              <Input
                id="preview-email"
                type="email"
                placeholder={options.placeholderText}
                className="h-10"
                style={{
                  borderRadius: `${options.borderRadius * 0.5}px`,
                  fontSize: `${options.fontSize * 0.9}px`,
                }}
                disabled={isSubmitting}
                defaultValue="demo@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="preview-name"
                className="text-sm font-medium"
                style={{ color: options.textColor }}
              >
                Name{" "}
                <span className="text-muted-foreground text-xs">
                  (Optional)
                </span>
              </Label>
              <Input
                id="preview-name"
                type="text"
                placeholder="Your name"
                className="h-10"
                style={{
                  borderRadius: `${options.borderRadius * 0.5}px`,
                  fontSize: `${options.fontSize * 0.9}px`,
                }}
                disabled={isSubmitting}
                defaultValue="Demo User"
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full h-11 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  backgroundColor: options.buttonColor,
                  color: options.buttonTextColor,
                  borderColor: options.buttonColor,
                  borderRadius: `${options.borderRadius * 0.5}px`,
                  fontSize: `${options.fontSize * 0.9}px`,
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  options.buttonText
                )}
              </Button>
            </motion.div>
          </form>

          {options.includeLeaderboard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <Badge
                variant="secondary"
                className="text-xs"
                style={{
                  borderRadius: `${options.borderRadius * 0.3}px`,
                }}
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                See your position after joining
              </Badge>
            </motion.div>
          )}

          <div className="text-center">
            <p
              className="text-xs text-muted-foreground"
              style={{ fontSize: `${options.fontSize * 0.75}px` }}
            >
              By joining, you agree to receive updates about the launch.
            </p>
          </div>

          {options.includeBrandBadge && (
            <div className="text-center pt-2">
              <Badge variant="outline" className="text-xs">
                Powered by Waitlist
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

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

  const [copied, setCopied] = useState(false);
  const [previewDevice, setPreviewDevice] =
    useState<keyof typeof deviceSizes>("desktop");
  const [activeSection, setActiveSection] = useState("appearance");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const generateEmbedUrl = () => {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    return `${baseUrl}/embed/${waitlistSlug}?${params.toString()}`;
  };

  const generateEmbedCode = () => {
    const embedUrl = generateEmbedUrl();
    const { width, height } = deviceSizes[previewDevice];

    if (options.embedType === "iframe") {
      return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" style="border: none; border-radius: ${options.borderRadius}px; box-shadow: 0 ${options.shadowIntensity * 2}px ${options.shadowIntensity * 8}px rgba(0,0,0,0.1);"></iframe>`;
    }

    return `<div id="waitlist-embed-${waitlistSlug}"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${embedUrl}';
    iframe.width = '${width}';
    iframe.height = '${height}';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '${options.borderRadius}px';
    iframe.style.boxShadow = '0 ${options.shadowIntensity * 2}px ${options.shadowIntensity * 8}px rgba(0,0,0,0.1)';
    document.getElementById('waitlist-embed-${waitlistSlug}').appendChild(iframe);
  })();
</script>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
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

  const sections = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "layout", label: "Layout", icon: Layout },
    { id: "content", label: "Content", icon: Settings2 },
    { id: "features", label: "Features", icon: Sparkles },
  ];

  return (
    <div className="flex h-full overflow-hidden">
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
              {activeSection === "appearance" && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Theme</Label>
                    <Select
                      value={options.theme}
                      onValueChange={(value: "light" | "dark" | "auto") =>
                        updateOption("theme", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Button Color</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color.value}
                          className={`w-full aspect-square rounded-md border-2 transition-all hover:scale-105 ${
                            options.buttonColor === color.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-border"
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() =>
                            updateOption("buttonColor", color.value)
                          }
                          title={color.name}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={options.buttonColor}
                      onChange={(e) =>
                        updateOption("buttonColor", e.target.value)
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Border Radius: {options.borderRadius}px
                    </Label>
                    <Slider
                      value={[options.borderRadius]}
                      onValueChange={([value]) =>
                        updateOption("borderRadius", value)
                      }
                      max={24}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Shadow Intensity: {options.shadowIntensity}
                    </Label>
                    <Slider
                      value={[options.shadowIntensity]}
                      onValueChange={([value]) =>
                        updateOption("shadowIntensity", value)
                      }
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {activeSection === "layout" && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Form Width: {options.formWidth}px
                    </Label>
                    <Slider
                      value={[options.formWidth]}
                      onValueChange={([value]) =>
                        updateOption("formWidth", value)
                      }
                      max={800}
                      min={300}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Font Size: {options.fontSize}px
                    </Label>
                    <Slider
                      value={[options.fontSize]}
                      onValueChange={([value]) =>
                        updateOption("fontSize", value)
                      }
                      max={24}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Padding: {options.padding}px
                    </Label>
                    <Slider
                      value={[options.padding]}
                      onValueChange={([value]) =>
                        updateOption("padding", value)
                      }
                      max={48}
                      min={12}
                      step={4}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Animation</Label>
                    <Select
                      value={options.animation}
                      onValueChange={(
                        value: "none" | "fade" | "slide" | "bounce"
                      ) => updateOption("animation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="fade">Fade In</SelectItem>
                        <SelectItem value="slide">Slide Up</SelectItem>
                        <SelectItem value="bounce">Bounce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {activeSection === "content" && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="headerText" className="text-sm font-medium">
                      Header Text
                    </Label>
                    <Input
                      id="headerText"
                      value={options.headerText}
                      onChange={(e) =>
                        updateOption("headerText", e.target.value)
                      }
                      placeholder="Join our waitlist"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="descriptionText"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>
                    <Input
                      id="descriptionText"
                      value={options.descriptionText}
                      onChange={(e) =>
                        updateOption("descriptionText", e.target.value)
                      }
                      placeholder="Be the first to know when we launch!"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="buttonText" className="text-sm font-medium">
                      Button Text
                    </Label>
                    <Input
                      id="buttonText"
                      value={options.buttonText}
                      onChange={(e) =>
                        updateOption("buttonText", e.target.value)
                      }
                      placeholder="Join Waitlist"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="placeholderText"
                      className="text-sm font-medium"
                    >
                      Email Placeholder
                    </Label>
                    <Input
                      id="placeholderText"
                      value={options.placeholderText}
                      onChange={(e) =>
                        updateOption("placeholderText", e.target.value)
                      }
                      placeholder="Enter your email"
                    />
                  </div>
                </>
              )}

              {activeSection === "features" && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Include Leaderboard
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Show position in waitlist
                        </p>
                      </div>
                      <Switch
                        checked={options.includeLeaderboard}
                        onCheckedChange={(checked) =>
                          updateOption("includeLeaderboard", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          Referrer Tracking
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Track UTM parameters and referrals
                        </p>
                      </div>
                      <Switch
                        checked={options.referrerTracking}
                        onCheckedChange={(checked) =>
                          updateOption("referrerTracking", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Brand Badge
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Show &quot;Powered by&quot; attribution
                        </p>
                      </div>
                      <Switch
                        checked={options.includeBrandBadge}
                        onCheckedChange={(checked) =>
                          updateOption("includeBrandBadge", checked)
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Embed Type</Label>
                    <Select
                      value={options.embedType}
                      onValueChange={(value: "iframe" | "script") =>
                        updateOption("embedType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iframe">iFrame (Simple)</SelectItem>
                        <SelectItem value="script">
                          JavaScript (Advanced)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-4 border-t">
          <Button onClick={copyToClipboard} className="w-full" size="lg">
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy Embed Code"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="p-3 md:p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
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

            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              {Object.entries(deviceSizes).map(([device, { icon: Icon }]) => (
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
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-auto min-h-0">
          <motion.div
            key={previewDevice}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex justify-center items-center min-h-full w-full"
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border overflow-hidden"
              style={{
                width: deviceSizes[previewDevice].width,
                height: deviceSizes[previewDevice].height,
                maxWidth: "calc(100vw - 2rem)",
                maxHeight: "calc(100vh - 12rem)",
                backgroundColor: options.backgroundColor,
                padding: `${options.padding}px`,
              }}
            >
              <div className="h-full flex items-center justify-center overflow-auto">
                <LivePreviewForm
                  options={options}
                  waitlistName={waitlistName}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 md:p-4 border-t bg-muted/30 flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <Code2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">Embed Code</span>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {options.embedType}
              </Badge>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 p-3 md:p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-32 overflow-y-auto w-full">
            <code className="whitespace-pre-wrap break-all">
              {generateEmbedCode()}
            </code>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
