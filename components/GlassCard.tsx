'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'hover' | 'interactive';
}

/**
 * GlassCard component with glassmorphism styling
 *
 * Implements the glassmorphism design pattern with three variants:
 * - default: Static glass effect for content containers
 * - hover: Glass effect with hover animation (scale up, enhanced glow)
 * - interactive: Glass effect optimized for clickable items
 *
 * The "hover" and "interactive" variants additionally get a subtle
 * mouse-follow 3D tilt and radial glow, used for smaller preview cards
 * (projects, repos). "default" cards (info panels, text-heavy content)
 * stay static, since tilting large blocks of text reads as distracting
 * rather than premium.
 *
 * @param children - Content to render inside the glass card
 * @param className - Additional CSS classes to apply
 * @param variant - Visual variant of the card (default, hover, interactive)
 */
export default function GlassCard({
    children,
    className = '',
    variant = 'default'
}: GlassCardProps) {
    // Determine base glass class based on variant
    const baseClass = variant === 'default' ? 'glass-card' : 'glass-card-hover';

    // Add interactive cursor for interactive variant
    const cursorClass = variant === 'interactive' ? 'cursor-pointer' : '';

    // Combine all classes with responsive padding
    const combinedClasses = `${baseClass} ${cursorClass} p-6 ${className}`.trim();

    const enableTilt = variant !== 'default';

    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), { stiffness: 300, damping: 25 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), { stiffness: 300, damping: 25 });
    const glowBackground = useTransform([mouseX, mouseY], ([mx, my]: number[]) =>
        `radial-gradient(circle at ${mx * 100}% ${my * 100}%, rgba(168, 85, 247, 0.25), transparent 60%)`
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
        mouseX.set(0.5);
        mouseY.set(0.5);
    };

    if (!enableTilt) {
        return <div className={combinedClasses}>{children}</div>;
    }

    return (
        <motion.div
            ref={cardRef}
            className={`${combinedClasses} relative overflow-hidden`}
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: glowBackground }}
            />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
