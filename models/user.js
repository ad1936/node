var mongoose=require("mongoose");
var localPassportMongoose=require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username: String,
    password: String   
 });
 userSchema.plugin(localPassportMongoose);
module.exports= mongoose.model("User", userSchema);