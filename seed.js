var mongoose=require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var Campground=require("./models/campground");
var Comment=require("./models/comment");


function seedDB(){
    Campground.deleteMany({},function(err){ 
    if(err){
        console.log(err);
    } else{
        console.log("Campgrounds Removed");
    }
    
    });
}

module.exports=seedDB;