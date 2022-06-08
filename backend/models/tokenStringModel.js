import mongoose from "mongoose";
import randtoken from "rand-token";
import { variables } from "../log";
const tokenStringSchema = mongoose.Schema({
  tokenString: {
    type: String,
    default: function () {
      return randtoken.generate(32);
    },
  },
  createdAt: { type: Date, expires: variables.EXPIRES, default: Date.now },
});

const TokenString = mongoose.model("TokenString", tokenStringSchema);
export default TokenString;
