import mongoose, { Schema } from 'mongoose';

interface hotelD{
    name:string,
    totalNumberOfRooms:number,
    numberofRoomsAvailable:number,
    
};

const hotelDetailsSchema:Schema = new Schema<hotelD>({
    name:{type:String, required:true},
    totalNumberOfRooms:{type:Number, required:true},
    numberofRoomsAvailable:{type:Number, required:true}
});

const hotelDetails = mongoose.model('hotels',hotelDetailsSchema);

export {hotelDetails};