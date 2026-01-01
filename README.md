# ShopIQ

Analyze e-commerce product reviews, eliminate fake reviews using AI, and present genuine insights.

## Getting Started

First, install dependencies in each folder:

```bash
# from project root (run twice)
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

Then, run the development server:

```bash
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run backend (development):

```bash
# from project root
cd backend && npm run dev
```

Run both services for development (two terminals):

```bash
# in terminal 1
cd frontend && npm run dev
# in terminal 2
cd backend && npm run dev
```

Build and start for production:

```bash
# build
cd frontend && npm run build && cd ..
cd backend && npm run build && cd ..

# start
cd frontend && npm run start && cd ..
cd backend && npm run start && cd ..
```