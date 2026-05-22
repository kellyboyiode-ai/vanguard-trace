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
          <figure key={asset.id} className="vt-media-tile vt-media-tile-live">
            <img
              className="vt-media-live-image"
              src={asset.src}
              alt={asset.alt}
              loading="lazy"
              decoding="async"
            />
            <span className="vt-media-sweep" aria-hidden="true" />
            <span className="vt-media-pulse" aria-hidden="true" />

            <svg
              className="vt-media-signal-layer"
              viewBox="0 0 400 300"
              aria-hidden="true"
            >
              <path
                d="M58 112 L186 152 L332 74"
                className="vt-media-signal-trace"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="30;0;30"
                  dur="4.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.45;0.95;0.45"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              </path>

              <path
                d="M86 228 L186 152 L286 236"
                className="vt-media-signal-trace vt-media-signal-trace-secondary"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="22;0;22"
                  dur="5.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.28;0.72;0.28"
                  dur="3.8s"
                  repeatCount="indefinite"
                />
              </path>

              {[
                { cx: 58, cy: 112 },
                { cx: 186, cy: 152 },
                { cx: 332, cy: 74 },
              ].map((node, index) => (
                <g key={`${asset.id}-node-${index}`}>
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="4"
                    className="vt-media-signal-node"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.45;1;0.45"
                      dur="2.4s"
                      begin={`${index * 0.28}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="8"
                    className="vt-media-signal-node-glow"
                  >
                    <animate
                      attributeName="r"
                      values="4;12;4"
                      dur="2.4s"
                      begin={`${index * 0.28}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.28;0;0.28"
                      dur="2.4s"
                      begin={`${index * 0.28}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              ))}

              <circle
                className="vt-media-signal-packet-trail"
                r="7"
                cx="58"
                cy="112"
              >
                <animateMotion
                  dur="3.8s"
                  repeatCount="indefinite"
                  rotate="auto"
                  path="M58 112 L186 152 L332 74 L186 152 L58 112"
                />
              </circle>
              <circle
                className="vt-media-signal-packet"
                r="3.3"
                cx="58"
                cy="112"
              >
                <animateMotion
                  dur="3.8s"
                  repeatCount="indefinite"
                  rotate="auto"
                  path="M58 112 L186 152 L332 74 L186 152 L58 112"
                />
              </circle>

              <circle
                className="vt-media-signal-packet-trail vt-media-signal-packet-trail-secondary"
                r="6"
                cx="86"
                cy="228"
              >
                <animateMotion
                  dur="4.6s"
                  begin="0.75s"
                  repeatCount="indefinite"
                  rotate="auto"
                  path="M86 228 L186 152 L286 236 L186 152 L86 228"
                />
              </circle>
              <circle
                className="vt-media-signal-packet vt-media-signal-packet-secondary"
                r="3"
                cx="86"
                cy="228"
              >
                <animateMotion
                  dur="4.6s"
                  begin="0.75s"
                  repeatCount="indefinite"
                  rotate="auto"
                  path="M86 228 L186 152 L286 236 L186 152 L86 228"
                />
              </circle>
            </svg>
          </figure>
        ))}
      </div>
    </section>
  );
}
