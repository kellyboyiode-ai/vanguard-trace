export const nodeFloat = {
  initial: { y: 0, opacity: 0.7 },
  animate: {
    y: [-3, 3, -3],
    opacity: [0.55, 1, 0.55],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export const radarSpin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 8,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

export const panelReveal = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};
