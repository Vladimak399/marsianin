import { Variants } from 'framer-motion';

export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: premiumEase }
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const cardHover: Variants = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: premiumEase }
  }
};

export const nodeTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: premiumEase } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: premiumEase } }
};

export const teleportOverlayVariants: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: 1,
    scale: 1.2,
    transition: { duration: 0.45, ease: premiumEase }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: premiumEase }
  }
};
