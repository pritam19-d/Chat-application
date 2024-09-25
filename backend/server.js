import express from "express";
import chats from "./data/data.js";
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
const PORT = process.env.PORT || 8000;

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Cookie parser middleware
app.use(cookieParser())

app.get("/",(req, res)=>{
  res.send("API is Running.")
})

app.get("/api/chats", (req, res)=>{
  res.send(chats)
})

app.get("/api/chats/:id", (req, res)=>{
  const chat = chats.find((cht)=> cht._id === req.params.id)
  res.send(chat)
})

app.use("/api/user", userRoutes)

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>console.log(`Server is up on port ${PORT}`.blue.bold.underline))