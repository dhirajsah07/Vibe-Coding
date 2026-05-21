# AURELIA | Luxury Fashion

Aurelia is a modern, cohesive, multi-page luxury fashion website featuring a sleek minimalist design and an AI Concierge. It is designed to provide a premium e-commerce experience.

## Features

- **Minimalist Editorial Design**: Uses a curated color palette of Obsidian (#0A0A0A), Champagne Gold (#C5A059), and Pure White for a premium look.
- **Dynamic Frontend**: Glassmorphism header, smooth fade-in scroll animations using the Intersection Observer, and a slide-out cart drawer.
- **Global Cart**: Cart state is managed seamlessly across all pages (Shop, Brand Story, Contact, Checkout) using `localStorage`.
- **AI Concierge**: A Python-powered digital stylist built directly into the UI as a Floating Action Button, capable of answering inquiries about materials, pricing, and shipping.
- **Robust Backend**: A FastAPI backend that securely validates requests using Pydantic, serves the frontend assets, and provides product/payment simulated APIs.
- **Dockerized**: Containerized for easy deployment to cloud services.

## Technology Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+), Fetch API
- **Backend**: Python 3, FastAPI, Uvicorn, Pydantic
- **Deployment**: Docker, Google Cloud Run

## Project Structure

```
.
├── backend/
│   ├── main.py            # FastAPI application & API endpoints
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── index.html         # Home / Shop page
│   ├── about.html         # Brand Story page
│   ├── contact.html       # Inquiry form page
│   ├── checkout.html      # Secure checkout page
│   ├── style.css          # Global styles & animations
│   └── script.js          # Cart logic, observer, and API calls
├── Dockerfile             # Container configuration for Cloud Run
└── .dockerignore          # Ignored files for Docker build
```

## Running Locally

To run the application locally on your machine:

1. **Ensure you have Python 3.10+ installed.**
2. **Install the backend requirements:**
   ```bash
   pip install -r backend/requirements.txt
   ```
3. **Run the Uvicorn server:**
   ```bash
   uvicorn backend.main:app --reload
   ```
4. **Open your browser** and navigate to `http://127.0.0.1:8000` to view the website.

## Deployment

This project is configured to run as a single unified service (FastAPI serving static files alongside the APIs). It is ready for deployment on **Google Cloud Run**.

To deploy using the Google Cloud CLI:
```bash
gcloud run deploy aurelia-app --source . --allow-unauthenticated
```
