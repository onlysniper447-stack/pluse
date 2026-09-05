import type { Transition, Variants } from 'framer-motion'

export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1]

export const spring: Transition = { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: 'blur(6px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.38, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } },
}

export const logLine: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
}

export const scanStateVariants: Variants = {
  idle: { opacity: 1, scale: 1, boxShadow: '0 0 0px 0px rgba(0,240,128,0)' },
  scanning: {
    opacity: 1,
    scale: 1,
    boxShadow: [
      '0 0 0px 0px rgba(0,240,128,0)',
      '0 0 36px -4px rgba(0,240,128,0.5)',
      '0 0 0px 0px rgba(0,240,128,0)',
    ],
    transition: { boxShadow: { duration: 1.7, repeat: Infinity, ease: 'easeInOut' } },
  },
  complete: {
    opacity: 1,
    scale: 1,
    boxShadow: '0 0 44px -8px rgba(16,185,129,0.55)',
    transition: { duration: 0.55, ease: easeOutExpo },
  },
}

export const scoreRingTransition: Transition = { duration: 1.45, ease: easeOutExpo, delay: 0.12 }

export const navIndicatorTransition: Transition = { type: 'spring', stiffness: 520, damping: 42 }

export const hoverLift = { y: -2, transition: { duration: 0.18 } }
