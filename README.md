# Nishit Parikh — Creative Developer Portfolio 🚀

Welcome to the source code of my personal portfolio! This project is a showcase of my skills as a creative developer, combining cutting-edge web technologies to create an immersive, interactive, and high-performance user experience.

> **Note:** This repository is **private** and **not open source**. The code, design, and assets are not licensed for reuse, redistribution, or contribution.

## ✨ Features

- **Immersive 3D Galaxy:** A dynamic, physics-based WebGL galaxy background built with **Three.js** that reacts to cursor movements.
- **Cinematic Animations:** Smooth, buttery page transitions and scroll-triggered animations powered by **Framer Motion** and **GSAP**.
- **Interactive Physics Engine:** A custom 2D physics engine using **Matter.js** for the skills section ball pit.
- **Premium UI/UX:** Sleek glassmorphism interfaces, glowing neon accents, custom cursor tracking, and seamless modal transitions.
- **AI Assistant Integration:** An optional integrated "Astra" chat assistant powered by the Groq API.
- **Fully Responsive:** Carefully crafted to look stunning on mobile, tablet, and desktop devices.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org) (App Router)
- **Styling:** Tailwind CSS & Vanilla CSS for complex animations
- **3D & Canvas:** Three.js, React Three Fiber, native HTML5 Canvas
- **Animations:** Framer Motion, GSAP, Lenis (Smooth Scrolling)
- **Physics:** Matter.js
- **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables for the AI assistant:
   - Copy `.env.example` to `.env.local`.
   - Add your [Groq API Key](https://console.groq.com/): `GROQ_API_KEY=your_key_here`.

### Local Development

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📦 Build & Deploy

To create an optimized production build:
```bash
npm run build
npm start
```

### Deployment (Vercel)

This project is highly optimized for deployment on [Vercel](https://vercel.com).
1. Connect your repository to Vercel.
2. Add the `GROQ_API_KEY` to your Vercel Environment Variables.
3. Deploy!

---
*Crafted with ❤️ by Nishit Parikh.*
