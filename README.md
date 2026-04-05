# CryTrack Admin Panel

This repository contains the administrative web dashboard for the **CryTrack** application. It is divided into an Express/Node.js backend API and a React frontend.

## 📁 Repository Structure

*   **/adminBackend**: Node.js & Express.js backend. Handles API requests, database operations (MongoDB), and authentication.
*   **/adminFrontend**: React frontend application (built with Create React App). Provides the UI for administrators to manage the platform.

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Running locally, or a MongoDB Atlas cluster URI)
*   Git

---

## 🚀 Getting Started for Collaborators

Follow these steps to set up the project on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/Alihaider0007/CryTrack-Admin.git
cd CryTrack-Admin
```

### 2. Configure & Run the Backend

Open a terminal and navigate to the backend directory:
```bash
cd adminBackend
```

**Install dependencies:**
```bash
npm install
```

**Set up environment variables:**
Create a file named `.env` inside the `adminBackend` folder and add securely required keys (ask the project admin for exact values if unsure). It should look something like this:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/crytrack
JWT_SECRET=your_super_secret_jwt_key
```

**Start the backend server:**
```bash
npm run dev
# The backend will run on http://localhost:5000 by default using nodemon
```

### 3. Configure & Run the Frontend

Open a **new** terminal window and navigate to the frontend directory:
```bash
cd adminFrontend
```

**Install dependencies:**
```bash
npm install
```

**Set up environment variables:**
Create a file named `.env` inside the `adminFrontend` folder. Point it to your running backend:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start the frontend application:**
```bash
npm start
# The React app will automatically open in your default browser at http://localhost:3000
```

## 🤝 Contribution Guidelines
1. Always create a new branch before making changes: `git checkout -b feature/your-feature-name`
2. Keep your commits clean and descriptive.
3. Push your branch and open a Pull Request for review.
