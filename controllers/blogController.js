const Post = require("../models/postModel");
const { ObjectId } = require("mongodb");
const config = require("../config/config");
const nodemailer = require("nodemailer");

const sendCommentEmail = async (name, email, post_id,reply) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    const mailOption = {
      from: "BMS",
      to: email,
      subject: "You have New Reply",
      html: `<p>Hi, ${name} ${' '} has replies to your comment  <a href="http://localhost:3000/post/${post_id}">Reade here this reply</a>your password
             <br> <p>message :${reply}</p>
      `,
      // html:'<p>Hi  Plesa Check here to <a href="http://localhost:3000/reset-password?token">Reset</a>your password'
    };
    transport.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully:-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loadBlog = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("blog", { posts: posts });
  } catch (error) {
    console.log(error.message);
  }
};
const loadPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    //res.send(post)
    res.render("post", { post: post });
  } catch (error) {
    console.log(error.message);
  }
};
const addComment = async (req, res) => {
  try {
    const post_id = req.body.post_id;
    const username = req.body.username;
    const email = req.body.email;
    const comment = req.body.comment;
    var comment_id = new ObjectId();
    await Post.findByIdAndUpdate(
      { _id: post_id.trim() },
      {
        $push: {
          comments: {
            _id: comment_id,
            username: username,
            email: email,
            comment: comment,
          },
        },
      }
    );
    res.status(200).send({ success: true, msg: "Comment added" });
  } catch (error) {
    res.status(200).send({ success: false, msg: error.message });
  }
};

const doReply = async (req, res) => {
  try {
    var reply_id = new ObjectId();
    const replyUser = await Post.updateOne(
      {
        _id: ObjectId(req.body.post_id),
        "comments._id": ObjectId(req.body.comment_id),
      },
      {
        $push: {
          "comments.$.replies": {
            _id: reply_id,
            name: req.body.name,
            reply: req.body.reply,
          },
        },
      }
    );
    sendCommentEmail(req.body.name, req.body.comment_email, req.body.post_id,req.body.reply);
    console.log("reply");
    res.status(200).send({ success: true, msg: "Reply added !" });
  } catch (error) {
    res.status(200).send({ success: false, msg: error.message });
  }
};
module.exports = {
  loadBlog,
  loadPost,
  addComment,
  doReply,
};
