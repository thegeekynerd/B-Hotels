import express, { Router , Request, Response, response} from 'express';

import {userDetails} from '../models/user-details';
import { hotelDetails, hotelD } from '../models/hotels-details';
import { hotelB, hotelBookings } from '../models/hotel-bookings';
import mongoose, { ObjectId, Schema } from 'mongoose';

const user:Router = express.Router();

user.get('/',(req:Request, res:Response)=>{
    
    res.status(200).json({ response:"this is user module"});
});


//Search APIs

user.get('/searchhotels', (req:Request, res:Response, next:any)=>{
    /*
    params :
    {
        cityCode:""
    } 
    */
//    if(e instanceof SyntaxError)
//    {
//        console.log(e)
//        return res.sendStatus(400).json({
//            error:e
//        })
//    }
//    console.log(req.body)
   const cityCode:Number = req.body.cityCode;
   hotelDetails.find({cityCode},"-_id -roomsBooked",(err: any,doc: any)=>{
    if(err)
    {
        console.log(err);
        res.status(404).json({ error:"DB error"});
    }
    else
    {

        res.status(200).json({doc});
    }
   });   
// console.log(req);
// res.send(200);
});

user.get('/hoteldetails',(req:Request, res:Response)=>{
    // console.log(req.body.id);
    const _id = new mongoose.Types.ObjectId(req.body.id);
    
    hotelDetails.findById(_id,"-_id -roomsBooked",(err:any,doc:hotelD)=>{
        if(err)
        {
            console.log(err);
            res.status(503).json({ error:"DB error"});
        }
        else
        {
    
            res.status(200).json({ doc});
        }
       });
    // res.json({status:200, response:_id});
});


// Bookings APIs


