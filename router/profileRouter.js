const express = require("express");
let Profile = require("../models/Profile");
let User = require("../models/User");

const router = express.Router();

const { body, validationResult } = require("express-validator");
const authenticate = require("../middleware/authenticate");

/**
 * @usage: Create Profile Info
 * @URL: /api/profiles/me
 * @fields: company, website, location, designation, skills, bio, githubUsername, youtube, facebook, twitter, linkedin, instagram
 * @method: POST
 * @access: private
 */

router.post(
  "/",
  [
    body("company").notEmpty().withMessage("Company is required"),
    body("website").notEmpty().withMessage("website is required"),
    body("location").notEmpty().withMessage("location is required"),
    body("designation").notEmpty().withMessage("designation is required"),
    body("skills").notEmpty().withMessage("Skills is required"),
    body("bio").notEmpty().withMessage("Bio is required"),
    body("githubUsername").notEmpty().withMessage("githubUsername is required"),
    body("youtube").notEmpty().withMessage("youtube is required"),
    body("facebook").notEmpty().withMessage("facebook is required"),
    body("twitter").notEmpty().withMessage("twitter is required"),
    body("linkedin").notEmpty().withMessage("linkedin is required"),
    body("instagram").notEmpty().withMessage("instagram is required"),
  ],
  authenticate,
  async (request, response) => {
    //check for validation
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }

    try {
      //extract the data from request object

      const {
        company,
        website,
        location,
        designation,
        skills,
        bio,
        githubUsername,
        youtube,
        facebook,
        twitter,
        linkedin,
        instagram,
      } = request.body;

      //create the profile object

      let profileObj = {
        user: request.user.id, //associated the profile with authentication user
        company,
        website,
        location,
        designation,
        skills,
        bio,
        githubUsername,
        social: {
          youtube,
          facebook,
          twitter,
          linkedin,
          instagram,
        },
      };

      //insert the data into database

      profile = new Profile(profileObj);
      await profile.save();

      response.status(200).json({
        msg: "Profile is created",
        profile: profile,
      });
    } catch (error) {
      console.error(error);
      response.status(401).json({ errors: [{ msg: "Server errors" }] });
    }
  }
);

/**
 * @usage: update  Profile Info
 * @URL: /api/profiles/update
 * @fields: company, website, location, designation, skills, bio, githubUsername, youtube, facebook, twitter, linkedin, instagram
 * @method: POST
 * @access: private
 */

router.put(
  "/update",
  [
    body("company").notEmpty().withMessage("Company is required"),
    body("website").notEmpty().withMessage("Website is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("designation").notEmpty().withMessage("Designation is required"),
    body("skills").notEmpty().withMessage("Skills is required"),
    body("bio").notEmpty().withMessage("Bio is required"),
    body("githubUsername")
      .notEmpty()
      .withMessage("GitHub Username is required"),
    body("youtube").notEmpty().withMessage("YouTube is required"),
    body("facebook").notEmpty().withMessage("Facebook is required"),
    body("twitter").notEmpty().withMessage("Twitter is required"),
    body("linkedin").notEmpty().withMessage("LinkedIn is required"),
    body("instagram").notEmpty().withMessage("Instagram is required"),
  ],
  authenticate,
  async (request, response) => {
    // Check for validation errors
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract the data from the request body
      const {
        company,
        website,
        location,
        designation,
        skills,
        bio,
        githubUsername,
        youtube,
        facebook,
        twitter,
        linkedin,
        instagram,
      } = request.body;

      // Check if a profile exists for the user
      let profile = await Profile.findOne({ user: request.user.id });

      if (!profile) {
        return response
          .status(404)
          .json({ errors: [{ msg: "Profile not found" }] });
      }

      // Create a profile object
      const profileObj = {
        user: request.user.id,
        company,
        website,
        location,
        designation,
        skills,
        bio,
        githubUsername,
        social: {
          youtube,
          facebook,
          twitter,
          linkedin,
          instagram,
        },
      };

      // Update the profile object
      profile = await Profile.findOneAndUpdate(
        { user: request.user.id },
        profileObj,
        { new: true }
      );

      return response
        .status(200)
        .json({ msg: "Profile is updated successfully", profile });
    } catch (error) {
      console.error(error);
      response.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

//Get profile of the user

/**
 * @usage: Get  Profile of the user
 * @URL: /api/profiles/users:userId
 * @fields: no-fields
 * @method: GET
 * @access: public
 */

router.get("/users/:userId", async (request, response) => {
  try {
    let userId = request.params.userId;

    let profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      return response
        .status(404) // Change the status code to 404
        .json({ errors: [{ msg: "Profile is not found" }] });
    }

    response.status(200).json({ profile: profile });
  } catch (error) {
    console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});

/**
 * @usage: Delete the profile
 * @URL: /api/profiles/users:userId
 * @fields: no-fields
 * @method: GET
 * @access: public
 */

router.delete("/users/:userId", authenticate, async (request, response) => {
  try {
    let userId = request.params.userId;

    //check profile is exist of not
    
    //let profile = await Profile.findOne({ user: userId });
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return response
        .status(401)
        .json({ errors: [{ msg: "Profile is not found" }] });
    }
    //delete the profile 
    profile = await Profile.findOneAndRemove({ user: userId });
    await User.findOneAndRemove({ user: userId });

    //todo delete the user of the post

    response.status(200).json({ msg: "Profile is Deleted" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});

module.exports = router;
