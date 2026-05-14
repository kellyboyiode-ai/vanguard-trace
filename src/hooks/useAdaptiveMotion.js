import { useEffect, useMemo, useState } from 'react';

function detectLowPowerDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const cores = Number(navigator.hardwareConcurrency || 0);
  const memory = Number(navigator.deviceMemory || 0);
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);

  return saveData || (cores > 0 && cores <= 4) || (memory > 0 && memory <= 4);
}

export function useAdaptiveMotion(options = {}) {
  const { applyRootClass = false } = options;
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [lowPower] = useState(() => detectLowPowerDevice());

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setPrefersReduced(media.matches);

    apply();

    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  const reducedMotion = useMemo(
    () => prefersReduced || lowPower,
    [prefersReduced, lowPower],
  );

  useEffect(() => {
    if (!applyRootClass) {
      return undefined;
    }

    document.documentElement.classList.toggle(
      'vt-reduced-motion',
      reducedMotion,
    );
    return () => {
      document.documentElement.classList.remove('vt-reduced-motion');
    };
  }, [applyRootClass, reducedMotion]);

  return {
    reducedMotion,
    lowPower,
    prefersReduced,
  };
}
