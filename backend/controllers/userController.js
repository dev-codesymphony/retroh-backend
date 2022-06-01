import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Get user profile
// @route   Get /api/users/profile
// @access  Private
const get = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    create user
// @route   post /api/users
// @access  public
const create = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  const createdUser = await user.save();
  // Check if req.query has referredBy eg. /api/users?referredBy=5f4b8f8f5f4b8f8f5f4b8f8f
  if (req.query.referredby) {
    // Find the user who referred the user by the id
    const userExists = await User.findById(req.query.referredby);
    // checking if the user who invited exists
    if (userExists) {
      // Giving 1 arcade point to the user who referred the user
      userExists.arcadePoint += 1;
      userExists.save();
      // Giving 1 arcade point to the user who joined using invite link
      createdUser.arcadePoint += 1;
      createdUser.save();
    }
  }
  // if user is created successfully
  res.status(201).res.json(createdUser);
});

// @desc    Update user profile
// @route   patch /api/users
// @access  Private
const patch = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    verify discord
// @route   patch /api/users/verifyDiscord
// @access  Private
const verifyDiscord = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.verifiedInDiscord = true;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// @desc    twitter followed
// @route   patch /api/users/twitterFollowed
// @access  Private
const twitterFollowed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (user.twitterFollowed.includes(req.body.twitterFollowed)) {
      res.status(400);
      throw new Error("User already followed");
    }

    user.twitterFollowed = [...user.twitterFollowed, req.body.twitterFollowed];
    user.arcadePoint += 1;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    twitter followed
// @route   patch /api/users/twitterRetweeted
// @access  Private
const twitterRetweeted = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (user.twitterRetweeted.includes(req.body.twitterRetweeted)) {
      res.status(400);
      throw new Error("User already followed");
    }

    user.twitterRetweeted = [
      ...user.twitterRetweeted,
      req.body.twitterRetweeted,
    ];
    user.arcadePoint += 1;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    twitter tweeted specific handle
// @route   patch /api/users/twitterFollowed
// @access  Private
const twitterTweetedHandle = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (user.twitterTweetedHandle.includes(req.body.tweetedHandle)) {
      res.status(400);
      throw new Error("User already followed");
    }

    user.twitterTweetedHandle = [
      ...user.twitterTweetedHandle,
      req.body.tweetedHandle,
    ];
    user.arcadePoint += 1;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   Get /api/users
// @access  Public
const find = asyncHandler(async (req, res) => {
  // If a query string ?publicAddress=... is given, then filter results
  const whereClause =
    req.query && req.query.publicAddress
      ? {
          publicAddress: req.query.publicAddress,
        }
      : {};

  const users = await User.find(whereClause);
  res.json(users);
});

export {
  find,
  get,
  create,
  patch,
  verifyDiscord,
  twitterFollowed,
  twitterRetweeted,
  twitterTweetedHandle,
};
