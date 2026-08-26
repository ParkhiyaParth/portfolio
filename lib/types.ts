/**
 * Type definitions for the modern portfolio website
 * 
 * This file contains all TypeScript interfaces used across the portfolio application.
 * These types ensure type safety and provide clear contracts for data structures.
 */

/**
 * Represents a portfolio project with all details for display in gallery and modal views
 * 
 * @property id - Unique identifier for the project
 * @property title - Project name
 * @property description - Brief project summary for gallery cards
 * @property detailedDescription - Comprehensive project description for modal view
 * @property technologies - Array of technology names used in the project
 * @property outcomes - Array of project results and achievements
 * @property imageUrl - Path to project preview image
 * @property githubUrl - Optional link to GitHub repository
 * @property liveUrl - Optional link to live deployment
 * @property featured - Optional flag marking this as the flagship project
 */
export interface Project {
    id: string;
    title: string;
    description: string;
    detailedDescription: string;
    technologies: string[];
    outcomes: string[];
    imageUrl: string;
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
}

/**
 * Represents a single public GitHub repository as returned by the GitHub REST API
 * (subset of fields actually used by the GitHub showcase section)
 */
export interface GitHubRepo {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
    fork: boolean;
    archived: boolean;
}

/**
 * Represents the subset of GitHub user profile fields used by the GitHub showcase section
 */
export interface GitHubUser {
    login: string;
    html_url: string;
    public_repos: number;
    followers: number;
    following: number;
    avatar_url: string;
}

/**
 * Represents a professional work experience entry
 * 
 * @property id - Unique identifier for the experience entry
 * @property role - Job title or position
 * @property company - Company or organization name
 * @property startDate - Employment start date (formatted string)
 * @property endDate - Employment end date (formatted string or "Present")
 * @property description - Array of responsibilities and achievements
 */
export interface Experience {
    id: string;
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string[];
}

/**
 * Represents an education credential entry
 * 
 * @property id - Unique identifier for the education entry
 * @property degree - Degree name and field of study
 * @property institution - University or institution name
 * @property date - Graduation date or time period
 * @property details - Optional additional information (GPA, honors, etc.)
 */
export interface Education {
    id: string;
    degree: string;
    institution: string;
    date: string;
    details?: string;
}

/**
 * Represents a category of skills with related skill items
 * 
 * @property category - Category name (e.g., "Languages", "Frameworks", "Tools")
 * @property skills - Array of skill names within the category
 */
export interface SkillCategory {
    category: string;
    skills: string[];
}

/**
 * Represents contact form submission data
 * 
 * @property name - Sender's name
 * @property email - Sender's email address
 * @property message - Message content
 */
export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

/**
 * Represents validation errors for contact form fields
 * 
 * @property name - Error message for name field (if invalid)
 * @property email - Error message for email field (if invalid)
 * @property message - Error message for message field (if invalid)
 */
export interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}
