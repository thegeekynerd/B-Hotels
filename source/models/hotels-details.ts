import mongoose, { Schema } from 'mongoose';

interface hotelD{
    hotel_id?: number,
    name:string,
    totalNumberOfRooms:number,
    numberofRoomsAvailable:number,
    city:string,
    cityCode:number,
    pincode:number,
    contactNumber:string,
    roomsBooked?: Array<{bookingId:number, blockedFrom: Date, blockedTill :Date, numberOfRooms:number}>,
    calender:Object
};

const hotelDetailsSchema:Schema = new Schema<hotelD>({
    hotel_id:{type:Number,required:true},
    name:{type:String, required:true},
    totalNumberOfRooms:{type:Number, required:true},
    numberofRoomsAvailable:{type:Number, required:true},
    city:{type:String, required:true},
    cityCode:{type:Number, required:true},
    pincode:{type:Number, required:true},
    contactNumber:{type:String, required:true},
    roomsBooked:[{bookingId:Number,blockedFrom: Date, blockedTill:Date, numberOfRooms:Number}],
    calender:{type:Object, required:true, default :{}}
});

const hotelDetails = mongoose.model('hotels',hotelDetailsSchema);

export {hotelD, hotelDetails};