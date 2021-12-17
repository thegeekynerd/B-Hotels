import express , {Application, Request, Response} from "express";
import mongoose, { Connection, Mongoose} from "mongoose";
import bodyParser from 'body-parser';
import * as dotenv from "dotenv";

import User from './user/user-route';
import Admin from './admin/admin-route';

dotenv.config({path: __dirname+'/.env'});
// console.log(__dirname+'/.env')

const app:Application = express();

// const mongodb:string = "mongodb://localhost:27017/bhotels";
const mongodb:any = process.env.DB_URL;
mongoose.connect(mongodb);
const db:Connection = mongoose.connection;
db.once('open', ()=>console.log("Connection made to DB"));
db.on('error', (error)=>console.log(error));

// console.log(process.env)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/user', User);
app.use('/admin',Admin);

app.use((e:Error,req:Request,res:Response,next:any)=>{
    if(e)
    {
        console.log("lolo",e);
        return res.sendStatus(400).json({resp:"Bad Request!!!"});
        return next();
    }
});

app.get('/', (req:Request , res:Response)=>{
    res.json({status:200, response: "Hello"});
});


const port = process.env.PORT||8080;
app.listen(port, ()=>{
    console.log(`Server running at ${port}`);
});

