import React from 'react';

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

    return (
        <div className={combinedClasses}>
            {children}
        </div>
    );
}
