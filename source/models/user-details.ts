import mongoose, { model, Schema } from "mongoose";


interface userD{
    name:string,
    username:string,
    email?: string,
    password:string
};

let UserSchema = new Schema<userD>({
    name:{type:String, required:true},
    username:{type:String, required:true},
    email: String,
    password:{type:String, required:true}
});

const userDetails = model<userD>('user', UserSchema);
export {userDetails}