// Global interfaces and types for the KrizPay application

export interface NavigationItem {
  name: string;
  href: string;
  ariaLabel: string;
}

export interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

export interface StatisticItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
  format: (val: number) => string;
}

export interface SecurityFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface CurrencyData {
  code: string;
  rate: number;
  change: string;
}

export interface CountryFlag {
  country: string;
  flag: string;
  users: string;
}

export interface RegionalStats {
  users: string;
  transactions: string;
  growth: string;
}

export interface CityData {
  name: string;
  x: number;
  y: number;
  region: string;
}

export interface StateData {
  phase: number;
  status: 'active' | 'planned' | 'future';
  city: string;
  timeline: string;
  users: string;
  transactions: string;
  merchants: string;
  strategy: string;
  segments: string[];
  progress: number;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  period: string;
  status: 'active' | 'planned' | 'future';
  states: string[];
  targets: {
    users: string;
    transactions: string;
    revenue: string;
  };
  milestones: string[];
}

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface NewsletterFormData {
  email: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// GSAP Animation Types
export interface GSAPAnimation {
  target: string | Element | Element[];
  duration: number;
  ease?: string;
  delay?: number;
  stagger?: number;
  scrollTrigger?: {
    trigger: string | Element;
    start: string;
    end?: string;
    scrub?: boolean | number;
    toggleActions?: string;
  };
}

// Component Props Types
export interface LayoutProps {
  children: React.ReactNode;
}

export interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NewsletterSubscriptionResponse extends APIResponse {
  data?: {
    subscribed: boolean;
    email: string;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string; }[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string) => boolean | string;
  };
}

export interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Theme and Design System Types
export interface ColorPalette {
  primary: {
    purple: string;
    blue: string;
  };
  secondary: {
    purple: string;
    blue: string;
  };
  dark: {
    bg: string;
    card: string;
    border: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
}

export interface BreakpointConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};