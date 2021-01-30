//jshint esversion:6
require("dotenv").config()
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const app=express()
const mongoose =require("mongoose")
const encrypt=require("mongoose-encryption")
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect("mongodb://localhost:27017/secretDB",{useNewUrlParser:true})
console.log(process.env.API_KEY )

const userSchema=new mongoose.Schema({
    email:String,
    password: String
})

//userSchema.plugin(encrypt, { secret: secret });
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

//userSchema.plugin(encrypt, {secret: secret,encryptedFields:[password]})

const User=mongoose.model("User",userSchema)
app.route("/")
    .get(function(req,res){
        res.render("home")
    })

app.route("/login")
    .get(function(req,res){
        res.render("login")
    })
    .post(function(req,res){
        const uName=req.body.username
        const pword=req.body.password
        User.findOne({email: uName},function(err,result){
            if(!err){
                if(result.password==pword){
                    res.render("secrets")
                }
                else{
                    res.send("wrong pasword")
                }
            }
            else{
                console.log(err)
            }
        })
    })



app.route("/logout")
    .get(function(req,res){
        res.render("home")
    })



app.route("/register")
    .get(function(req,res){
        res.render("register")

    })
    .post(function(req,res){
        const newUser=new User({
            email: req.body.username,
            password: req.body.password
        })
        newUser.save(function(err){
            if(!err){
                res.render("secrets")
            }
            else{
                res.render(err)
            }
        })
})
app.listen(3000)
