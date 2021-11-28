import express , {Application, Request, Response} from "express";
import mongoose, { Connection, Mongoose} from "mongoose";
import bodyParser from 'body-parser';

import User from './user/user-route';
import Admin from './admin/admin-route';

const app:Application = express();

// const mongodb:string = "mongodb://localhost:27017/bhotels";
const mongodb:string = "mongodb+srv://ah7886:thisisatestdatabase@cluster0.oefpk.mongodb.net/bhotels?retryWrites=true&w=majority";
mongoose.connect(mongodb);
const db:Connection = mongoose.connection;
db.once('open', ()=>console.log("Connection made to DB"));
db.on('error', (error)=>console.log(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/user', User);
app.use('/admin',Admin);

app.get('/', (req:Request , res:Response)=>{
    res.json({status:200, response: "Hello"});
});


const port = process.env.PORT||8080;
app.listen(port, ()=>{
    console.log(`Server running at ${port}`);
});

