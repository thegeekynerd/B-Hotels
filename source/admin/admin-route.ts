import express, { Router, Request, Response } from 'express';

import { userDetails } from '../models/user-details';
import {hotelDetails} from '../models/hotels-details';

const admin:Router = express.Router();

admin.get('/',(req:Request, res:Response)=>{
    res.json({status:200, response:"This is admin module"});
});

admin.post('/addUser',(req:Request, res:Response)=>{
    console.log(req.body);
    for(const e in req.body){
        if(!req.body[e])
        {
            console.log({status:404, error:'Bad request.'});
            res.json({status:404, error:'Bad request.'});
            return;
        }
    }

    const userD = new userDetails({
        name:req.body.name,
        username:req.body.username,
        password:req.body.password

    });
    userDetails.create(userD, (err,doc)=>{
        if(err)
        {
            console.log(err);
            res.json({status:404, error:"Database error"});
        }
        else
        {
            res.json({status:200 , doc});
        }
    });

    // res.json('This is '+req.body.hel);
});

admin.post('/addHotels', (req:Request, res:Response)=>{
    // interface hotelD{
    //     hotel_id?: number,
    //     name:string,
    //     totalNumberOfRooms:number,
    //     numberofRoomsAvailable:number,
    //     city:string,
    //     pincode:number,
    //     contactNumber:string
        
        
    // };
    /*
    request 
    {
        "name":"",
        "totalNumberOfRooms":,
        "numberofRoomsAvailable":,
        "city":"",
        "cityCode":
        "pincode":,
        "contactNumber":""
    }
     */

    console.log(req.body);
    // for(const e in req.body){
    //     if(!req.body[e])
    //     {
    //         console.log({status:404, error:'Bad request.'});
    //         res.json({status:404, error:'Bad request.'});
    //         return;
    //     }
    // }
    // const enrty = new hotelDetails({
    //     name:req.body.name,
    //     totalNumberOfRooms:req.body.totalNumberOfRooms,
    //     numberofRoomsAvailable:req.body.numberofRoomsAvailable
    // });
    // console.log(enrty);
    
    // hotelDetails.create(enrty, (err:any,doc:any)=>{
    //             if(err)
    //             {
    //                 console.log(err);
    //                 res.json({status:404, error:"DB error"});
    //             }
    //             else
    //             {
    //                 res.json({status:200 , doc});
    //             }
    //         });

    const entries: [] = req.body.entries

    hotelDetails.collection.insertMany(entries,(err,docs)=>{
        if(err)
        {
            console.log(err);
            res.json({status:404, error:"DB error"});
        }
        else
        {
            res.json({status:200 , docs});
        }
    });

    // console.log(entries);
    // res.json({status:200, entries});
});


//for collections
admin.get('/deleteHotels',(req:Request, res:Response)=>{
    const x = hotelDetails.collection.drop();
    res.json({status:200, response:`Deleted: true`});
});

export default admin;