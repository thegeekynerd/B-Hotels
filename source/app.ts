import express , {Application, Request, Response} from "express";
import mongoose, { Connection, Mongoose} from "mongoose";
import bodyParser from 'body-parser';

import User from './user/user-route';

const app:Application = express();

const mongodb:string = "mongodb://localhost:27017/bhotels";
mongoose.connect(mongodb);
const db:Connection = mongoose.connection;
db.once('open', ()=>console.log("Connection made to DB"));
db.on('error', (error)=>console.log(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/user', User);

app.get('/', (req:Request , res:Response)=>{
    res.send("Hello");
});


const port = process.env.PORT||8080;
app.listen(port, ()=>{
    console.log(`Server running at ${port}`);
});

