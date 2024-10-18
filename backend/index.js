import express from 'express'
import "dotenv/config"
import cors from "cors"
import { connectDB } from './config/connect_db.js'
import bodyParser from 'body-parser'
import router from './routes/user.routes.js'
const app = express()
const port = 4000

connectDB()
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Backend Started")
})

app.use("/api/user",router)

app.listen(port,(req,res)=>{
    console.log(`Backend Started on http://localhost:${port}`);
    
})