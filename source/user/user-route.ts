import express, { Router , Request, Response} from 'express';

import {userDetails} from '../models/user-details';
import { hotelDetails } from '../models/hotels-details';

const user:Router = express.Router();

user.get('/',(req:Request, res:Response)=>{
    
    res.send("This is user module.")
});

user.post('/hello',(req:Request, res:Response)=>{
    res.json({name:req.body.hel});
});

// User.post('/addUser',(req:Request, res:Response)=>{

//     const userD = new userDetails({
//         name:"Aniket Hazra",
//         username:"ah7886",
//         password:"1234"

//     });
//     userDetails.create(userD, (err,doc)=>{
//         if(err)
//         {
//             console.log(err);
//             res.json({status:404});
//         }
//         else
//         {
//             res.json({status:200 , userD});
//         }
//     });

//     // res.json('This is '+req.body.hel);
// });

user.post('/addHotel', (req:Request, res:Response)=>{
    // interface hotelD{
    //     name:string,
    //     totalNumberOfRooms:number,
    //     numberofRoomsAvailable:number,
    // };
    /*
    request 
    {
        "name":
        "totalrooms":
        "totalavailable":
    }
     */

    console.log(req.body);
    for(const e in req.body){
        if(!req.body[e])
        {
            console.log({status:404, error:'Bad request.'});
            res.json({status:404, error:'Bad request.'});
            return;
        }
    }
    const enrty = new hotelDetails({
        name:req.body.name,
        totalNumberOfRooms:req.body.totalrooms,
        numberofRoomsAvailable:req.body.totalavailable
    });
    // console.log(enrty);
    
    hotelDetails.create(enrty, (err:any,doc:any)=>{
                if(err)
                {
                    console.log(err);
                    res.json({status:404, error:"DB error"});
                }
                else
                {
                    res.json({status:200 , doc});
                }
            });
});

export default user;