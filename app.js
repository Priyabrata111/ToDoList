//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ =require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/*
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
*/
mongoose.connect("mongodb+srv://Priyabrata111:123456789priya@cluster0.5a6mqet.mongodb.net/todoListDB",{useNewUrlParser: true, useUnifiedTopology: true} );

const day = date.getDate();

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const listSchema = {
  name:String,
  items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);


const item1 = new Item({
  name: "wake up"
});
 const item2 = new Item({
  name:" Face wash "
 });
const defaultItems = [item1,item2];


/* 
Item.insertMany(defaultItems).then(function(){
  console.log("suceessfully updated the default items");
})
 .catch(function(err){
  console.log(" you get the folloeing error "+ err);
})
  */

-





app.get("/", function(req, res) {




Item.find({}).then(items=>{
  
  if(items.length==0)
  {
    Item.insertMany(defaultItems).then(function(){
      console.log("suceessfully updated the default items");
    })
     .catch(function(err){
      console.log(" you get the following error "+ err);
    });
    res.redirect("/");

  }
  else{
    res.render("list", {listTitle: day, newListItems: items});
  }
  
})

 

});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const listName = req.body.list;

  const itemNew = new Item({
    name:item
  });


  if(listName===day)
  {
  itemNew.save();
  res.redirect("/");

  }else{

    List.findOne({name:listName}).then(function(foundItem){
      foundItem.items.push(itemNew);
      foundItem.save();
      res.redirect("/"+listName);
      
    })
  }

  

});

app.post("/delete", function(req, res){
 
  const checkedItemId = req.body.checkbox.trim();
  const checkedListName = req.body.listName.trim();

  if(checkedListName===day)
  {
    Item.findByIdAndRemove(checkedItemId).then(function(foundItem){Item.deleteOne({_id: checkedItemId})})
   res.redirect("/");
  } else{
    List.findOneAndUpdate({name:checkedListName},{$pull:{items:{_id:checkedItemId}}}).catch((err)=>{console.log("something wrong happen")});
    
    res.redirect("/"+checkedListName);
  }
});




app.get("/:customListName",function(req,res){
  var customListName = _.capitalize(req.params.customListName);
  
  List.findOne({name:customListName}).then((foundItem)=>{
    if(foundItem)
    {
      //show the existing list
      res.render("list",{listTitle:customListName, newListItems: foundItem.items});
      
    }
    else{
      //console.log("dOES NOT EXISTS");
      //create a new list
      const list = new List({
        name:customListName,
        items:defaultItems
      });
      // save the new list
      list.save();
      res.redirect("/"+customListName);
      
    }
   
  });

})

/*
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});
*/
app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
