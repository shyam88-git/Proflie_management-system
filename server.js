const express=require('express');
const app=express();
const cors=require('cors');
const dotEnv=require('dotenv');
const mongoose=require('mongoose');


//configure the corse

app.use(cors());


//configure the express to receive the form data

app.use(express.json());


//configure dotenv

dotEnv.config({path:'./.env'});


const port=process.env.PORT||5000;

//conigure the mongodb connection


//simple request

app.get('/',(request,response)=>{

    response.send(`<h2>Welcome to online shopping application backend </h2>`);


});

//connect to mongodb connection

mongoose.connect(process.env.MONGO_DB_LOCAL_URL).then((response)=>{
    console.log("Connected to mongodb successfully..........");



}).catch((error)=>{

    console.error(error);
    process.exit(1);
});

//router configuration

app.use('/api/users',require('./router/userRouter'));
app.use('/api/posts',require('./router/postRouter'));
app.use('/api/profiles',require('./router/profileRouter'));


app.listen(port,()=>{

    console.log(`Express Server is started at PORT:${port}`);
});







