'use client';

import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import ContactForm from '@/components/ContactForm';
import GitHubShowcase from '@/components/GitHubShowcase';
import { Project, Experience, Education, SkillCategory } from '@/lib/types';

const GITHUB_USERNAME = 'ParkhiyaParth';

/**
 * Single Page Scrollable Portfolio
 * All sections on one page with smooth scroll navigation
 */

// Data imports
const projects: Project[] = [
    {
        id: '1',
        title: 'QueryBot — Workflow Driven RAG Chatbot',
        description: 'A Retrieval-Augmented Generation chatbot designed for intelligent document-based question answering and workflow automation.',
        detailedDescription: 'QueryBot is an advanced RAG chatbot that intelligently processes documents to provide accurate, context-aware responses. The system leverages state-of-the-art embedding models and vector search technology to retrieve relevant information from large document collections. Designed for workflow automation, QueryBot streamlines document-based interactions and enhances productivity through intelligent query processing.',
        technologies: ['Python', 'RAG', 'LLMs', 'Embeddings', 'Vector Search', 'LangChain', 'FAISS'],
        outcomes: [
            'Built document-based question answering system',
            'Used embeddings and vector search',
            'Focused on accurate information retrieval',
            'Designed for workflow-driven automation'
        ],
        imageUrl: '/images/placeholder.svg',
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        featured: true
    },
    {
        id: '2',
        title: 'RAG Q&A Chatbot',
        description: 'A PDF-based Q&A chatbot that extracts text from uploaded documents and answers user questions using OCR, embeddings, FAISS, LangChain, and Groq Llama.',
        detailedDescription: 'This chatbot enables users to upload PDF documents and ask questions about their content. It uses OCR for text extraction, advanced embeddings for semantic understanding, and FAISS for efficient similarity search. The LangChain framework orchestrates the retrieval and generation pipeline, while Groq Llama powers the language understanding.',
        technologies: ['Python', 'Streamlit', 'PyTorch2', 'Tesseract OCR', 'FAISS', 'LangChain', 'Groq Llama', 'Google Generative AI Embeddings'],
        outcomes: [
            'Implemented OCR-based PDF text extraction',
            'Built semantic search with embeddings',
            'Integrated FAISS for vector similarity',
            'Created conversational interface with Streamlit'
        ],
        imageUrl: '/images/placeholder.svg',
        githubUrl: 'https://github.com',
    },
    {
        id: '3',
        title: 'Smart Investment Portfolio Generator',
        description: 'A machine learning-based stock portfolio recommendation system that suggests optimal stock allocations based on risk level and investment strategy.',
        detailedDescription: 'This system uses machine learning algorithms to analyze market data and generate personalized stock portfolio recommendations. It considers user risk tolerance, investment goals, and market conditions to suggest optimal asset allocations. The system provides detailed insights into expected returns, risk metrics, and diversification strategies.',
        technologies: ['Python', 'FastAPI', 'yfinance', 'Pandas', 'NumPy', 'XGBoost', 'LSTM'],
        outcomes: [
            'Developed ML-based portfolio optimization',
            'Implemented risk assessment algorithms',
            'Created real-time market data integration',
            'Built RESTful API for portfolio generation'
        ],
        imageUrl: '/images/placeholder.svg',
        githubUrl: 'https://github.com',
    },
    {
        id: '4',
        title: 'Brain Tumor Classification System',
        description: 'A deep learning model for classifying brain MRI images into tumor and non-tumor categories using CNNs.',
        detailedDescription: 'This medical imaging system uses convolutional neural networks to automatically classify brain MRI scans. The model was trained on a large dataset of labeled MRI images and achieves high accuracy in detecting tumors. The system includes preprocessing pipelines for image normalization and augmentation to improve model robustness.',
        technologies: ['Python', 'TensorFlow', 'Keras', 'CNN', 'OpenCV', 'NumPy'],
        outcomes: [
            'Trained CNN for medical image classification',
            'Achieved high accuracy on test dataset',
            'Implemented image preprocessing pipeline',
            'Created model deployment interface'
        ],
        imageUrl: '/images/placeholder.svg',
        githubUrl: 'https://github.com',
    },
    {
        id: '5',
        title: 'Student Exam Performance Indicator',
        description: 'A machine learning system that predicts student exam performance based on various demographic and academic factors.',
        detailedDescription: 'This predictive analytics system uses machine learning to forecast student exam scores based on historical data and demographic information. The model considers factors such as study hours, parental education, test preparation, and previous scores to provide accurate predictions. The system helps educators identify at-risk students early and provide targeted interventions.',
        technologies: ['Python', 'Scikit-learn', 'Pandas', 'Regression Models', 'Data Analysis'],
        outcomes: [
            'Built predictive model for student performance',
            'Analyzed demographic and academic factors',
            'Created feature engineering pipeline',
            'Developed insights dashboard for educators'
        ],
        imageUrl: '/images/placeholder.svg',
        githubUrl: 'https://github.com',
    },
];

