const express = require("express");
const { check, validationResult } = require("express-validator");
const { blogschema } = require("./../schema/schema");
const { fetchuser } = require("./../controller/controller");
const { upload } = require("../multer/multer");
const { default: mongoose } = require("mongoose");
const fs = require("fs");
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const blogdata = await (await blogschema()).find();
    return res.send(blogdata);
  } catch (e) {
    console.log(e.message);
  }
});
router.get("/particular", fetchuser, async (req, res) => {
  try {
    const blogdata = await (
      await blogschema()
    ).find({
      createdby: req.users._id,
    });
    return res.send(blogdata);
  } catch (e) {
    console.log(e.message);
  }
});
router.post(
  "/add",
  [
    upload.single("blog_image"),
    check("title", "Title is required").notEmpty(),
    check(
      "description",
      "description must be at least 10 characters long"
    ).isLength({ min: 10 }),
    fetchuser,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newdata = new (await blogschema())({
        createdby: req.users._id,
        ...req.body,
        file: req.file,
      });
      const save_status = await newdata.save();
      console.log(save_status);
      if (save_status) {
        return res.status(201).json("succesfully Created");
      }
    } catch (e) {
      console.log(e);
    }
  }
);
router.put(
  "/update:_id",
  [
    upload.single("blog_image"),
    check("title", "Title is required").notEmpty(),
    check(
      "description",
      "description must be at least 10 characters long"
    ).isLength({ min: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let data;
      if (req.file) {
        data = {
          ...req.body,
          file: req.file,
        };
      } else {
        data = { ...req.body };
      }
      const update = await (
        await blogschema()
      ).updateOne(
        {
          _id: req.params._id,
        },
        data
      );
      if (update.modifiedCount > 0) {
        res.status(200).json("Blog updated successfully.");
      } else {
        res.status(404).json({ message: "Blog not found " });
      }
    } catch (e) {
      console.log(e.message);
    }
  }
);
router.delete("/delete:_id", async (req, res) => {
  try {
    const deletion = await (
      await blogschema()
    ).deleteOne({ _id: req.params._id });
    console.log(deletion, req.params._id);
    if (deletion.deletedCount > 0) {
      res.status(200).json("Blog deleted successfully.");
    } else {
      res.status(404).json({ message: "Blog not found." });
    }
  } catch (e) {
    console.log(e);
  }
});
router.put(
  "/add/comment",
  [check("content").notEmpty(), fetchuser],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0] });
    }
    try {
      usercomment = {
        content: req.body.content,
        createdby: req.users._id,
      };
      const updatedata = await (
        await blogschema()
      ).updateOne(
        {
          _id: req.body._id,
        },
        { $push: { comments: usercomment } }
      );
      res.status(200).json("updated")
    } catch (e) {
      console.log(e.message);
    }
  }
);
router.put("/add/like", fetchuser, async (req, res) => {
  try {
    const data = {
      Likedby: req.users._id,
    };
    const updateOperation = req.body.status
      ? { $push: { likes: data } }
      : { $pull: { likes: data } };
    const updatedata = await (
      await blogschema()
    ).updateOne(
      {
        _id: req.body.postid,
      },
      updateOperation
    );
    console.log(updatedata);
  } catch (e) {
    console.log(e.message);
  }
});
router.put("/comment/reply", fetchuser, async (req, res) => {
  try {
    const data = {
      createdby: req.users._id,
      content: req.body.reply,
    };
    console.log(data);
    const updatedata = await (
      await blogschema()
    ).updateOne(
      { _id: req.body.postid, "comments._id": req.body.commentid },
      { $push: { "comments.$.replies": data } }
    );
    res.status(200).json("update succesfully");
  } catch (e) {
    console.log(e.message);
  }
});
module.exports = router;
