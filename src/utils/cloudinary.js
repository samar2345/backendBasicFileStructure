// Can be used for future projects as well
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath) return null
    //upload file on cloudinary
    const response=await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    })
    //file has been uploaded successfully
    // console.log("File uploaded on cloudinary",response.url)
    fs.unlinkSync(localFilePath)
    return response
    }catch(error){
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file bcoz upload operation got failed 
    }
}

export {uploadOnCloudinary}