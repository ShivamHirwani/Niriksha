# Niriksha - AI Based Dropout Prediction & Counseling System
by Team AnveshanX
## Overview
Niriksha is an AI-powered early warning dashboard built to predict student dropouts and facilitate timely interventions in technical educational institutions. Designed for the realities of Indian colleges, Niriksha merges attendance, grades, and fee data from Excel/CSV sources, highlights at-risk students, and sends crucial alerts to stakeholders without expensive analytics platforms or major IT changes.

### Purpose
This system facilitates access to mentorship and guidance using AI automation, streamlines communication between students and mentors, and provides risk assessment with early intervention capabilities through data analysis.

### Key Features
- **User Authentication**: Secure login system for students, teachers, counselors, and administrators
- **Student Data Management**: Comprehensive student profile and performance tracking
- **Risk Assessment**: AI-driven analysis to identify students at risk of dropping out
- **Dashboard Monitoring**: Real-time visualization of student status and alerts
- **Email Notifications**: Automated communication system for mentors
- **PWA Support**: Offline accessibility through Progressive Web App technology
- **Data Import/Export**: Easy data management capabilities

## 🛠️ Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **PWA**: Service workers and manifest for offline support

### Backend
- **Language**: Python
- **Framework**: Flask
- **Database**: SQLAlchemy (ORM)
- **Authentication**: JWT-based security
- **Email**: SMTP with templating system

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+
- Python 3.x
- npm/yarn package manager

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
SMTP_SERVER=your_smtp_server
SMTP_PORT=your_smtp_port
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
```
## 🏗️ Development

### Building for Production
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

### Project Structure
```
AI-Counselling-System/
├── backend/
│   ├── application/
│   │   ├── api.py          # Core API routes
│   │   ├── auth.py         # Authentication logic
│   │   ├── models.py       # Database models
│   │   ├── students_func.py # Student-related business logic
│   │   ├── mail_to_mentor.py # Email notification system
│   │   └── utils.py        # Utility functions
│   └── app.py              # Main application entry point
└── frontend/
    ├── src/
    │   ├── components/     # UI components
    │   ├── context/        # State management
    │   ├── hooks/          # Custom React hooks
    │   ├── services/       # API services
    │   └── utils/          # Utility functions
    └── public/             # Static assets
```

## 🔧 Key Components

### Frontend Components
- **Dashboard**: Main overview with analytics and metrics
- **Student Management**: List and detail views for student data
- **Risk Assessment**: Visualization of student risk levels
- **Alerts System**: Notification management
- **Data Import**: CSV/excel data import functionality
- **Reports**: Generate and export reports

### Backend Modules
- **API Layer**: RESTful endpoints for frontend communication
- **Authentication**: User registration and login system
- **Student Functions**: Business logic for student data operations
- **Email System**: Automated notification service
- **Database Models**: ORM definitions for data persistence

## 🔒 Security Features
- JWT-based authentication
- Secure password handling
- Role-based access control
- Data encryption for sensitive information

## Contact
Contact
Project Lead: 

Email: 

Empowering institutions to predict, prevent, and reduce dropouts — one student at a time.

## 📄 License
This project is developed as part of the Smart India Hackathon and is intended for educational and demonstration purposes.

## 📞 Support
For issues and questions, please contact the development team through the SIH platform.