const experiences: Experience[] = [
    {
        id: '1',
        role: 'AI/ML Intern',
        company: 'Tech Company',
        startDate: 'June 2024',
        endDate: 'Present',
        description: [
            'Developed and deployed machine learning models for production systems',
            'Implemented RAG-based chatbot solutions using LangChain and FAISS',
            'Collaborated with cross-functional teams to deliver AI-powered features',
            'Optimized model performance and reduced inference time by 40%'
        ]
    },
    {
        id: '2',
        role: 'Machine Learning Developer',
        company: 'Freelance',
        startDate: 'January 2023',
        endDate: 'May 2024',
        description: [
            'Built custom ML solutions for various clients',
            'Specialized in NLP and computer vision projects',
            'Delivered end-to-end AI applications from concept to deployment',
            'Provided technical consulting on ML architecture and best practices'
        ]
    }
];

const education: Education[] = [
    {
        id: '1',
        degree: 'B.Tech / B.E. in Computer Engineering',
        institution: 'Vishwakarma Government Engineering College, Ahmedabad',
        date: 'Gujarat Technological University',
        details: 'CGPA: 8.03 / 8.10 | Final Year Project: QueryBot — Workflow Driven RAG Chatbot'
    }
];

const skillCategories: SkillCategory[] = [
    {
        category: 'Programming Languages',
        skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'C++']
    },
    {
        category: 'AI/ML Frameworks',
        skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'XGBoost']
    },
    {
        category: 'LLM & RAG',
        skills: ['LangChain', 'FAISS', 'Vector Databases', 'OpenAI API', 'Groq', 'Embeddings']
    },
    {
        category: 'Web Frameworks',
        skills: ['FastAPI', 'Streamlit', 'Next.js', 'React', 'Flask']
    },
    {
        category: 'Data Science',
        skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Data Analysis']
    },
    {
        category: 'Computer Vision',
        skills: ['OpenCV', 'Image Processing', 'CNN', 'Object Detection']
    },
    {
        category: 'Tools & Technologies',
        skills: ['Git', 'Docker', 'AWS', 'Linux', 'VS Code', 'Jupyter']
    },
    {
        category: 'Databases',
        skills: ['PostgreSQL', 'MongoDB', 'Vector DBs', 'SQL']
    }
];

const researchInterests = [
    {
        title: 'Retrieval-Augmented Generation',
        description: 'Exploring advanced RAG architectures and techniques for improving document-based question answering systems with better retrieval and generation quality.'
    },
    {
        title: 'Intelligent Document Processing',
        description: 'Developing systems that can understand, extract, and process information from complex documents using NLP and computer vision techniques.'
    },
    {
        title: 'Agentic Document Intelligence',
        description: 'Building autonomous AI agents that can interact with documents, understand context, and perform intelligent document workflows.'
    },
    {
        title: 'Machine Learning Applications',
        description: 'Applying machine learning algorithms to solve real-world problems in various domains including finance, healthcare, and education.'
    }
];

