<div align="center">

# 🌌 Anuj Savita — Developer Portfolio

**A futuristic, interactive portfolio built with React + Vite + Three.js**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r183-white?style=flat-square&logo=threedotjs&logoColor=black)](https://threejs.org)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com)
[![EmailJS](https://img.shields.io/badge/EmailJS-connected-orange?style=flat-square)](https://emailjs.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🔗 Live Demo](#) · [📬 Contact](mailto:anujsavita395@gmail.com) · [⭐ Star this repo](https://github.com/anujsavita929-alt/my-portfolio)

</div>

---

## 🖼️ Preview

> **Dark Mode** — Sci-fi wormhole intro → glassmorphism portfolio with green accent  
> **Light Mode** — Soft sky-blue glassmorphism with blush pink accents

---

## ✨ Features

| Feature | Description |
|---|---|
| 🚀 **Sci-Fi Intro** | Wormhole particle tunnel, orbital rings, HUD panels, LiquidEther fluid simulation |
| 🏎️ **Bugatti 3D** | Real GLB model — drag to orbit, auto-rotate, transparent background |
| 🌀 **Orbital Projects** | Project cards orbit around the Bugatti in 3D space |
| 🎨 **Dark / Light Theme** | Toggle with animated pill button; dark uses green accent, light uses blush pink |
| 🧭 **GooeyNav** | Animated right-sidebar nav with gooey particle burst effects |
| 📜 **Infinite Skills Scroll** | Auto-scrolling skill cards with real icons, pausable on hover, clickable to docs |
| 🃏 **MagicBento Cards** | Particle effects, tilt, border glow, and spotlight tracking on all cards |
| 🖱️ **Arcane Cursor** | Gold ring + comet trail + star/spark particles following the cursor |
| ✨ **ClickSpark** | Green spark burst on every click across the portfolio |
| 🔄 **Rotating Hero Text** | Spring-animated character-by-character text rotation |
| 🖼️ **Showcase Gallery** | Placeholder grid for project images — drop-in ready |
| 📬 **EmailJS Contact** | Live form with send/error/success states — no backend required |
| 📱 **Fully Responsive** | Bottom-bar nav on mobile, all layouts adapt gracefully |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 8 |
| 3D Graphics | Three.js r183 + GLTFLoader + OrbitControls |
| Fluid Simulation | LiquidEther (custom WebGL component) |
| Animations | GSAP + CSS Animations + Framer Motion |
| Cursor | Custom Arcane Cursor (Canvas API) |
| Email | EmailJS (`@emailjs/browser`) |
| Fonts | Orbitron, Cinzel Decorative, Cormorant Garamond, DM Sans |
| Styling | CSS3 + CSS Variables + Glassmorphism |
| Language | JavaScript (JSX) |
| Linting | ESLint |

---

## 📁 Project Structure

```
my-portfolio/
├── public/
│   └── model/
│       └── bugatti_chiron_white.glb    # 3D Bugatti model
├── src/
│   ├── assets/
│   │   └── gurukul.jpg                 # Loader profile image
│   ├── components/
│   │   ├── ArcaneCursor/
│   │   │   ├── ArcaneCursor.jsx        # Gold ring + comet trail cursor
│   │   │   └── ArcaneCursor.css
│   │   ├── ClickSpark/
│   │   │   └── ClickSpark.jsx          # Green spark burst on click
│   │   ├── GooeyNav/
│   │   │   ├── GooeyNav.jsx            # Particle burst nav component
│   │   │   └── GooeyNav.css
│   │   ├── LiquidEther/
│   │   │   ├── LiquidEther.jsx         # WebGL fluid simulation
│   │   │   └── LiquidEther.css
│   │   ├── MagicBento/
│   │   │   ├── MagicBento.jsx          # Particle card + spotlight
│   │   │   └── MagicBento.css
│   │   └── RotatingText/
│   │       ├── RotatingText.jsx        # Spring character animation
│   │       └── RotatingText.css
│   ├── App.jsx                         # Root component — all sections
│   ├── style.css                       # Global styles + dark/light theme
│   └── main.jsx                        # Entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🗂️ Sections

| # | Section | Description |
|---|---|---|
| 1 | **Intro** | Full-screen sci-fi wormhole with LiquidEther fluid bg + click-to-enter |
| 2 | **Hero** | Name, rotating tagline, CTA buttons, stats card |
| 3 | **About** | 3 MagicBento cards — who I am, what I do, currently |
| 4 | **Skills** | Infinite auto-scroll track, real brand icons, clickable to docs |
| 5 | **Showcase** | Image gallery grid — placeholder, drop-in ready |
| 6 | **Projects** | Bugatti 3D center + 3 project cards orbiting around it |
| 7 | **Hackathons** | Experience and hackathon highlight cards |
| 8 | **Contact** | EmailJS form + social links |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anujsavita929-alt/my-portfolio.git

# Navigate into the project
cd my-portfolio

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

---

## 📬 EmailJS Setup

No backend required. Uses [EmailJS](https://emailjs.com) to send form submissions directly to your Gmail.

1. Sign up at [emailjs.com](https://emailjs.com)
2. Create an **Email Service** (Gmail)
3. Create an **Email Template** with variables:
   - `{{from_name}}` — sender's name
   - `{{from_email}}` — sender's email
   - `{{message}}` — message body
4. Replace in `App.jsx` `handleSubmit`:

```js
emailjs.sendForm(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  formRef.current,
  'YOUR_PUBLIC_KEY'
)
```

> ⚠️ Use your **Public Key** only — never commit private keys.

---

## 🎨 Theme System

The portfolio supports full **dark / light theming** via CSS variables on `[data-theme]`:

| Token | Light | Dark |
|---|---|---|
| Background | Sky blue gradient | `#00060f` → `#001a10` |
| Accent | Blush pink `#d87880` | Green `#00e5a0` |
| Glass | `rgba(255,255,255,0.22)` | `rgba(0,12,28,0.72)` |
| Text | `#1a2a3a` | `#e8f4f0` |

Theme preference is saved to `localStorage` and defaults to **dark**.

---

## 🏎️ 3D Model Setup

Place your Bugatti GLB at:
```
public/model/bugatti_chiron_white.glb
```

The model auto-centers, scales to fit, and enables OrbitControls with auto-rotate.  
On user interaction, auto-rotate pauses. Fully transparent background.

---

## 🏫 About This Project

Built for **Frontend Battle 2K26** at **MITS Gwalior** — Round 1: Portfolio Showdown.

**Evaluation criteria:**
- ✅ Visual Design & Creativity
- ✅ Responsiveness Across Devices
- ✅ Code Quality & Structure
- ✅ Content Clarity
- ✅ Overall UX

---

## 📬 Connect

| Platform | Link |
|---|---|
| 📧 Email | [anujsavita395@gmail.com](mailto:anujsavita395@gmail.com) |
| 💻 GitHub | [@anujsavita929-alt](https://github.com/anujsavita929-alt) |
| 💼 LinkedIn | [anuj-savita-b1a4a6391](https://www.linkedin.com/in/anuj-savita-b1a4a6391/) |

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

Crafted with ☕ + Three.js by **Anuj Savita** · Gwalior, India · 2026

*"Code is poetry, and this is my verse."*

</div>