const { default: mongoose } = require("mongoose");
const userschema = async () => {
  const UserSchema = new mongoose.Schema({
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    file:{
      type:Object
    }
  });
  const user_collection =
    mongoose.models["users"] || mongoose.model("users", UserSchema);
  return user_collection;
};
const commentreplyschema = new mongoose.Schema({
  createdby: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const commentSchema = new mongoose.Schema({
  createdby: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  replies: [commentreplyschema],
});
const Likeschema = new mongoose.Schema({
  Likedby: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const blogschema = async () => {
  const BlogSchema = new mongoose.Schema({
    createdby: {
      type: mongoose.Schema.ObjectId,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    file: {
      type: Object,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    comments: [commentSchema],
    likes: [Likeschema],
  });
  const blogcollection =
    mongoose.models["blogposts"] || mongoose.model("blogposts", BlogSchema);
  return blogcollection;
};
module.exports = { userschema, blogschema };
