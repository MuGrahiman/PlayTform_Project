console.log('IN THE MULTER')
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')
const path=require('path');
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      console.log('in the multer')
      console.log(file)
      if (file.fieldname == 'instalfile') {
        cb(null, path.join(__dirname,'../public/upload/files'));

      } else if (file.fieldname == 'Images') {
        cb(null, path.join(__dirname,'../public/upload/Images'));

      } else if (file.fieldname == 'Image') {
        cb(null, path.join(__dirname,'../public/upload/Image'));

      }
        // cb(null, path.join(__dirname,'../public/upload'));
        // cb(null, 'upload')
    },
    filename:(req,file,cb)=>{
        // const name=file.originalname;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        cb(null, file.originalname + '-' + uniqueSuffix)
        // cb(null,name);
    }
})
// const upload=multer({storage:multer.memoryStorage()})

// const imageName = uniqueSuffix + '-' + req.files.Images[i].originalname;

const upload=multer({storage})


// 
  const cloudstorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "DEV",
        resource_type:"auto"
      },
    });
    // const upload = multer({ storage: cloudstorage});

  module.exports=upload