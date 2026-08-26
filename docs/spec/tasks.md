# Implementation Plan: Modern Portfolio Website

## Overview

This implementation plan converts the design into actionable coding tasks for building a Next.js 14+ portfolio website with TypeScript, Tailwind CSS, and glassmorphism dark theme. The contact form functionality is powered by a separate Python FastAPI backend that handles email delivery. The plan follows an incremental approach: setting up the project foundation, implementing core components, building all nine section pages, setting up the Python backend with email integration, and completing with comprehensive testing.

## Tasks

- [x] 1. Initialize Next.js project and configure foundation
  - Create Next.js 14+ project with TypeScript and App Router
  - Install and configure Tailwind CSS
  - Set up project structure: `/app`, `/components`, `/lib`, `/public` directories
  - Configure `globals.css` with dark theme base styles and glassmorphism utilities
  - Set up TypeScript configuration for strict type checking
  - _Requirements: 1.1, 2.1, 2.2, 15.1_

- [x] 2. Implement core reusable components
  - [x] 2.1 Create GlassCard component with variants
    - Implement `GlassCard.tsx` with glassmorphism styling (backdrop-filter, transparent background, border)
    - Support `default`, `hover`, and `interactive` variants
    - Apply Tailwind classes for responsive padding and border radius
    - _Requirements: 2.2, 2.4_
  
  - [x] 2.2 Create Navigation component with responsive behavior
    - Implement `Navigation.tsx` with links to all nine sections
    - Use Next.js `Link` component and `usePathname()` hook for active state
    - Implement hamburger menu for mobile, full menu for desktop
    - Apply fixed positioning with glassmorphism effect
    - _Requirements: 1.3, 1.4, 1.5, 3.1, 3.2, 3.3, 16.4_
  
  - [x] 2.3 Write property test for Navigation
    - **Property 1: Navigation Links Completeness**
    - **Property 2: Navigation Routing Correctness**
    - **Property 3: Navigation Presence Across Pages**
    - **Validates: Requirements 1.3, 1.4, 1.5**

- [x] 3. Define TypeScript types and validation utilities
  - [x] 3.1 Create type definitions in lib/types.ts
    - Define interfaces: `Project`, `Experience`, `Education`, `SkillCategory`, `ContactFormData`, `FormErrors`
    - Export all types for use across components
    - Note: API endpoint structure will be Python FastAPI backend at `/api/contact`
    - _Requirements: 7.1, 9.1, 10.1, 13.2_
  
  - [x] 3.2 Implement form validation logic in lib/validation.ts
    - Implement `validateContactForm` function with rules: name ≥2 chars, valid email format, message ≥10 chars
    - Implement `isValidEmail` helper using regex pattern
    - Return `FormErrors` object with field-specific error messages
    - _Requirements: 13.4, 13.5_
  
  - [x] 3.3 Write property tests for form validation
    - **Property 20: Contact Form Validation - Valid Input Acceptance**
    - **Property 21: Contact Form Validation - Invalid Input Rejection**
    - **Validates: Requirements 13.4, 13.5**

