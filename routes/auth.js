var express = require("express")
    router = express.Router({mergeParams: true}),
    user=require("../models/user")
    // Campground=require("../models/campground"),
    // Comments=require("../models/comment")

    router.get("/login",function(req,res){
        res.render("./Auth/login");
    });

    router.post("/login",function(req,res,next){
        console.log(passport);
        passport.authenticate("local",function(err,user,info){
            if(err){
                req.flash("error",err.message)
                console.log(err);
            return res.redirect("/login");  
            }  
            if(!user){
                req.flash("error","not a valid user")
            return  res.redirect("/login");
            } 
            console.log("error")
            console.log(user);
            req.login(user,function(err){
                if(err){
                    console.log(err);
                    req.flash("error",err.message)
                    res.redirect("/login");
                }
                else{
                    req.flash("success","Welcome "+user.username)
                    return res.redirect("/campgrounds");
                }
            });
        })(req, res, next);

    });

    router.get("/logout",function(req,res){
        req.logout();
        res.redirect("/");
    });

    router.get("/register",function(req,res){
        res.render("./Auth/register");
    });

    router.post("/register",function(req,res){
        regUser=new user({username:req.body.username});
        console.log(req.body.username);
        user.register(regUser, req.body.password, function(err, user){
            if(err){
                console.log(err);
                return res.render('./Auth/register');
            }
            console.log(passport.authenticate("local"));
            passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
            });
        });
    });
module.exports = router