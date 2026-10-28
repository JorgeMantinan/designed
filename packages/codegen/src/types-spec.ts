/**
 * Structural mirror of the DesignSpec types, emitted into the exported
 * project as `src/types/spec.ts`. The generated project has no dependency on
 * @designed/*, so these types stand alone: input-friendly (optional fields)
 * to match the component prop types exactly.
 */
export const TYPES_SPEC = `// Tipos estructurales del diseño (generado por designed).
// Espejo sin validación del schema del editor: los datos de design.ts ya se
// validaron al exportar.

export interface EntranceAnimationInput {
  type:
    | 'fade-in'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'zoom-in'
    | 'blur-in'
    | 'reveal-up';
  durationMs?: number;
  delayMs?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  trigger?: 'scroll' | 'load';
  once?: boolean;
}

export interface HoverAnimationInput {
  type: 'none' | 'lift' | 'scale' | 'glow' | 'tilt' | 'shine' | 'underline' | 'border-draw';
  durationMs?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  intensity?: number;
}

export interface AnimationInput {
  entrance?: EntranceAnimationInput;
  hover?: HoverAnimationInput;
}

export interface ImageOverlayInput {
  type?: 'gradient' | 'duotone' | 'vignette';
  direction?:
    | 'to-right'
    | 'to-left'
    | 'to-bottom'
    | 'to-top'
    | 'to-bottom-right'
    | 'to-bottom-left'
    | 'to-top-right'
    | 'to-top-left'
    | 'center';
  color?: string;
  colorTo?: string;
  intensity?: number;
}

export interface ButtonInput {
  id: string;
  label: string;
  href?: string;
  variant?:
    | 'solid'
    | 'outline'
    | 'ghost'
    | 'gradient'
    | 'soft'
    | 'glass'
    | 'neon'
    | 'brutal';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'theme' | 'rect' | 'rounded' | 'pill' | 'circle' | 'tag' | 'bubble';
  icon?: string;
  newTab?: boolean;
  color?: string;
  hoverColor?: string;
  hoverOpacity?: number;
  animation?: AnimationInput;
}

export interface GradientSpec {
  type?: 'linear' | 'radial' | 'conic';
  angle: number;
  stops: { color: string; position?: number }[];
}

export type BackgroundSpec =
  | { type: 'color'; color: string }
  | { type: 'gradient'; gradient: GradientSpec }
  | {
      type: 'image';
      src: string;
      overlay?: ImageOverlayInput;
      size: 'cover' | 'contain';
      position: string;
      fixed: boolean;
    }
  | {
      type: 'interactive';
      effect:
        | 'spotlight'
        | 'particles'
        | 'dots'
        | 'waves'
        | 'retro-grid'
        | 'ripples'
        | 'rain'
        | 'constellation'
        | 'grid-glow'
        | 'matrix'
        | 'confetti'
        | 'snow'
        | 'aurora-curtains'
        | 'fire'
        | 'sparks'
        | 'shooting-stars'
        | 'equalizer'
        | 'shapes';
      baseColor?: string;
      effectColor?: string;
      intensity: number;
      speed: number;
    };

export type InteractiveBackgroundSpec = Extract<BackgroundSpec, { type: 'interactive' }>;

export interface SectionPadding {
  topBottomPx?: number;
  leftRightPx?: number;
}

export type ComponentSpec =
  | {
      type: 'heading';
      id: string;
      level?: number;
      text: string;
      size?: 'display' | 'xl' | 'lg' | 'md' | 'sm';
      align?: 'left' | 'center' | 'right';
      tone?: 'default' | 'primary' | 'muted' | 'inverse';
      color?: string;
      animation?: AnimationInput;
    }
  | {
      type: 'text';
      id: string;
      text: string;
      align?: 'left' | 'center' | 'right';
      tone?: 'default' | 'primary' | 'muted' | 'inverse';
      color?: string;
      maxWidthPx?: number;
      animation?: AnimationInput;
    }
  | {
      type: 'buttonGroup';
      id: string;
      buttons: ButtonInput[];
      direction?: 'row' | 'column';
      align?: 'left' | 'center' | 'right';
      gapPx?: number;
      animation?: AnimationInput;
    }
  | { type: 'badge'; id: string; label: string; tone?: 'primary' | 'secondary' | 'accent' | 'neutral' }
  | {
      type: 'image';
      id: string;
      src: string;
      alt?: string;
      overlay?: ImageOverlayInput;
      radius?: 'none' | 'sm' | 'md' | 'lg' | 'pill';
      shadow?: 'none' | 'sm' | 'md' | 'lg';
      ratio?: 'auto' | '1:1' | '4:3' | '16:9' | '3:4' | '21:9';
      animation?: AnimationInput;
    }
  | {
      type: 'featureCard';
      id: string;
      icon?: string;
      title: string;
      text: string;
      align?: 'left' | 'center' | 'right';
      href?: string;
      animation?: AnimationInput;
    }
  | {
      type: 'pricingCard';
      id: string;
      planName: string;
      price: string;
      currency?: string;
      period?: string;
      features: string[];
      highlighted?: boolean;
      cta?: ButtonInput;
      animation?: AnimationInput;
    }
  | {
      type: 'testimonialCard';
      id: string;
      quote: string;
      author: string;
      role?: string;
      avatarUrl?: string;
      rating?: number;
      animation?: AnimationInput;
    }
  | { type: 'stat'; id: string; value: string; label: string; suffix?: string; animation?: AnimationInput }
  | {
      type: 'featureList';
      id: string;
      items: { icon?: string; title: string; text: string }[];
      columns?: number;
      animation?: AnimationInput;
    }
  | {
      type: 'faqList';
      id: string;
      items: { question: string; answer: string }[];
      radius?: 'sm' | 'md' | 'lg' | 'pill';
      color?: string;
      animation?: AnimationInput;
    }
  | {
      type: 'logoCloud';
      id: string;
      logos: { src: string; alt?: string }[];
      grayscale?: boolean;
      animation?: AnimationInput;
    }
  | {
      type: 'carousel';
      id: string;
      slides: { src: string; alt?: string; title?: string; text?: string; overlay?: ImageOverlayInput }[];
      overlay?: ImageOverlayInput;
      autoplay?: boolean;
      intervalMs?: number;
      showDots?: boolean;
      showArrows?: boolean;
      ratio?: '16:9' | '4:3' | '3:2' | '21:9';
      animation?: AnimationInput;
    }
  | {
      type: 'divider';
      id: string;
      thicknessPx?: number;
      style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'gradient';
      color?: string;
      animated?: boolean;
    }
  | { type: 'spacer'; id: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' };

export interface RowSpec {
  id: string;
  columns: ColumnSpec[];
  gapPx?: number;
  stackBelow?: 'never' | 'tablet' | 'mobile';
}

export interface ColumnSpec {
  id: string;
  span: number;
  components: ComponentSpec[];
  hideOn: ('tablet' | 'mobile')[];
  verticalAlign: 'start' | 'center' | 'end';
  contentAlign: 'stretch' | 'start' | 'center' | 'end';
}

export interface SectionSpec {
  id: string;
  kind?: string;
  rows: RowSpec[];
  background?: BackgroundSpec;
  padding?: SectionPadding;
  width?: 'contained' | 'full';
  animation?: AnimationInput;
}

export interface NavChild {
  id: string;
  label: string;
  href?: string;
  badge?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  children: NavChild[];
}

export interface HeaderSpec {
  layout: 'top' | 'angled' | 'sidebar' | 'minimal' | 'corner' | 'floating' | 'bottom';
  sidebarPosition?: 'left' | 'right';
  sticky: boolean;
  transparentOnTop: boolean;
  brand: { name: string; logoUrl?: string; href: string };
  items: NavItem[];
  cta?: ButtonInput;
  itemAnimation?: HoverAnimationInput;
  mobileMenu: 'hamburger-overlay' | 'dropdown' | 'hidden';
  backgroundColor?: string;
  linkColor?: string;
  brandColor?: string;
}

export type SocialPlatform =
  | 'x'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'discord'
  | 'facebook';

export interface FooterSpec {
  columns: {
    id: string;
    title: string;
    links: { label: string; href?: string }[];
    contentAlign?: 'start' | 'center' | 'end';
  }[];
  brandText?: string;
  social: { platform: SocialPlatform; href: string }[];
  newsletter?: boolean;
  copyright?: string;
  layout?: 'classic' | 'centered' | 'minimal';
  titleColor?: string;
  linkColor?: string;
  itemAnimation?: HoverAnimationInput;
  background?: BackgroundSpec;
}

export interface ThemeSpec {
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text?: string;
    textMuted?: string;
  };
  typography?: Record<string, string | number>;
  spacing?: Record<string, number>;
  radius?: Record<string, number>;
  shadow?: Record<string, string>;
}

export interface DesignSpec {
  version: 1;
  meta: { name: string; description?: string; lang?: 'es' | 'en' };
  theme: ThemeSpec;
  header: HeaderSpec;
  sections: SectionSpec[];
  footer: FooterSpec;
}
`;
