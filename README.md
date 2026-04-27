# 🏦 Punjab & Sindh Bank — Smart Banking Dashboard

> A next-generation intelligent banking web application built for the hackathon, featuring AI-powered insights, fraud detection, and device-aware security.

**🌐 Live Demo:** [www.techfaizan.com](http://www.techfaizan.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Test Credentials](#test-credentials)
- [Project Structure](#project-structure)
- [Future Scope](#future-scope)
- [Deployment](#deployment)

---

## Overview

This project is a smart banking web application developed for a hackathon, designed around the real-world needs of Punjab & Sindh Bank customers. It combines financial data visualization, AI-assisted insights, UPI fraud detection, and device-level security — all in a unified, modern dashboard experience.

The application is built to showcase how AI and intelligent systems can be layered on top of traditional banking infrastructure to enhance both usability and security.

---

## Features

### 🔐 Authentication & OTP Verification
- Phone number-based login with OTP verification powered by **Firebase Authentication**
- A test number is pre-configured in Firebase for seamless hackathon demonstrations
- Secure session handling with redirect to the personal dashboard post-login

### 📊 Financial Dashboard
- Visual representation of account data through **charts and graphs**
- Displays **total balance**, **spending breakdown**, and **transaction history**
- Data is pulled from individual transaction records stored in MongoDB
- Designed to scale into a full personal finance management tool

### 📁 CSV Bank Statement Upload
- Users can upload their Punjab & Sindh Bank statement in **CSV format**
- The system parses the file, extracts individual transactions, and stores them in **MongoDB**
- Extracted data powers dashboard visualizations and all personalization features
- Enables the application to work with real user financial history

### 📷 QR Code Payment Scanner
- Scan any UPI QR code to extract **receiver details and UPI address**
- The UPI address is run through a **rule-based fraud detection engine** that:
  - Cross-checks the receiver against the user's frequent transaction history
  - Assigns a **risk score** to each transaction (Low / Medium / High)
  - Saves instances of medium-risk transactions for review
  - **Holds transactions** flagged as high-risk or involving large amounts
- Demonstrates the protective layer a smart banking app can provide before money moves

### 🛡️ Device Fingerprinting & Security
- On login, the application generates a **unique device key** from browser metadata
- This key is stored and associated with the user's account
- If a login is detected from a **new or unrecognized device**, the system flags it and requires additional verification (**2FA**)
- Protects users against unauthorized account access from unknown devices

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React / Next.js |
| Authentication | Firebase (Phone OTP) |
| Database | MongoDB |
| Hosting | Vercel |
| Domain | Hostinger |
| CDN & Protection | Cloudflare |
| Fraud Detection | Rule-based engine (UPI risk scoring) |
| Device Security | Browser fingerprinting |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB URI
- Firebase project with Phone Authentication enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/psb-smart-banking.git
cd psb-smart-banking

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Firebase config, MongoDB URI, and other keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app locally.

---

## Test Credentials

For hackathon demo purposes, a test phone number is pre-configured in the Firebase project:

| Field | Value |
|---|---|
| **Test Phone Number** | `+91 97736 66243` |
| **Test OTP** | `123456` |

> This number is registered as a test number in Firebase Console and can be used multiple times without consuming SMS quota.

**Login URL:** [www.techfaizan.com/login](http://www.techfaizan.com/login)

---

## Project Structure

```
├── app/
│   ├── login/              # OTP login page (Firebase Auth)
│   ├── dashboard/          # Main financial dashboard
│   ├── upload/             # CSV bank statement uploader
│   └── scan/               # QR code payment scanner
├── components/             # Reusable UI components
├── lib/
│   ├── firebase.js         # Firebase config & auth
│   ├── mongodb.js          # MongoDB connection
│   ├── deviceFingerprint.js# Device key generation
│   └── fraudEngine.js      # Rule-based UPI risk scoring
├── models/                 # MongoDB schemas (Transactions, Users, Devices)
├── public/                 # Static assets
└── .env.example            # Environment variable template
```

---

## Future Scope

The following features are planned for the next development phase:

### 🤖 AI-Powered Financial Assistant
- Integration of an **LLM** that can answer personalized questions based on the user's own transaction data
- Conversational interface for querying spending patterns, balance history, and account summaries
- **Savings recommendations** and goal-tracking suggestions driven by user behavior

### 📈 Live Market Data Integration
- **Gold price API** integration to display real-time gold rates within the dashboard
- **Stock market data** feeds for users who hold investments
- Unified view of liquid and non-liquid assets

### 🧠 NLP-Based Trend Analysis
- Natural language processing to identify and narrate spending trends (e.g., "Your dining expenses increased 40% this month")
- Automated monthly financial summaries in plain language
- Smart categorization of transactions using NLP

### 🚨 ML-Based UPI Fraud Detection
- Replace the current rule-based system with a trained **machine learning model**
- Model will evaluate UPI addresses, transaction amounts, time patterns, and receiver history
- Continuous learning from flagged transactions to improve accuracy over time

### 🌍 Geolocation-Based Security
- Track login and transaction locations using **browser geolocation**
- Flag and block login attempts from locations **unreasonably far** from recent activity
- Add an extra layer of protection against international fraud and account takeovers

---

## Deployment

The application is deployed using the following stack:

- **Vercel** — Continuous deployment from the GitHub repository
- **Hostinger** — Custom domain registration (`techfaizan.com`)
- **Cloudflare** — DNS management, CDN, and DDoS protection layer

Any push to the `main` branch triggers an automatic deployment on Vercel.

---

## 🙌 Acknowledgements

Built with ❤️ for the Punjab & Sindh Bank Hackathon.

---

## 📄 License

This project is built for hackathon and educational purposes.
