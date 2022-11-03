const Blog_Setting=require("../models/blogSettingModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const bcrypt = require("bcrypt");

const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}


// const login = (req,res)=>{
//     res.send("Hi login Here")
// }


const blogSetup = async(req,res)=>{
   try {
    const blogSetting = await Blog_Setting.find({});
    if(blogSetting.length > 0){
        res.redirect("/login")
    }else{
        res.render('blogSetup')
    }
   } catch (error) {
    console.log(error.message);
   }
}
const blogSetupSave = async(req,res)=>{
    try {
       const blog_title = req.body.blog_title;
       const blog_image = req.file.filename;
       const description = req.body.description;
       const email = req.body.email;
       const name = req.body.name;
       const password = await securePassword(req.body.password);

       const BlogSetting = new Blog_Setting({
        blog_title:blog_title,
        blog_logo:blog_image,
        description:description,
       });
       await BlogSetting.save();

      const user = new User({
        name:name,
        email:email,
        password:password,
        is_Admin:1
       })
       const userData = await user.save();
       if(userData){
        res.redirect('/login');
       }else{
        res.render('blogSetup',{message:'Blog not setup properly!'});
       }
        
    } catch (error) {
        console.log(error.message);
    }

}
const dashboard =async(req,res)=>{
    try {
        //res.send("Hi Admin Dashboard Here")
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}
const loadPostDashboard = async(req,res)=>{
    try {
        res.render('../views/admin/postDashboard');
       
    } catch (error) {
       console.log(error.message); 
    }
}
const addPost =async(req,res)=>{
    try {
        var image = '';
        if(req.body.image !== undefined){
            image=req.body.image;
        }
        const post = new Post({
            title:req.body.title,
            content:req.body.content,
            image:image
        });
        const postData = await post.save();
        res.render('../views/admin/postDashboard',{message:"Post added succesfully!"});

    } catch (error) {
        console.log(error.message); 
    }
}

const uploadPostImage =async(req,res)=>{
    try {
        var imagePath = '/images';
        imagePath = imagePath+'/'+req.file.filename;
        res.send({success:true,msg:'Image Posted Successfully !',path:imagePath})

    } catch (error) {
        res.send({success:false,msg:error.message})
        
    }
}
module.exports ={
    // login, 
    blogSetup,
    blogSetupSave,
    dashboard,
    loadPostDashboard,
    addPost,
    securePassword,
    uploadPostImage
}