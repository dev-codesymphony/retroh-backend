import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import { variables } from "../log.js";
import { getUserFollowingData, getUserTweetsData } from "../utils/functions.js";
import fetch from "node-fetch";
import TokenString from "../models/tokenStringModel.js";
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

// @desc    consume a point and generate a token string
// @route   post /api/users/generateTokenString
// @access  Private
const generateTokenString = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.arcadePoint -= 1;
    const updatedUser = await user.save();

    const tokenString = await new TokenString().save();
    res.json(tokenString);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    directly expire token string
// @route   post /api/users/expireTokenString
// @access  Private
const expireTokenString = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const tokenString = await TokenString.findOne({
      tokenString: req.body.tokenString,
    });
    if (tokenString) {
      tokenString.remove();
      res.json(tokenString);
    } else {
      res.status(404);
      throw new Error("Token string invalid or missing");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    check token string is valid or not
// @route   post /api/users/tokenStringValid
// @access  Private
const tokenStringValid = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const tokenString = await TokenString.findOne({
      tokenString: req.body.tokenString,
    });
    if (tokenString) {
      res.json(tokenString);
    } else {
      res.status(404);
      throw new Error("Token string expired or invalid");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    verify discord
// @route   patch /api/users/verifyDiscord
// @access  Private
const verifyDiscord = asyncHandler(async (req, resp) => {
  const user = await User.findById(req.user._id);
  if (user) {
    // Step 1: Make a request to Discord's API to get the user's server list
    fetch(`https://discordapp.com/api/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${req.body.token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        // Step 2: Check if our server is in the user's server
        const guilds = response.map((guild) => guild.id);

        const SERVER = variables.server;
        const isInGuild = guilds.includes(SERVER);
        if (isInGuild) {
          // Step 3: If we are in the server, get the user's info
          fetch(
            `https://discordapp.com/api/users/@me/guilds/${SERVER}/member`,
            {
              headers: {
                Authorization: `Bearer ${req.body.token}`,
              },
            }
          )
            .then((res) => res.json())
            .then(async (res) => {
              // Step 4: Check if the user has a role in our server
              const roles = res.roles;
              const ROLE = variables.role;
              const hasRole = roles.includes(ROLE);
              if (hasRole) {
                // Step 5: If the user has the role, update in the database
                user.verifiedInDiscord = true;
                user.arcadePoint += 1;
                const updatedUser = await user.save();
                resp.status(201).resp.json(updatedUser);
              } else {
                resp.status(400);
                throw Error("Dont have role");
              }
            });
        } else {
          resp.status(400);
          throw Error("Not In Server");
        }
      })
      .catch((error) => {
        resp.status(400);
        throw Error(error.message);
      });
  } else {
    resp.status(404);
    throw new Error("User not found");
  }
});
// @desc    twitter followed
// @route   patch /api/users/twitterFollowed
// @access  Private
const twitterFollowed = asyncHandler(async (req, resp) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (user.twitterFollowed.includes(req.body.twitterFollowed)) {
      resp.status(400);
      throw Error("User already followed");
    }

    let pagination_token = null;
    let shouldRun;
    do {
      try {
        shouldRun = false;
        const data = await getUserFollowingData(
          req.body.user,
          pagination_token
        );
        const id =
          req.body.twitterFollowed === "official"
            ? variables.ACCOUNT_OFFICIAL
            : variables.ACCOUNT_FOUNDER;
        // eslint-disable-next-line
        const isFollowing = data.data.some((user) => user.id == id);
        if (isFollowing) {
          user.twitterFollowed = [
            ...user.twitterFollowed,
            req.body.twitterFollowed,
          ];
          user.arcadePoint += 1;

          const updatedUser = await user.save();
          resp.json(updatedUser);
        } else {
          if (data.meta && data.meta.next_token) {
            pagination_token = data.meta.next_token;
            shouldRun = true;
          } else {
            resp.status(400);
            throw Error("Please try again! You havent followed");
          }
        }
      } catch (error) {
        resp.status(400);
        throw Error(error);
      }
    } while (shouldRun);
  } else {
    resp.status(404);
    throw new Error("User not found");
  }
});

// @desc    twitter followed
// @route   patch /api/users/twitterRetweeted
// @access  Private
const twitterRetweeted = asyncHandler(async (req, resp) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (user.twitterRetweeted.length > 0) {
      resp.status(400);
      throw new Error("User already retweeted this specific tweet");
    }

    let pagination_token = null;
    let shouldRun = false;
    do {
      try {
        shouldRun = false;
        const data = await getUserTweetsData(req.body.user, pagination_token);

        const filteredData = data.data.filter((data) => {
          return data.referenced_tweets
            ? data.referenced_tweets.some(
                (tweet) => tweet.id === variables.TWEET
              )
            : false;
        });

        console.log("filteredData", filteredData);

        const hasRetweetedTweet = filteredData.length > 0;
        if (hasRetweetedTweet) {
          user.twitterRetweeted = [...user.twitterRetweeted, variables.TWEET];
          user.arcadePoint += 1;

          const updatedUser = await user.save();
          resp.json(updatedUser);
        } else {
          if (data.meta && data.meta.next_token) {
            pagination_token = data.meta.next_token;
            shouldRun = true;
          } else {
            resp.status(400);
            throw new Error(
              "Please try again! You haven't retweeted this specific tweet"
            );
          }
        }
      } catch (error) {
        resp.status(400);
        throw Error(error);
      }
    } while (shouldRun);
  } else {
    resp.status(404);
    throw new Error("User not found");
  }
});

// @desc    twitter tweeted specific handle
// @route   patch /api/users/twitterFollowed
// @access  Private
const twitterTweetedHandle = asyncHandler(async (req, resp) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (user.twitterTweetedHandle.length > 0) {
      resp.status(400);
      throw new Error("User already tweeted this specific handle");
    }

    let pagination_token = null;
    let shouldRun = false;
    do {
      try {
        shouldRun = false;
        const data = await getUserTweetsData(req.body.user, pagination_token);

        const filteredData = data.data.filter((data) => {
          return !data.entities
            ? false
              ? data.entities.referenced_tweets
              : false
            : !data.entities.mentions
            ? false
            : data.entities.mentions.some(
                (mention) => mention.username === variables.HANDLE
              );
        });

        const hasRetweetedHandle = filteredData.length > 0;
        if (hasRetweetedHandle) {
          user.twitterTweetedHandle = [
            ...user.twitterTweetedHandle,
            variables.HANDLE,
          ];
          user.arcadePoint += 1;

          const updatedUser = await user.save();
          resp.json(updatedUser);
        } else {
          if (data.meta && data.meta.next_token) {
            pagination_token = data.meta.next_token;
            shouldRun = true;
          } else {
            resp.status(400);
            throw Error(
              "Please try again! You havent tweeted this specific handle"
            );
          }
        }
      } catch (error) {
        resp.status(400);
        throw Error(error);
      }
    } while (shouldRun);
  } else {
    resp.status(404);
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
  generateTokenString,
  expireTokenString,
  tokenStringValid,
};
