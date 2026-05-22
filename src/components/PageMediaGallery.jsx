import { getPageMedia } from '../data/premiumMediaLibrary.js';

export default function PageMediaGallery({
  pageKey,
  title = 'Mission Visual Intelligence',
  compact = false,
}) {
  const media = getPageMedia(pageKey);
  const signalNodes = [
    { cx: 58, cy: 112 },
    { cx: 186, cy: 152 },
    { cx: 332, cy: 74 },
  ];
  const coordinateBeacons = [
    { cx: 118, cy: 198, delay: '0.25s', driftX: -7, driftY: 4 },
    { cx: 252, cy: 112, delay: '0.9s', driftX: 8, driftY: -5 },
    { cx: 304, cy: 206, delay: '1.5s', driftX: -6, driftY: -6 },
  ];

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
        <p>assigned assets</p>
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

              {coordinateBeacons.map((beacon, index) => (
                <g
                  key={`${asset.id}-beacon-${index}`}
                  className="vt-media-coordinate-beacon"
                >
                  <path
                    d={`M${beacon.cx} ${beacon.cy} L186 152`}
                    className="vt-media-coordinate-link"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.14;0.42;0.14"
                      dur="3.2s"
                      begin={beacon.delay}
                      repeatCount="indefinite"
                    />
                  </path>
                  <circle
                    cx={beacon.cx}
                    cy={beacon.cy}
                    r="2.8"
                    className="vt-media-coordinate-dot"
                  >
                    <animate
                      attributeName="cx"
                      values={`${beacon.cx};${beacon.cx + beacon.driftX};${beacon.cx}`}
                      dur="4.8s"
                      begin={beacon.delay}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      values={`${beacon.cy};${beacon.cy + beacon.driftY};${beacon.cy}`}
                      dur="4.8s"
                      begin={beacon.delay}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.45;1;0.45"
                      dur="2.4s"
                      begin={beacon.delay}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={beacon.cx}
                    cy={beacon.cy}
                    r="10"
                    className="vt-media-coordinate-ring"
                  >
                    <animate
                      attributeName="r"
                      values="5;13;5"
                      dur="2.8s"
                      begin={beacon.delay}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0;0.2"
                      dur="2.8s"
                      begin={beacon.delay}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              ))}

              {signalNodes.map((node, index) => (
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
                r="10"
                cx="58"
                cy="112"
              >
                <animate
                  attributeName="cx"
                  values="58;186;332;186;58"
                  keyTimes="0;0.224;0.5;0.776;1"
                  dur="3.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="112;152;74;152;112"
                  keyTimes="0;0.224;0.5;0.776;1"
                  dur="3.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.28;0.58;0.28"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                className="vt-media-signal-packet"
                r="4.6"
                cx="58"
                cy="112"
              >
                <animate
                  attributeName="cx"
                  values="58;186;332;186;58"
                  keyTimes="0;0.224;0.5;0.776;1"
                  dur="3.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="112;152;74;152;112"
                  keyTimes="0;0.224;0.5;0.776;1"
                  dur="3.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="4;5.2;4"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle
                className="vt-media-signal-packet-trail vt-media-signal-packet-trail-secondary"
                r="8"
                cx="86"
                cy="228"
              >
                <animate
                  attributeName="cx"
                  values="86;186;286;186;86"
                  keyTimes="0;0.245;0.5;0.755;1"
                  dur="4.6s"
                  begin="0.75s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="228;152;236;152;228"
                  keyTimes="0;0.245;0.5;0.755;1"
                  dur="4.6s"
                  begin="0.75s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.5;0.2"
                  dur="1.35s"
                  begin="0.75s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                className="vt-media-signal-packet vt-media-signal-packet-secondary"
                r="4"
                cx="86"
                cy="228"
              >
                <animate
                  attributeName="cx"
                  values="86;186;286;186;86"
                  keyTimes="0;0.245;0.5;0.755;1"
                  dur="4.6s"
                  begin="0.75s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="228;152;236;152;228"
                  keyTimes="0;0.245;0.5;0.755;1"
                  dur="4.6s"
                  begin="0.75s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="3.4;4.6;3.4"
                  dur="1.05s"
                  begin="0.75s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </figure>
        ))}
      </div>
    </section>
  );
}
