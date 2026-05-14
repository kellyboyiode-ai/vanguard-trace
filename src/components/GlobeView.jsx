import { useEffect, useMemo, useRef, useState } from 'react';
import { useAdaptiveMotion } from '../hooks/useAdaptiveMotion.js';

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

function latLngToVector([lat, lng], radius, three) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;

  return new three.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function buildArc(start, end, arcHeight = 0.55) {
  const midpoint = start.clone().addVectors(start, end).multiplyScalar(0.5);
  midpoint.normalize().multiplyScalar(midpoint.length() + arcHeight);
  return midpoint;
}

function createHeatTexture(three) {
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext('2d');

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(48, 48, 8, 48, 48, 48);
  gradient.addColorStop(0, 'rgba(34, 211, 238, 1)');
  gradient.addColorStop(0.35, 'rgba(34, 211, 238, 0.56)');
  gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

  context.clearRect(0, 0, 96, 96);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 96, 96);

  return new three.CanvasTexture(canvas);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

async function loadThreeModule() {
  const [
    { Vector3 },
    { QuadraticBezierCurve3 },
    { CanvasTexture },
    { Scene },
    { PerspectiveCamera },
    { WebGLRenderer },
    constants,
    { AmbientLight },
    { DirectionalLight },
    { Group },
    { Mesh },
    { SphereGeometry },
    { MeshStandardMaterial },
    { Color },
    { MeshBasicMaterial },
    { Points },
    { BufferGeometry },
    { PointsMaterial },
    { BufferAttribute },
    { Line },
    { LineBasicMaterial },
    { SpriteMaterial },
    { Sprite },
    { Clock },
  ] = await Promise.all([
    import('three/src/math/Vector3.js'),
    import('three/src/extras/curves/QuadraticBezierCurve3.js'),
    import('three/src/textures/CanvasTexture.js'),
    import('three/src/scenes/Scene.js'),
    import('three/src/cameras/PerspectiveCamera.js'),
    import('three/src/renderers/WebGLRenderer.js'),
    import('three/src/constants.js'),
    import('three/src/lights/AmbientLight.js'),
    import('three/src/lights/DirectionalLight.js'),
    import('three/src/objects/Group.js'),
    import('three/src/objects/Mesh.js'),
    import('three/src/geometries/SphereGeometry.js'),
    import('three/src/materials/MeshStandardMaterial.js'),
    import('three/src/math/Color.js'),
    import('three/src/materials/MeshBasicMaterial.js'),
    import('three/src/objects/Points.js'),
    import('three/src/core/BufferGeometry.js'),
    import('three/src/materials/PointsMaterial.js'),
    import('three/src/core/BufferAttribute.js'),
    import('three/src/objects/Line.js'),
    import('three/src/materials/LineBasicMaterial.js'),
    import('three/src/materials/SpriteMaterial.js'),
    import('three/src/objects/Sprite.js'),
    import('three/src/core/Clock.js'),
  ]);

  return {
    Vector3,
    QuadraticBezierCurve3,
    CanvasTexture,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SRGBColorSpace: constants.SRGBColorSpace,
    BackSide: constants.BackSide,
    AdditiveBlending: constants.AdditiveBlending,
    AmbientLight,
    DirectionalLight,
    Group,
    Mesh,
    SphereGeometry,
    MeshStandardMaterial,
    Color,
    MeshBasicMaterial,
    Points,
    BufferGeometry,
    PointsMaterial,
    BufferAttribute,
    Line,
    LineBasicMaterial,
    SpriteMaterial,
    Sprite,
    Clock,
  };
}

