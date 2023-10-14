const express = require("express");
const authenticate = require("../middleware/authenticate");
let Profile = require("../models/Profile");
const { body, validationResult } = require("express-validator");
const router = express.Router();

/**
 * @usage: Create Profile Info
 * @URL: /api/profiles/
 * @fields: company, website, location, designation, skills, bio, githubUsername, youtube, facebook, twitter, linkedin, instagram
 * @method: POST
 * @access: private
 */

router.post(
  "/",
  [
    // Validation rules for the fields
    body("company").notEmpty().withMessage("Company is required"),
    body("website").notEmpty().withMessage("Website is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("designation").notEmpty().withMessage("Designation is required"),
    body("skills").notEmpty().withMessage("Skills is required"),
    body("bio").notEmpty().withMessage("Bio is required"),
    body("githubUsername").notEmpty().withMessage("GitHub Username is required"),
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
      // Extract data from the request body
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

      // Create a profile object
      let profileObj = {
        user: request.user.id, // This associates the profile with the authenticated user
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

      // Insert the profile into the database
      let profile = new Profile(profileObj);
      profile = await profile.save();

      response.status(200).json({
        msg: "Profile is created successfully",
        profile: profile,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
  }
);

module.exports = router;
