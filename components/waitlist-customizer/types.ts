export interface WaitlistCustomizerProps {
  waitlistName: string;
  waitlistSlug: string;
}

export interface CustomizationOptions {
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
  includeNameField: boolean;
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

export const colorPresets = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Red", value: "#ef4444" },
  { name: "Pink", value: "#ec4899" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Teal", value: "#14b8a6" },
];

export const deviceSizes = {
  desktop: { width: "100%", height: "600px" },
  tablet: { width: "768px", height: "500px" },
  mobile: { width: "375px", height: "400px" },
};

export const animationVariants = {
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
