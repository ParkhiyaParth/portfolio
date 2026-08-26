# Design Document

## Introduction

This document specifies the technical design for a modern portfolio website built with Next.js. The design follows a component-based architecture with a dark theme featuring glassmorphism effects. The application implements nine distinct sections showcasing professional information, with responsive design supporting mobile, tablet, and desktop viewports.

## Architecture Overview

### System Architecture

The portfolio follows a **modern Next.js App Router architecture** with the following layers:

1. **Presentation Layer**: React components implementing UI sections and interactions
2. **Routing Layer**: Next.js App Router for page navigation and routing
3. **State Management Layer**: React hooks and context for UI state (modal visibility, form state)
4. **Service Layer**: Email service integration for contact form submissions
5. **Static Asset Layer**: Public folder for resume PDF and optimized images

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Email Service**: EmailJS or Formspree
- **Deployment**: Vercel (recommended for Next.js)

### Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page (Hero section)
│   ├── about/page.tsx          # About section
│   ├── skills/page.tsx         # Skills section
│   ├── projects/page.tsx       # Projects gallery
│   ├── experience/page.tsx     # Experience section
│   ├── education/page.tsx      # Education section
│   ├── research/page.tsx       # Research interests
│   ├── resume/page.tsx         # Resume download
│   └── contact/page.tsx        # Contact form
├── components/
│   ├── Navigation.tsx          # Main navigation component
│   ├── ProjectCard.tsx         # Project preview card
│   ├── ProjectModal.tsx        # Project detail modal
│   ├── ContactForm.tsx         # Contact form with validation
│   └── GlassCard.tsx           # Reusable glassmorphism card
├── lib/
│   ├── email.ts                # Email service integration
│   ├── types.ts                # TypeScript type definitions
│   └── validation.ts           # Form validation logic
├── public/
│   ├── resume.pdf              # Resume PDF file
│   └── images/                 # Project images and assets
└── styles/
    └── globals.css             # Global styles and Tailwind config
```


## Component Design

### Core Components

#### 1. Navigation Component

**Purpose**: Provides consistent navigation across all pages

**Interface**:
```typescript
interface NavigationProps {
  currentPath: string;
}

interface NavLink {
  label: string;
  path: string;
}
```

**Behavior**:
- Displays navigation links to all nine sections
- Highlights current active page
- Responsive: Hamburger menu on mobile, full menu on desktop
- Applies glassmorphism styling with fixed positioning

**Implementation Notes**:
- Use Next.js `Link` component for client-side navigation
- Use `usePathname()` hook to determine active page
- CSS: `backdrop-filter: blur(10px)`, `background: rgba(0, 0, 0, 0.7)`

#### 2. GlassCard Component

**Purpose**: Reusable container with glassmorphism effect

**Interface**:
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'interactive';
}
```

**Styling**:
- Background: `rgba(255, 255, 255, 0.05)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Backdrop filter: `blur(10px)`
- Border radius: `16px`
- Padding: `24px`


#### 3. ProjectCard Component

**Purpose**: Displays project preview in gallery layout

**Interface**:
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  detailedDescription: string;
  outcomes: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  onOpenModal: (project: Project) => void;
}
```

**Behavior**:
- Displays project title, short description, and image
- Shows technology tags
- Hover effect: Scale up slightly, increase glow
- Click triggers modal with full project details
- Visual indicator (e.g., "View Details" or expand icon)

#### 4. ProjectModal Component

**Purpose**: Displays expanded project details in overlay

