import type { ComponentSpec } from '@designed/schema';

import { FeatureCard } from './cards/FeatureCard';
import { FeatureList } from './cards/FeatureList';
import { FaqList } from './cards/FaqList';
import { LogoCloud } from './cards/LogoCloud';
import { PricingCard } from './cards/PricingCard';
import { Stat } from './cards/Stat';
import { TestimonialCard } from './cards/TestimonialCard';
import { Carousel } from './carousel/Carousel';
import { Badge } from './primitives/Badge';
import { BodyText } from './primitives/BodyText';
import { ButtonGroup } from './primitives/ButtonGroup';
import { Divider } from './primitives/Divider';
import { Heading } from './primitives/Heading';
import { Image } from './primitives/Image';
import { Spacer } from './primitives/Spacer';

export interface SpecRendererProps {
  spec: ComponentSpec;
}

/** Maps a ComponentSpec discriminated union to its React component. */
export function SpecRenderer({ spec }: SpecRendererProps) {
  switch (spec.type) {
    case 'heading':
      return <Heading {...spec} />;
    case 'text':
      return <BodyText {...spec} />;
    case 'buttonGroup':
      return <ButtonGroup {...spec} />;
    case 'badge':
      return <Badge {...spec} />;
    case 'image':
      return <Image {...spec} />;
    case 'featureCard':
      return <FeatureCard {...spec} />;
    case 'pricingCard':
      return <PricingCard {...spec} />;
    case 'testimonialCard':
      return <TestimonialCard {...spec} />;
    case 'stat':
      return <Stat {...spec} />;
    case 'featureList':
      return <FeatureList {...spec} />;
    case 'faqList':
      return <FaqList {...spec} />;
    case 'logoCloud':
      return <LogoCloud {...spec} />;
    case 'carousel':
      return <Carousel {...spec} />;
    case 'divider':
      return <Divider {...spec} />;
    case 'spacer':
      return <Spacer {...spec} />;
    default:
      return null;
  }
}
