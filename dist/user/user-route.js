"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotels_details_1 = require("../models/hotels-details");
const user = express_1.default.Router();
user.get('/', (req, res) => {
    res.send("This is user module.");
});
user.post('/hello', (req, res) => {
    res.json({ name: req.body.hel });
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
user.post('/addHotel', (req, res) => {
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
    for (const e in req.body) {
        if (!req.body[e]) {
            console.log({ status: 404, error: 'Bad request.' });
            res.json({ status: 404, error: 'Bad request.' });
            return;
        }
    }
    const enrty = new hotels_details_1.hotelDetails({
        name: req.body.name,
        totalNumberOfRooms: req.body.totalrooms,
        numberofRoomsAvailable: req.body.totalavailable
    });
    // console.log(enrty);
    hotels_details_1.hotelDetails.create(enrty, (err, doc) => {
        if (err) {
            console.log(err);
            res.json({ status: 404, error: "DB error" });
        }
        else {
            res.json({ status: 200, doc });
        }
    });
});
exports.default = user;
