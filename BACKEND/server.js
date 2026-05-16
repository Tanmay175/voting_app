import express from "express"
import dotenv from "dotenv"
import connectdb from "./db.js"
import userRoutes from "./routes/userRouters.js"
import candidateRoutes from "./routes/candidateRoutes.js"
import cors from "cors"



dotenv.config()
const app = express()

app.use(express.json())  
app.use(cors())

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

connectdb()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("server is running")
})