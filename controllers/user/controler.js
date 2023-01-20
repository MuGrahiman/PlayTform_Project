const Project = require("../../models/userschema");
const Product = require("../../models/productschema");
const Category = require("../../models/categoryschema");
const bcrypt = require("bcrypt");
const mail_sender = require("../../config/mail_generator");
const nodemailer = require("nodemailer");
const { request } = require("express");
require('dotenv').config()
const { findOneAndUpdate } = require("../../models/userschema");
const { result } = require("lodash");

const home = (req, res) => {
  let category;
  Category.find().then((result) => {
    category = result;
  });
  Product.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product to home");
      res.render("user/home", {
        title: "Home Page",
        product: result,
        category,
      });
    });
  // res.render("user/home", { title: "Home Page" });
};
//  -----------login------------------
const login = (req, res) => {
  let category;
  Category.find().then((result) => {
    category = result;
  });
  console.log(category);
  res.render("user/user-login", { title: "Login Page", category: category });
};
const post_login = async (req, res) => {
  const usermail = req.body.email;
  const userpswd = req.body.password;

  try {
    const user = await Project.findOne({ email: usermail });
    const password = await bcrypt.compare(userpswd, user.password);
    console.log(user + "" + password);

    if (user) {
      if (password) {
        if (user.delete === true) {
          res.render("user/user-login", {
            title: "Login Page",
            error: "you are blocked contact admin",
          });
        } else {
          req.session.email = user;
          console.log("user session created");
          console.log("posted login form" + JSON.stringify(req.body));
          res.redirect("/");
        }
      } else {
        res.render("user/user-login", {
          title: "Login Page",
          error: "Invalid Password",
        });
      }
    } else {
      res.render("user/user-login", {
        error: "Invalid Email",
        title: "Login Page",
      });
    }
  } catch (error) {
    res.render("user/user-login", {
      error: "Invalid Email",
      title: "Login Page",
    });
    console.log(error);
  }
};

