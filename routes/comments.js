var express = require("express")
    router = express.Router({mergeParams: true}),
    Campground=require("../models/campground"),
    Comments=require("../models/comment"),
    user=require("../models/user"),
    Middleware=require("../middleware")

router.get("/comment/new",Middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
          console.log(err);   
        } else{
            res.render("Comment/new",{campground:foundCampground});
        }
    });
});

router.post("/comment",Middleware.isLoggedIn,function(req,res){
    var Comment=req.body.comment;
    console.log(req.user)
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err);
        } else{
            console.log(Comment);
            var inpComment={
                text: Comment,
                author:{
                    id:req.user._id,
                    username: req.user.username
                }
            }
            Comments.create(inpComment,function(err,addComment){
                if(err){
                    console.log(err);
                    res.redirect("back")
                } else{
                    foundCampground.comments.push(addComment._id);
                    foundCampground.save();
                    res.redirect("/campgrounds/"+foundCampground._id)
                }
            });
        }
    });
});

//edit route
router.get("/comment/:comment_id/edit",Middleware.verifyCommentUser,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err)
            res.redirect("back")
        } else{
            Comments.findById(req.params.comment_id,function(err,foundComment){
                if(err){

                }
                else{
                    res.render("./Comment/edit",{campground:foundCampground,comment:foundComment})
                }
            })
        }
    });
    
})

//update route
router.put("/comment/:comment_id",verifyUser,function(req,res){
    Comments.findByIdAndUpdate(req.params.comment_id,{text:req.body.comment},function(err,foundComment){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
});

router.delete("/comment/:comment_id",verifyUser,function(req,res){
    Comments.findByIdAndDelete(req.params.id,function(err,removed){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
})

function verifyUser(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(foundComment.author.id.equals(req.user._id)) {
                next()
            }
            else{
                res.redirect("back")
            }
        })
    }
     else{
        res.redirect("back")
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router