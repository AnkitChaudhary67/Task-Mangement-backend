require('dotenv').config();
const express=require('express');
const app=express();
require("./db/db")
const cors=require('cors');
const router=require('./Routes/routes')
const PORT= process.env.PORT || 8003;
const fileUpload = require("express-fileupload")
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(express.json());


app.use(router);

app.listen(PORT,()=>{
    console.log(`Server start at ${PORT}`);
})