user.get('/hotelavailable', (req:Request, res:Response)=>{
    const query = req.body;
    query.bookedFrom = new Date(query.bookedFrom);
    query.bookedTill = new Date(query.bookedTill);
    // hotelAvailable(query).then((doc)=>{
    //     if(doc==0)
    //     {
    //         // console.log(response);
    //         res.status(404).json({ doc:'error'});
    //     }
    //     else
    //     {
            
    //         if(isHotelAvailable(doc, query))
    //             res.status(200).json({ response:true});
    //         else
    //             res.status(200).json({ response:false});
    //     }
    // });
    hotelDetails.findById(query.hotelId)
    .then((details)=>{
        if(details==null)
        {
            console.log(details)
            return null
        }
        let calender = details.calender;
        for(let d = new Date(query.bookedFrom);d<=query.bookedTill;d.setDate(d.getDate()+1))
        {
            // @ts-expect-error
            if(d in calender){
            //@ts-expect-error
            if(calender[d]<query.roomsToBeBooked)
                return null
            }
            else if (details.totalNumberOfRooms<query.roomsToBeBooked)
                return null
        }
        return true;
    })
    .then((bol)=>{
        if(bol)
            res.status(200).json({ response:true});
        else
            res.status(200).json({ response:false});
    })
    .catch((err)=>{
        console.log(err);
        res.status(404).json({response:'error'});
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
   let query = req.body;
   const booking_id = Math.floor((Math.random()*1000000)+100000);
//    console.log(booking_id);
   query.booking_id = booking_id;
   query.bookedFrom = new Date(query.bookedFrom);
   query.bookedTill = new Date(query.bookedTill);
//    res.json({bookedAtId:query.bookedAtId, bookedById:query.bookedById});
   hotelBookings.findOne({bookedAtId:query.bookedAtId, bookedById:query.bookedById, status:{$ne:cancelled}})
   .then((booking)=>{
    //    console.log("Booking:", booking)
       if(booking!=null ){
        // res.status(200).json({response:"Booking already Made."});
        // console.log(101);
        return null
       }
        else 
        // return hotelBookings.create(query);
        return hotelDetails.findById(query.bookedAtId);

   })
//    .then(bookings=>{
//        if(bookings){
//            console.log(102)
//            return hotelDetails.findById(bookings.bookedAtId);
//        }  
//        return null;  
//    })
   .then((hoteldetail)=>{
       if(hoteldetail==null)
            return null;
        // console.log(103)
       let rooms = hoteldetail.roomsBooked,
        calender = hoteldetail.calender,
        flag = 1;
       
       if(rooms==null)
       {
           rooms = []
       }
       console.log(query,101)
       let roma:Object = {bookingId:query.booking_id, blockedFrom:query.bookedFrom, blockedTill :query.bookedTill, numberOfRooms:query.roomsBooked};
    //    console.log(roma, 102)
       if(calender!=null)
       for(let x =new Date(query.bookedFrom); x<=query.bookedTill;x.setDate(x.getDate()+1))
       {
           //@ts-ignore
           if(x in calender)
           {
               //@ts-expect-error
               if(calender[x]>=query.roomsBooked)
               //@ts-expect-error
                calender[x] -= query.roomsBooked
                else{
                    // console.log("triggered because no rroms")
                    return null;
                }
               
           }
           else if(hoteldetail.totalNumberOfRooms>=query.roomsBooked)
           {
               //@ts-expect-error
               calender[x] = hoteldetail.totalNumberOfRooms - query.roomsBooked
               
           }
           else {flag = 0;console.log("triggered"); return null;}

       }
       if(flag==1){
        //    console.log(roma, 103)
       rooms.push(roma);
    //    console.log(calender,"\n",rooms);

    //    console.log(rooms);
    //    res.send("Hello")
       return hotelDetails.findByIdAndUpdate(hoteldetail._id,{roomsBooked:rooms, calender})
       }
       else return null;
   })
   .then(updated=>{
        if(updated==null){
            // res.status(200).json({response:'Booking cannot be made because rooms are not available or booking already made!!'});
            return null;
        }
        else
        // res.status(201).json({response:'Booking made Successfully!', booking_id});
        return hotelBookings.create(query);
   })
   .then(booking=>{
    if(booking==null){
        res.status(200).json({response:'Booking cannot be made because rooms are not available or booking already made!!'});
    }
    else
    res.status(201).json({response:'Booking made Successfully!', booking_id});
   })
   .catch((err)=>{
       console.log(err);
       res.status(404).json({response:'error'});
   });
   
});

user.get('/bookings',(req:Request, res:Response)=>{
    /*
    params:
    {
        bookedById:""
    }
    */
    hotelBookings.find(req.body).select("-__v -_id -bookedById -bookedAtId")
    .then((bookings)=>{
        res.status(200).json({bookings, response:'Success'});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({response:'DB error!!'});
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
        let rooms:any = [],
            calender:Object = hotel.calender,
            bookedFrom:Date,
            bookedTill:Date,
            numOfRooms:number;
        // console.log(calender);
        hotel.roomsBooked.forEach((obj:any)=>{
            // console.log(obj)
            if(obj.bookingId!=req.body.booking_id)
                rooms.push(obj);
            else{
                bookedFrom = obj.blockedFrom;
                bookedTill = obj.blockedTill;
                numOfRooms = obj.numberOfRooms

            }
        });
        

        //@ts-expect-error
        for(let dt = new Date(bookedFrom); dt<=bookedTill;dt.setDate(dt.getDate()+1))
        {
            console.log(dt);
            //@ts-expect-error
            calender[dt] +=  numOfRooms;
        }
        //@ts-expect-error
        console.log(bookedFrom, " ", bookedTill, " ", numOfRooms);
        // console.log(rooms)
        return hotelDetails.findByIdAndUpdate(hotel._id, {roomsBooked:rooms, calender});
    })
    .then(updatedHotel =>{
        if(updatedHotel==null)
            res.status(404).json({response:'No booking by this id or some error!!'});
        else
        res.status(201).json({respsonse:"Booking cancelled", booking_id:req.body.booking_id,})
    })
    .catch((err)=>
    {
        console.log(err)
        res.status(500).json({response:'DB error!'})
    });
});




export default user;