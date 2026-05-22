import { getPageMedia } from '../data/premiumMediaLibrary.js';

export default function PageMediaGallery({
  pageKey,
  title = 'Mission Visual Intelligence',
  compact = false,
}) {
  const media = getPageMedia(pageKey);

  if (!media.length) {
    return null;
  }

  return (
    <section
      className={
        compact
          ? 'vt-media-gallery vt-media-gallery-compact'
          : 'vt-media-gallery'
      }
      aria-label={`${title} for ${pageKey}`}
    >
      <div className="panel-header">
        <h2>{title}</h2>
        <p>{`${media.length} assigned assets`}</p>
      </div>

      <div className="vt-media-grid">
        {media.map((asset) => (
          <figure key={asset.id} className="vt-media-tile">
            <img
              src={asset.src}
              alt={asset.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