- [x] 4. Implement root layout and Hero section (landing page)
  - [x] 4.1 Create root layout with Navigation
    - Implement `app/layout.tsx` with Navigation component
    - Configure Inter font using `next/font`
    - Apply dark theme background and text colors
    - _Requirements: 1.5, 2.1, 15.1, 16.1_
  
  - [x] 4.2 Create Hero section page
    - Implement `app/page.tsx` with name, title, and introductory statement
    - Apply gradient text effect to heading
    - Center content with full viewport height layout
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 4.3 Write property test for Hero section
    - **Property 7: Hero Section Content Rendering**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 5. Checkpoint - Verify foundation and navigation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement About and Skills sections
  - [x] 6.1 Create About section page
    - Implement `app/about/page.tsx` with professional summary and background text
    - Use GlassCard component for content container
    - Apply max-width centering and responsive padding
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 6.2 Write property test for About section
    - **Property 8: About Section Content Rendering**
    - **Validates: Requirements 5.1, 5.2**
  
  - [x] 6.3 Create Skills section page
    - Implement `app/skills/page.tsx` with skill categories data
    - Render grid of GlassCard components (1 col mobile, 2 col tablet, 3 col desktop)
    - Display category name and skill items as badges/pills
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 3.1, 3.2, 3.3_
  
  - [x] 6.4 Write property test for Skills section
    - **Property 9: Skills Display Completeness**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 7. Implement Projects section with modal system
  - [x] 7.1 Create ProjectCard component
    - Implement `components/ProjectCard.tsx` with project preview (title, description, image, technologies)
    - Add hover effects (scale, glow) using Tailwind
    - Include "View Details" visual indicator
    - Handle click event to trigger modal opening
    - _Requirements: 7.2, 7.5, 2.2_
  
  - [x] 7.2 Create ProjectModal component
    - Implement `components/ProjectModal.tsx` with full-screen overlay
    - Display all project fields: title, detailed description, technologies, outcomes, GitHub/live links
    - Implement close button, outside-click dismissal, and Escape key handler
    - Prevent body scroll when open using useEffect
    - Apply focus management for accessibility
    - Ensure responsive layout (full-screen mobile, centered card desktop)
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 16.4, 16.5_
  
  - [x] 7.3 Create Projects section page
    - Implement `app/projects/page.tsx` with array of 5 project objects
    - Manage modal state: `selectedProject` and `isModalOpen`
    - Render grid of ProjectCard components (1 col mobile, 2 col tablet, 3 col desktop)
    - Pass project data and modal handlers to ProjectCard and ProjectModal
    - _Requirements: 7.1, 7.3, 7.4, 3.1, 3.2, 3.3_
  
  - [x] 7.4 Write property tests for Projects and Modal
    - **Property 10: Projects Gallery Display**
    - **Property 11: Project Detail Indicator Presence**
    - **Property 12: Modal Open with Correct Project Data**
    - **Property 13: Modal Content Completeness**
    - **Property 14: Modal Lifecycle**
    - **Property 15: Modal Responsiveness**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.7**

- [x] 8. Checkpoint - Verify core interactive features
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Experience and Education sections
  - [x] 9.1 Create Experience section page
    - Implement `app/experience/page.tsx` with array of experience objects
    - Render timeline or card list with role, company, date range, responsibilities
    - Apply chronological ordering (most recent first)
    - Use GlassCard components for each entry
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [x] 9.2 Write property test for Experience section
    - **Property 16: Experience Content Rendering**
    - **Validates: Requirements 9.1, 9.2, 9.3**
  
  - [x] 9.3 Create Education section page
    - Implement `app/education/page.tsx` with array of education objects
    - Display degree, institution, date, and optional details
    - Use GlassCard components for each entry
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [x] 9.4 Write property test for Education section
    - **Property 17: Education Content Rendering**
    - **Validates: Requirements 10.1, 10.2**

- [x] 10. Implement Research and Resume sections
  - [x] 10.1 Create Research section page
    - Implement `app/research/page.tsx` with research interests content
    - Display focus areas in formatted text (paragraphs or bullet points)
    - Use GlassCard component for content container
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [x] 10.2 Write property test for Research section
    - **Property 18: Research Content Rendering**
    - **Validates: Requirements 11.1**
  
  - [x] 10.3 Create Resume section page
    - Implement `app/resume/page.tsx` with download button/link
    - Link to `/resume.pdf` in public folder with download attribute
    - Display brief description and file format indication
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [x] 10.4 Write property test for Resume download
    - **Property 19: Resume Download Trigger**
    - **Validates: Requirements 12.1, 12.3, 12.4**

