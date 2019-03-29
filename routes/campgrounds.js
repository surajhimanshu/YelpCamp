var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
// var mongoose = require("mongoose");
// mongoose.set("useFindAndModify", false);
var middleware = require("../middleware");






//INDEX show all campground
router.get("/", function(req,res){
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allcampgrounds});
        }
      });
  });


//CREATE -add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author ={
        id: req.user._id,
        username: req.user.username
        }
    var newCampground = {name:name, price:price, image:image, description: desc, author: author}
    //create new campground
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else{
            
             res.redirect("/campgrounds");
        }
    });
 });

//NEW -form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - show the specific campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


//EDIT the campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req , res){
      Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
        });
  });



//UPDATE the show page
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
          res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            campground.remove();
            res.redirect("/campgrounds");
        }
    });
});







module.exports = router;
