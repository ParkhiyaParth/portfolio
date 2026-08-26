# Parth Parkhiya — Portfolio

A single-page, dark-themed portfolio with glassmorphism styling, built with Next.js (App Router) and TypeScript, backed by a FastAPI service for the contact form.

**Live demo:** _add your deployed URL here once published_

## Tech Stack

| Layer      | Stack                                                              |
| ---------- | ------------------------------------------------------------------- |
| Frontend   | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| Backend    | Python, FastAPI, Pydantic, aiosmtplib (SMTP email delivery)         |
| Testing    | Jest, React Testing Library, fast-check (property-based tests), pytest |

## Features

- Single-page layout with smooth scroll navigation and active-section highlighting
- Glassmorphism UI: frosted-glass cards, gradient accents, dark theme
- Project gallery with an expandable detail modal
- Contact form with client-side validation, wired to a FastAPI email backend
- Fully responsive (mobile, tablet, desktop) and accessibility-conscious (semantic landmarks, ARIA labels, keyboard navigation)
- Unit and property-based test coverage on both the frontend and backend

## Project Structure

```
portfolio/
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Root layout (fonts, metadata, Navigation)
│   ├── page.tsx           # The entire single-page site (all sections)
│   └── globals.css        # Design tokens & glassmorphism utilities
├── components/            # Reusable React components
│   ├── Navigation.tsx     # Scroll-spy navigation bar
│   ├── GlassCard.tsx      # Glassmorphism card primitive
│   ├── ProjectCard.tsx    # Project preview card
│   ├── ProjectModal.tsx   # Project detail modal
│   └── ContactForm.tsx    # Validated contact form
├── lib/                   # Shared types, validation, API client
├── public/                # Static assets (resume, images)
├── backend/                # FastAPI contact form service
│   ├── main.py
│   ├── email_service.py
│   └── test_main.py
├── __tests__/             # Jest / React Testing Library / fast-check suites
└── docs/spec/              # Original requirements, design, and task planning docs
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+ (only needed to run the contact form backend)

### Frontend

```bash
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend (contact form API)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env               # add your SMTP credentials
uvicorn main:app --reload --port 8000
```

API docs are available at `http://localhost:8000/docs`. See [backend/README.md](backend/README.md) for endpoint details, deployment notes, and troubleshooting.

## Scripts

| Command         | Description                        |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start the Next.js dev server        |
| `npm run build` | Production build                    |
| `npm start`     | Serve the production build          |
| `npm run lint`  | Run ESLint                          |
| `npm test`      | Run the Jest test suite             |

Backend tests: `cd backend && pytest test_main.py -v`

## Customizing

- Site content (hero copy, projects, experience, education, skills, research) lives inline in [`app/page.tsx`](app/page.tsx).
- Replace [`public/resume.pdf`](public/resume.pdf) with your own resume.
- Drop real project screenshots into `public/images/projects/` and update each project's `imageUrl` in `app/page.tsx` (they currently fall back to a generated placeholder).

## License

ISC
