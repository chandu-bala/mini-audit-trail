# 📝 Mini Audit Trail Generator  
A full-stack micro web application that automatically tracks changes made to text and generates a detailed audit trail for every saved version.

This project was built as part of an originality-focused, skill-revealing full-stack assignment designed to test:
- Backend–frontend communication  
- Custom diff logic  
- State management  
- Server-side persistence  
- Deployment skills  
- Clean design & architecture  

---

## 🔗 **Live Demo**

### 🌐 Frontend (React + Vercel)
👉 https://mini-audit-trail-8dnzndb8d-chandus-projects-e0ce5ea1.vercel.app/

### 🛠 Backend (Node.js + Express + Render)
👉 https://mini-audit-trail-2l2w.onrender.com/

---

# 📌 Features

### ✍️ **Content Editor**
- User can type or modify text  
- Save version manually  
- Shows live character count  

### 🗂 **Version History Panel**
Each saved version stores:
- Timestamp (formatted using Day.js)  
- Added words  
- Removed words  
- Old & new text lengths  
- Old & new word counts  
- Change summary object  
- Auto-ordering (newest first)

### 🧠 **Diff Engine (Custom)**
Detects:
- Words added  
- Words removed  
- Word count changes  

Custom logic ensures there is **no template or library dependency**, fulfilling originality requirements.

### 💾 **Persistent Storage**
Backend stores all versions in:
```bash
/data/versions.json
```
(inside Render persistent mount)

### ⚛️ **Frontend**
- Built with React  
- Fetches versions dynamically  
- Clean UI  
- Image-integrated content editor  
- Optimized for readability  

### 🌐 **Fully Deployed**
- Backend: Render Web Service  
- Frontend: Vercel Static Hosting  

---

# 🧱 Tech Stack

## Frontend  
- **React (Vite)**
- **Fetch API** for backend communication  
- **Custom CSS** layout  
- **Vercel Deployment**

## Backend  
- **Node.js**
- **Express.js**
- **UUID** for unique version IDs  
- **Day.js** for timestamp formatting  
- **Custom diff algorithm (no libraries)**  
- **File-based storage (JSON)**  
- **CORS enabled**

## Deployment  
- **Frontend → Vercel**  
- **Backend → Render**  
- **Persistent JSON storage → Render Disk (/data)**  

---

# 🔌 API Documentation

## `GET /versions`
Returns a list of all saved versions (newest first).

**Response Example**
```json
[
  {
    "id": "1b49e...",
    "timestamp": "2025-11-30 14:32",
    "addedWords": ["hello"],
    "removedWords": [],
    "oldLength": 0,
    "newLength": 5,
    "oldWordCount": 0,
    "newWordCount": 1
  }
]
```
## `POST /save-version`

Saves a new version and performs diff computation.

**Request Body**
```json
{
  "content": "Your text here"
}
```

**Response**
```json
{
  "id": "uuid",
  "timestamp": "2025-11-30 14:35",
  "addedWords": [...],
  "removedWords": [...],
  "oldLength": 12,
  "newLength": 18,
  "oldWordCount": 3,
  "newWordCount": 4
}
```

---

# ⚙️ Local Development Setup
### **1. Clone repository**

```bash
git clone https://github.com/chandu-bala/mini-audit-trail
cd mini-audit-trail
```

### **2. Backend Setup**
```bash
cd backend
npm install
npm start
```

**Backend runs at:**
`
http://localhost:4000
`

### **3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
`
http://localhost:5173
`


---

# 🚀 Deployment
## Backend (Render)

Connected GitHub repo

Auto-deployment from backend directory

Persistent storage enabled with a **/data** mount

Exposed as a public web service

## Frontend (Vercel)

Deployed from **/frontend**

Build command: `npm run build`

Output directory: **dist**

Points to backend via **API_BASE_URL** inside config.js

---

# 🚀 Future Improvements

- Add Clear History button

- Add word-level colored diff viewer

- Add search in history

- Export to PDF/JSON

- Authentication (optional)

- Sync with database (PostgreSQL/MongoDB)

---

# 👨‍💻 Author

### **Duddela Bala Chandu**

#### Full Stack Developer Intern

---

#⭐ Final Note

This project demonstrates complete full-stack capability:

- Custom backend algorithm

- Clean API

- React frontend

- Deployment mastery

- Persistent storage

- End-to-end integration

