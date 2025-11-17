# **Calmora Admin Panel – Web Dashboard Documentation**

![Calmora Logo](public/images/calmora_circle_crop.png)
---


A React-based **Admin Dashboard** for managing the Calmora mental health platform.  
This dashboard connects to the **Calmora API** to manage specialists and articles approvals.

---

## 📌 Table of Contents
1. Overview  
2. Tech Stack  
3. Project Structure  
4. Installation & Setup  
5. Environment Variables  
6. Features  
7. Admin Capabilities  
8. Running the Server  
9. Important URL Configuration Notes  

---

## 🎯 Overview

The Calmora Admin Dashboard allows system administrators to:

- Approve or reject newly registered **specialists**
- Approve, or unpublish **submitted articles**
- Ban or manage approved specialists  
- Monitor platform activity  
- Communicate with the API 

This is a **web admin-only** system and works side-by-side with the Calmora mobile app.

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend Framework | **React.js** |
| State/Data | Hooks, Context |
| UI | Tailwind / Custom UI |
| API Calls | **Axios / Fetch** |

---

## 📁 Project Structure

```
/src
  /components
  /pages
  /services
  App.jsx
  authProvider.jsx
  dataprovider.js
  index.css
  main.jsx
  socket.js
  socketContext.js
.env
```

---

## 🔧 Installation & Setup

### 1. Clone the repository
```sh
git clone https://github.com/<your-repo>/calmora-admin.git
cd calmora-admin
```

### 2. Install dependencies
```sh
npm install
```

### 3. Create `.env`
```
REACT_APP_GOOGLE_MAPS_API_KEY=
REACT_APP_API_URL=your_backend_api_url
REACT_APP_SOCKET_URL=your_socket_server_url
```

> ⚠ **IMPORTANT:**  
> Inside the project, **multiple files contain:**  
> ```
> const API_URL = "";
> const SOCKET_URL = "";
> ```  
> You **must replace these manually** with your actual deployed URLs.  
> The admin panel will NOT function unless these are updated.

---

## 🧩 Features

- 🔐 Admin authentication  
- 👩‍⚕️ Review pending specialists  
- ✔ Approve / ❌ Reject specialists  
- ✏ Manage approved specialists  
- 📚 Manage articles (approve / unpublish)  
- 🛑 Ban specialists  
- 📍 Google Maps UI for specialist clinic location *(optional)*  

---

## 🛠 Admin Capabilities

### **1. Specialist Management**
- View pending registrations  
- See full application details (documents, info, experience)  
- Approve or reject specialist  
- Manage approved specialists  
- Unpublish or ban specialist if necessary  

---

### **2. Article Management**
- View all submitted mental health articles  
- Approve articles for app publishing  
- Unpublish or delete articles  
- Manage article revisions  

---

## ▶ Running the Admin Dashboard

### Development Mode
```sh
npm run dev
```

### Production Build
```sh
npm run build
```

Then deploy `/build` to:
- Vercel  
- Netlify  
- Cloudflare Pages  
- Custom hosting  

---

## ⚠ IMPORTANT URL CONFIGURATION

The Calmora Admin Dashboard communicates with **two servers**:

### **1. API Backend**
Used for REST routes  
```
const API_URL = "https://your-api.com";
```

### **2. Socket Server**
Used for real-time admin notifications  
```
const SOCKET_URL = "https://your-socket-server.com";
```

> These appear **in multiple files**, not just `.env`.  
> Always replace them before deployment.

---

## ✔ Admin Dashboard Ready

You may now use the admin dashboard to manage:

- Specialist registrations  
- Article publications  
- System bans  


