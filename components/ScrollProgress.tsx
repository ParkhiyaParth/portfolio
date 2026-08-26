'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gradient bar fixed to the very top of the viewport that fills as
 * the user scrolls down the page.
 */
export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 300,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 origin-left bg-gradient-to-r from-accent-purple to-accent-blue z-[60]"
            style={{ scaleX }}
            role="progressbar"
            aria-label="Page scroll progress"
        />
    );
}
