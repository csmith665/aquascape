import type { CSSProperties } from 'react';

type ProductImageProps = {
  src: string;
  alt: string;
  variant?: 'thumb' | 'card';
  style?: CSSProperties;
};

const VARIANT_STYLE: Record<NonNullable<ProductImageProps['variant']>, CSSProperties> = {
  thumb: { width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 },
  card: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' },
};

export function ProductImage({ src, alt, variant = 'card', style }: ProductImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- these are inline SVG data-URI placeholders; next/image offers no LCP/bandwidth benefit and refuses SVG without dangerouslyAllowSVG.
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{ ...VARIANT_STYLE[variant], ...style }}
    />
  );
}
