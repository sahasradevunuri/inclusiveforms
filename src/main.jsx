import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Bell,
  CircleDot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  Eye,
  FileText,
  GripVertical,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Save,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Type,
  Upload,
  X,
  Zap,
} from "lucide-react";
import "./styles.css";

const DEMO_USER = { name: "Sahasra", email: "demo@inclusiveforms.local" };
const initialForms = [
  {
    id: "student-registration",
    title: "Student Registration",
    description:
      "Collect student information with a clear, accessible form experience.",
    status: "Published",
    updated: "Today",
    fields: [
      {
        id: "f1",
        type: "text",
        label: "Full Name",
        placeholder: "Your full name",
        required: true,
        help: "Enter your first and last name.",
      },
      {
        id: "f2",
        type: "email",
        label: "Email Address",
        placeholder: "name@example.com",
        required: true,
        help: "We will use this to contact you.",
      },
      {
        id: "f3",
        type: "phone",
        label: "Phone Number",
        placeholder: "+91 98765 43210",
        required: false,
        help: "",
      },
      {
        id: "f4",
        type: "dropdown",
        label: "Department",
        placeholder: "Select your department",
        required: true,
        options: ["Computer Science", "Electronics", "Mechanical", "Civil"],
      },
      {
        id: "f5",
        type: "checkbox",
        label: "I agree to the terms and conditions",
        required: true,
      },
    ],
  },
  {
    id: "event-feedback",
    title: "Event Feedback",
    description: "A short feedback form for workshops and campus events.",
    status: "Draft",
    updated: "Yesterday",
    fields: [
      {
        id: "e1",
        type: "text",
        label: "Your Name",
        placeholder: "Optional",
        required: false,
      },
      {
        id: "e2",
        type: "dropdown",
        label: "How was the event?",
        placeholder: "Choose an option",
        required: true,
        options: ["Excellent", "Good", "Average", "Needs improvement"],
      },
      {
        id: "e3",
        type: "textarea",
        label: "Tell us more",
        placeholder: "Share your feedback…",
        required: false,
      },
    ],
  },
  {
    id: "scholarship",
    title: "Scholarship Application",
    description: "Application intake with structured student details.",
    status: "Published",
    updated: "Sep 4",
    fields: [
      {
        id: "s1",
        type: "text",
        label: "Applicant Name",
        placeholder: "Full name",
        required: true,
        help: "",
      },
      {
        id: "s2",
        type: "email",
        label: "Email Address",
        placeholder: "name@example.com",
        required: true,
        help: "",
      },
      {
        id: "s3",
        type: "date",
        label: "Date of Birth",
        placeholder: "",
        required: true,
        help: "",
      },
      {
        id: "s4",
        type: "textarea",
        label: "Why are you applying?",
        placeholder: "Tell us about your goals…",
        required: true,
      },
    ],
  },
];
const fieldTypes = [
  ["text", "Text field", "Short answer", Type],
  ["email", "Email", "Email address", ClipboardList],
  ["phone", "Phone", "Phone number", Zap],
  ["number", "Number", "Numeric value", SlidersHorizontal],
  ["date", "Date", "Date picker", ClipboardList],
  ["dropdown", "Dropdown", "Select one", ChevronDown],
  ["textarea", "Long text", "Paragraph", FileText],
  ["checkbox", "Checkbox", "Multiple choices", CheckCircle2],
  ["radio", "Radio buttons", "Choose one", CircleDot],
  ["file", "File upload", "Attach a file", Upload],
  ["content", "Custom content", "Heading or instructions", FileText],
];
const clone = (x) => JSON.parse(JSON.stringify(x));

const FORM_TEMPLATES = [
  {
    id: "student-feedback-template",
    title: "Student Feedback",
    description: "Collect clear, accessible feedback from students.",
    fields: [
      { type: "text", label: "Full Name", placeholder: "Your full name", required: true, help: "Enter your first and last name." },
      { type: "email", label: "University Email", placeholder: "name@university.edu", required: true, help: "Use your university email address." },
      { type: "radio", label: "How was your experience?", options: ["Excellent", "Good", "Average", "Needs improvement"], required: true, help: "Choose one option." },
      { type: "textarea", label: "Additional feedback", placeholder: "Share your feedback…", required: false, help: "Tell us what worked well or what could improve." },
    ],
  },
  {
    id: "event-registration-template",
    title: "Event Registration",
    description: "A polished registration form for campus events.",
    fields: [
      { type: "text", label: "Full Name", placeholder: "Your full name", required: true },
      { type: "email", label: "Email Address", placeholder: "name@university.edu", required: true },
      { type: "dropdown", label: "Department", placeholder: "Select your department", options: ["Computer Science", "Electronics", "Mechanical", "Civil", "Other"], required: true },
      { type: "radio", label: "Will you attend?", options: ["Yes", "No"], required: true },
      { type: "checkbox", label: "Preferences", options: ["Receive event updates", "Receive future event invitations"], required: false },
    ],
  },
  {
    id: "support-request-template",
    title: "Student Support Request",
    description: "Let students request academic, technical or accessibility support.",
    fields: [
      { type: "text", label: "Full Name", placeholder: "Your full name", required: true },
      { type: "email", label: "University Email", placeholder: "name@university.edu", required: true },
      { type: "dropdown", label: "Support needed", placeholder: "Select support type", options: ["Academic", "Technical", "Accessibility", "Other"], required: true },
      { type: "textarea", label: "Describe your request", placeholder: "Tell us what you need help with…", required: true, help: "Avoid sharing passwords or other sensitive information." },
      { type: "content", label: "Before you submit", content: "Please review your answers. Clear descriptions help the support team respond faster." },
    ],
  },
];

function saveResponseRecord(form, answers) {
  const current = JSON.parse(localStorage.getItem("if-responses") || "[]");
  const record = {
    id: "response-" + Date.now(),
    formId: form.id,
    formTitle: form.title,
    submittedAt: new Date().toISOString(),
    answers,
  };
  localStorage.setItem("if-responses", JSON.stringify([record, ...current]));
  return record;
}

function getResponseRecords() {
  try { return JSON.parse(localStorage.getItem("if-responses") || "[]"); }
  catch { return []; }
}