- [x] 11. Set up Python FastAPI backend for contact form
  - [x] 11.1 Initialize FastAPI backend project
    - Create `/backend` directory in project root
    - Create `backend/main.py` with FastAPI app initialization
    - Create `backend/requirements.txt` with dependencies: fastapi, uvicorn, python-multipart, pydantic, pydantic-settings
    - Add email library dependencies: python-dotenv, aiosmtplib (or sendgrid/boto3 for email service SDK)
    - Create `backend/.env.example` with email configuration variables
    - _Requirements: 14.1, 14.2, 14.5_
  
  - [x] 11.2 Implement FastAPI contact endpoint
    - Create `backend/models.py` with Pydantic model for contact form data (name, email, message)
    - Create `backend/config.py` to load email configuration from environment variables
    - Implement POST `/api/contact` endpoint in `backend/main.py`
    - Add request validation using Pydantic models
    - Add CORS middleware to allow requests from Next.js frontend (localhost:3000 for dev, production domain)
    - _Requirements: 14.1, 13.2, 13.4_
  
  - [x] 11.3 Implement email sending functionality in Python backend
    - Create `backend/email_service.py` with email sending function
    - Use aiosmtplib for SMTP or integrate email service SDK (SendGrid, AWS SES, etc.)
    - Configure email templates with sender information
    - Implement error handling for email delivery failures
    - Return appropriate HTTP status codes and messages
    - _Requirements: 14.1, 14.2, 14.5_
  
  - [x] 11.4 Create ContactForm component for Next.js frontend
    - Implement `components/ContactForm.tsx` with name, email, message fields and submit button
    - Integrate validation logic from `lib/validation.ts`
    - Display inline error messages for invalid fields with red styling
    - Disable submit button during submission
    - Show success/error status messages below form
    - Clear form on successful submission
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [x] 11.5 Write property test for ContactForm fields
    - **Property 22: Contact Form Field Requirements**
    - **Validates: Requirements 13.1, 13.2, 13.3**
  
  - [x] 11.6 Implement frontend API client for Python backend
    - Create `lib/email.ts` with `sendEmail` function that calls Python FastAPI endpoint
    - Configure API base URL using environment variable (NEXT_PUBLIC_API_URL)
    - Implement POST request to `/api/contact` with form data
    - Handle network errors and API error responses
    - Parse success/error responses from backend
    - _Requirements: 14.1, 14.2, 14.5_
  
  - [x] 11.7 Create Contact section page
    - Implement `app/contact/page.tsx` with ContactForm component
    - Manage form submission state: `isSubmitting`, `submitStatus`
    - Handle successful and failed submissions with user feedback
    - _Requirements: 13.6, 14.3, 14.4_
  
  - [x] 11.8 Write integration tests for Python backend
    - Create `backend/test_main.py` with pytest tests
    - Test POST `/api/contact` endpoint with valid data
    - Test validation errors with invalid data
    - Mock email sending function to test error handling
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 12. Checkpoint - Verify all sections complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Implement responsive design and theme refinements
  - [x] 13.1 Configure Tailwind theme extensions
    - Extend Tailwind config with custom color palette (dark theme colors, accent gradients)
    - Add custom glassmorphism utilities if needed
    - Configure responsive breakpoints (sm, md, lg, xl)
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_
  
  - [x] 13.2 Apply responsive design across all pages
    - Verify all grid layouts adapt correctly (1 col → 2 col → 3 col)
    - Test navigation responsiveness (hamburger menu on mobile)
    - Ensure no horizontal scrolling on any viewport size
    - Apply consistent padding and spacing using Tailwind responsive classes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 13.3 Write property tests for responsive behavior
    - **Property 4: Dark Theme Application**
    - **Property 5: Glassmorphism Effect Presence**
    - **Property 6: Responsive Layout Adaptation**
    - **Validates: Requirements 2.1, 2.2, 3.1, 3.2, 3.3, 3.4**

- [x] 14. Implement accessibility features
  - [x] 14.1 Add semantic HTML and ARIA labels
    - Ensure proper heading hierarchy (h1 → h2 → h3) across all pages
    - Add ARIA labels to navigation, modal, form elements
    - Use semantic elements: `<nav>`, `<main>`, `<article>`, `<form>`
    - _Requirements: 16.1, 16.5_
  
  - [x] 14.2 Add alt text to all images
    - Add descriptive alt text to project images
    - Use empty alt for decorative images
    - _Requirements: 16.2_
  
  - [x] 14.3 Verify keyboard navigation support
    - Test Tab navigation through all interactive elements
    - Test Escape key for modal dismissal
    - Ensure visible focus indicators on all focusable elements
    - _Requirements: 16.4_
  
  - [x] 14.4 Write property tests for accessibility
    - **Property 23: Semantic HTML Usage**
    - **Property 24: Image Alt Text Presence**
    - **Property 25: Keyboard Navigation Support**
    - **Property 26: ARIA Label Presence**
    - **Validates: Requirements 16.1, 16.2, 16.4, 16.5**

