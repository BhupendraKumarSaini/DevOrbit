/* Global easing */
export const ease = [0.22, 1, 0.36, 1];

/* Fade + Slide */
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

/* Scale in (cards, modals) */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease },
  },
};

/* Stagger container */
export const stagger = {
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* Hover / Tap (buttons, cards, links) */
export const hover = {
  scale: 1.04,
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

export const tap = {
  scale: 0.96,
};
