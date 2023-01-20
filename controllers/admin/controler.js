const { result } = require("lodash");
const Project = require("../../models/userschema");
const Product = require("../../models/productschema");
const Category = require("../../models/categoryschema")
const bodyparser = require("body-parser");
const multer = require('multer')
const upload = require('../../config/multer')
const fileUpload = multer()
const Cloudinary = require ('../../config/cloudinary')
const streamifier = require('streamifier')
const url = require('url')
const fs = require('fs');
const { log } = require("console");
require('dotenv').config(),
require("../../config/connection")

const Path = require('path');
const sharp = require('sharp')
let adminno = 226688;  

 
const home = (req,res)=>{
    res.render('admin/admin-home.ejs',{title : "admin-home"})
}
const login_admin =  (req, res) => {
    if (adminno == req.body.password) {
      req.session.admin = true;
      console.log("admin session created");
      res.redirect("/admin-customer");
    } else {
        res.render('admin/admin-home.ejs',{title : "admin-home-error",error:"password not matching"})
    }
  };
const customer = (req,res) =>{
    Project.find()
    .sort({createdAt :-1})
    .then((result)=>{
      console.log(result)
        console.log('get all data from db')
        res.render('admin/admin-customer',{title : "admin-customer",project : result})

    })

} 
const customer_block = (req, res) => {
  
    let id = req.params.id;
    console.log(id+"this is the id for block");
 
    Project.findByIdAndUpdate(
      {_id: req.params.id},
      {$set:{ delete : true}})
      .then((result) => {
        res.redirect('/admin-customer');
        console.log("this is the result"+result);
      })
      .catch((err) => console.log("404", { title: "Blog not found" }));
    // res.redirect('/admin-log')
  
  }
  const customer_unblock = (req, res) => {
  
    let id = req.params.id;
    console.log(id+"this is the id for unblock");
 
    Project.findByIdAndUpdate(
      {_id: req.params.id},
      {$set:{ delete : false}})
      .then((result) => {
        res.redirect('/admin-customer');
        console.log("this is the result"+result);
      })
      .catch((err) => console.log("404", { title: "Blog not found" }));
    // res.redirect('/admin-log')
  
  }
const product = (req,res) =>{
  Product.find()
  .sort({createdAt :-1})
  .then((result)=>{
    console.log(result)
      console.log('get all Product from db')
      res.render('admin/admin-product',{title : "admin-Product",product : result})

  })
  // res.render('admin/admin-product',{title :'admin-product'})
} 


const singleadmin_product = async (req,res)=>{
  try {
    let category;
    let id = req.params.id
    Category.find().then((result) => {
      category = result;
    });
    // let others =await Product.find()
    Product.findById(id)
      .sort({ createdAt: -1 })
      .then((result) => {
        console.log(result);
        console.log("get all singleadmin_product");
        // console.log(others+"other product");
        res.render("admin/admin-single-product", {
          title: "user-Product",
          product: result,
          category,
          // others
        });
      });
  } catch (error) {
    console.log(error);
  }
  }
  const singleadmin_postproduct = async (req,res)=>{
    try {
      let category;
      let id = req.params.id
      // Category.find().then((result) => {
      //   category = result;
      // });
      // let others =await Product.find()
      console.log(id);
      Product.findByIdAndUpdate(
        { _id:  req.params.id },
        {
          $set: {
            title: req.body.name,
      developer: req.body.developer,
      // release_date:Date.now(),
      category: req.body.category,
      genres: req.body.genres,
      cost: req.body.cost,
          },
        },
        console.log(req.body)
      )
        .then((result) => {
          console.log(result);
          console.log("get all singleadmin_postproduct");
          // console.log(others+"other product");
          // res.render("admin/admin-single-product", {
          //   title: "user-Product",
          //   product: result,
            // category,
            // others
          // });
          res.redirect("/admin-product")
        });
    } catch (error) {
      console.log(error);
    }
    }
  

