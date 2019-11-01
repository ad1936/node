var express= require("express"),
    router = express.Router({mergeParams: true}),
    Campground=require("../models/campground"),
    Comments=require("../models/comment"),
    Middleware=require("../middleware")
   
    //New Route
    router.get("/new",Middleware.isLoggedIn,function(req,res){
        res.render("./Campground/new")
    });

    //Add Route
    router.post("/",Middleware.isLoggedIn,function(req,res){
        var nameInp=req.body.name;
        var imageInp=req.body.image;
        var descInp = req.body.description;
        var userInp={
            id:req.user._id,
            username:req.user.username

        }
        var campAdd={name:nameInp,image:imageInp,description:descInp,author:userInp}
        
        Campground.create(campAdd,function(err,newlyCreated){
            if(err){
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        });
        
    });

    //Index Route
    router.get("/",function(req,res){
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
            res.render("./Campground/index",{data:allCampgrounds});
            }
        });
    });

    //show Route
    router.get("/:id",function(req,res){
        console.log("amandeep"+req.params.id);
        Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
            if(err || !foundCampground){
                console.log(err);
                res.redirect("/campgrounds")
            } else{
                // console.log("Entered");
                // console.log(foundCampground)
                res.render("./Campground/show",{campground:foundCampground});
            }
        });

    });

    //edit
    router.get("/:id/edit",Middleware.verifyCampgroundUser,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err || !foundCampground){
                console.log(err);
                res.redirect("/campgrounds")
            } else{
                res.render("./Campground/edit",{campground:foundCampground})
            }
        });
    });
    //update
    router.put("/:id",Middleware.verifyCampgroundUser,function(req,res){
        console.log(req.body.editcamp)
        Campground.findByIdAndUpdate(req.params.id,req.body.editcamp,function(err,foundCampground){
            if(err){
                res.redirect("/campgrounds")
            }
            else{
                res.redirect("/campgrounds/"+req.params.id)
            }
        })
    });

    //delete
    router.delete("/:id",Middleware.verifyCampgroundUser,function(req,res){
        Campground.findByIdAndDelete(req.params.id,function(err,deleteCampground){
            if(err || !deleteCampground){
                res.redirect("/campgrounds")
            }
            else{
                Comments.deleteMany({_id:{$in:deleteCampground.comments}},function(err,deleteComments){
                    if(err){
                        console.log(err)
                        console.log("error in deleting")
                    } else{
                        console.log("deleted");
                        res.redirect("/campgrounds")            
                    }
                });   
            }
        });
    });

    
module.exports=router