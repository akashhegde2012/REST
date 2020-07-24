var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var methodOverride=require('method-override')
var expressSanitizer=require('express-sanitizer');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/restful_blog_app");

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

var port=process.env.PORT || 3000;
//Mongoose/model congig
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type: Date, default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
//routs
//index
app.get('/',function(req,res){
    res.redirect('/blogs');
});
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if (err)
        console.log('error');
        else
        res.render('index',{blogs:blogs});
    });
});

//new route
app.get('/blogs/new',function(req,res){
    res.render('new')
});

//create
app.post('/blogs',function(req,res){
    //sanitize the inpu
    req.body.blog.body=req.sanitize(req.body.blog.body);
  
    //create blog
    Blog.create(req.body.blog, function(err,newBlog){
        if (err)
        res.render('/new');
        else
        res.redirect('/blogs');
    });
});
// show route
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if (err)
        res.redirect('/index');
        else
        res.render('show',{blog:foundBlog});
    });
});

//edit
app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if (err)
        res.redirect('/blogs');
        else
        res.render('edit',{blog:foundBlog});
    });
    
});

//update route
app.put('/blogs/:id',function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
        res.redirect('/blogs');
        else
        res.redirect('/blogs/'+req.params.id);
    });
});
//delete
app.delete('/blogs/:id',function(req,res){
    //destroy
    Blog.findByIdAndRemove(req.params.id,function(err){
        if (err)
        res.redirect('/blogs');
        else
        res.redirect('/blogs');
    });
});

app.listen(port,function(){
    console.log('server is running');
});