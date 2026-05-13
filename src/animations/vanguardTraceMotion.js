export const nodeFloat = {
  initial: { y: 0, opacity: 0.85 },
  animate: {
    y: [-1, 1, -1],
    opacity: [0.78, 0.92, 0.78],
    transition: {
      duration: 5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export const radarSpin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 18,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

export const panelReveal = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: 'easeOut',
    },
  },
};
