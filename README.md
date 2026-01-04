# ShopIQ

Analyze e-commerce product reviews, eliminate fake reviews using AI, and present genuine insights.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Copy `.env.example` to `.env.local` and add your Gemini API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and replace `your_gemini_api_key_here` with your actual Gemini API key.

## Build for Production

```bash
npm run build
npm run start
```