**Interface**:
```typescript
interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**Behavior**:
- Full-screen overlay with centered content
- Displays all project fields: title, detailed description, technologies, outcomes, links
- Close button in top-right corner
- Click outside modal to dismiss
- Escape key to dismiss
- Prevents body scroll when open
- Responsive: Full-screen on mobile, centered card on desktop

**State Management**:
- Parent component manages `isOpen` state and selected project
- Modal receives `project`, `isOpen`, and `onClose` callback


#### 5. ContactForm Component

**Purpose**: Handles contact form submission with validation

**Interface**:
```typescript
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}
```

**Behavior**:
- Input fields: name (text), email (email), message (textarea)
- Client-side validation:
  - Name: Required, min 2 characters
  - Email: Required, valid email format
  - Message: Required, min 10 characters
- Submit button disabled during submission
- Display inline error messages for invalid fields
- Display success message on successful submission
- Display error message on submission failure
- Clear form on successful submission

**Validation Logic** (lib/validation.ts):
```typescript
export function validateContactForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};
  
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  return errors;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```


### Page Components

#### Hero Section (app/page.tsx)

**Purpose**: Landing page with introduction

**Content**:
- Professional name (h1)
- Title/Role (h2)
- Introductory tagline/statement
- Optional: Call-to-action buttons (View Projects, Contact Me)
- Background gradient effect

**Layout**: Centered content, full viewport height

#### About Section (app/about/page.tsx)

**Content**:
- Professional summary paragraph
- Background information
- Optional: Profile image

**Layout**: GlassCard with text content, max-width centered

#### Skills Section (app/skills/page.tsx)

**Content**:
- Grouped skill categories (e.g., Languages, Frameworks, Tools, AI/ML)
- Skill items displayed as pills/badges

**Layout**: Grid of GlassCards, each card representing a skill category

**Example Data Structure**:
```typescript
interface SkillCategory {
  category: string;
  skills: string[];
}
```

#### Projects Section (app/projects/page.tsx)

**Content**:
- Grid of 5 ProjectCard components
- Modal state management

**Layout**: Responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop)

**State Management**:
```typescript
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
```


#### Experience Section (app/experience/page.tsx)

**Content**:
- Timeline or list of work experiences
- Each entry: Role, Company, Date range, Responsibilities/achievements

**Data Structure**:
```typescript
interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string; // or "Present"
  description: string[];
}
```

**Layout**: Vertical timeline or card list, chronological order (most recent first)

#### Education Section (app/education/page.tsx)

**Content**:
- Academic credentials
- Each entry: Degree, Institution, Date, Optional: GPA, honors

**Data Structure**:
```typescript
interface Education {
  id: string;
  degree: string;
  institution: string;
  date: string;
  details?: string;
}
```

**Layout**: Card list or timeline

#### Research Section (app/research/page.tsx)

**Content**:
- Research interests and focus areas
- Optional: Publications, ongoing projects

**Layout**: GlassCard with formatted text, bullet points or paragraphs

#### Resume Section (app/resume/page.tsx)

**Content**:
- Download button/link
- Brief description of resume contents
- File size and format indication

**Functionality**:
```typescript
// Link to static file
<a href="/resume.pdf" download="YourName_Resume.pdf">
  Download Resume
</a>
```


#### Contact Section (app/contact/page.tsx)

**Content**:
- ContactForm component
- Optional: Additional contact information (email, LinkedIn, GitHub)

**State Management**:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

const handleSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);
  try {
    await sendEmail(data);
    setSubmitStatus('success');
  } catch (error) {
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};
```

## Service Layer

### Email Service Integration (lib/email.ts)

**Purpose**: Handles email delivery via EmailJS or Formspree

**Interface**:
```typescript
export async function sendEmail(data: ContactFormData): Promise<void> {
  // Implementation depends on chosen service
}
```

**Option 1: EmailJS Implementation**
```typescript
import emailjs from '@emailjs/browser';

export async function sendEmail(data: ContactFormData): Promise<void> {
  const templateParams = {
    from_name: data.name,
    from_email: data.email,
    message: data.message,
  };
  
  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    templateParams,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  );
}
```

**Option 2: Formspree Implementation**
```typescript
export async function sendEmail(data: ContactFormData): Promise<void> {
  const response = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}
```

**Environment Variables**:
- EmailJS: `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
- Formspree: `NEXT_PUBLIC_FORMSPREE_ID`


## Styling Design

### Theme Configuration

**Color Palette**:
```typescript
// Tailwind CSS theme extension
const colors = {
  dark: {
    bg: '#0a0a0a',           // Main background
    bgSecondary: '#141414',  // Secondary backgrounds
    text: '#f5f5f5',         // Primary text
    textSecondary: '#a0a0a0', // Secondary text
    border: 'rgba(255, 255, 255, 0.1)', // Glass borders
  },
  accent: {
    purple: '#a855f7',       // Primary accent
    blue: '#3b82f6',         // Secondary accent
    gradient: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
  },
  glass: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
};
```

### Glassmorphism Styling

**Base Glass Effect**:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  transition: all 0.3s ease;
}
```

### Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '320px - 767px',
  tablet: '768px - 1023px',
  desktop: '1024px+',
};

// Tailwind breakpoints
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
```

**Responsive Grid Examples**:
- Projects: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Skills: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`


