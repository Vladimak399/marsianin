import { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const cardHover: Variants = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.2 }
  }
};
