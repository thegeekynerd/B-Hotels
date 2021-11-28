import mongoose, { isValidObjectId, ObjectId, Schema } from 'mongoose';

interface hotelB
{
    booking_id:number,
    bookedBy:string,//username
    bookedById:ObjectId,
    bookedAt:string,//hotelname
    bookedAtId:ObjectId,
    roomsBooked:Number,//number or numbers of rooms booked
    bookedFrom:Date,
    bookedTill:Date,
    feedback?:string,
    status?:string
}

const hotelBookingSchema = new Schema<hotelB>({
    booking_id:Number,
    bookedBy:String,
    bookedById:Schema.Types.ObjectId,
    bookedAt:String,
    bookedAtId:Schema.Types.ObjectId,
    roomsBooked:Number,
    bookedFrom:Date,
    bookedTill:Date,
    feedback:String,
    status:String

});

const hotelBookings = mongoose.model('hotelBooking', hotelBookingSchema);
export {hotelBookings, hotelB};
