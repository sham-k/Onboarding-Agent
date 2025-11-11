# 🧠 AI Onboarding Agent

An intelligent onboarding assistant powered by **Next.js**, **n8n**, and **OpenAI**, designed to capture user inputs, summarize them with AI, and automate follow-up workflows such as email and Google Sheets updates.

---

## 🚀 Overview

The AI Onboarding Agent streamlines user onboarding by:
- Capturing **Name, Email, and Summary** via a sleek frontend form.  
- Generating an **AI-powered summary** using OpenAI.  
- Storing user data in **Google Sheets** for tracking.  
- Sending personalized **confirmation emails** through Gmail integration.  

All powered by **n8n** automations and a **Next.js frontend**.

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | Next.js (React 18), TypeScript, Tailwind CSS |
| Backend Automation | n8n (Docker) |
| AI | OpenAI GPT Model |
| Integrations | Google Sheets, Gmail |
| Dev Tools | Docker, Ngrok, GitHub |

---

## 🧩 Architecture

```
User Form (Next.js)
        ↓
Webhook → n8n Workflow
        ↓
Code Node → OpenAI Summarizer
        ↓
Google Sheets + Gmail Automation
        ↓
AI Summary Response → Frontend Display
```

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sham-k/onboarding-agent.git
cd onboarding-agent
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create `.env.local`
```bash
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-ngrok-url/webhook/onboarding-agent
```

*(Replace the webhook URL with your running n8n endpoint.)*

### 4️⃣ Run the Frontend
```bash
npm run dev
```

Your app will be live at:  
👉 **http://localhost:3000**

---

## 🐳 n8n Docker Setup

```bash
docker compose up -d
```

Once n8n is running:
- Access: http://localhost:5678  
- Set up your workflow with **Webhook**, **OpenAI**, **Google Sheets**, and **Gmail** nodes.  
- Connect your **Google OAuth** credentials for Sheets and Gmail integrations.

---

## 📤 Deployment

You can deploy your Next.js frontend on:
- **Vercel** (recommended)
- **Netlify**
- **Render**

Make sure to set the same environment variable (`NEXT_PUBLIC_N8N_WEBHOOK_URL`) in your deployment environment.

---

## 📬 Demo Flow

1. User submits onboarding form.  
2. n8n generates AI summary using OpenAI.  
3. Data is logged to Google Sheets.  
4. Personalized email sent to the user.  
5. Summary displayed back on the frontend.

---

## 💡 Future Enhancements

- 🔊 Voice-based onboarding via Speech-to-Text.  
- 🧩 CRM integration (HubSpot / Notion).  
- 🔒 Authentication & admin dashboard.  
- 🧠 AI feedback loop for smarter summaries.  

---

## 👨‍💻 Author

**[Shamar Knibbs](https://www.linkedin.com/in/shamar-knibbs)**  
Frontend Engineer • AI Builder • Product Innovator  
[GitHub](https://github.com/sham-k) | [Portfolio](https://shamar.dev)

---

## 📝 License

MIT © 2025 Shamar Knibbs