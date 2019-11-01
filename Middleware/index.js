var Campground=require("../models/campground");
var Comment =require("../models/comment");

var middlewareObj ={}
middlewareObj.verifyCampgroundUser=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error", "no such comment exist")
                console.log("error campground not found");
                res.redirect("back")
            } else{
                if(foundCampground.author.id.equals(req.user._id)) {
                    next()
                }
                else{
                    req.flash("error","you don't have permissions")
                    res.redirect("back")
                }
            }
        })
    }
     else{
        req.flash("error","please login first")
        res.redirect("back")
    }
}

middlewareObj.verifyCommentUser =function (req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error", "no such comment exist")
                console.log("error comment not found");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)) {
                    next()
                }
                else{
                    req.flash("error","you don't have permissions for the comment")
                    res.redirect("back")
                }
            }
        })
    }
     else{
        req.flash("error","please login first")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","you need to be login first")
    res.redirect("/login");
}
module.exports=middlewareObj;