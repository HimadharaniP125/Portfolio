import { useState, useEffect } from 'react';
import { 
  Terminal, Globe, Cpu, Eye, CheckSquare, Layers, 
  GitBranch, FileText, Mail, Phone, MapPin, 
  ExternalLink, Sun, Moon, ArrowUpRight, 
  Award, GraduationCap, Code, CheckCircle, Send
} from 'lucide-react';
import './Portfolio.css';

// Custom Brand Icons (since brand icons are deprecated/removed in newer Lucide versions)
const GithubIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Portfolio() {
  const [theme, setTheme] = useState('dark');

  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initialize theme from localStorage or system preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) {
        setTheme(saved);
        return;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'certifications', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok) {
        alert(`Error: ${result.error || 'Failed to send message'}`);
        return;
      }

      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Network error. Please try again.');
    }
  };

  const skillsData = [
    { name: 'Python', desc: 'Object-Oriented Programming, Automation Scripting & Algorithms', icon: Terminal },
    { name: 'HTML', desc: 'Semantic layout, structuring web pages & document models', icon: Globe },
    { name: 'React.js (Basics)', desc: 'Component architectures, state management & user interfaces', icon: Cpu },
    { name: 'Selenium', desc: 'Web automation testing, locators, dynamic element handling', icon: Eye },
    { name: 'Software Testing', desc: 'Manual & automation testing, regression, test case design', icon: CheckSquare },
    { name: 'Jira', desc: 'Agile project tracking, issue reporting & sprint management', icon: Layers },
    { name: 'Git', desc: 'Distributed version control, local staging, branching workflows', icon: GitBranch },
    { name: 'GitHub', desc: 'Cloud collaboration, code reviews, pull request workflows', icon: GithubIcon },
    { name: 'Microsoft Office', desc: 'Analytical reporting, spreadsheet tracking, project notes', icon: FileText }
  ];

  const projectsData = [
    {
      title: 'Heuristic Model for Multilingual Document Information Extraction',
      badge: 'NLP & Extraction',
      desc: 'Developed a robust framework for identifying and extracting unstructured data from complex documents written in multiple languages.',
      metrics: '30% Efficiency Gain',
      highlights: [
        'Improved overall data processing speed by 30% through modular heuristic rules.',
        'Successfully supported multilingual NLP parsing with high accuracy.',
        'Boosted downstream information retrieval accuracy by 25%.'
      ],
      tags: ['Python', 'NLP', 'Heuristics', 'Data Extraction']
    },
    {
      title: 'Number Guessing Game – Python',
      badge: 'Algorithm Design',
      desc: 'Created an interactive terminal game with smart prediction mechanisms providing optimized feedback loops for players.',
      metrics: 'Intuitive UX',
      highlights: [
        'Built a smart feedback algorithm adjusting hints based on guess histories.',
        'Polished terminal user-friendly interfaces with inputs validation.',
        'Created clear documentation outlining binary search and game design strategies.'
      ],
      tags: ['Python', 'Algorithms', 'UX Design', 'Documentation']
    }
  ];

  const certificationsData = [
    {
      title: 'AI/ML Virtual Internship',
      provider: 'EduSkill / AICTE',
      desc: 'Completed a hands‑on AI/ML virtual internship covering neural network design, data preprocessing, and regression modeling.'
    },
    {
      title: 'Selenium Automation Testing',
      provider: 'Online IT Vidhya',
      desc: 'Intensive training on Selenium test automation, grid configuration, XPath strategies, and generating Bootstrap‑styled test reports.'
    }
  ];

  return (
    <div className="theme-transition">
      {/* Glow Backdrops */}
      <div className="bg-glow-container">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">
          <a className="navbar-brand-custom" href="#home">PH.</a>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
            style={{ border: 'none', padding: '0.25rem' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <div className="navbar-nav align-items-center gap-3 mt-3 mt-lg-0">
              <a className={`nav-link-custom ${activeSection === 'home' ? 'active' : ''}`} href="#home">Home</a>
              <a className={`nav-link-custom ${activeSection === 'about' ? 'active' : ''}`} href="#about">About</a>
              <a className={`nav-link-custom ${activeSection === 'skills' ? 'active' : ''}`} href="#skills">Skills</a>
              <a className={`nav-link-custom ${activeSection === 'projects' ? 'active' : ''}`} href="#projects">Projects</a>
              <a className={`nav-link-custom ${activeSection === 'certifications' ? 'active' : ''}`} href="#certifications">Certifications</a>
              <a className={`nav-link-custom ${activeSection === 'contact' ? 'active' : ''}`} href="#contact">Contact</a>
              
              <button 
                onClick={toggleTheme} 
                className="btn-theme-toggle ms-lg-2 mt-2 mt-lg-0" 
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero-wrapper">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="hero-subtitle">Welcome to my space</span>
              <h1 className="hero-title">
                Hi, I'm <br />
                <span className="hero-title-gradient">Pikkili Himadharani</span>
              </h1>
              <h2 className="fs-3 fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Software Engineer
              </h2>
              <p className="hero-summary">
                A detail-oriented and motivated B.Tech graduate with a strong foundation in software engineering, testing, and automation. Experienced in building automation test suites with Selenium and Python, analyzing requirements using Jira, and collaborating with Git/GitHub.
              </p>
              
              <div className="hero-buttons">
                <a href="#contact" className="btn-gradient">
                  Get In Touch <ArrowUpRight size={18} />
                </a>
                <a href="#projects" className="btn-outline-custom">
                  View Projects
                </a>
              </div>

              <div className="social-links">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
                  <GithubIcon size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                  <LinkedinIcon size={20} />
                </a>
              </div>
            </div>

            <div className="col-lg-5 hero-img-container">
              <div className="hero-img-backdrop"></div>
              <div className="hero-img-card">
                <div className="hero-img-avatar">
                  <Code size={52} />
                </div>
                <h3 className="fs-5 fw-bold mb-1">Pikkili Himadharani</h3>
                <p className="text-muted small mb-0">Software Quality & Dev</p>
                <div className="floating-badge">
                  <Award className="floating-badge-icon" size={18} />
                  <span className="floating-badge-text">B.Tech Graduate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About & Education Section */}
      <section id="about" className="section-padding bg-transparent">
        <div className="container text-start">
          <div className="section-title-container">
          
            <h2 className="section-title">About Me</h2>
          </div>

          <div className="row g-5">
            <div className="col-lg-6">
              <div className="glass-card">
                <h3 className="fs-4 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Career Objective</h3>
                <p className="mb-4">
                  To secure a challenging position as a Software Engineer where I can utilize my technical skills in Python, software testing, and web development to contribute to organizational success while continuously learning and growing.
                </p>
                <p className="mb-4">
                  I enjoy solving complex problems through structural logic and writing clean automated test pipelines. I am highly collaborative, value version control integrity, and look forward to partnering with agile teams to build solid software solutions.
                </p>
                
                <div className="about-stats">
                  <div className="stat-item">
                    <div className="stat-number">7.70</div>
                    <div className="stat-label">B.Tech GPA</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">2+</div>
                    <div className="stat-label">Core Projects</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">2</div>
                    <div className="stat-label">Certifications</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h3 className="fs-4 fw-bold mb-4 ps-2" style={{ color: 'var(--text-primary)' }}>Education Timeline</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">Graduated 2024</div>
                    <h4 className="timeline-title">Bachelor of Technology</h4>
                    <p className="timeline-subtitle">Sanskrithi School of Engineering</p>
                    <p className="text-muted small">Focused on Computer Science curriculum, software life cycles, testing methodology, and automation frameworks.</p>
                    <span className="timeline-gpa">GPA: 7.70 / 10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-padding bg-transparent" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-title-container">
         <h2 className="section-title">My Skills</h2>
          </div>

          <div className="row g-4">
            {skillsData.map((skill, index) => {
              const IconComp = skill.icon;
              return (
                <div key={index} className="col-md-6 col-lg-4 text-start">
                  <div className="glass-card skill-card">
                    <div className="skill-icon-wrapper">
                      <IconComp size={24} />
                    </div>
                    <h3 className="skill-name">{skill.name}</h3>
                    <p className="skill-desc mb-0">{skill.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-padding bg-transparent" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container text-start">
            <div className="section-title-container">
      
              <h2 className="section-title">Academic & Personal Projects</h2>
            </div>

          <div className="row g-4">
            {projectsData.map((project, index) => (
              <div key={index} className="col-lg-6">
                <div className="glass-card project-card">
                  <div className="project-card-image-placeholder">
                    <Terminal size={48} />
                    <span className="project-metrics-badge">{project.metrics}</span>
                  </div>
                  
                  <div className="project-card-body">
                    <span className="badge mb-2 bg-transparent text-primary border border-primary align-self-start py-1 px-2.5" style={{ fontSize: '0.75rem', borderRadius: '4px' }}>
                      {project.badge}
                    </span>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.desc}</p>
                    
                    <h4 className="fs-6 fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Key Highlights:</h4>
                    <ul className="project-highlights">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                    
                    <div className="project-tags mt-auto">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="project-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="section-padding bg-transparent" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container text-start">
          <div className="section-title-container">
          
            <h2 className="section-title">Certifications</h2>
          </div>

          <div className="row g-4">
            {certificationsData.map((cert, index) => (
              <div key={index} className="col-md-6">
                <div className="glass-card cert-card d-flex flex-column align-items-start">
                  <div className="cert-icon-wrapper">
                    <Award size={36} />
                  </div>
                  <div>
                    <h3 className="cert-title">{cert.title}</h3>
                    <p className="cert-provider mb-2">{cert.provider}</p>
                    <p className="text-muted small mb-0">{cert.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Contact Form & Footer Section */}
      <section id="contact" className="section-padding bg-transparent" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container text-start">
          <div className="section-title-container">
    
            <h2 className="section-title">Contact Information</h2>
          </div>

          <div className="row g-5">
            {/* Contact Details */}
            <div className="col-lg-5">
              <h3 className="fs-4 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Let's Connect</h3>
              <p className="mb-4 text-secondary">
                I am interested in starting my professional career as a software development or quality assurance engineer. Feel free to reach out via email, phone, or LinkedIn!
              </p>

              <div className="d-flex flex-column gap-3">
                <a href="mailto:himadharanipikkili@gmail.com" className="contact-card">
                  <div className="contact-icon-wrapper">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">himadharanipikkili@gmail.com</div>
                  </div>
                </a>

                <div className="contact-card">
                  <div className="contact-icon-wrapper">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="contact-label">Phone</div>
                    <div className="contact-value">+91 6304269009</div>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-icon-wrapper">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="contact-label">Location</div>
                    <div className="contact-value">Andhra Pradesh, India</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="col-lg-7">
              <div className="glass-card">
                <h3 className="fs-4 fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>Send a Quick Message</h3>
                
                {formSubmitted ? (
                  <div className="alert alert-success d-flex align-items-center gap-2 py-3" role="alert">
                    <CheckCircle size={20} />
                    <div>
                      <strong>Thank you!</strong> Your message has been sent successfully. I will get back to you soon.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="formName" className="form-label fw-semibold text-primary-custom small">Name</label>
                        <input 
                          type="text" 
                          className="form-control bg-transparent border-color theme-transition text-primary-custom py-2.5" 
                          id="formName" 
                          placeholder="Your Name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="formEmail" className="form-label fw-semibold text-primary-custom small">Email</label>
                        <input 
                          type="email" 
                          className="form-control bg-transparent border-color theme-transition text-primary-custom py-2.5" 
                          id="formEmail" 
                          placeholder="name@example.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="formMessage" className="form-label fw-semibold text-primary-custom small">Message</label>
                      <textarea 
                        className="form-control bg-transparent border-color theme-transition text-primary-custom py-2.5" 
                        id="formMessage" 
                        rows="4" 
                        placeholder="Hi, I'd love to chat about..."
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-gradient border-0 px-4 py-2.5 d-flex align-items-center gap-2">
                      Send Message <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Details */}
      <footer className="footer text-center">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <a className="navbar-brand-custom" href="#home" style={{ fontSize: '1.6rem' }}>PH.</a>
            <p className="mb-0 copyright-text">
              &copy; {new Date().getFullYear()} Pikkili Himadharani. All rights reserved.
            </p>
            <div className="d-flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" style={{ width: '40px', height: '40px' }} aria-label="GitHub">
                <GithubIcon size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" style={{ width: '40px', height: '40px' }} aria-label="LinkedIn">
                <LinkedinIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
