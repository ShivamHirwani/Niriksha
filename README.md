# Niriksha - AI Based Dropout Prediction & Counseling System
by Team AnveshanX
## Overview
Niriksha is an AI-powered early warning dashboard built to predict student dropouts and facilitate timely interventions in technical educational institutions. Designed for the realities of Indian colleges, Niriksha merges attendance, grades, and fee data from Excel/CSV sources, highlights at-risk students, and sends crucial alerts to stakeholders without expensive analytics platforms or major IT changes.
## Features
Unified Dashboard: Consolidates attendance, grades, and fee/payment info for holistic student tracking.

Early Risk Alerts: Color-coded notifications (Red, Orange, Yellow) for at-risk students driven by educator-configurable rules and AI.

Automated Notifications: Sends alerts by Email, SMS, or WhatsApp to counselors, parents, and mentors.

CSV-First Design: Integrates with existing spreadsheet/Excel-based workflows; no new infrastructure needed.

User-Configurable: Educators set risk thresholds via an intuitive interface.

Scalable & Modular: Built for seamless pilots and large state-wide rollouts.

Compliance Ready: Role-based access with optional auditing and anonymization.

Roadmap for AI: Hybrid Rule+ML, UDISE+/ShalaDarpan compatibility for future expansion.

## Tech Stack
Backend: Python, Flask, Pandas, Scikit-learn, Celery, PostgreSQL/SQLite

Frontend: React.js, TypeScript, Tailwind CSS, Vite

Notifications: Twilio (SMS), WhatsApp Business API, SendGrid (Email)

Deployment: Vercel

Supported Formats: .csv, .xlsx

## Installation & Deployment
### Frontend Deployment (Vercel)

Login to Vercel

Visit vercel.com and sign in with your GitHub/GitLab/Bitbucket account.

Import Your Repository

Click on “New Project” and select your Niriksha frontend repository from your account.

Add Environment Variables

During the project setup, add the required environment variables in the Vercel dashboard (API URLs, authentication keys, etc.).

Create Deployment

Click “Deploy” to build and launch your frontend application.

Your site will be live at a unique Vercel URL (e.g., https://niriksha.vercel.app).

### Backend Deployment (Render)
Login to Render

Go to render.com and sign in to your account.

Upload Backend Files

Create a new “Web Service” and upload all necessary backend code files for Niriksha.

Run Your Server

Set appropriate environment variables as needed.

Start your backend server via the Render dashboard (ensure the correct build and start commands are configured).

Once deployed, Render will provide you with a public backend URL (e.g. https://niriksha-backend.onrender.com).
## Usage
Upload Data: Import CSV/XLSX (attendance, grades, fees).

Configure Rules: Set risk thresholds on the admin panel.

View Dashboard: Instantly see risk categories and student details.

Notification Triggers: Alerts auto-sent to stakeholders as needed.

Export Reports: Download insights for meetings and compliance.
## Live Demo 
The Niriksha is live and accessible at:

https://niriksha-zeta.vercel.app

Visit the live site to explore core features, dashboard, and see real-time risk alerts in action.
## Contact
Contact
Project Lead: 

Email: 

Empowering institutions to predict, prevent, and reduce dropouts — one student at a time.
