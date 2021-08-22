const express = require("express");
const bparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine','ejs')
app.use(bparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"))

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true,useUnifiedTopology: true});

const articleSchema = {
    title : String,
    content : String
};

const Article = mongoose.model("Article",articleSchema);

///////////REQUEST TARGTTING ALL THE ARTICLES//////////

app.route("/articles").get(function(req,res){
    Article.find({},function(err,foundArticles){
        if(err)
        {
            res.send(err);
        }
        else
        {
             // console.log(foundArticles);
             res.send(foundArticles);
        }
    });
 })
 .post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });
    newArticle.save(function(err){
        if(!err)
        {
            res.send("successfully added a new article");
        }
        else
        {
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send("successfully deleted all the articles");
        }
    });
});

///////////REQUEST TARGTTING A SPECIFIC ARTICLE//////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
        if(err)
        {
            res.send(err);
        }
        else
        {
            if(foundArticle)
            {
                res.send(foundArticle);
            }
            else
            {
                res.send("No such articles found");
            }
        }
    });
})
.put(function(req,res){
    Article.updateOne({title : req.params.articleTitle},
        {title : req.body.title , content : req.body.content},
        {overwrite : true},
        function(err){
            if(err)
            {
                res.send(err);
            }
            else
            {
                res.send("Article updated successfully");
            }
        });
})
.patch(function(req,res){
    Article.updateOne({title : req.params.articleTitle},
        {$set : req.body},
        function(err){
            if(err)
            {
                res.send(err);
            }
            else
            {
                res.send("Article updated successfully");
            }
        });
})
.delete(function(req,res){
    Article.deleteOne({title : req.params.articleTitle},function(err){
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send("Article deleted successfully");
        }
    });
});


app.listen(3000,function(){
    console.log("port created at 3000");
});