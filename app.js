var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

// seedDB();

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index.js");
  
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// mongoose.connect("mongodb://localhost:27017/Yelp_camp", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://surajhimanshu:26@Suraj@cluster0-hbcjq.mongodb.net/yelpcamp?retryWrites=true");

// var url = process.env."mongodb+srv://surajhimanshu:26@Suraj@cluster0-hbcjq.mongodb.net/test?retryWrites=true" || "mongodb://localhost/yelp_camp_v10";
// mongoose.connect(url);

mongoose.connect("mongodb+srv://surajhimanshu:26@Suraj@cluster0-hbcjq.mongodb.net/test?retryWrites=true");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//PAssport CONFIGURATION
app.use(require("express-session")({
    secret:"Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has Started");
});