'use client'

import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter">
      {children}
    </motion.div>
  )
}
