const express = require("express");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const router = express.Router();

/*@usage :Register a User
  @url: api/users/register
  @method:POST
  @fields:Name,Email,Password
  @Access :PUBLIC
  */

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("name is required"),
    body("password").notEmpty().withMessage("password is required"),
    body("email").notEmpty().withMessage("email is required"),
  ],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }

    try {
      let { name, password, email } = request.body;

      //check user is already exists or not

      let user = await User.findOne({ email: email });

      if (user) {
        return response
          .status(401)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //encode the password

      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      //gravatar the image

      let avatar = gravatar.url(email, {
        s: "300",
        r: "pg",
        d: "mm",
      });

      //insert data to db

      user = new User({
        name,
        password,
        email,
        avatar,
      });

      await user.save();

      response.status(200).json({ msg: "Registration is successful" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ errors: [{ msg: error.message }] });
    }
  }
);

/**
 * @usage:Login user
 * @URL:'/api/users/login
 * @fields:emai,password
 * @method:post
 * @access:public
 *
 */

router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }

    try {
      let { email, password } = request.body;

      //check user is exists or not

      let user = await User.findOne({ email: email });
      if (!user) {
        return response
          .status(401)
          .json({ errors: [{ msg: "Email is Invalid" }] });
      }

      //check password

      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response
          .status(401)
          .json({ errors: [{ msg: "Password is Invalid" }] });
      }

      //create a token

      let payload = {
        user: {
          id: user.id,
          name: user.name,
          
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET_KEY, (err, token) => {
        if (err) throw err;
        response.status(200).json({ msg: "Login Success", token: token });
      });
    } catch (error) {
      console.error(error);
      response.status(401).json({ errors: [{ msg: error.message }] });
    }
  }
);

module.exports = router;
