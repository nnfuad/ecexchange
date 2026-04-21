#  ECExchange

A full-stack MERN web application for university students to **share, discover, and manage academic resources**.

**Live Demo:** https://ecexchange.vercel.app

---

##  Features

###  Resource Sharing

* Upload notes, slides, lab reports, etc.
* Organized by **semester → course**
* Supports multiple file types (PDF, DOCX, PPT, etc.)
* Stored securely using **Cloudinary**

###  Smart Search

* Search resources globally
* Filter by:

  * Semester
  * File type
* Fast retrieval from MongoDB

### Authentication

* JWT-based login/signup system
* Secure protected routes
* Upload/delete restricted to authenticated users

###  User Features

* Upload files
* Delete own uploads
* View uploader info

---

##  Tech Stack

### Frontend

* React (Vite)
* React Router
* CSS (custom styling)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Cloud & Deployment

* Frontend: Vercel
* Backend: Render
* File Storage: Cloudinary

---

##  Project Structure

```
client/
  src/
    components/
    pages/
    data/
server/
  src/
    routes/
    models/
    config/
    middleware/
```

Full structure available here: 

---

##  Environment Variables

### Frontend (.env)

```
VITE_API_URL=https://ecexchange-api.onrender.com
```

### Backend (.env)

```
PORT=5050
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

EMAIL_USER=...
EMAIL_PASS=...
```

---

##  Run Locally

### 1. Clone repo

```
git clone https://github.com/nnfuad/ecexchange.git
cd ecexchange
```

### 2. Install dependencies

```
cd client && npm install
cd ../server && npm install
```

### 3. Run backend

```
cd server
node src/server.js
```

### 4. Run frontend

```
cd client
npm run dev
```

---

##  API Endpoints

### Auth

* `POST /api/auth/signup`
* `POST /api/auth/login`

### Resources

* `GET /api/resources/:semester/:courseCode`
* `GET /api/resources?search=&semester=&type=`
* `POST /api/resources/upload`
* `DELETE /api/resources/:id`

---

## 📸 Demo

Visit:
👉 https://ecexchange.vercel.app

Try:

* Browsing semesters
* Uploading notes
* Searching resources

---

##  Known Limitations

* Email OTP may fail on some deployments (SMTP restrictions)
* No file preview for certain formats (e.g., DOCX)
* No pagination yet for large datasets

---

##  Future Improvements

*  Chatbot assistant
*  Analytics dashboard
*  Upvote / rating system
*  Download tracking
*  ML-based recommendation system

---

##  Author

**Nur Nafis Fuad**
Electrical & Computer Engineering
ML & Full Stack Enthusiast

---

## ⭐ If you like this project

Give it a star on GitHub and share feedback.😊
