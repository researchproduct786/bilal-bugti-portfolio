import type { ReactNode } from 'react';

type SceneName = 'discover' | 'operations' | 'planning' | 'design' | 'build' | 'testing' | 'delivery' | 'ecommerce' | 'kitchen';

/**
 * A real photograph with a short caption that belongs to it.
 *
 * Mobile-first rules applied here:
 *  - the image is cropped to a fixed, modest aspect ratio (never a full screen);
 *  - the caption sits directly beneath it, so the picture and its explanation are
 *    impossible to separate by scrolling;
 *  - `sizes` keeps the download small on phones, and only the first one is eager.
 */
export function Scene({
  name, caption, ratio = '4 / 3', priority = false, className = '', children,
}: {
  name: SceneName;
  caption: string;
  ratio?: string;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={`scene ${className}`}>
      <div className="scene-img" style={{ aspectRatio: ratio }}>
        <img
          src={`/img/scene-${name}.webp`}
          alt={caption}
          width={1600}
          height={1200}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 620px"
        />
        {children}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
