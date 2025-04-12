import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res
        .status(400)
        .json({ error: "Post must have either text or img" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res.status(401).json({ error: "Not authorized to delete!" });

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Comment field is empty" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = {
      text: text,
      user: userId,
    };

    post.comments.push(comment);
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      //unlike function
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //like function
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      await Notification.create({
        to: post.user,
        from: userId,
        type: "like",
      });
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
