# Vendor App Backend

This is the backend server for the **Vendor App**, built with Node.js, Express, and MongoDB (Mongoose).  
It provides RESTful APIs for user authentication, vendors, categories, and reviews.  

---

## Features

- User registration, login, profile, and authentication via JWT
- Vendor creation, management, and categorization
- Category listing
- Customers can review vendors

---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Git](https://git-scm.com/) (optional, but recommended)

---

## Local Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/<your-username>/vendor-app-backend.git
   cd vendor-app-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root of the project:

   ```env
   PORT=5000
   MONGODB_URL=mongodb://localhost:27017/vendorapp
   JWT_SECRET=your-secret-key
   ```

   - Change `MONGODB_URL` to your own MongoDB connection URI if using Atlas.
   - Make sure `JWT_SECRET` is a strong, unpredictable value.

4. **Start MongoDB**

   - For local MongoDB, ensure it is running (`mongod` in terminal).
   - For Atlas, ensure network and credentials are configured.

5. **Run the Server**

   ```bash
   npm start
   ```

   Or, during development with live reload:

   ```bash
   npm run dev
   ```

6. **API Endpoints**

   The server runs by default at [http://localhost:5000](http://localhost:5000).

   - **Auth**: `/api/auth/`
     - `POST /signup` — Register new user
     - `POST /login` — User login
     - `GET /profile` — View profile (JWT required)
   - **Vendors**: `/api/vendors/`
   - **Categories**: `/api/categories/`
   - **Reviews**: `/api/reviews/`

   lookup the codebase and frontend for details on request payloads and responses.

---

## Project Structure

```
src/
  |-- controllers/
  |-- models/
  |-- routes/
  |-- middlewares/
  |-- config/
  |-- App.js
  |-- server.js
.env
README.md
```

---

## Useful Commands

| Command         | Description      |
| --------------- | --------------- |
| `npm install`   | Install node modules |
| `npm start`     | Start server (production) |
| `npm run dev`   | Start server with nodemon (development) |

---

## Notes

- Make sure to set up and secure your `.env` file; don't commit it to version control.
- The `MONGODB_URL` must match your MongoDB deployment settings.

---

## Troubleshooting

- **Port already in use?**  
  Make sure nothing else is running on your selected port (default: 5000).
- **Cannot connect to MongoDB?**  
  Double-check your `MONGODB_URL` and ensure local MongoDB is running or Atlas details are correct.
- **Invalid credentials or authentication errors?**  
  Make sure `JWT_SECRET` is set and consistent.

---


