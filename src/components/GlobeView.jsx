import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const defaultRoutes = [
  {
    label: 'Lagos -> Rotterdam',
    status: 'stable',
    start: [6.5244, 3.3792],
    end: [51.9244, 4.4777],
  },
  {
    label: 'Shenzhen -> Dubai',
    status: 'watch',
    start: [22.5431, 114.0579],
    end: [25.2048, 55.2708],
  },
  {
    label: 'Houston -> Singapore',
    status: 'priority',
    start: [29.7604, -95.3698],
    end: [1.3521, 103.8198],
  },
];

function latLngToVector([lat, lng], radius) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function buildArc(start, end, arcHeight = 0.55) {
  const midpoint = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);
  midpoint.normalize().multiplyScalar(midpoint.length() + arcHeight);
  return new THREE.QuadraticBezierCurve3(start.clone(), midpoint, end.clone());
}

export default function GlobeView({ routes = defaultRoutes }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  const routeItems = useMemo(
    () => routes.map((route) => ({ label: route.label, status: route.status })),
    [routes],
  );

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) {
      return undefined;
    }

    const width = host.clientWidth;
    const height = Math.max(host.clientHeight, 260);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x5bc0de, 0.6);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0x93c5fd, 1.1);
    directional.position.set(5, 4, 8);
    scene.add(directional);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.68, 64, 64),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#07324d'),
        emissive: new THREE.Color('#0b4b63'),
        emissiveIntensity: 0.35,
        metalness: 0.2,
        roughness: 0.72,
      }),
    );
    globeGroup.add(globe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.79, 40, 40),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#67e8f9'),
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      }),
    );
    globeGroup.add(atmosphere);

    const stars = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.PointsMaterial({
        color: 0xb3f5ff,
        size: 0.012,
        transparent: true,
      }),
    );
    const starPositions = new Float32Array(900);
    for (let i = 0; i < starPositions.length; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 24;
      starPositions[i + 1] = (Math.random() - 0.5) * 24;
      starPositions[i + 2] = (Math.random() - 0.5) * 24;
    }
    stars.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(starPositions, 3),
    );
    scene.add(stars);

    const markers = [];
    const arcMovers = [];

    routes.forEach((route) => {
      const start = latLngToVector(route.start, 1.7);
      const end = latLngToVector(route.end, 1.7);
      const curve = buildArc(start, end, 0.7);
      const points = curve.getPoints(72);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const colorByStatus = {
        stable: '#22d3ee',
        watch: '#facc15',
        priority: '#fb923c',
      };

      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: new THREE.Color(colorByStatus[route.status] || '#22d3ee'),
          transparent: true,
          opacity: 0.86,
        }),
      );
      globeGroup.add(line);

      const markerGeometry = new THREE.SphereGeometry(0.04, 12, 12);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorByStatus[route.status] || '#22d3ee'),
      });
      const startMarker = new THREE.Mesh(markerGeometry, markerMaterial);
      startMarker.position.copy(start);
      const endMarker = new THREE.Mesh(markerGeometry, markerMaterial);
      endMarker.position.copy(end);

      globeGroup.add(startMarker);
      globeGroup.add(endMarker);
      markers.push(startMarker, endMarker);

      const mover = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 8, 8),
        new THREE.MeshBasicMaterial({ color: new THREE.Color('#e0fbff') }),
      );
      globeGroup.add(mover);
      arcMovers.push({
        mover,
        curve,
        speed: 0.0018 + Math.random() * 0.0012,
        progress: Math.random(),
      });
    });

    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      globeGroup.rotation.y = elapsed * 0.1;
      atmosphere.rotation.y = -elapsed * 0.07;
      stars.rotation.y = elapsed * 0.005;

      markers.forEach((marker, index) => {
        marker.scale.setScalar(1 + Math.sin(elapsed * 2 + index) * 0.08);
      });

      arcMovers.forEach((item) => {
        item.progress = (item.progress + item.speed) % 1;
        const point = item.curve.getPoint(item.progress);
        item.mover.position.copy(point);
      });

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const nextWidth = Math.max(entry.contentRect.width, 200);
      const nextHeight = Math.max(entry.contentRect.height, 260);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    });

    resizeObserver.observe(host);

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry?.dispose();
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => mat.dispose());
          } else {
            node.material?.dispose();
          }
        }
        if (node instanceof THREE.Line) {
          node.geometry?.dispose();
          node.material?.dispose();
        }
        if (node instanceof THREE.Points) {
          node.geometry?.dispose();
          node.material?.dispose();
        }
      });
      host.removeChild(renderer.domElement);
    };
  }, [routes]);

  return (
    <section
      className="vt-globe-view"
      aria-label="Global 3D logistics tracking"
    >
      <div className="vt-globe-canvas-wrap" ref={canvasRef} />

      <ul className="vt-globe-routes">
        {routeItems.map((route) => (
          <li key={route.label} className={`vt-route-${route.status}`}>
            <span className="vt-route-pulse" aria-hidden="true" />
            {route.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
