const express = require("express");
const { check, validationResult } = require("express-validator");
const confiq = require("./../envConfiq");
const { userschema } = require("./../schema/schema");
const { fetchuser } = require("./../controller/controller");
const router = express.Router();
const bcryt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const jwtsecret = confiq.jwtSecret;
const { upload } = require("./../multer/multer");
const e = require("express");
// signup route
router.post(
  "/signup",
  [
    check("Email", "enter valid email").isEmail(),
    check("password", "password atleast minimum length is 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { Email, password } = req.body;
      const checkexitinguser = await (
        await userschema()
      ).findOne({
        email: Email,
      });
      console.log(checkexitinguser);
      if (checkexitinguser) {
        return res.status(409).json("User already exists");
      }
      const hashedpassword = bcryt.hashSync(password, 10);
      const user = new (await userschema())({
        email: Email,
        password: hashedpassword,
      });
      const save_status = await user.save();
      if (save_status) {
        const token = jwt.sign({ _id: save_status._id }, jwtsecret);
        return res.status(200).send({ token: token });
      }
    } catch (e) {
      console.log(e.message);
      res.status(500).json("Server error");
    }
  }
);
// login route
router.post(
  "/authenticate",
  [check("Email").isEmail(), check("password").isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      const userdata = await (
        await userschema()
      ).findOne({ email: req.body.Email });
      if (userdata) {
        const passwordmatching = await bcryt.compare(
          req.body.password,
          userdata.password
        );
        if (passwordmatching) {
          const token = jwt.sign({ _id: userdata._id }, jwtsecret);
          res.status(200).send({ token: token });
        } else {
          res.status(400).json("Enter correct password");
        }
      } else {
        res.status(404).json("User not found");
      }
    } catch (err) {
      res.status(500).json("Server error");
    }
  }
);
// getuserdetail route
router.get("/getdata", fetchuser, async (req, res) => {
  try {
    const userid = req.users._id;
    console.log(userid);
    const userdata = await (await userschema())
      .findOne({ _id: userid })
      .select("-password");
      console.log(userdata)
    res.status(200).send({ userdata, msg: true });
  } catch (e) {
    console.log(e);
  }
});
router.put(
  "/profile/pic",
  [fetchuser, upload.single("file")],
  async (req, res) => {
    try {
      const userid = req.users._id;
      const userdata = await (
        await userschema()
      ).updateOne({ _id: userid }, { file: req.file });
      console.log(userdata)
      if (userdata.modifiedCount > 0) {
        return res.status(200).json(" updated successfully.");
      } else {
        return res.status(404).json({ message: "not found " });
      }
    } catch (error) {
      console.log(e.message);
    }
  }
);
module.exports = router;
