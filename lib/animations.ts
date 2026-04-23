import { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12
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
