import express from 'express'
import "dotenv/config"
import cors from "cors"
import { connectDB } from './config/connect_db.js'
import bodyParser from 'body-parser'
import router from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
const app = express()
const port = 4000

connectDB()
app.use(cors({origin:process.env.CORS_ORIGIN, credentials:true}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Backend Started")
})

app.use("/api/user",router)

app.listen(port,(req,res)=>{
    console.log(`Backend Started on http://localhost:${port}`);
    
})