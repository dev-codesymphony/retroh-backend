import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    nonce: {
      type: Number,
      required: true,
      default: () => Math.floor(Math.random() * 1000000), // Initialize with a random nonce
    },
    publicAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      unique: true,
    },
    arcadePoint: {
      type: Number,
      default: 0,
    },
    verifiedInDiscord: {
      type: Boolean,
      default: false,
    },
    twitterFollowed: {
      type: [String],
      default: [],
    },
    twitterTweetedHandle: {
      type: [String],
      default: [],
    },
    twitterRetweeted: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
