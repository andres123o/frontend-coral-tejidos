export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeSoft = [0.4, 0, 0.2, 1] as const;
export const springTap = { type: "spring", stiffness: 300, damping: 30 } as const;

export const durations = { fast: 0.15, base: 0.25, slow: 0.4 } as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: durations.base, ease: easeOutExpo } },
};

export const gridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

export const routeTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: easeSoft } },
  exit: { opacity: 0, y: -8, transition: { duration: durations.fast, ease: easeSoft } },
};