### Typography

```css
/* Base typography */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #f5f5f5;
  background: #0a0a0a;
}

h1 {
  font-size: 3rem; /* 48px */
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  font-size: 2rem; /* 32px */
  font-weight: 600;
  line-height: 1.3;
}

h3 {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
}

p {
  font-size: 1rem; /* 16px */
  line-height: 1.6;
  color: #a0a0a0;
}
```

## Data Models

### Type Definitions (lib/types.ts)

```typescript
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
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  date: string;
  details?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}
```


## Error Handling

### Form Validation Errors

**Display Strategy**:
- Inline error messages below each invalid field
- Red border around invalid input fields
- Error messages in red text (#ef4444)
- Show errors on blur and on submit attempt

**Error Message Examples**:
```typescript
const errorMessages = {
  nameRequired: 'Name is required',
  nameTooShort: 'Name must be at least 2 characters',
  emailRequired: 'Email is required',
  emailInvalid: 'Please enter a valid email address',
  messageRequired: 'Message is required',
  messageTooShort: 'Message must be at least 10 characters',
};
```

### Email Submission Errors

**Error Scenarios**:
1. Network failure: "Unable to send message. Please check your connection and try again."
2. Service error: "Failed to send message. Please try again later."
3. Rate limiting: "Too many requests. Please wait a moment and try again."

**User Feedback**:
- Error alert displayed below submit button
- Red background with white text
- Retry button available
- Error persists until successful submission or form change

### Image Loading Errors

**Fallback Strategy**:
- Display placeholder gradient for project images that fail to load
- Use Next.js Image component with `onError` handler
- Log errors to console for debugging

```typescript
<Image
  src={project.imageUrl}
  alt={project.title}
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder.png';
  }}
/>
```


## Performance Optimization

### Next.js Optimizations

1. **Image Optimization**:
   - Use Next.js `Image` component for automatic optimization
   - Lazy loading for project images
   - WebP format with fallbacks
   - Responsive images with `sizes` prop

2. **Code Splitting**:
   - Automatic route-based code splitting via App Router
   - Dynamic import for ProjectModal (loaded only when needed)
   ```typescript
   const ProjectModal = dynamic(() => import('./ProjectModal'), {
     loading: () => <LoadingSpinner />,
   });
   ```

3. **Font Optimization**:
   - Use `next/font` for optimized font loading
   ```typescript
   import { Inter } from 'next/font/inter';
   const inter = Inter({ subsets: ['latin'] });
   ```

4. **Static Generation**:
   - All pages are statically generated at build time
   - No server-side rendering needed (purely client-side interactivity)

### CSS Optimization

- Tailwind CSS with PurgeCSS to remove unused styles
- Critical CSS inlined in head
- Minimal custom CSS

### Bundle Size Targets

- Initial page load: < 100KB (compressed)
- Time to Interactive: < 3 seconds on 3G
- Lighthouse Performance score: > 90


## Accessibility

### Semantic HTML

- Use appropriate heading hierarchy (h1 → h2 → h3)
- Use `<nav>` for navigation
- Use `<main>` for main content
- Use `<article>` for project cards
- Use `<form>` for contact form

### ARIA Labels

```typescript
// Navigation
<nav aria-label="Main navigation">
  <Link href="/about" aria-label="Navigate to About page">About</Link>
</nav>

// Modal
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">{project.title}</h2>
  <button aria-label="Close project details" onClick={onClose}>×</button>
</div>

// Form
<label htmlFor="name">Name</label>
<input id="name" aria-required="true" aria-invalid={!!errors.name} />
{errors.name && <span role="alert">{errors.name}</span>}
```

### Keyboard Navigation

- All interactive elements focusable via Tab
- Modal closes with Escape key
- Focus trap within modal when open
- Skip to main content link
- Visible focus indicators

```typescript
// Focus management for modal
useEffect(() => {
  if (isOpen) {
    const previousFocus = document.activeElement as HTMLElement;
    modalRef.current?.focus();
    
    return () => {
      previousFocus?.focus();
    };
  }
}, [isOpen]);
```

### Color Contrast

- All text meets WCAG AA standards (4.5:1 for normal text)
- Primary text on dark background: #f5f5f5 on #0a0a0a (15.8:1)
- Secondary text: #a0a0a0 on #0a0a0a (8.5:1)
- Links and buttons have sufficient contrast and hover states

### Alt Text

- All images have descriptive alt text
- Decorative images use `alt=""`
- Project images: `alt={project.title + ' project screenshot'}`


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, the following properties were identified as providing unique validation value. Several potential properties were consolidated to avoid redundancy:

- **Navigation rendering properties** (1.3, 1.4, 1.5) were combined into comprehensive navigation properties that verify links, routing, and presence across all pages
- **Section content rendering properties** (4.1-4.3, 5.1-5.3, 6.1-6.3, 9.1-9.3, 10.1-10.3, 11.1-11.2) follow the same pattern: for any data, all required fields render correctly
- **Modal interaction properties** (8.1, 8.3-8.5) were combined into a comprehensive modal lifecycle property
- **Responsive design properties** (3.1-3.4) were consolidated into viewport adaptation properties that cover all breakpoints

The properties below represent the minimal set that provides complete validation coverage without logical redundancy.

### Property 1: Navigation Links Completeness

*For any* set of section configurations, the navigation component SHALL render links for all configured sections.

**Validates: Requirements 1.3**

### Property 2: Navigation Routing Correctness

*For any* navigation link in the navigation system, clicking the link SHALL navigate to the correct destination path corresponding to that section.

**Validates: Requirements 1.4**

### Property 3: Navigation Presence Across Pages

*For any* page in the portfolio system, the navigation component SHALL be rendered and visible on that page.

**Validates: Requirements 1.5**


### Property 4: Dark Theme Application

*For any* component in the portfolio system, the component SHALL have dark theme CSS classes or styles applied.

**Validates: Requirements 2.1**

### Property 5: Glassmorphism Effect Presence

*For any* glassmorphism component, the rendered element SHALL have the required CSS properties: `backdrop-filter` with blur, transparent background, and border styling.

**Validates: Requirements 2.2**

### Property 6: Responsive Layout Adaptation

*For any* viewport width within the mobile (320px-767px), tablet (768px-1023px), or desktop (1024px+) ranges, the page layout SHALL adapt to that viewport size without horizontal scrolling.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 7: Hero Section Content Rendering

*For any* hero section data containing name, title, and introductory statement, the rendered hero section SHALL display all three fields.

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 8: About Section Content Rendering

*For any* about section data containing professional summary and background, the rendered about section SHALL display both fields.

**Validates: Requirements 5.1, 5.2**

### Property 9: Skills Display Completeness

*For any* list of skill categories with associated skills, the rendered skills section SHALL display all categories and all skills within each category.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 10: Projects Gallery Display

*For any* list of projects, the projects section SHALL render all projects with their preview information (title, description, image, technologies).

**Validates: Requirements 7.1, 7.2, 7.3**


### Property 11: Project Detail Indicator Presence

*For any* rendered project card, the card SHALL include a visual indicator (button, icon, or text) that signals additional details are available.

**Validates: Requirements 7.5**

### Property 12: Modal Open with Correct Project Data

*For any* project in the projects list, when that project's card is clicked, the modal SHALL open with the correct project data (matching the clicked project's ID).

