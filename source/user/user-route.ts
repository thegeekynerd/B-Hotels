import express, { Router , Request, Response, response} from 'express';

import {userDetails} from '../models/user-details';
import { hotelDetails, hotelD } from '../models/hotels-details';
import { hotelB, hotelBookings } from '../models/hotel-bookings';
import mongoose, { ObjectId, Schema } from 'mongoose';

const user:Router = express.Router();

user.get('/',(req:Request, res:Response)=>{
    
    res.json({status:200, response:"this is user module"});
});


//Search APIs

user.get('/searchhotels', (req:Request, res:Response)=>{
    /*
    params :
    {
        cityCode:""
    } 
    */
   const cityCode:Number = req.body.cityCode;
   hotelDetails.find({cityCode},(err,doc)=>{
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
// console.log(req);
// res.send(200);
});

user.get('/hoteldetails',(req:Request, res:Response)=>{
    // console.log(req.body.id);
    const _id = new mongoose.Types.ObjectId(req.body.id);
    
    hotelDetails.findById(_id,(err:any,doc:hotelD)=>{
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
    // res.json({status:200, response:_id});
});


// Bookings APIs

async function hotelAvailable(query:any){
    let res;
    try{
        res = await hotelDetails.findById(query.hotelId).exec();
        console.log(res);
        
    }
    catch(err)
    {
        console.log(err);
        return 0;
    }
    return res;
}

user.get('/hotelavailable', (req:Request, res:Response)=>{
    const query = req.body;
    query.bookedFrom = new Date(query.bookedFrom);
    query.bookedTill = new Date(query.bookedTill);
    hotelAvailable(query).then((doc)=>{
        if(doc==0)
        {
            // console.log(response);
            res.json({status:404, doc:'error'});
        }
        else
        {
            if(doc.numberofRoomsAvailable >= query.roomsBooked)
                res.json({status:200, response:true});
            else
                res.json({status:200, response:false});
        }
    });
    
});

user.post('/bookhotel', (req:Request, res:Response)=>{
    /*
    params:
    {
     "bookedBy":
     "bookedById":
     "bookedAt":
     "bookedAtId":
     "roomsBooked":
     "bookedFrom":
     "bookedTill":
    }
    ***date in MM/DD/YYYY format
    */
   const query = req.body;
   const booking_id = Math.floor((Math.random()*1000000)+100000);
//    console.log(booking_id);
   query.booking_id = booking_id;
   query.bookedFrom = new Date(query.bookedFrom);
   query.bookedTill = new Date(query.bookedTill);
//    res.json({bookedAtId:query.bookedAtId, bookedById:query.bookedById});
   hotelBookings.findOne({bookedAtId:query.bookedAtId, bookedById:query.bookedById})
   .then((booking)=>{
       if(booking!=null){
        res.status(200).json({response:"Booking already Made."});
        return null
       }
        else 
        return hotelBookings.create(query);
   })
   .then(bookings=>{
       if(bookings){
           return hotelDetails.findById(bookings.bookedAtId);
       }  
       return null;  
   })
   .then(hoteldetail=>{
       if(hoteldetail==null)
            return null;
       let rooms = hoteldetail.roomsBooked;
       if(rooms==null)
       {
           rooms = []
       }
       rooms.push({bookingId:query.booking_id, blockedFrom:query.bookedFrom, blockedTill :query.bookedTill, numberOfRooms:query.roomsBooked})
    //    console.log(rooms);
    //    res.send("Hello")
       return hotelDetails.findByIdAndUpdate(hoteldetail._id,{roomsBooked:rooms})
   })
   .then(updated=>{
        if(updated==null)
            return null

        res.status(200).json({response:'Booking made Successfully!', booking_id});
   })
   .catch((err)=>{
       console.log(err);
       res.json({status:404,response:'error'});
   });
   
});


//Cancel API
const cancelled = "cancelled";
const completed = "completed";

user.post('/cancelbooking', (req:Request, res:Response)=>{
    /*
    params:
    {
        "booking_id":
    }
    */
    hotelBookings.findOneAndUpdate({booking_id:req.body.booking_id}, {status:cancelled})
    .then(booking =>{
        if(booking==null)
            return null
        // console.log(booking, 'cancelled')
        return hotelDetails.findById(booking.bookedAtId)
    })
    .then(hotel=>{
        if(hotel==null)
            return null
        let rooms:any = [];
        // console.log(hotel);
        hotel.roomsBooked.forEach((obj:any)=>{
            if(obj.bookingId!=req.body.booking_id)
                rooms.push(obj);
        });
        // console.log(rooms)
        return hotelDetails.findByIdAndUpdate(hotel._id, {roomsBooked:rooms});
    })
    .then(updatedHotel =>{
        if(updatedHotel==null)
            res.status(404).json({response:'No booking by this id or some error!!'});
        else
        res.status(200).json({respsonse:"Booking cancelled", booking_id:req.body.booking_id,})
    })
    .catch((err)=>
    {
        console.log(err)
        res.status(500).json({response:'DB error!'})
    });
});




export default user;