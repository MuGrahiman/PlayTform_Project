const controler = require('../controllers/user/controler')
const controler_admin =require('../controllers/admin/controler') 
const express = require('express');
const multer = require('multer')
// const fileUpload = multer({storage:memoryStorage}).fields(
//  [
//     { name: "Image"},
//     { name: "Images"},
//     { name: "category"},
//     { name: "genres"},
//     { name: "instalfile"}, 
  
  
//   ]
// )
const cloudinary = require ('../config/cloudinary')

const upload = require('../config/multer')
const { add } = require('lodash');
const { memoryStorage } = require('multer');
require('dotenv').config()
const router = express.Router();
//----------------USER---------------
  //  -----------home------------------
router.get('/',controler.home)
  //  -----------login------------------
router.get('/login',controler.login)
router.post('/login',controler.post_login)
  //  -----------forgot------------------
 
router.get('/forgot',controler.forgot)
router.post("/forgot",controler.forgot_post)
router.get("/forgot-otp",controler.forgot_otp)
router.post("/forgot-otp",controler.forgot_otpost)
router.get("/forgot-password",controler.forgot_password)
router.post("/forgot-password",controler.forgotpost_password)
router.get('/foresend',controler.foresend)



  //----------signup----------------
router.get('/sign-up',controler.signUp)
router.post('/sign-up',controler.post_signup)
router.get('/signresend',controler.signresend)
router.post('/otp',controler.OTP_signVarification)

//----------------product-----------------------

router.get('/product',controler.product)
router.get('/product/:id',controler.single_product)
// -------------sort and filter------------------
router.get('/pc',controler.pc)
router.get('/vr',controler.vr)
router.get('/ps',controler.ps)
router.get("/less",controler.less) 
router.get("/more",controler.more) 
router.get('/subcate/:id',controler.subcate)

// --------------------search---------------
router.get('/search',controler.search)  
router.post('/search',controler.searchpost)  


//----------------ADMIN------------------
router.get('/admin',controler_admin.home)
router.post('/admin',controler_admin.login_admin)
//--------------customer-----------------
router.get('/admin-customer',controler_admin.customer)
router.get('/userblock/:id',controler_admin.customer_block)
router.get('/userunblock/:id',controler_admin.customer_unblock)
//----------------coupen-----------------------
router.get("/coupen",controler_admin.coupen)

//----------------category-----------------------
router.get("/category",controler_admin.category) 
router.post('/add-category',controler_admin.add_category)
router.get("/category-block/:id",controler_admin.category_block) 
router.get("/category-unblock/:id",controler_admin.category_unblock) 

//----------------product-----------------------
router.get('/admin-product',controler_admin.product)
router.get('/admin-product/:id',controler_admin.singleadmin_product)
router.post('/admin-product/:id',controler_admin.singleadmin_postproduct)
router.get('/admin-product-add',controler_admin.product_add)
// router.post('/admin-product-add',upload.fields("image"),controler_admin.product_post)
router.post('/admin-product-add',upload.any()
// .any([
//   { name: "Image"},
//   { name: "Images"},
//   { name: "category"},
//   { name: "genres"},
//   { name: "instalfile"}, 


// ])
,controler_admin.product_post)


module.exports=router;  