**Validates: Requirements 8.1**

### Property 13: Modal Content Completeness

*For any* project displayed in the modal, the modal SHALL render all detailed fields: title, detailed description, technologies, outcomes, and optional links (GitHub, live URL).

**Validates: Requirements 8.2**

### Property 14: Modal Lifecycle

*For any* modal state, when the modal is opened and then closed (via close button, outside click, or Escape key), the modal SHALL transition from visible to hidden and return focus appropriately.

**Validates: Requirements 8.3, 8.4, 8.5**

### Property 15: Modal Responsiveness

*For any* viewport size (mobile, tablet, desktop), the project modal SHALL render correctly without layout issues or horizontal scrolling.

**Validates: Requirements 8.7**

### Property 16: Experience Content Rendering

*For any* list of experience entries containing role, company, dates, and descriptions, the rendered experience section SHALL display all entries with all required fields.

**Validates: Requirements 9.1, 9.2, 9.3**


### Property 17: Education Content Rendering

*For any* list of education entries containing degree, institution, and date, the rendered education section SHALL display all entries with all required fields.

**Validates: Requirements 10.1, 10.2**

### Property 18: Research Content Rendering

*For any* research content data, the rendered research section SHALL display the research interests and focus areas.

**Validates: Requirements 11.1**

### Property 19: Resume Download Trigger

*For any* resume download button click event, the browser SHALL initiate a download of the resume PDF file from the public folder.