const product_add = (req,res) =>{
  Category.find()
  .sort({createdAt:-1})
  .then((result) =>{
    res.render('admin/admin-product-add',{title : "admin-product-add",category : result})
  })
}
  const product_post = async (req, res) => {
    try {
// console.log(req.body)
console.log(req.files)

  // const dirname = '/home/mujeeb/Desktop/visual studio/project/public/upload/';
  // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const imgs = [];
  let img;
  let instalfile;
  let Image;
  let Images = [];

  req.files.forEach(file => {
   console.log(file.fieldname)
   if (file.fieldname == "instalfile") {
    instalfile = file ;
  } else if(file.fieldname =="Image") {
    Image = file;
   } else if(file.fieldname == "Images") {
    Images.push(file)
   }
  });
   
console.log(instalfile + Image + Images)
        // const imageName = uniqueSuffix + '-' + req.files[1].originalname;
        // console.log(instalfile.filename )
     
          const data = {
            image: Image.path
          }
  
          console.log(Images.length);
          let war = await Cloudinary.uploader.upload(Image.path, {public_id: Image.filename})
console.log(war);

      for (i = 0;i < Images.length; i++) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

      // const imageName = uniqueSuffix + '-' + req.files.Images[i].originalname;
      // console.log(imageName )

        // sharp(req.files.Images[i].buffer)
        //   .resize({ width: 485, height: 485 })
        //   .toFormat("png")
        //   .png({ quality: 80 })
        //   .toFile('public/upload/'+imageName); 
          // app.post("/image-upload", (req, res) => {
            const datas = {
              image: Images[i].path
            }
console.log(datas)
            let mar = await Cloudinary.uploader.upload(Images[i].path, {public_id: Images[i].filename})
            
          imgs.push({public_id :mar.public_id , url :mar.url });
      } 

      newproduct = new Product({
        file:instalfile.filename,
        title: req.body.name,
        developer: req.body.developer,
        release_date:Date.now(),
        category:  req.body.category,
        genres: req.body.genres,
        cost: req.body.cost,
        imgs:imgs ,
        img:{public_id :war.public_id , url :war.url }
      });
    await newproduct.save();
      res.redirect('/admin-product-add');
          console.log(newproduct+'new product added');

    } catch (err) {
      Category.find()
      .sort({createdAt:-1})
      .then((result) =>{
        res.render('admin/admin-product-add',{title : "admin-product-add",category : result,err})
      })
      console.log(err);

    }
  };

//----------------coupen-----------------------
const coupen = (req,res)=>{
res.render('admin/admin-coupen')
}

//----------------category-----------------------
const category = (req,res)=>{
 Category.find()
  .sort({createdAt:-1})
  .then((result) =>{
    res.render('admin/admin-category',{title : "admin-category",category : result})
  })
  }

const add_category = async (req,res)=>{
const newcategory = new Category({
  title : req.body.name,
  delete :false
})
await newcategory.save()
.then((result)=>{
res.redirect('/category')
})
.catch((err)=>console.log(err))
}
const category_block = (req,res) =>{
  
  let id = req.params.id;
  console.log(id+"this is the id for block");

  Category.findByIdAndUpdate(
    {_id: req.params.id},
    {$set:{ delete : true}})
    .then((result) => {
      res.redirect('/category');
      console.log("this is the result"+result);
    })
    .catch((err) => console.log("404", { title: "Blog not found" }));
  // res.redirect('/admin-log')
}
const category_unblock = (req,res) =>{
  let id = req.params.id;
  console.log(id+"this is the id for block");

  Category.findByIdAndUpdate(
    {_id: req.params.id},
    {$set:{ delete : false}})
    .then((result) => {
      res.redirect('/category');
      console.log("this is the result"+result);
    })
    .catch((err) => console.log("404", { title: "Blog not found" }));
}
//-------------export-items-------------
module.exports = {
    home,
    customer,
    customer_block ,
    customer_unblock ,
    login_admin ,
    product,
    singleadmin_product,
    singleadmin_postproduct,
    product_add ,
    product_post,
    coupen,
    category,
    add_category,
    category_block,
    category_unblock
  };