export default function GlobeView({ routes = defaultRoutes }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const [threeReady, setThreeReady] = useState(false);
  const { reducedMotion } = useAdaptiveMotion();

  const routeItems = useMemo(
    () => routes.map((route) => ({ label: route.label, status: route.status })),
    [routes],
  );

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '220px',
        threshold: 0.1,
      },
    );

    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInViewport) {
      return undefined;
    }

    const host = canvasRef.current;
    if (!host) {
      return undefined;
    }

    let cancelled = false;
    let renderer = null;
    let resizeObserver = null;
    let cleanup = null;

    async function initializeScene() {
      const three = await loadThreeModule();
      if (cancelled) {
        return;
      }

      const width = host.clientWidth;
      const height = Math.max(host.clientHeight, 260);

      const scene = new three.Scene();
      const camera = new three.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 6.2);

      renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = three.SRGBColorSpace;
      host.appendChild(renderer.domElement);
      setThreeReady(true);

      const ambient = new three.AmbientLight(0x5bc0de, 0.6);
      scene.add(ambient);

      const directional = new three.DirectionalLight(0x93c5fd, 1.1);
      directional.position.set(5, 4, 8);
      scene.add(directional);

      const globeGroup = new three.Group();
      scene.add(globeGroup);

      const globe = new three.Mesh(
        new three.SphereGeometry(1.68, 64, 64),
        new three.MeshStandardMaterial({
          color: new three.Color('#07324d'),
          emissive: new three.Color('#0b4b63'),
          emissiveIntensity: 0.35,
          metalness: 0.2,
          roughness: 0.72,
        }),
      );
      globeGroup.add(globe);

      const atmosphere = new three.Mesh(
        new three.SphereGeometry(1.79, 40, 40),
        new three.MeshBasicMaterial({
          color: new three.Color('#67e8f9'),
          transparent: true,
          opacity: 0.08,
          side: three.BackSide,
        }),
      );
      globeGroup.add(atmosphere);

      const stars = new three.Points(
        new three.BufferGeometry(),
        new three.PointsMaterial({
          color: 0xb3f5ff,
          size: reducedMotion ? 0.008 : 0.012,
          transparent: true,
        }),
      );
      const starPositions = new Float32Array(reducedMotion ? 540 : 900);
      for (let i = 0; i < starPositions.length; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 24;
        starPositions[i + 1] = (Math.random() - 0.5) * 24;
        starPositions[i + 2] = (Math.random() - 0.5) * 24;
      }
      stars.geometry.setAttribute(
        'position',
        new three.BufferAttribute(starPositions, 3),
      );
      scene.add(stars);

      const markers = [];
      const arcMovers = [];
      const heatSprites = [];
      const heatTexture = createHeatTexture(three);

      const heatGroup = new three.Group();
      globeGroup.add(heatGroup);

      const dragState = {
        active: false,
        pointerId: null,
        lastX: 0,
        lastY: 0,
      };

      const rotationState = {
        currentX: 0.08,
        currentY: 0,
        targetX: 0.08,
        targetY: 0,
        velocityX: 0,
        velocityY: 0,
      };

      const zoomState = {
        current: 6.2,
        target: 6.2,
      };

      routes.forEach((route) => {
        const start = latLngToVector(route.start, 1.7, three);
        const end = latLngToVector(route.end, 1.7, three);
        const control = buildArc(start, end, 0.7);
        const curve = new three.QuadraticBezierCurve3(
          start.clone(),
          control,
          end.clone(),
        );
        const points = curve.getPoints(72);
        const geometry = new three.BufferGeometry().setFromPoints(points);

        const colorByStatus = {
          stable: '#22d3ee',
          watch: '#facc15',
          priority: '#fb923c',
        };

        const line = new three.Line(
          geometry,
          new three.LineBasicMaterial({
            color: new three.Color(colorByStatus[route.status] || '#22d3ee'),
            transparent: true,
            opacity: 0.86,
          }),
        );
        globeGroup.add(line);

        const heatSamples = reducedMotion ? 8 : 16;
        if (heatTexture) {
          for (let i = 0; i <= heatSamples; i += 1) {
            const point = curve
              .getPoint(i / heatSamples)
              .normalize()
              .multiplyScalar(1.73);
            const material = new three.SpriteMaterial({
              map: heatTexture,
              color: new three.Color('#22d3ee'),
              transparent: true,
              opacity: reducedMotion ? 0.12 : 0.18,
              depthWrite: false,
              blending: three.AdditiveBlending,
            });
            const sprite = new three.Sprite(material);
            const scale = i % 3 === 0 ? 0.26 : 0.2;
            sprite.scale.setScalar(scale);
            sprite.position.copy(point);
            heatGroup.add(sprite);
            heatSprites.push(sprite);
          }
        }

        const markerGeometry = new three.SphereGeometry(0.04, 12, 12);
        const markerMaterial = new three.MeshBasicMaterial({
          color: new three.Color(colorByStatus[route.status] || '#22d3ee'),
        });
        const startMarker = new three.Mesh(markerGeometry, markerMaterial);
        startMarker.position.copy(start);
        const endMarker = new three.Mesh(markerGeometry, markerMaterial);
        endMarker.position.copy(end);

        globeGroup.add(startMarker);
        globeGroup.add(endMarker);
        markers.push(startMarker, endMarker);

        const mover = new three.Mesh(
          new three.SphereGeometry(0.028, 8, 8),
          new three.MeshBasicMaterial({ color: new three.Color('#e0fbff') }),
        );
        globeGroup.add(mover);
        arcMovers.push({
          mover,
          curve,
          speed: 0.0018 + Math.random() * 0.0012,
          progress: Math.random(),
        });
      });

      const clock = new three.Clock();

      const onPointerDown = (event) => {
        dragState.active = true;
        dragState.pointerId = event.pointerId;
        dragState.lastX = event.clientX;
        dragState.lastY = event.clientY;
        renderer.domElement.setPointerCapture(event.pointerId);
      };

      const onPointerMove = (event) => {
        if (!dragState.active || dragState.pointerId !== event.pointerId) {
          return;
        }

        const deltaX = event.clientX - dragState.lastX;
        const deltaY = event.clientY - dragState.lastY;
        dragState.lastX = event.clientX;
        dragState.lastY = event.clientY;

        rotationState.targetY += deltaX * 0.006;
        rotationState.targetX = clamp(
          rotationState.targetX + deltaY * 0.004,
          -0.75,
          0.75,
        );
        rotationState.velocityY = deltaX * 0.0009;
        rotationState.velocityX = deltaY * 0.0007;
      };

      const endPointer = (event) => {
        if (dragState.pointerId === event.pointerId) {
          dragState.active = false;
          dragState.pointerId = null;
        }
      };

      const onWheel = (event) => {
        event.preventDefault();
        zoomState.target = clamp(
          zoomState.target + event.deltaY * 0.004,
          4.6,
          8.8,
        );
      };

      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      renderer.domElement.addEventListener('pointermove', onPointerMove);
      renderer.domElement.addEventListener('pointerup', endPointer);
      renderer.domElement.addEventListener('pointerleave', endPointer);
      renderer.domElement.addEventListener('wheel', onWheel, {
        passive: false,
      });

      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        if (!dragState.active) {
          rotationState.targetY += reducedMotion ? 0.0003 : 0.00075;
          rotationState.targetX += rotationState.velocityX;
          rotationState.targetY += rotationState.velocityY;
          rotationState.velocityX *= 0.92;
          rotationState.velocityY *= 0.92;
        }

        rotationState.currentX +=
          (rotationState.targetX - rotationState.currentX) * 0.08;
        rotationState.currentY +=
          (rotationState.targetY - rotationState.currentY) * 0.08;
        globeGroup.rotation.x = rotationState.currentX;
        globeGroup.rotation.y = rotationState.currentY;

        zoomState.current += (zoomState.target - zoomState.current) * 0.1;
        camera.position.z = zoomState.current;

        atmosphere.rotation.y = -elapsed * (reducedMotion ? 0.025 : 0.07);
        stars.rotation.y = elapsed * (reducedMotion ? 0.002 : 0.005);

        markers.forEach((marker, index) => {
          marker.scale.setScalar(
            1 + Math.sin(elapsed * (reducedMotion ? 1.25 : 2) + index) * 0.08,
          );
        });

        heatSprites.forEach((sprite, index) => {
          const pulse =
            0.12 + (Math.sin(elapsed * 2.4 + index * 0.35) + 1) * 0.08;
          sprite.material.opacity = reducedMotion ? pulse * 0.45 : pulse;
        });

        arcMovers.forEach((item) => {
          item.progress =
            (item.progress + item.speed * (reducedMotion ? 0.55 : 1)) % 1;
          const point = item.curve.getPoint(item.progress);
          item.mover.position.copy(point);
        });

        renderer.render(scene, camera);
      };

      animate();

      resizeObserver = new ResizeObserver((entries) => {
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

      cleanup = () => {
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerup', endPointer);
        renderer.domElement.removeEventListener('pointerleave', endPointer);
        renderer.domElement.removeEventListener('wheel', onWheel);
        heatTexture?.dispose();
        renderer.dispose();
        scene.traverse((node) => {
          if (node instanceof three.Mesh) {
            node.geometry?.dispose();
            if (Array.isArray(node.material)) {
              node.material.forEach((mat) => mat.dispose());
            } else {
              node.material?.dispose();
            }
          }
          if (node instanceof three.Line) {
            node.geometry?.dispose();
            node.material?.dispose();
          }
          if (node instanceof three.Points) {
            node.geometry?.dispose();
            node.material?.dispose();
          }
          if (node instanceof three.Sprite) {
            node.material?.dispose();
          }
        });
        if (host.contains(renderer.domElement)) {
          host.removeChild(renderer.domElement);
        }
      };
    }

    initializeScene();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
      resizeObserver?.disconnect();
      cleanup?.();
      setThreeReady(false);
    };
  }, [isInViewport, routes, reducedMotion]);

  return (
    <section
      className="vt-globe-view"
      aria-label="Global 3D logistics tracking"
    >
      <div className="vt-globe-canvas-wrap" ref={canvasRef}>
        {!threeReady && (
          <div className="vt-globe-loading" aria-live="polite">
            <span className="vt-globe-loading-pulse" aria-hidden="true" />
            Initializing 3D globe...
          </div>
        )}
      </div>

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
