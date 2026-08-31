
import express from "express";
import userRoutes from "./routes/userRoutes.js"
import { connectDB } from "./db/index.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()

const app = express();



app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.json())
app.use(cookieParser())

app.use(async (req, res, next) => {
    const uri = process.env.MONGODB_URI
    if (!uri || uri.includes("<db_password>")) {
        console.error("MONGODB_URI is missing or still contains <db_password> placeholder.")
        return res.status(500).json({ error: "Database configuration error" })
    }
    
    try {
        await connectDB(uri)
        console.log("MongoDB connected in middleware")
        next()
    } catch (err) {
        console.error("MongoDB connection failed:", err.message)
        res.status(500).json({ error: "Failed to connect to database" })
    }
})

app.use("/api", userRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: "Something went wrong on our end." })
})

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/api`);
    });
}

export default app;

