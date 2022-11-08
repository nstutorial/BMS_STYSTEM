 require('dotenv').config();
 const mongoose = require("mongoose");

mongoose.connect(process.env.URL);

const express = require('express');
const app = express();

//middleware
const isBlog =require("./middlewares/isBlog");
app.use(isBlog.isBlog)

//admin routes
const admin_route = require('./routes/adminRoute');
app.use('/',admin_route);

//user routes
const user_route = require('./routes/userRoute');
app.use('/',user_route);

//blog routes
const blogRoute = require('./routes/blogRoute');
app.use('/',blogRoute);

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`server is running at ${port}`);
})