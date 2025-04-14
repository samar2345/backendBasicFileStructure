import mongoose,{Schema} from "mongoose";//doubt mongo
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema=new Schema({
    username:{
        type: String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true // used to make the field searchable,use very carefully
    },
    email:{
        type: String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true, //?
    },
    fullName:{
        type: String,
        required:true,
        trim:true, //?
        index:true,
    },
    avatar:{
        type:String, //cloudinary url
        required:true
    },
    coverImage:{
        type:String //cloudinary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type:String
    }

},{timestamps:true});


// doubt ???
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,10)
    next()
})

// custom method, use??
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User= mongoose.model("User",userSchema)// This User model can directly communicate with the database, we can use it to create, update, delete and find users in the database.