// Native DOM helpers used by the accessibility layer.
function announceToScreenReader(message) {
  const region = document.getElementById("a11y-live-region");
  if (!region) return;
  region.textContent = "";
  window.setTimeout(() => {
    region.textContent = message;
  }, 30);
}
function focusElement(id) {
  const el = document.getElementById(id);
  if (el) el.focus();
}
function runAccessibilityDOMAudit() {
  const results = [];
  const fields = document.querySelectorAll(
    ".public-form input, .public-form textarea, .public-form select",
  );
  fields.forEach((field, index) => {
    const hasLabel = !!(
      field.labels?.length ||
      field.getAttribute("aria-label") ||
      field.getAttribute("aria-labelledby")
    );
    results.push({
      id: "label-" + index,
      text: hasLabel
        ? "Every form control has an accessible label"
        : "A form control is missing an accessible label",
      ok: hasLabel,
    });
  });
  const controls = document.querySelectorAll(
    "button,input,textarea,select,a,[tabindex]",
  );
  const keyboard = Array.from(controls).every(
    (el) => el.disabled || el.getAttribute("tabindex") !== "-1",
  );
  results.push({
    id: "keyboard",
    text: "Interactive controls are reachable by keyboard",
    ok: keyboard,
  });
  const labelledButtons = document.querySelectorAll("button");
  const buttonLabels = Array.from(labelledButtons).every(
    (b) =>
      b.textContent.trim() ||
      b.getAttribute("aria-label") ||
      b.getAttribute("aria-labelledby"),
  );
  results.push({
    id: "buttons",
    text: "Interactive buttons have accessible names",
    ok: buttonLabels,
  });
  return results;
}
function useStore() {
  const [forms, setForms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("if-forms")) || initialForms;
    } catch {
      return initialForms;
    }
  });
  const save = (forms) => {
    setForms(forms);
    localStorage.setItem("if-forms", JSON.stringify(forms));
  };
  return { forms, save };
}
function A11yToolbar() {
  const [scale, setScale] = useState(() => Number(localStorage.getItem("if-scale") || 1));
  const [contrast, setContrast] = useState(() => localStorage.getItem("if-contrast") === "1");
  const [reading, setReading] = useState(false);
  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", scale);
    document.documentElement.classList.toggle("contrast", contrast);
    localStorage.setItem("if-scale", scale);
    localStorage.setItem("if-contrast", contrast ? "1" : "0");
  }, [scale, contrast]);
  const changeScale = (delta) => {
    const next = Math.max(0.9, Math.min(1.3, scale + delta));
    setScale(next);
    announceToScreenReader(`Text size ${Math.round(next * 100)} percent`);
  };
  const toggleContrast = () => {
    const next = !contrast;
    setContrast(next);
    announceToScreenReader(next ? "High contrast mode enabled" : "High contrast mode disabled");
  };
  const stopReading = () => {
    window.speechSynthesis?.cancel();
    setReading(false);
    announceToScreenReader("Reading stopped");
  };
  const readPage = () => {
    if (!window.speechSynthesis) {
      announceToScreenReader("Text to speech is not supported in this browser.");
      return;
    }
    stopReading();
    const root = document.querySelector("main") || document.body;
    const text = root.innerText.replace(/\s+/g, " ").trim();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onstart = () => setReading(true);
    utterance.onend = () => setReading(false);
    utterance.onerror = () => setReading(false);
    window.speechSynthesis.speak(utterance);
    announceToScreenReader("Reading page aloud");
  };
  return (
    <div className="access-toolbar" role="toolbar" aria-label="Accessibility controls">
      <Accessibility size={16} aria-hidden="true" />
      <button type="button" aria-label="Read page aloud" aria-pressed={reading} onClick={readPage}>🔊</button>
      <button type="button" aria-label="Stop reading" onClick={stopReading} disabled={!reading}>■</button>
      <button type="button" aria-label="Decrease text size" onClick={() => changeScale(-0.1)}>A−</button>
      <span aria-live="polite">{Math.round(scale * 100)}%</span>
      <button type="button" aria-label="Increase text size" onClick={() => changeScale(0.1)}>A+</button>
      <button type="button" className={contrast ? "active" : ""} aria-pressed={contrast} aria-label="Toggle high contrast mode" onClick={toggleContrast}>Contrast</button>
    </div>
  );
}
function Toast({ text, onClose }) {
  if (!text) return null;
  return (
    <div className="toast">
      <CheckCircle2 size={18} />
      <span>{text}</span>
      <button onClick={onClose}>
        <X size={15} />
      </button>
    </div>
  );
}
function Landing() {
  return (
    <div className="landing">
      <header className="site-header">
        <Link to="/" className="brand">
          Inclusive<span>Forms</span>
          <i>.</i>
        </Link>
        <nav>
          <a href="#features">Features</a>
          <a href="#accessibility">Accessibility</a>
          <Link to="/login" className="nav-signin">
            Sign in
          </Link>
          <Link to="/register" className="btn primary">
            Get started <ArrowRight size={16} />
          </Link>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="pill">
              <Sparkles size={14} /> Accessibility-first form building
            </div>
            <h1>
              Forms that work for <span>everyone.</span>
            </h1>
            <p>
              Create polished, responsive forms with inclusive validation,
              keyboard-first interactions and built-in accessibility guidance.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn primary">
                Create your first form <ArrowRight size={17} />
              </Link>
              <Link to="/login" className="btn ghost">
                Sign in
              </Link>
            </div>
            <div className="hero-meta">
              <span>
                <Check size={15} /> No design experience needed
              </span>
              <span>
                <Check size={15} /> Built for inclusive teams
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="mini-window">
              <div className="mini-top">
                <span></span>
                <span></span>
                <span></span>
                <b>Student Registration</b>
              </div>
              <div className="mini-body">
                <label>
                  Full Name <em>*</em>
                  <div className="fake-input">Your full name</div>
                </label>
                <label>
                  Email Address <em>*</em>
                  <div className="fake-input">name@example.com</div>
                </label>
                <label className="check-row">
                  <span className="fake-check">✓</span> I agree to the terms
                </label>
                <button>
                  Submit form <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <div className="floating-score">
              <div className="score-ring">94</div>
              <div>
                <b>Accessibility</b>
                <small>Excellent score</small>
              </div>
            </div>
          </div>
        </section>
        <section className="trusted">
          <span>DESIGNED AROUND</span>
          <b>Semantic HTML</b>
          <b>Keyboard access</b>
          <b>Clear validation</b>
          <b>Responsive layouts</b>
        </section>
        <section className="features" id="features">
          <div className="section-head">
            <div>
              <div className="eyebrow">BUILT FOR REAL USERS</div>
              <h2>Everything you need to build better forms.</h2>
            </div>
            <p>
              From the first field to the final preview, InclusiveForms keeps
              usability and accessibility visible.
            </p>
          </div>
          <div className="feature-grid">
            <Feature
              icon={<Accessibility />}
              title="Accessible by default"
              text="Labels, focus states, descriptions and required states are designed into the builder."
            />
            <Feature
              icon={<Zap />}
              title="Fast form building"
              text="Add, reorder, duplicate and configure fields without leaving the canvas."
            />
            <Feature
              icon={<Eye />}
              title="Live preview"
              text="See the form exactly as your users will experience it while you build."
            />
            <Feature
              icon={<ShieldCheck />}
              title="Accessibility guidance"
              text="Use the built-in score and checks to catch common issues before publishing."
            />
          </div>
        </section>
        <section className="access-band" id="accessibility">
          <div>
            <div className="eyebrow">INCLUSIVE DESIGN</div>
            <h2>Make every interaction clearer.</h2>
            <p>
              Text scaling, high contrast, visible focus, screen-reader-friendly
              structure and responsive layouts are part of the experience.
            </p>
          </div>
          <div className="access-list">
            <div>
              <CheckCircle2 /> Clear inline errors
            </div>
            <div>
              <CheckCircle2 /> Keyboard-friendly controls
            </div>
            <div>
              <CheckCircle2 /> Helpful field descriptions
            </div>
            <div>
              <CheckCircle2 /> Responsive across screen sizes
            </div>
          </div>
        </section>
      </main>
      <footer>
        <span>© 2026 InclusiveForms</span>
        <span>Build inclusive. Ship confidently.</span>
      </footer>
      <A11yToolbar />
    </div>
  );
}
function Feature({ icon, title, text }) {
  return (
    <article className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
function Auth({ register = false, onLogin }) {
  const nav = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (register && !data.name.trim())
      return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(data.email))
      return setError("Enter a valid email address.");
    if (data.password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (register && data.password !== data.confirm)
      return setError("Passwords do not match.");
    const user = {
      name: register ? data.name.trim() || DEMO_USER.name : DEMO_USER.name,
      email: data.email || DEMO_USER.email,
    };
    localStorage.setItem("if-user", JSON.stringify(user));
    onLogin(user);
    nav("/dashboard");
  };
  return (
    <div className="auth-page">
      <div className="auth-side">
        <Link to="/" className="brand">
          Inclusive<span>Forms</span>
          <i>.</i>
        </Link>
        <div className="auth-promo">
          <div className="pill">
            <Accessibility size={14} /> Inclusive by design
          </div>
          <h2>Build forms people can actually use.</h2>
          <p>
            Design, preview and manage accessible forms from one focused
            workspace.
          </p>
          <div className="promo-points">
            <span>
              <Check /> Semantic structure
            </span>
            <span>
              <Check /> Keyboard friendly
            </span>
            <span>
              <Check /> Live accessibility score
            </span>
          </div>
        </div>
        <small>© 2026 InclusiveForms</small>
      </div>
      <div className="auth-main">
        <Link to="/" className="mobile-brand brand">
          Inclusive<span>Forms</span>
          <i>.</i>
        </Link>
        <div className="auth-card">
          <div className="auth-head">
            <div className="auth-icon">
              {register ? <Sparkles /> : <ShieldCheck />}
            </div>
            <div>
              <div className="eyebrow">
                {register ? "GET STARTED" : "WELCOME BACK"}
              </div>
              <h1>
                {register
                  ? "Create your workspace"
                  : "Sign in to your workspace"}
              </h1>
            </div>
          </div>
          <p className="auth-sub">
            {register
              ? "Start building inclusive forms in a few clicks."
              : "Enter your details to continue to your forms."}
          </p>
          <form onSubmit={submit} noValidate>
            {register && (
              <label>
                Full name
                <input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
            )}
            <label>
              Email address
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="••••••••"
                autoComplete={register ? "new-password" : "current-password"}
              />
            </label>
            {register && (
              <label>
                Confirm password
                <input
                  type="password"
                  value={data.confirm}
                  onChange={(e) =>
                    setData({ ...data, confirm: e.target.value })
                  }
                  placeholder="••••••••"
                />
              </label>
            )}
            {!register && (
              <div className="form-row">
                <label className="inline-check">
                  <input type="checkbox" /> Remember me
                </label>
                <button type="button" className="text-button">
                  Forgot password?
                </button>
              </div>
            )}
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            <button className="btn primary full">
              {register ? "Create account" : "Sign in"} <ArrowRight size={17} />
            </button>
          </form>
          {!register && (
            <button
              className="demo-button"
              onClick={() => {
                localStorage.setItem("if-user", JSON.stringify(DEMO_USER));
                onLogin(DEMO_USER);
                nav("/dashboard");
              }}
            >
              Use demo workspace
            </button>
          )}
          <p className="auth-switch">
            {register ? "Already have an account?" : "New to InclusiveForms?"}{" "}
            <Link to={register ? "/login" : "/register"}>
              {register ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
      <A11yToolbar />
    </div>
  );
}
function Shell({ children, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const nav = [
    ["/dashboard", "Overview", LayoutDashboard],
    ["/forms", "My Forms", FileText],
    ["/builder/new", "Create Form", Plus],
    ["/submissions", "Submissions", Inbox],
    ["/accessibility", "Accessibility", Accessibility],
    ["/settings", "Settings", Settings],
  ];
  return (
    <div className="app-shell">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="side-brand-row">
          <Link to="/dashboard" className="brand">
            Inclusive<span>Forms</span>
            <i>.</i>
          </Link>
          <button className="mobile-close" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <div className="side-label">WORKSPACE</div>
        {nav.map(([path, label, Icon]) => (
          <Link
            key={path}
            to={path}
            onClick={() => setOpen(false)}
            className={
              "workspace-nav-link " +
              (location.pathname === path ? "active" : "")
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
        <div className="side-bottom">
          <div className="side-user">
            <div className="avatar">S</div>
            <div>
              <b>{user.name}</b>
              <small>{user.email}</small>
            </div>
          </div>
          <button className="workspace-nav-link" onClick={onLogout}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
      <button className="mobile-menu" onClick={() => setOpen(true)}>
        <Menu />
      </button>
      <main className="app-main">
        <header className="app-header">
          <div></div>
          <div className="header-actions">
            <button className="icon-button">
              <Bell size={18} />
              <span className="notif-dot"></span>
            </button>
            <div className="header-user">
              <div className="avatar">S</div>
              <span>{user.name}</span>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>
        {children}
      </main>
      <A11yToolbar />
    </div>
  );
}
function Dashboard({ forms, save, setToast }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const nav = useNavigate();
  const stats = {
    total: forms.length,
    published: forms.filter((f) => f.status === "Published").length,
    fields: forms.reduce((a, f) => a + f.fields.length, 0),
    score: Math.round(
      forms.reduce((a, f) => a + score(f.fields), 0) /
        Math.max(1, forms.length),
    ),
  };
  return (
    <div className="page-content">
      <div className="page-title">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>
            Good morning <span>✦</span>
          </h1>
          <p>Here’s what’s happening with your forms today.</p>
        </div>
        <Link to="/builder/new" className="btn primary">
          <Plus size={17} /> Create new form
        </Link>
      </div>
      <div className="stat-grid">
        <Stat
          icon={<FileText />}
          label="Total forms"
          value={stats.total}
          trend="2 this month"
        />
        <Stat
          icon={<Eye />}
          label="Published"
          value={stats.published}
          trend="Ready to share"
        />
        <Stat
          icon={<ClipboardList />}
          label="Total fields"
          value={stats.fields}
          trend="Across all forms"
        />
        <Stat
          icon={<Accessibility />}
          label="Avg. accessibility"
          value={stats.score + "/100"}
          trend="Excellent"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel-card recent">
          <div className="panel-head">
            <div>
              <h2>Recent forms</h2>
              <p>Your latest form projects.</p>
            </div>
            <Link to="/forms">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          {forms.slice(0, 3).map((f) => (
            <FormRow key={f.id} f={f} />
          ))}
        </section>
        <section className="panel-card quick">
          <div className="panel-head">
            <div>
              <h2>Quick start</h2>
              <p>Build your next form faster.</p>
            </div>
          </div>
          <Link to="/builder/new" className="quick-action">
            <div className="qa-icon">
              <Plus />
            </div>
            <div>
              <b>Start from scratch</b>
              <small>Build a custom form</small>
            </div>
            <ArrowRight />
          </Link>
          <button className="quick-action" type="button" onClick={() => setShowTemplates(true)}>
            <div className="qa-icon"><Sparkles /></div>
            <div><b>Try a template</b><small>Start with an accessibility-ready form</small></div>
            <ArrowRight />
          </button>
        </section>
      </div>
      {showTemplates && (
        <Modal title="Choose a template" onClose={() => setShowTemplates(false)}>
          <div className="template-grid">
            {FORM_TEMPLATES.map((template) => (
              <article className="template-card" key={template.id}>
                <div className="template-icon"><Sparkles size={18} /></div>
                <span className="pill">ACCESSIBILITY READY</span>
                <h3>{template.title}</h3>
                <p>{template.description}</p>
                <small>{template.fields.length} elements · Keyboard-friendly · Screen-reader ready</small>
                <button className="btn primary full" type="button" onClick={() => {
                  const item = {
                    id: "form-" + Date.now(),
                    title: template.title,
                    description: template.description,
                    status: "Draft",
                    updated: "Just now",
                    fields: template.fields.map((field, index) => ({ ...clone(field), id: "f-" + Date.now() + "-" + index }))
                  };
                  save([...forms, item]);
                  setShowTemplates(false);
                  setToast(`${template.title} template added`);
                  nav(`/builder/${item.id}`);
                }}>Use template <ArrowRight size={15} /></button>
              </article>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
function Stat({ icon, label, value, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </div>
  );
}
function FormRow({ f }) {
  return (
    <Link to={"/builder/" + f.id} className="form-row-card">
      <div className="form-row-icon">
        <FileText size={19} />
      </div>
      <div className="form-row-main">
        <b>{f.title}</b>
        <small>
          {f.fields.length} fields · Updated {f.updated}
        </small>
      </div>
      <span className={"status " + f.status.toLowerCase()}>{f.status}</span>
      <ChevronRight size={17} />
    </Link>
  );
}
function FormsPage({ forms, save, setToast }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      forms.filter((f) => f.title.toLowerCase().includes(query.toLowerCase())),
    [forms, query],
  );
  const duplicate = (f) => {
    const copy = clone(f);
    copy.id = f.id + "-" + Date.now();
    copy.title = f.title + " Copy";
    copy.status = "Draft";
    copy.updated = "Just now";
    save([...forms, copy]);
    setToast("Form duplicated");
  };
  const remove = (f) => {
    save(forms.filter((x) => x.id !== f.id));
    setToast("Form deleted");
  };
  return (
    <div className="page-content">
      <div className="page-title">
        <div>
          <div className="eyebrow">WORKSPACE</div>
          <h1>My Forms</h1>
          <p>Build, edit and manage your accessible forms.</p>
        </div>
        <Link to="/builder/new" className="btn primary">
          <Plus /> Create new form
        </Link>
      </div>
      <div className="list-toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forms…"
          />
        </div>
        <button className="filter-button">
          <SlidersHorizontal size={16} /> Filter <ChevronDown size={15} />
        </button>
      </div>
      <div className="forms-list">
        {filtered.map((f) => (
          <article className="form-card" key={f.id}>
            <div className="form-card-top">
              <div className="form-row-icon large">
                <FileText size={21} />
              </div>
              <div className="form-card-title">
                <h2>{f.title}</h2>
                <p>{f.description}</p>
              </div>
              <span className={"status " + f.status.toLowerCase()}>
                {f.status}
              </span>
              <button className="icon-button">
                <MoreHorizontal />
              </button>
            </div>
            <div className="form-card-bottom">
              <span>{f.fields.length} fields</span>
              <span>
                Accessibility <b>{score(f.fields)}/100</b>
              </span>
              <span>Updated {f.updated}</span>
              <div className="card-actions">
                <Link to={"/builder/" + f.id} className="small-btn">
                  <Pencil size={15} /> Edit
                </Link>
                <Link to={"/forms/" + f.id} className="small-btn">
                  <Eye size={15} /> Preview
                </Link>
                <button onClick={() => duplicate(f)} className="small-btn">
                  <Copy size={15} /> Duplicate
                </button>
                <button onClick={() => remove(f)} className="small-btn danger">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
function score(fields) {
  if (!fields.length) return 0;
  let n = 0;
  fields.forEach((f) => {
    if (f.label) n += 20;
    if (f.required !== undefined) n += 10;
    if (f.type === "checkbox" || f.help) n += 5;
    if (f.placeholder) n += 5;
  });
  return Math.min(100, Math.round((n / fields.length) * 1.5));
}
function Builder({ forms, save, setToast }) {
  const { id } = useParams();
  const isNew = id === "new";
  const nav = useNavigate();
  const existing = !isNew ? forms.find((f) => f.id === id) : null;
  const [form, setForm] = useState(() =>
    existing
      ? clone(existing)
      : {
          id: "new-" + Date.now(),
          title: "Untitled Form",
          description: "",
          status: "Draft",
          updated: "Just now",
          fields: [],
        },
  );
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("properties");
  const [showPreview, setShowPreview] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  useEffect(() => {
    if (existing) setForm(clone(existing));
  }, [id]);
  const updateForm = (patch) => setForm((x) => ({ ...x, ...patch }));
  const addField = (type) => {
    const [, label] = fieldTypes.find((x) => x[0] === type);
    const isContent = type === "content";
    const f = {
      id: "f-" + Date.now(),
      type,
      label: isContent ? "Section information" : label,
      placeholder:
        type === "email"
          ? "name@example.com"
          : type === "dropdown" || type === "radio"
            ? "Select an option"
            : "",
      required: false,
      help: "",
      content: isContent
        ? "Add instructions, context, or a short description for people completing this form."
        : undefined,
      options:
        type === "dropdown" || type === "radio"
          ? ["Option 1", "Option 2", "Option 3"]
          : type === "checkbox"
            ? ["Option 1", "Option 2", "Option 3"]
            : undefined,
      accept: type === "file" ? ".pdf,.doc,.docx,.png,.jpg,.jpeg" : undefined,
    };
    setForm((x) => ({ ...x, fields: [...x.fields, f] }));
    setSelected(f.id);
    setTab("properties");
  };
  const updateField = (patch) =>
    setForm((x) => ({
      ...x,
      fields: x.fields.map((f) => (f.id === patch.id ? patch : f)),
    }));
  const deleteField = (id) => {
    setForm((x) => ({ ...x, fields: x.fields.filter((f) => f.id !== id) }));
    setSelected(null);
    setToast("Field removed");
  };
  const duplicateField = (id) => {
    const f = form.fields.find((x) => x.id === id);
    if (!f) return;
    const c = clone(f);
    c.id = "f-" + Date.now();
    c.label = f.label + " Copy";
    setForm((x) => ({
      ...x,
      fields: [
        ...x.fields.slice(0, x.fields.findIndex((y) => y.id === id) + 1),
        c,
        ...x.fields.slice(x.fields.findIndex((y) => y.id === id) + 1),
      ],
    }));
    setSelected(c.id);
  };
  const move = (id, dir) =>
    setForm((x) => {
      const arr = [...x.fields],
        i = arr.findIndex((f) => f.id === id),
        j = i + dir;
      if (j < 0 || j >= arr.length) return x;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...x, fields: arr };
    });
  const saveForm = () => {
    const item = {
      ...clone(form),
      id: isNew ? form.id : existing?.id || form.id,
      updated: "Just now",
    };
    save(
      isNew
        ? [...forms, item]
        : forms.map((f) => (f.id === item.id ? item : f)),
    );
    setToast("Form saved locally");
    if (isNew) nav("/builder/" + item.id);
  };
  const publishForm = () => {
    const item = {
      ...clone(form),
      id: isNew ? form.id : existing?.id || form.id,
      status: "Published",
      updated: "Just now",
    };

    const updatedForms = isNew
      ? [...forms, item]
      : forms.map((f) => (f.id === item.id ? item : f));

    save(updatedForms);

    setToast("Form published successfully");

    nav(`/forms/${item.id}`);
  };
  return (
    <div className="builder-page">
      <header className="builder-header">
        <div className="builder-left">
          <Link to="/forms" className="back-link">
            <ArrowLeft size={17} /> Forms
          </Link>
          <div className="divider"></div>
          <div>
            <input
              className="builder-title"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
            />
            <small>Draft · Saved locally</small>
          </div>
        </div>
        <div className="builder-actions">
          <button className="header-action" onClick={() => setShowAudit(true)}>
            <Accessibility size={16} /> Accessibility
          </button>
          <button
            className="header-action"
            onClick={() => setShowPreview(true)}
          >
            <Eye size={16} /> Preview
          </button>
          <button className="header-action" onClick={saveForm}>
            <Save size={16} />
            Save form
          </button>
          <button className="btn primary" onClick={publishForm}>
            Publish form
            <ArrowRight size={16} />
          </button>
        </div>
      </header>
      <div className="builder-layout">
        <aside className="field-library">
          <div className="panel-title">
            <div>
              <div className="eyebrow">ELEMENTS</div>
              <h2>Field library</h2>
            </div>
          </div>
          <p className="library-help">
            Click an element to add it to your form.
          </p>
          {fieldTypes.map(([type, name, desc, Icon]) => (
            <button
              className="library-item"
              key={type}
              onClick={() => addField(type)}
            >
              <span className="lib-icon">
                <Icon size={17} />
              </span>
              <span>
                <b>{name}</b>
                <small>{desc}</small>
              </span>
              <Plus size={15} />
            </button>
          ))}
        </aside>
        <section className="canvas-area">
          <div className="canvas-head">
            <div>
              <span className="eyebrow">FORM CANVAS</span>
              <h2>
                {form.fields.length
                  ? `${form.fields.length} elements`
                  : "Start building your form"}
              </h2>
            </div>
            <button className="canvas-settings">
              <SlidersHorizontal size={16} /> Form settings
            </button>
          </div>
          <div className="canvas-card">
            <div className="canvas-form-head">
              <div className="form-logo">
                <Sparkles size={18} />
              </div>
              <div>
                <h1>{form.title}</h1>
                <p>
                  {form.description ||
                    "Add a short description to help people understand this form."}
                </p>
              </div>
            </div>
            {form.fields.length ? (
              <div className="builder-fields">
                {form.fields.map((f, i) => (
                  <BuilderField
  key={f.id}
  f={f}
  selected={selected === f.id}
  onSelect={() => setSelected(f.id)}
  onDelete={() => deleteField(f.id)}
  onDuplicate={() => duplicateField(f.id)}
  onMove={d => move(f.id, d)}
  onUpdate={updateField}
  index={i}
  total={form.fields.length}
/>
                ))}
              </div>
            ) : (
              <div className="builder-empty">
                <div>
                  <Plus size={22} />
                </div>
                <h3>Add your first field</h3>
                <p>
                  Choose an element from the left panel to start creating your
                  form.
                </p>
              </div>
            )}
            <div className="canvas-submit">
              <button className="btn primary">
                Submit form <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
        <aside className="builder-right">
          <div
            className="right-tabs"
            role="tablist"
            aria-label="Form builder panels"
          >
            <button
              type="button"
              role="tab"
              id="properties-tab"
              aria-selected={tab === "properties"}
              aria-controls="properties-panel"
              className={tab === "properties" ? "active" : ""}
              onClick={() => {
                setTab("properties");
                announceToScreenReader("Properties panel selected");
              }}
            >
              Properties
            </button>
            <button
              type="button"
              role="tab"
              id="preview-tab"
              aria-selected={tab === "preview"}
              aria-controls="preview-panel"
              className={tab === "preview" ? "active" : ""}
              onClick={() => {
                setTab("preview");
                announceToScreenReader("Live preview panel selected");
              }}
            >
              Live preview
            </button>
          </div>
          {tab === "properties" ? (
            <div
              id="properties-panel"
              role="tabpanel"
              aria-labelledby="properties-tab"
            >
              <Properties
                selected={form.fields.find((f) => f.id === selected)}
                update={updateField}
                onDelete={deleteField}
              />
            </div>
          ) : (
            <div
              id="preview-panel"
              role="tabpanel"
              aria-labelledby="preview-tab"
            >
              <LivePreview form={form} />
            </div>
          )}
          <div className="score-card">
            <div className="score-top">
              <div>
                <div className="eyebrow">ACCESSIBILITY</div>
                <b>Form score</b>
              </div>
              <div className="big-score">{score(form.fields)}</div>
            </div>
            <div className="score-bar">
              <span style={{ width: score(form.fields) + "%" }}></span>
            </div>
            <p>
              <CheckCircle2 size={14} /> Strong foundation. Review before
              publishing.
            </p>
            <button
              type="button"
              onClick={() => {
                const results = runAccessibilityDOMAudit();
                console.log("InclusiveForms DOM accessibility audit", results);
                announceToScreenReader(
                  `Accessibility audit completed. ${results.filter((r) => r.ok).length} checks passed.`,
                );
                setShowAudit(true);
              }}
            >
              View accessibility checks <ArrowRight size={14} />
            </button>
          </div>
        </aside>
      </div>
      {showPreview && (
        <Modal title="Preview form" onClose={() => setShowPreview(false)}>
          <LivePreview form={form} full />
        </Modal>
      )}
      {showAudit && (
        <Modal title="Accessibility review" onClose={() => setShowAudit(false)}>
          <div className="audit-hero">
            <div className="audit-score">
              {score(form.fields)}
              <small>/100</small>
            </div>
            <div>
              <h3>Great start!</h3>
              <p>Your form has a solid accessibility foundation.</p>
            </div>
          </div>
          <div className="audit-checks">
            <AuditItem ok text="Every field has a visible label" />
            <AuditItem ok text="Required fields are clearly indicated" />
            <AuditItem ok text="Keyboard focus remains visible" />
            <AuditItem
              ok={form.fields.some((f) => f.help)}
              text="Helpful field descriptions are available"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
function LegacyBuilderField({
  f,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
  onMove,
  index,
  total,
}) {
  const selectField = () => {
    onSelect();
    announceToScreenReader(`${f.label} selected for editing`);
  };
  return (
    <div
      id={`field-${f.id}`}
      className={"builder-field " + (selected ? "selected" : "")}
      role="group"
      aria-label={`${f.label} form field`}
      tabIndex="0"
      onClick={selectField}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectField();
          focusElement(`field-${f.id}`);
        }
      }}
    >
      <div className="drag" aria-hidden="true">
        <GripVertical size={17} />
      </div>
      <div className="field-content">
        <div className="field-label">
          <b>{f.label}</b>
          {f.required && <em aria-hidden="true">*</em>}
        </div>
        {f.help && <small>{f.help}</small>}
        {f.type === "checkbox" ? (
          <div className="checkbox-field">
            {(f.options || [f.label || "Checkbox option"]).map((option, i) => (
              <label className="preview-check" key={i}>
                <input
                  type="checkbox"
                  name={f.id}
                  value={option}
                  aria-label={option}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ) : f.type === "dropdown" ? (
          <div
            className="field-control"
            role="combobox"
            aria-label={f.label}
            aria-expanded="false"
          >
            {f.placeholder || "Select an option"}
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        ) : f.type === "textarea" ? (
          <div
            className="field-control textarea-control"
            role="textbox"
            aria-label={f.label}
          >
            {f.placeholder || "Type your answer…"}
          </div>
        ) : (
          <div className="field-control" role="textbox" aria-label={f.label}>
            {f.placeholder || `Enter ${f.label.toLowerCase()}`}
          </div>
        )}
      </div>
      {selected && (
        <div
          className="field-tools"
          role="toolbar"
          aria-label={`${f.label} field actions`}
        >
          <button
            type="button"
            aria-label={`Move ${f.label} up`}
            onClick={(e) => {
              e.stopPropagation();
              onMove(-1);
              announceToScreenReader(`${f.label} moved up`);
            }}
            disabled={index === 0}
          >
            <ChevronLeft size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Move ${f.label} down`}
            onClick={(e) => {
              e.stopPropagation();
              onMove(1);
              announceToScreenReader(`${f.label} moved down`);
            }}
            disabled={index === total - 1}
          >
            <ChevronRight size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Duplicate ${f.label}`}
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
              announceToScreenReader(`${f.label} duplicated`);
            }}
          >
            <Copy size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Delete ${f.label}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              announceToScreenReader(`${f.label} deleted`);
            }}
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
function BuilderField({
  f,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
  onMove,
  onUpdate,
  index,
  total,
}) {
  const selectField = () => {
    onSelect();
    announceToScreenReader(`${f.label} selected for editing`);
  };

  return (
    <div
      id={`field-${f.id}`}
      className={"builder-field " + (selected ? "selected" : "")}
      role="group"
      aria-label={`${f.label} form field`}
      tabIndex="0"
      onClick={selectField}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectField();
          focusElement(`field-${f.id}`);
        }
      }}
    >
      <div className="drag" aria-hidden="true">
        <GripVertical size={17} />
      </div>

      <div className="field-content">
        <div className="field-label">
          <b>{f.label}</b>
          {f.required && <em aria-hidden="true">*</em>}
        </div>

        {f.type === "content" ? (
          <div className="builder-content-block">
            <span className="content-badge">CONTENT BLOCK</span>
            <p>{f.content || "Add your own instructions or description."}</p>
          </div>
        ) : (
          <>
            {f.help && <small>{f.help}</small>}

            {f.type === "checkbox" ? (
              <div className="checkbox-field">
                {(f.options || [f.label]).map((option, i) => (
                  <label className="preview-check" key={i}>
                    <input type="checkbox" aria-label={option} />
                    <span className="checkbox-box" aria-hidden="true">
                      <Check size={12} />
                    </span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : f.type === "radio" ? (
  <fieldset className="builder-choice-group">
    <legend className="sr-only">{f.label}</legend>

    {(Array.isArray(f.options) && f.options.length > 0
      ? f.options
      : ["Option 1"]
    ).map((option, i) => (
      <label
        className="preview-radio"
        key={`${f.id}-radio-${i}`}
      >
        <input
          type="radio"
          name={`builder-${f.id}`}
          value={option}
          aria-label={option}
        />

        <span
          className="radio-box"
          aria-hidden="true"
        />

        <span>{option}</span>
      </label>
    ))}
  </fieldset>
) : f.type === "file" ? (
              <label className="file-upload-control">
                <input type="file" aria-label={f.label} accept={f.accept || ""} />
                <span className="file-upload-icon"><Upload size={16} /></span>
                <span><b>Choose a file</b><small>{f.accept || "Any supported file"}</small></span>
              </label>
            ) : f.type === "dropdown" ? (
              <div className="select-wrap">
                <select
                  className="field-control field-select"
                  aria-label={f.label}
                  value={f.value || ""}
                  onChange={(e) => {
                    e.stopPropagation();
                    onUpdate({ ...f, value: e.target.value });
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">{f.placeholder || "Select an option"}</option>
                  {(f.options || []).map((option, i) => (
                    <option value={option} key={i}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </div>
            ) : f.type === "date" ? (
          <input
            className="field-control field-date"
            type="date"
            aria-label={f.label}
            value={f.value || ""}
            onChange={(e) => {
              e.stopPropagation();
              onUpdate({ ...f, value: e.target.value });
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : f.type === "textarea" ? (
          <textarea
            className="field-control textarea-control"
            aria-label={f.label}
            placeholder={f.placeholder || "Type your answer…"}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <input
            className="field-control"
            type={f.type === "phone" ? "tel" : f.type}
            aria-label={f.label}
            placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}`}
            onClick={(e) => e.stopPropagation()}
          />
        )}
          </>
        )}
      </div>

      {selected && (
        <div
          className="field-tools"
          role="toolbar"
          aria-label={`${f.label} field actions`}
        >
          <button
            type="button"
            aria-label={`Move ${f.label} up`}
            onClick={(e) => {
              e.stopPropagation();
              onMove(-1);
            }}
            disabled={index === 0}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            aria-label={`Move ${f.label} down`}
            onClick={(e) => {
              e.stopPropagation();
              onMove(1);
            }}
            disabled={index === total - 1}
          >
            <ChevronRight size={15} />
          </button>
          <button
            type="button"
            aria-label={`Duplicate ${f.label}`}
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy size={15} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${f.label}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
function Properties({ selected, update, onDelete }) {
  if (!selected)
    return (
      <div className="properties-empty" aria-live="polite">
        <div className="empty-prop-icon">
          <SlidersHorizontal aria-hidden="true" />
        </div>
        <h3>Select a field</h3>
        <p>Click a field on the canvas to edit its properties.</p>
      </div>
    );
  const set = (k) => (e) => update({ ...selected, [k]: e.target.value });
  return (
    <div className="properties" aria-label="Field properties">
      <div className="prop-header">
        <div>
          <div className="eyebrow">FIELD SETTINGS</div>
          <h2 id={`selected-field-${selected.id}`}>
            {selected.type[0].toUpperCase() + selected.type.slice(1)}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            onDelete(selected.id);
            announceToScreenReader(`${selected.label} deleted`);
          }}
          className="icon-button danger"
          aria-label={`Delete ${selected.label}`}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
      <label htmlFor={`property-label-${selected.id}`}>
        Field label
        <input
          id={`property-label-${selected.id}`}
          value={selected.label}
          onChange={set("label")}
          aria-required="true"
          aria-describedby={`label-help-${selected.id}`}
        />
        <small id={`label-help-${selected.id}`} className="sr-only">
          This label identifies the form control for assistive technology.
        </small>
      </label>
      {selected.type === "content" ? (
        <label htmlFor={`property-content-${selected.id}`}>
          Content
          <textarea
            id={`property-content-${selected.id}`}
            rows="6"
            value={selected.content || ""}
            onChange={set("content")}
            placeholder="Write instructions, context, or a description..."
          />
          <small className="property-hint">
            Use this block for headings, instructions, or helpful context. It does not collect a response.
          </small>
        </label>
      ) : (
        <>
          <label htmlFor={`property-placeholder-${selected.id}`}>
            Placeholder
            <input
              id={`property-placeholder-${selected.id}`}
              value={selected.placeholder || ""}
              onChange={set("placeholder")}
            />
          </label>
          <label htmlFor={`property-help-${selected.id}`}>
            Help text
            <textarea
              id={`property-help-${selected.id}`}
              rows="3"
              value={selected.help || ""}
              onChange={set("help")}
              placeholder="Optional guidance for users"
            />
          </label>
          <label className="prop-check">
            <input
              type="checkbox"
              checked={!!selected.required}
              onChange={(e) => {
                update({ ...selected, required: e.target.checked });
                announceToScreenReader(
                  e.target.checked
                    ? `${selected.label} is required`
                    : `${selected.label} is optional`,
                );
              }}
              aria-label={`Make ${selected.label} required`}
            />
            <span>
              <b>Required field</b>
              <small>Users must complete this field.</small>
            </span>
          </label>
        </>
      )}
      {selected.type === "dropdown" && (
        <div className="options">
          <div className="option-head">
            <b>Dropdown options</b>
            <button
              type="button"
              onClick={() =>
                update({
                  ...selected,
                  options: [...(selected.options || []), "New option"],
                })
              }
              aria-label="Add dropdown option"
            >
              <Plus size={14} aria-hidden="true" /> Add
            </button>
          </div>
          {(selected.options || []).map((o, i) => (
            <div className="option-row" key={i}>
              <span aria-hidden="true">{i + 1}</span>
              <label className="sr-only" htmlFor={`option-${selected.id}-${i}`}>
                Option {i + 1}
              </label>
              <input
                id={`option-${selected.id}-${i}`}
                value={o}
                onChange={(e) =>
                  update({
                    ...selected,
                    options: selected.options.map((x, j) =>
                      j === i ? e.target.value : x,
                    ),
                  })
                }
              />
              <button
                type="button"
                onClick={() =>
                  update({
                    ...selected,
                    options: selected.options.filter((_, j) => j !== i),
                  })
                }
                aria-label={`Remove option ${i + 1}`}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
      {(selected.type === "checkbox" || selected.type === "radio") && (
        <div className="property-group">
          <label>{selected.type === "radio" ? "Radio options" : "Checkbox options"}</label>
          {(selected.options || [selected.label || "Option 1"]).map((option, i) => (
            <div className="option-row" key={i}>
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const options = [...(selected.options || [selected.label])];
                  options[i] = e.target.value;
                  update({ ...selected, options });
                }}
                aria-label={`${selected.type === "radio" ? "Radio" : "Checkbox"} option ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => {
                  const options = [...(selected.options || [selected.label])];
                  options.splice(i, 1);
                  update({ ...selected, options });
                }}
                aria-label={`Delete option ${i + 1}`}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-option"
            onClick={() => {
              const options = [
                ...(selected.options || [selected.label || "Option 1"]),
                `Option ${(selected.options || []).length + 1}`,
              ];
              update({ ...selected, options });
            }}
          >
            + Add {selected.type === "radio" ? "radio" : "checkbox"}
          </button>
        </div>
      )}
      {selected.type === "file" && (
        <div className="property-group">
          <label htmlFor={`property-accept-${selected.id}`}>
            Accepted file types
            <input
              id={`property-accept-${selected.id}`}
              value={selected.accept || ""}
              onChange={set("accept")}
              placeholder=".pdf,.png,.jpg"
            />
          </label>
          <small className="property-hint">Use extensions separated by commas. Leave blank to allow common file types.</small>
        </div>
      )}
      <div className="property-note" role="note">
        <Accessibility size={16} aria-hidden="true" />
        <div>
          <b>Accessibility</b>
          <p>Visible labels and keyboard focus are preserved automatically.</p>
        </div>
      </div>
    </div>
  );
}
function LivePreview({ form, full = false }) {
  return (
    <div className={full ? "live-preview full" : "live-preview"}>
      <div className="preview-browser" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <small>Preview</small>
      </div>
      <form
        className="public-form"
        aria-label={`${form.title} form`}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="public-kicker">FORM PREVIEW</div>
        <h1>{form.title}</h1>
        <p>{form.description || "Your form description will appear here."}</p>
        <div className="public-fields">
          {form.fields.map((f) => {
            const inputId = `preview-${f.id}`;
            const helpId = f.help ? `${inputId}-help` : undefined;
            return (
              <div className="public-field" key={f.id}>
                {f.type === "content" ? (
                  <section className="public-content-block" aria-label={f.label}>
                    <div className="content-badge">INFORMATION</div>
                    <h2>{f.label}</h2>
                    <p>{f.content || "Add instructions or context for your users."}</p>
                  </section>
                ) : f.type === "checkbox" ? (
                  <fieldset className="public-check-group">
                    <legend>
                      {f.label}
                      {f.required && <em aria-hidden="true"> *</em>}
                    </legend>
                    {(f.options || [f.label]).map((option, i) => (
                      <label className="public-check" htmlFor={`${inputId}-${i}`} key={i}>
                        <input
                          id={`${inputId}-${i}`}
                          type="checkbox"
                          name={f.id}
                          value={option}
                          required={f.required && i === 0}
                          aria-required={f.required ? "true" : "false"}
                        />
                        <span className="checkbox-box" aria-hidden="true">
                          <Check size={12} />
                        </span>
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>
                ) : f.type === "radio" ? (
                  <fieldset className="public-choice-group">
                    <legend>{f.label}{f.required && <em aria-hidden="true"> *</em>}</legend>
                    {(f.options || ["Option 1", "Option 2"]).map((option, i) => (
                      <label className="public-radio" htmlFor={`${inputId}-${i}`} key={i}>
                        <input
                          id={`${inputId}-${i}`}
                          type="radio"
                          name={f.id}
                          value={option}
                          required={f.required && i === 0}
                          aria-required={f.required ? "true" : "false"}
                        />
                        <span className="radio-box" aria-hidden="true" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>
                ) : f.type === "file" ? (
                  <label className="file-upload-control public-file-upload" htmlFor={inputId}>
                    <input id={inputId} type="file" required={f.required} accept={f.accept || ""} aria-required={f.required ? "true" : "false"} />
                    <span className="file-upload-icon"><Upload size={18} /></span>
                    <span><b>Choose a file</b><small>{f.accept || "Supported file types"}</small></span>
                  </label>
                ) : (
                  <>
                    <label htmlFor={inputId}>
                      {f.label}
                      {f.required && <em aria-hidden="true"> *</em>}
                    </label>
                    {f.type === "dropdown" ? (
                      <div className="select-wrap public-select-wrap">
                        <select
                          id={inputId}
                          defaultValue=""
                          required={f.required}
                          aria-required={f.required ? "true" : "false"}
                          aria-describedby={helpId}
                        >
                          <option value="" disabled>
                            {f.placeholder || "Select an option"}
                          </option>
                          {(f.options || []).map((o, i) => (
                            <option value={o} key={i}>{o}</option>
                          ))}
                        </select>
                        <ChevronDown size={17} aria-hidden="true" />
                      </div>
                    ) : f.type === "textarea" ? (
                      <textarea
                        id={inputId}
                        rows="4"
                        placeholder={f.placeholder || "Type your answer…"}
                        required={f.required}
                        aria-required={f.required ? "true" : "false"}
                        aria-describedby={helpId}
                      />
                    ) : (
                      <input
                        id={inputId}
                        type={f.type === "phone" ? "tel" : f.type}
                        placeholder={
                          f.placeholder || `Enter ${f.label.toLowerCase()}`
                        }
                        required={f.required}
                        aria-required={f.required ? "true" : "false"}
                        aria-describedby={helpId}
                      />
                    )}{" "}
                    {f.help && <small id={helpId}>{f.help}</small>}
                  </>
                )}
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className="btn primary full"
          aria-label="Submit form"
        >
          Submit form <ArrowRight size={15} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
function RespondentForm({ form }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = React.useRef(null);

  const validateField = (field, value) => {
    const cleanValue =
      field.type === "checkbox"
        ? value || []
        : field.type === "file"
          ? value || null
          : String(value || "").trim();

    if (field.required) {
      const missing =
        field.type === "checkbox"
          ? !cleanValue.some(Boolean)
          : !cleanValue;

      if (missing) {
        return `Please complete ${field.label}.`;
      }
    }

    if (field.type === "email" && cleanValue) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(cleanValue)) {
        return "Please enter a valid email address.";
      }
    }

    if (field.type === "number" && cleanValue) {
      if (!/^\d+$/.test(cleanValue)) {
        return "Please enter numbers only.";
      }
    }

    if (field.type === "phone" && cleanValue) {
      const phonePattern = /^[0-9+\-\s()]{7,20}$/;

      if (!phonePattern.test(cleanValue)) {
        return "Please enter a valid phone number.";
      }
    }

    if (field.type === "dropdown" && field.required) {
      if (!cleanValue) {
        return `Please select ${field.label}.`;
      }
    }

    return "";
  };

  const updateValue = (fieldId, value) => {
    const field = form.fields.find((f) => f.id === fieldId);

    setValues((current) => ({ ...current, [fieldId]: value }));

    if (field) {
      const error = validateField(field, value);

      setErrors((current) => {
        const next = { ...current };

        if (error) {
          next[fieldId] = error;
        } else {
          delete next[fieldId];
        }

        return next;
      });
    }

    setSubmitted(false);
  };

  const handleBlur = (field) => {
    const error = validateField(field, values[field.id]);

    setErrors((current) => {
      const next = { ...current };

      if (error) {
        next[field.id] = error;
      } else {
        delete next[field.id];
      }

      return next;
    });
  };

  const submit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    form.fields.forEach((field) => {
      const error = validateField(field, values[field.id]);

      if (error) {
        nextErrors[field.id] = error;
      }
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);

      announceToScreenReader(
        "Please correct the errors in the form before submitting.",
      );

      const firstInvalid = form.fields.find(
        (field) => nextErrors[field.id],
      );

      if (firstInvalid) {
        window.setTimeout(() => {
          document
            .getElementById(`respondent-${firstInvalid.id}`)
            ?.focus();
        }, 0);
      }

      return;
    }

    saveResponseRecord(form, values);
    setSubmitted(true);

    announceToScreenReader(
      "Your response was submitted successfully. Your response has been saved.",
    );
  };

  return (
    <div className="live-preview full respondent-view">
      <div className="preview-browser" aria-hidden="true">
        <span></span><span></span><span></span><small>Published form</small>
      </div>
      <form
        ref={formRef}
        className="public-form"
        aria-label={`${form.title} form`}
        onSubmit={submit}
        noValidate
      >
        <div className="public-kicker">PUBLISHED FORM</div>
        <h1>{form.title}</h1>
        <p>{form.description || "Please complete the form below."}</p>
        <div className="respondent-required-note">* Required field</div>
        <div className="respondent-status" role="status" aria-live="polite">
          {submitted && "Your response was submitted successfully."}
        </div>
        <div
          className="respondent-alert"
          role="alert"
          aria-live="assertive"
        >
          {Object.keys(errors).length > 0 &&
            "Please correct the errors in the form before submitting."}
        </div>
        <div className="public-fields">
          {form.fields.map((field) => {
            const inputId = `respondent-${field.id}`;
            const helpId = field.help ? `${inputId}-help` : undefined;
            const errorId = errors[field.id] ? `${inputId}-error` : undefined;
            const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
            const invalid = !!errors[field.id];
            const common = {
              id: inputId,
              required: field.required,
              "aria-required": field.required
                ? "true"
                : "false",
              "aria-invalid": invalid
                ? "true"
                : "false",
              "aria-describedby": describedBy,
              onBlur: () => handleBlur(field),
            };
            return (
              <div
                className={
                  "public-field respondent-field" +
                  (invalid ? " has-error" : "")
                }
                key={field.id}
              >
                {field.type === "content" ? (
                  <section className="public-content-block" aria-label={field.label}>
                    <div className="content-badge">INFORMATION</div>
                    <h2>{field.label}</h2>
                    <p>{field.content || "Helpful information for this section."}</p>
                  </section>
                ) : field.type === "checkbox" ? (
                  <fieldset
                    className="respondent-checkbox-group"
                    aria-describedby={describedBy}
                  >
                    <legend>
                      {field.label}
                      {field.required && <em aria-hidden="true"> *</em>}
                    </legend>
                    {(field.options || [field.label || "Checkbox option"]).map((option, index) => (
                      <label className="public-check" htmlFor={`${inputId}-${index}`} key={index}>
                        <input
                          {...common}
                          id={`${inputId}-${index}`}
                          type="checkbox"
                          name={field.id}
                          value={option}
                          checked={(values[field.id] || []).includes(option)}
                          onChange={(event) => {
                            const current = values[field.id] || [];
                            updateValue(field.id, event.target.checked ? [...current, option] : current.filter((item) => item !== option));
                          }}
                        />
                        <span className="checkbox-box" aria-hidden="true"><Check size={12} /></span>
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>
                ) : field.type === "radio" ? (
                  <fieldset className="respondent-choice-group" aria-describedby={describedBy}>
                    <legend>{field.label}{field.required && <em aria-hidden="true"> *</em>}</legend>
                    {(field.options || ["Option 1", "Option 2"]).map((option, index) => (
                      <label className="public-radio" htmlFor={`${inputId}-${index}`} key={index}>
                        <input
                          {...common}
                          id={`${inputId}-${index}`}
                          type="radio"
                          name={field.id}
                          value={option}
                          checked={values[field.id] === option}
                          onChange={() => updateValue(field.id, option)}
                        />
                        <span className="radio-box" aria-hidden="true" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>
                ) : field.type === "file" ? (
                  <label className="file-upload-control public-file-upload" htmlFor={inputId}>
                    <input
                      {...common}
                      id={inputId}
                      type="file"
                      accept={field.accept || ""}
                      onChange={(event) => updateValue(field.id, event.target.files?.[0] || null)}
                    />
                    <span className="file-upload-icon"><Upload size={18} /></span>
                    <span><b>{values[field.id]?.name || "Choose a file"}</b><small>{field.accept || "Supported file types"}</small></span>
                  </label>
                ) : (
                  <>
                    <label htmlFor={inputId}>
                      {field.label}
                      {field.required && <em aria-hidden="true"> *</em>}
                    </label>
                    {field.type === "dropdown" ? (
                      <div className="select-wrap public-select-wrap">
                        <select
                          {...common}
                          value={values[field.id] || ""}
                          onChange={(event) => updateValue(field.id, event.target.value)}
                        >
                          <option value="">
                            {field.placeholder || "Select an option"}
                          </option>
                          {(field.options || []).map((option, index) => (
                            <option value={option} key={index}>{option}</option>
                          ))}
                        </select>
                        <ChevronDown size={17} aria-hidden="true" />
                      </div>
                    ) : field.type === "textarea" ? (
                      <textarea
                        {...common}
                        rows="4"
                        placeholder={field.placeholder || "Type your answer..."}
                        value={values[field.id] || ""}
                        onChange={(event) =>
                          updateValue(
                            field.id,
                            event.target.value,
                          )
                        }
                      />
                    ) : (
                      <input
                        {...common}
                        type={
                          field.type === "phone"
                            ? "tel"
                            : field.type
                        }
                        inputMode={
                          field.type === "number"
                            ? "numeric"
                            : undefined
                        }
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        value={values[field.id] || ""}
                        onChange={(event) => {
                          const value =
                            event.target.value;

                          if (
                            field.type === "number" &&
                            !/^\d*$/.test(value)
                          ) {
                            return;
                          }

                          updateValue(
                            field.id,
                            value,
                          );
                        }}
                      />
                    )}
                    {field.help && <small id={helpId}>{field.help}</small>}
                  </>
                )}

                {errors[field.id] && (
                  <div
                    className="respondent-error"
                    id={errorId}
                    role="alert"
                  >
                    {errors[field.id]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className="btn primary full"
          aria-label="Submit form"
        >
          Submit form
          <ArrowRight
            size={15}
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
}
function AuditItem({ ok, text }) {
  return (
    <div className="audit-item" role="status">
      <span className={ok ? "ok" : "warn"} aria-hidden="true">
        {ok ? <Check size={15} /> : <X size={15} />}
      </span>
      <span>{text}</span>
      <b>{ok ? "Pass" : "Review"}</b>
    </div>
  );
}
function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-head">
          <h2>{title}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
function Submissions() {
  const [responses, setResponses] = useState(() => getResponseRecords());
  const [selected, setSelected] = useState(null);
  const refresh = () => setResponses(getResponseRecords());
  const clear = () => {
    localStorage.removeItem("if-responses");
    setResponses([]);
    setSelected(null);
  };
  const exportResponses = () => {
    const blob = new Blob([JSON.stringify(responses, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inclusiveforms-responses.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="page-content">
      <div className="page-title">
        <div><div className="eyebrow">RESPONSES</div><h1>Submissions</h1><p>Review responses submitted through your published forms.</p></div>
        <div className="page-title-actions">
          <button className="btn ghost" onClick={refresh}><ArrowRight size={15} /> Refresh</button>
          {responses.length > 0 && <button className="btn ghost" onClick={exportResponses}><Save size={15} /> Export JSON</button>}
          {responses.length > 0 && <button className="btn ghost" onClick={clear}>Clear</button>}
        </div>
      </div>
      {responses.length === 0 ? (
        <div className="empty-state-large">
          <div className="empty-prop-icon"><Inbox /></div>
          <h2>No responses yet</h2>
          <p>Publish a form, submit a response, and it will appear here instantly. Responses are stored locally for this frontend demo.</p>
          <Link className="btn primary" to="/forms">View your forms</Link>
        </div>
      ) : (
        <div className="submissions-layout">
          <section className="panel-card submissions-list">
            <div className="panel-head"><div><h2>{responses.length} response{responses.length === 1 ? "" : "s"}</h2><p>Newest responses first.</p></div></div>
            {responses.map((r) => (
              <button className={"submission-row " + (selected?.id === r.id ? "active" : "")} key={r.id} onClick={() => setSelected(r)}>
                <div className="submission-avatar">{r.formTitle.charAt(0)}</div>
                <div><b>{r.formTitle}</b><small>{new Date(r.submittedAt).toLocaleString()}</small></div>
                <ChevronRight size={16} />
              </button>
            ))}
          </section>
          <section className="panel-card submission-detail">
            {selected ? (
              <>
                <div className="panel-head"><div><div className="eyebrow">RESPONSE DETAIL</div><h2>{selected.formTitle}</h2><p>{new Date(selected.submittedAt).toLocaleString()}</p></div></div>
                <div className="response-answers">
                  {Object.entries(selected.answers || {}).map(([key, value]) => (
                    <div className="response-answer" key={key}><span>{key}</span><strong>{Array.isArray(value) ? value.join(", ") || "—" : value?.name || value || "—"}</strong></div>
                  ))}
                </div>
              </>
            ) : <div className="properties-empty"><Inbox /><h3>Select a response</h3><p>Choose a submission from the list to view its answers.</p></div>}
          </section>
        </div>
      )}
    </div>
  );
}
function AccessibilityPage() {
  return (
    <div className="page-content">
      <div className="page-title">
        <div>
          <div className="eyebrow">INCLUSIVE DESIGN</div>
          <h1>Accessibility</h1>
          <p>Review the principles that guide every form you build.</p>
        </div>
      </div>
      <div className="access-grid">
        <div className="panel-card">
          <Accessibility />
          <h2>Accessibility-first builder</h2>
          <p>
            Every field keeps its visible label, keyboard focus and clear
            required state while you build.
          </p>
        </div>
        <div className="panel-card">
          <KeyboardIcon />
          <h2>Keyboard navigation</h2>
          <p>
            Core controls are designed for logical tab order and visible focus
            indicators.
          </p>
        </div>
        <div className="panel-card">
          <ShieldCheck />
          <h2>Pre-publish review</h2>
          <p>
            Use the score in the builder to identify areas worth reviewing
            before publishing.
          </p>
        </div>
      </div>
    </div>
  );
}
function KeyboardIcon() {
  return (
    <div className="feature-icon">
      <Zap />
    </div>
  );
}
function SettingsPage({ user }) {
  return (
    <div className="page-content">
      <div className="page-title">
        <div>
          <div className="eyebrow">ACCOUNT</div>
          <h1>Settings</h1>
          <p>Manage your workspace preferences.</p>
        </div>
      </div>
      <div className="settings-card">
        <div className="settings-avatar">S</div>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="status published">Demo workspace</span>
        </div>
      </div>
    </div>
  );
}
function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("if-user"));
    } catch {
      return null;
    }
  });
  const { forms, save: setForms } = useStore();
  const [toast, setToast] = useState("");
  const logout = () => {
    localStorage.removeItem("if-user");
    setUser(null);
  };
  const show = (t) => {
    setToast(t);
    setTimeout(() => setToast(""), 2500);
  };
  return (
    <>
      <div
        id="a11y-live-region"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      ></div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth onLogin={setUser} />} />
        <Route path="/register" element={<Auth register onLogin={setUser} />} />
        <Route path="/forms/:id" element={<PublicStandalone forms={forms} />} />
        {user ? (
          <>
            <Route
              path="/dashboard"
              element={
                <Shell user={user} onLogout={logout}>
                  <Dashboard forms={forms} save={setForms} setToast={show} />
                </Shell>
              }
            />
            <Route
              path="/forms"
              element={
                <Shell user={user} onLogout={logout}>
                  <FormsPage forms={forms} save={setForms} setToast={show} />
                </Shell>
              }
            />
            <Route
              path="/builder/:id"
              element={
                <Shell user={user} onLogout={logout}>
                  <Builder forms={forms} save={setForms} setToast={show} />
                </Shell>
              }
            />
            <Route
              path="/submissions"
              element={
                <Shell user={user} onLogout={logout}>
                  <Submissions />
                </Shell>
              }
            />
            <Route
              path="/accessibility"
              element={
                <Shell user={user} onLogout={logout}>
                  <AccessibilityPage />
                </Shell>
              }
            />
            <Route
              path="/settings"
              element={
                <Shell user={user} onLogout={logout}>
                  <SettingsPage user={user} />
                </Shell>
              }
            />
            <Route
              path="*"
              element={
                <Shell user={user} onLogout={logout}>
                  <Dashboard forms={forms} save={setForms} setToast={show} />
                </Shell>
              }
            />
          </>
        ) : (
          <Route path="*" element={<Landing />} />
        )}
      </Routes>
      <Toast text={toast} onClose={() => setToast("")} />
    </>
  );
}
function PublicStandalone({ forms }) {
  const { id } = useParams();
  const form = forms.find((f) => f.id === id);
  return (
    <div className="standalone-preview">
      <Link to="/" className="brand">
        Inclusive<span>Forms</span>
        <i>.</i>
      </Link>
      {form ? (
        form.status === "Published" ? (
          <RespondentForm form={form} />
        ) : (
          <LivePreview form={form} full />
        )
      ) : (
        <div className="empty-state-large">
          <h2>Form not found</h2>
        </div>
      )}
      <A11yToolbar />
    </div>
  );
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