const forgot = (req, res) => {
  res.render("user/forgot", { title: "forgot Page" });
};
let forgoterEmail;
let fOTP;
const forgot_post = async (req, res) => {
  try {
    // const body = req.body;
    const emailId = req.body.email;
    forgoterEmail = await Project.findOne({ email: emailId });
    console.log(forgoterEmail);
    if (forgoterEmail) {
      mail_sender
        .mail_sending(forgoterEmail)
        .then((result) => {
          fOTP = result;
          console.log(fOTP + " forgot session otp  ");
          res.redirect("/forgot-otp");
          setTimeout(() => {
            fOTP = false;
            console.log(fOTP + " forgot session otp  deleted");
          }, 60000);
        })
        .catch((error) => {
          console.log("forgot mail sending error " + error);
        });
    } else {
      res.render("user/forgot", {
        title: "forgot Page",
        messege: "Entered Email Is Not Found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const foresend = async (req, res) => {
  try {
    mail_sender
      .mail_sending(forgoterEmail)
      .then((result) => {
        fOTP = result;
        console.log(fOTP + "session otp for foresend created");
        setTimeout(() => {
          fOTP = false;
          console.log(" forgot resend session otp deleted");
        }, 60000);

        res.redirect("/forgot-otp");
      })
      .catch((error) => {
        console.log(" resend mail sending error " + error);
        res.render("user/forgot", {
          title: "forgot Page",
          messege: "Entered Email Is Not Found",
        });
      });
  } catch (error) {
    console.log(error);
  }
};
const forgot_otp = (req, res) => {
  res.render("user/otp", { title: "Sign-Up Page", success: "you win" });
};
const forgot_otpost = (req, res) => {
  console.log(req.body.Otp + " forgot user otp");
  console.log(fOTP + " forgot user session");

  if (fOTP === req.body.Otp * 1) {
    res.redirect("/forgot-password");
  } else {
    res.render("user/otp", {
      title: "otp-page",
      error: "Entered OTP Is Not Matching",
    });
  }
};

const forgot_password = (req, res) => {
  res.render("user/password", { title: "Sign-Up Page" });
};
const forgotpost_password = async (req, res) => {
  try {
    await Project.findOneAndUpdate(
      { email: forgoterEmail },
      { $set: { password: req.body.password } }
    );
    console.log("password changed");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

//----------signup----------------
const signUp = (req, res) => {
  res.render("user/user-sign", { title: "Sign-Up Page" });
};
let signerEmail;
let project;
let sOTP;
const post_signup = async (req, res) => {
  signerEmail = req.body;
  const usermail = req.body.email;
  user = await Project.findOne({ email: usermail });
  console.log(signerEmail);
  try {
    if (user) {
      res.render("user/user-sign", {
        title: "Sign-Up Page",
        error: "mail already exist",
      });
    } else {
      if (req.body.Cpassword === req.body.password) {
        mail_sender
          .mail_sending(signerEmail)
          .then(async (result) => {
            const saltround = 8;
            const hashedpswd = await bcrypt.hash(req.body.password, saltround);
            project = new Project({
              name: req.body.name,
              email: req.body.email,
              password: hashedpswd,
              delete: false,
            });
            sOTP = result;
            console.log(sOTP + "session otp for sign created");
            setTimeout(() => {
              sOTP = false;
              console.log(sOTP + " sign session otp deleted");
            }, 60000);

            res.render("user/user-sign", {
              title: "OTP Page",
              messege: "Enter The OTP Send To Your Email",
            });
          })
          .catch((error) => {
            console.log(error + "error of sign ");
          });
      } else {
        res.render("user/user-sign", {
          title: "Sign-Up Page",
          error: "password not matching",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const signresend = async (req, res) => {
  try {
    console.log(signerEmail + " signresend");
    mail_sender
      .mail_sending(signerEmail)
      .then((result) => {
        sOTP = result;
        console.log(sOTP + " otp for sign resend");
        setTimeout(() => {
          sOTP = false;
          console.log(" sign resend session otp deleted");
        }, 60000);
        res.render("user/user-sign", {
          title: "OTP Page",
          messege: "Enter The OTP Send To Your Email",
        });
      })
      .catch((error) => {
        console.log(" resend mail sending error " + error);
        res.render("user/user-sign", {
          title: "forgot Page",
          messege: "Entered Email Is Not Found",
        });
      });
  } catch (error) {
    console.log(error);
  }
};
//------------OTP varification--------------

const OTP_signVarification = async (req, res) => {
  console.log(sOTP);
  console.log(req.body.otp + " input");
  if (sOTP === req.body.otp * 1) {
    console.log("signVarification otp varified");
    await project
      .save()
      .then((result) => {
        res.render("user/user-sign", {
          title: "OTP Page",
          success: "OTP varified",
        });
      })
      .catch(function (err) {
        console.log("error: ", err);
      });
  } else {
    res.render("user/user-sign", {
      title: "OTP Page",
      messege: "Enter The OTP Send To Your Email",
      error: "Entered otp is not match",
    });
    console.log("signVarification otp not varified");
  }
};
const product = (req, res) => {
  let category;
  Category.find().then((result) => {
    category = result;
  });
  Product.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product into product");
      console.log(category);

      res.render("user/user-product", {
        title: "admin-Product",
        product: result,
        category,
      });
    });
};
const single_product = async (req,res)=>{
try {
  let category;
  let id = req.params.id
  Category.find().then((result) => {
    category = result;
  });
  let others =await Product.find()
  Product.findById(id)
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product into product");
      console.log(others+"other product");
      res.render("user/user-single-product", {
        title: "user-Product",
        product: result,
        category,others
      });
    });
} catch (error) {
  console.log(error);
}
}
// ------------- category-----------------
const pc = (req, res) => {
  let category;
  Category.find().then((result) => {
    category = result;
  });
  Product.find({ category: "pc" })
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product into pc");
      res.render("user/user-product", {
        title: "admin-Product",
        product: result,
        category,
      });
    });
};
const vr = (req, res) => {
  let category;
  Category.find().then((result) => {
    category = result;
  });
  // const category = Category.find()
  Product.find({ category: "vr" })
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product into vr");
      res.render("user/user-product", {
        title: "admin-Product",
        product: result,
        category,
      });
    });
  // res.render('admin/admin-product',{title :'admin-product'})
};
const ps = (req, res) => {
  // const category = Category.find()
  let category;
  Category.find().then((result) => {
    category = result;
  });
  Product.find({ category: "ps" })
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product into ps");
      res.render("user/user-product", {
        title: "user-Product",
        product: result,
        category,
      });
    });
};
// ---------------sort---------
const more = async (req, res) => {
  let category;
  Category.find().then((result) => {
    category = result;
  });
  Product.find()
.sort({ cost: -1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product into ps");
      res.render("user/user-product", {
        title: "user-Product",
        product: result,
        category,
      });
    });
};
const less = async (req, res) => {
  let category;
  Category.find().then((result) => {
    category = result;
  });
  Product.find()
.sort({ cost: 1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product into ps");
      res.render("user/user-product", {
        title: "user-Product",
        product: result,
        category,
      });
    });
};
//-----------------sub category----------------
const subcate = async (req, res) => {
  let category;
  const id = req.params.id;
  let genres = await Category.findById(id);
  Category.find().then((result) => {
    category = result;
  });
  await Product.find({ genres: genres.title })
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product into subcatecory");
      res.render("user/user-product", {
        title: "user-Product",
        product: result,
        category,
      });
    });
};
// ------------search---------------
const search = async (req, res) => {
  try {
    Product.find(
      {
        $or: [
          { title: { $regex: req.query.search } },
          { category: { $regex: req.query.search } },
          { genres: { $regex: req.query.search } },
        ],
      },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let category;

          Category.find().then((result) => {
            category = result;
          });
          Product.find({})
            .sort({ createdAt: -1 })
            .then((result) => {
              console.log(result);
              console.log("get all Product into search");
              res.render("user/user-product", {
                title: "user-Product",
                product: result,
                category,
                data,
              });
            });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const searchpost = async (req,res)=>{
  let category;

  Category.find().then((result) => {
    category = result;
  });
  Product.find(
    {
      $or: [
        { "title": { "$regex": req.body.search } },
        { "category": { "$regex": req.body.search } },
        { "genres": { "$regex": req.body.search } },
      ],
    })
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      console.log("get all Product into search");
      res.render("user/user-product", {
        title: "user-Product",
        product: result,
        category,
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }
//-------------export-items-------------

module.exports = {
  home,
  login,
  post_login,
  post_signup,
  signUp,
  signresend,
  OTP_signVarification,
  forgot,
  forgot_post,
  forgot_otp,
  foresend,
  forgot_otpost,
  forgot_password,
  forgotpost_password,
  product,
  single_product,
  ps,
  pc,
  vr,
  more,
  less,
  subcate,
  search,
  searchpost,
};