**Validates: Requirements 12.1, 12.3, 12.4**

### Property 20: Contact Form Validation - Valid Input Acceptance

*For any* contact form data where name has ≥2 characters, email is valid format, and message has ≥10 characters, the form validation SHALL return no errors and allow submission.

**Validates: Requirements 13.4**

### Property 21: Contact Form Validation - Invalid Input Rejection

*For any* contact form data where name has <2 characters, OR email is invalid format, OR message has <10 characters, the form validation SHALL return appropriate error messages for the invalid fields.

**Validates: Requirements 13.5**

### Property 22: Contact Form Field Requirements

*For any* rendered contact form, the form SHALL include input fields for name, email, and message, plus a submit button.

**Validates: Requirements 13.1, 13.2, 13.3**


### Property 23: Semantic HTML Usage

*For any* component in the portfolio system, the component SHALL use semantic HTML elements (nav, main, article, section, form) where applicable rather than generic div elements.

**Validates: Requirements 16.1**

### Property 24: Image Alt Text Presence

*For any* image element in the portfolio system, the element SHALL have an `alt` attribute with descriptive text (or empty string for decorative images).

**Validates: Requirements 16.2**

### Property 25: Keyboard Navigation Support

*For any* interactive element (link, button, form input), the element SHALL be focusable and operable via keyboard (Tab and Enter keys).

**Validates: Requirements 16.4**

### Property 26: ARIA Label Presence

*For any* interactive element where the purpose is not clear from visible text (icons, complex widgets), the element SHALL include appropriate ARIA labels (aria-label, aria-labelledby, or aria-describedby).

**Validates: Requirements 16.5**

## Testing Strategy

### Unit Testing

Unit tests should focus on:
- **Validation logic**: Test `validateContactForm` with specific valid and invalid examples
- **Component rendering**: Test that components render with expected props
- **Event handlers**: Test button clicks, form submissions, modal open/close
- **Edge cases**: Empty data, missing optional fields, boundary values

### Property-Based Testing

Property tests should verify the universal properties listed above with **minimum 100 iterations** per test. Each property test must be tagged with:

**Tag Format**: `Feature: modern-portfolio-website, Property {number}: {property_text}`

**Key Properties to Test with PBT**:
- Navigation completeness and routing (Properties 1-3)
- Content rendering across all sections (Properties 7-11, 13, 16-18, 22)
- Form validation (Properties 20-21)
- Responsive behavior (Property 6)
- Accessibility attributes (Properties 24-26)

**Generator Strategies**:
- Generate random project lists (varying count, field content)
- Generate random form inputs (valid and invalid combinations)
- Generate random viewport sizes within breakpoint ranges
- Generate random content data for all sections


### Integration Testing

Integration tests should verify:
- **Email service integration**: Mock EmailJS/Formspree, verify correct data sent
- **Next.js routing**: Verify navigation works end-to-end
- **Static asset serving**: Verify resume PDF is accessible

### Manual Testing

Manual testing required for:
- **Visual design quality**: Glassmorphism effects, gradients, spacing
- **User experience flow**: Overall site navigation feel
- **Accessibility**: Screen reader compatibility, keyboard-only navigation
- **Cross-browser compatibility**: Chrome, Firefox, Safari, Edge
- **Performance**: Lighthouse audit, real-device testing

## Deployment

### Build Configuration

```bash
# Build command
npm run build

# Output: .next/ folder with static and server bundles
# Deploy .next/ folder to hosting platform
```

### Environment Variables

Create `.env.local` for development and configure in deployment platform:

```
# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# OR Formspree
NEXT_PUBLIC_FORMSPREE_ID=your_formspree_id
```

### Vercel Deployment (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Automatic deployments on push to main branch
4. Preview deployments for pull requests

### Static Export Alternative

If static hosting preferred (GitHub Pages, Netlify):

```javascript
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
};
```

```bash
npm run build
# Output: out/ folder with fully static site
```

## Security Considerations

1. **Email Service**: Use environment variables for API keys, never commit to repository
2. **Form Validation**: Client-side validation for UX, server-side validation in email service for security
3. **Rate Limiting**: Consider adding rate limiting to contact form to prevent spam (via email service settings)
4. **XSS Prevention**: React automatically escapes content, but be cautious with `dangerouslySetInnerHTML` if used
5. **HTTPS**: Ensure deployment platform uses HTTPS (automatic with Vercel)

