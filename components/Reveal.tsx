'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

const variants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

interface RevealProps {
    children: ReactNode;
    className?: string;
}

/**
 * Fades and slides a section's content into view the first time it enters
 * the viewport while scrolling. Respects prefers-reduced-motion via the
 * MotionConfig wrapping the page (see app/page.tsx).
 */
export default function Reveal({ children, className }: RevealProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}
