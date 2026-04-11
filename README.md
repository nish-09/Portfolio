# Nishit Parikh — Portfolio

Personal portfolio site built with [Next.js](https://nextjs.org). This repository is **private** and **not open source**: the code is not licensed for reuse, redistribution, or contribution.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

The optional **Astra** chat assistant calls Groq from a server route. Do **not** commit secrets.

1. Copy `.env.example` to `.env.local`.
2. Set `GROQ_API_KEY` to your [Groq](https://console.groq.com/) API key.

Files matching `.env` and `.env.*` (except `.env.example`) are ignored by Git—see `.gitignore`.

## Build

```bash
npm run build
npm start
```

## Deploy

Compatible with [Vercel](https://vercel.com) or any Node host. Add `GROQ_API_KEY` in the host’s environment settings if you use the assistant.
