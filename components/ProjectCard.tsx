import React from 'react';
import Image from 'next/image';
import { Project } from '@/lib/types';
import GlassCard from './GlassCard';

interface ProjectCardProps {
    project: Project;
    onOpenModal: (project: Project) => void;
}

/**
 * ProjectCard component displays a project preview in the portfolio gallery
 * 
 * Features:
 * - Project image with Next.js Image optimization
 * - Title, description, and technology badges
 * - Glassmorphism styling with hover effects
 * - "View Details" button for modal interaction
 * - Click handler to open project modal
 * 
 * @param project - Project data to display
 * @param onOpenModal - Callback function to trigger modal opening
 */
export default function ProjectCard({ project, onOpenModal }: ProjectCardProps) {
    const handleClick = () => {
        onOpenModal(project);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenModal(project);
        }
    };

    return (
        <article
            className="group"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${project.title} project`}
        >
            <GlassCard variant="hover" className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                {/* Project Image */}
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <Image
                        src={project.imageUrl}
                        alt={`${project.title} project screenshot`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                </div>

                {/* Project Content */}
                <div className="flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gradient transition-all duration-300">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                        {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* View Details Button */}
                    <div className="mt-auto pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                            <span>View Details</span>
                            <svg
                                className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </article>
    );
}
