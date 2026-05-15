import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRouters.js"
import candidateRoutes from "./routes/candidateRoutes.js"

dotenv.config()
const app=express()

const PORT=process.env.PORT || 5000

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);



app.listen(PORT,()=>{
    console.log("server is runing")
})