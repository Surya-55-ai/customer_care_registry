# Customer Care Registry (MERN Stack)

A complaint management system where **users** raise complaints, chat with an **agent**,
and track status, while an **admin** manages users, agents, categories, and all complaints.

## Folder Structure

```
project/
├── server/            # Express + MongoDB backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── app.js
└── client/            # React frontend
    └── src/
        ├── components/
        ├── admin_components/
        ├── agent_components/
        ├── context/
        ├── api.js
        └── App.js
```

## 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string (local Mongo or MongoDB Atlas) and a
strong `JWT_SECRET`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/customer_care_registry
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Start MongoDB locally (or use Atlas), then run:

```bash
npm run dev     # requires nodemon, installed as a devDependency
# or
npm start
```

The API will run at `http://localhost:5000`. Visiting `http://localhost:5000/` in a
browser should show "Customer Care Registry API is running".

## 2. Frontend Setup

Open a **second terminal**:

```bash
cd client
npm install
cp .env.example .env
npm start
```

The app opens at `http://localhost:3000`.

## 3. Using the App

1. Go to **Sign Up**, create an account with type `user` (this is a normal customer).
2. Create a second account with type `agent` (a support agent).
3. Create a third account with type `admin` (to manage the platform).
4. Log in as **admin** → open the **Categories** tab and add a couple of complaint
   categories (optional but nice to have).
5. Log in as **user** → click **Raise Complaint**, fill in the form, and submit.
6. Log in as **admin** → go to **Complaints**, assign the complaint to your agent
   account, and optionally update its status.
7. Log in as **agent** → the dashboard shows assigned complaints; click one to open
   the chat panel and reply, or mark it resolved.
8. Log in as **user** again → go to **ChatWithAgent** to continue the conversation, or
   **MyComplaints** to see status update live.

## Notes

- Passwords are hashed with bcrypt; auth uses JWT stored in `localStorage` on the client.
- Chat updates by polling every 4 seconds (no separate WebSocket server required to run
  this project — simpler to set up before a deadline).
- If `npm install` in the client shows peer-dependency warnings from `react-scripts`,
  they can be safely ignored; the app has been structured for React 18 + CRA 5.
# customer_care_registry
