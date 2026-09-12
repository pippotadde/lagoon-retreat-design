import { IMAGES, srcSet, type ImageName } from "@/lib/images";

type PictureProps = {
  name: ImageName;
  alt: string;
  /** Rendered width of the image slot; see the `sizes` attribute. */
  sizes: string;
  className?: string;
  /** Above-the-fold image: load eagerly with high priority instead of lazily. */
  priority?: boolean;
};

/**
 * Responsive AVIF image with a JPEG fallback for browsers without AVIF. The
 * <picture> wrapper uses `display: contents`, so `className` styles the <img>
 * as if it were a direct child of the parent (flex/grid items, absolute positioning).
 */
export function Picture({ name, alt, sizes, className, priority = false }: PictureProps) {
  const { width, height, fallback } = IMAGES[name];
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet(name)} sizes={sizes} />
      <img
        src={`/img/${name}-${fallback}.jpg`}
        width={width}
        height={height}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? undefined : "async"}
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}
