import { useEffect, useMemo, useState } from 'react';
import { homeTransmissionMedia } from '../data/premiumMediaLibrary.js';

export default function HomeTransmissionGallery() {
  const media = useMemo(() => homeTransmissionMedia, []);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (media.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % media.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, [media]);

  if (!media.length) {
    return null;
  }

  const activeAsset = media[activeIndex];

  return (
    <section className="vt-transmission" aria-label="Home transmission image stream">
      <div className="vt-transmission-stage">
        <img
          key={activeAsset.id}
          src={activeAsset.src}
          alt={activeAsset.alt}
          className="vt-transmission-image"
          loading="eager"
          decoding="async"
        />
        <div className="vt-transmission-overlay" aria-hidden="true" />
      </div>

      <div className="vt-transmission-meta">
        <p className="panel-kicker">Transmission Sequence</p>
        <h3>{activeAsset.label}</h3>
        <p>{`Frame ${activeIndex + 1} / ${media.length}`}</p>

        <div className="vt-transmission-dots" role="tablist" aria-label="Transmission frame selector">
          {media.map((asset, index) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={index === activeIndex ? 'is-active' : ''}
              aria-label={`Show frame ${index + 1}`}
              aria-selected={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
