var express= require("express")
    app=express(),
    body_parser=require("body-parser"),
    request=require("request"),
    passport=require("passport"),
    methodOverride=require("method-override"),
    LocalStrategy=require("passport-local"),
    mongoose=require("mongoose"),
    passportLocalMongoose=require("passport-local-mongoose"),
    flash=require("connect-flash");

var user=require("./models/user"),
    Campground=require("./models/campground"),
    Comments=require("./models/comment"),
    seed=require("./seed");

var index_route = require("./routes/campground"),
    auth_route = require("./routes/auth");
    comments_route = require("./routes/comments");

app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(flash())
app.use(passport.initialize());
app.use(passport.session());


console.log(seed);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});
mongoose.connect('mongodb+srv://ad1960:amandeep@cluster0-dgukp.mongodb.net/testDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

app.use(body_parser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("Public"));
app.use(methodOverride("_method"));


app.use(function(req,res,next){
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    res.locals.currentUser=req.user;
    next();
});

seed(); 
//  Campground.create(
//      {
//          name: "Granite Hill", 
//          image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//          description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
         
//      },
//      function(err, campground){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED CAMPGROUND: ");
//           console.log(campground);
//       }
//     });

//Home Route
app.get("/",function(req,res){
    res.render("Campground/home");
});



app.use("/",auth_route)
app.use("/campgrounds",index_route)
app.use("/campgrounds/:id",comments_route)

app.get("/*",function(req,res){
    res.render("Campground/home");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT,function(){
    console.log("server started");
});