- [x] 15. Optimize performance and prepare for deployment
  - [x] 15.1 Optimize images using Next.js Image component
    - Replace img tags with Next.js `Image` component
    - Configure responsive image sizes
    - Add lazy loading for project images
    - _Requirements: 15.2, 15.3_
  
  - [x] 15.2 Configure build optimization
    - Verify Tailwind PurgeCSS is removing unused styles
    - Test build output and bundle size
    - Ensure all pages are statically generated
    - _Requirements: 15.1, 15.4_
  
  - [x] 15.3 Create environment configuration
    - Create `.env.local.example` with required environment variables
    - Frontend: `NEXT_PUBLIC_API_URL` for Python backend endpoint (e.g., http://localhost:8000 for dev)
    - Backend: Create `backend/.env.example` with email configuration (SMTP credentials or email service API keys)
    - Document setup instructions for Python FastAPI backend and email service
    - Add environment variables to `.gitignore`
    - _Requirements: 14.5_
  
  - [x] 15.4 Add resume PDF to public folder
    - Create placeholder `public/resume.pdf` (user will replace with actual resume)
    - Verify download functionality works correctly
    - _Requirements: 12.2, 12.3_

- [x] 16. Final checkpoint and verification
  - Run full build (`npm run build`)
  - Test all navigation links
  - Test modal interactions
  - Test contact form submission
  - Verify responsive behavior on mobile, tablet, desktop
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Property-based tests should use minimum 100 iterations per test
- Each task references specific requirements for traceability
- The implementation uses TypeScript for type safety throughout
- **Backend uses Python FastAPI with email delivery via aiosmtplib or email service SDK (SendGrid, AWS SES, etc.)**
- **Frontend communicates with Python backend via REST API endpoint: POST /api/contact**
- **CORS must be configured in FastAPI backend to allow requests from Next.js frontend**
- All glassmorphism effects should use `backdrop-filter: blur(10px)` for consistency
- Navigation component should be included in root layout for presence on all pages
- Modal focus management is critical for accessibility compliance
- Environment variables must never be committed to version control
- **Python backend runs separately from Next.js frontend (e.g., uvicorn on port 8000, Next.js on port 3000)**

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1"]
    },
    {
      "id": 1,
      "tasks": ["2.1", "3.1"]
    },
    {
      "id": 2,
      "tasks": ["2.2", "3.2", "4.1"]
    },
    {
      "id": 3,
      "tasks": ["2.3", "3.3", "4.2"]
    },
    {
      "id": 4,
      "tasks": ["4.3", "6.1"]
    },
    {
      "id": 5,
      "tasks": ["6.2", "6.3"]
    },
    {
      "id": 6,
      "tasks": ["6.4", "7.1"]
    },
    {
      "id": 7,
      "tasks": ["7.2"]
    },
    {
      "id": 8,
      "tasks": ["7.3"]
    },
    {
      "id": 9,
      "tasks": ["7.4", "9.1"]
    },
    {
      "id": 10,
      "tasks": ["9.2", "9.3"]
    },
    {
      "id": 11,
      "tasks": ["9.4", "10.1"]
    },
    {
      "id": 12,
      "tasks": ["10.2", "10.3"]
    },
    {
      "id": 13,
      "tasks": ["10.4", "11.1"]
    },
    {
      "id": 14,
      "tasks": ["11.2", "11.3", "11.4"]
    },
    {
      "id": 15,
      "tasks": ["11.5", "11.6"]
    },
    {
      "id": 16,
      "tasks": ["11.7"]
    },
    {
      "id": 17,
      "tasks": ["11.8", "13.1"]
    },
    {
      "id": 18,
      "tasks": ["13.2"]
    },
    {
      "id": 19,
      "tasks": ["13.3", "14.1"]
    },
    {
      "id": 20,
      "tasks": ["14.2", "14.3"]
    },
    {
      "id": 21,
      "tasks": ["14.4", "15.1"]
    },
    {
      "id": 22,
      "tasks": ["15.2", "15.3", "15.4"]
    }
  ]
}
```
