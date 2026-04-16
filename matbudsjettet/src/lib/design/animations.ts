import type { Variants } from "framer-motion";

export const motionTransition = {
  duration: 0.28,
  ease: "easeOut"
} as const;

export const pageTransition = {
  duration: 0.3,
  ease: "easeOut"
} as const;

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 }
};

export const onboardingStepVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

export const cardMotion = {
  whileHover: { opacity: 0.95 },
  whileTap: { scale: 0.99 },
  transition: { duration: 0.22, ease: "easeOut" }
} as const;

export const buttonTap = {
  whileTap: { scale: 0.98 },
  transition: { duration: 0.16, ease: "easeOut" }
} as const;

export const tabMotion = {
  whileTap: { opacity: 0.92 },
  transition: { duration: 0.18, ease: "easeOut" }
} as const;

export const sectionVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 }
};

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const modalSheetVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 18 }
};