export default function Home() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    return (
        <>
            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 scroll-mt-16">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                        Hi, I&apos;m Parth Parkhiya
                    </h1>
                    <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl text-dark-text">
                        AI/ML Engineer & LLM/RAG Developer
                    </h2>
                    <p className="mb-4 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
                        Building intelligent AI applications using Machine Learning, Deep Learning, and LLMs.
                    </p>
                    <p className="mb-10 text-base sm:text-lg max-w-2xl mx-auto">
                        I build practical AI/ML applications using Python, Machine Learning, Deep Learning,
                        RAG, LangChain, FAISS, FastAPI, Streamlit, and modern AI tools.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        <a
                            href="#projects"
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue text-dark-text font-semibold hover:opacity-90 transition-opacity"
                        >
                            View Projects
                        </a>
                        <a
                            href="#resume"
                            className="px-6 py-3 rounded-lg glass-card-hover text-dark-text font-semibold"
                        >
                            Download Resume
                        </a>
                        <a
                            href="#contact"
                            className="px-6 py-3 rounded-lg glass-card-hover text-dark-text font-semibold"
                        >
                            Contact Me
                        </a>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">About Me</h2>
                    <GlassCard variant="default">
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            I&apos;m an AI/ML Engineer passionate about building intelligent systems that solve real-world problems.
                            With expertise in Machine Learning, Deep Learning, and Large Language Models, I specialize in
                            creating practical AI applications that make a difference.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            My journey in AI/ML has led me to work on diverse projects ranging from Retrieval-Augmented
                            Generation chatbots to computer vision systems. I&apos;m particularly interested in LLM applications,
                            RAG architectures, and intelligent document processing. I believe in continuous learning and
                            staying updated with the latest advancements in AI technology.
                        </p>
                    </GlassCard>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Skills & Technologies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {skillCategories.map((category, index) => (
                            <GlassCard key={index} variant="default">
                                <h3 className="text-xl font-semibold text-gradient mb-4">
                                    {category.category}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill, skillIndex) => (
                                        <span
                                            key={skillIndex}
                                            className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300 border border-white/20"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Projects</h2>
                    <p className="text-center text-dark-text-secondary mb-12 max-w-2xl mx-auto">
                        A showcase of my AI/ML projects demonstrating practical applications of machine learning,
                        deep learning, and LLM technologies.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onOpenModal={handleOpenModal}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* GitHub Activity Section */}
            <section id="github" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">GitHub Activity</h2>
                    <p className="text-center text-dark-text-secondary mb-12 max-w-2xl mx-auto">
                        A live look at my open-source work, pulled directly from GitHub.
                    </p>
                    <GitHubShowcase username={GITHUB_USERNAME} />
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Experience</h2>
                    <div className="space-y-6">
                        {experiences.map((exp) => (
                            <GlassCard key={exp.id} variant="default">
                                <h3 className="text-2xl font-semibold text-gradient mb-2">
                                    {exp.role}
                                </h3>
                                <p className="text-lg text-white mb-1">{exp.company}</p>
                                <p className="text-gray-400 mb-4">
                                    {exp.startDate} - {exp.endDate}
                                </p>
                                <ul className="space-y-2">
                                    {exp.description.map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-purple-400 mr-3">•</span>
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Education Section */}
            <section id="education" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Education</h2>
                    <div className="space-y-6">
                        {education.map((edu) => (
                            <GlassCard key={edu.id} variant="default">
                                <h3 className="text-2xl font-semibold text-gradient mb-2">
                                    {edu.degree}
                                </h3>
                                <p className="text-lg text-white mb-1">{edu.institution}</p>
                                <p className="text-gray-400 mb-3">{edu.date}</p>
                                {edu.details && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-gray-300">{edu.details}</p>
                                    </div>
                                )}
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Research Section */}
            <section id="research" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Research Interests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {researchInterests.map((interest, index) => (
                            <GlassCard key={index} variant="default">
                                <h3 className="text-xl font-semibold text-gradient mb-3">
                                    {interest.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {interest.description}
                                </p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resume Section */}
            <section id="resume" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center scroll-mt-16">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-12">Resume</h2>
                    <GlassCard variant="default">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                            Parth Parkhiya - Resume
                        </h3>
                        <p className="text-gray-400 mb-2">AI/ML Engineer & LLM/RAG Developer</p>
                        <p className="text-sm text-gray-500 mb-6">PDF Format</p>
                        <a
                            href="/resume.pdf"
                            download="Parth_Parkhiya_Resume.pdf"
                            className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Resume
                        </a>
                    </GlassCard>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center scroll-mt-16">
                <div className="max-w-2xl mx-auto w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Get In Touch</h2>
                    <GlassCard variant="default">
                        <p className="text-center text-gray-300 mb-8">
                            I&apos;m always open to discussing new opportunities, collaborations, or just having a chat about AI/ML!
                        </p>
                        <ContactForm />
                    </GlassCard>
                </div>
            </section>

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
