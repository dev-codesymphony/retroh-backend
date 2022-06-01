import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Create
// @route   POST /api/auth/
// @access  Public
const create = asyncHandler(async (req, res) => {
  const { signature, publicAddress } = req.body;
  if (!signature || !publicAddress) {
    res.status(400);
    throw new Error("Request should have signature and publicAddress");
  }

  ////////////////////////////////////////////////////
  // Step 1: Get the user with the given publicAddress
  ////////////////////////////////////////////////////

  const userExists = await User.findOne({ publicAddress });

  if (!userExists) {
    res.status(401);
    throw new Error(
      `User with publicAddress ${publicAddress} is not found in database`
    );
  }

  ////////////////////////////////////////////////////
  // Step 2: Verify digital signature
  ////////////////////////////////////////////////////

  const msg = `I am signing my one-time nonce: ${userExists.nonce}`;

  // We now are in possession of msg, publicAddress and signature. We
  // will use a helper from eth-sig-util to extract the address from the signature
  const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });

  // The signature verification is successful if the address found with
  // sigUtil.recoverPersonalSignature matches the initial publicAddress
  if (address.toLowerCase() === publicAddress.toLowerCase()) {
    ////////////////////////////////////////////////////
    // Step 3: Generate a new nonce for the user
    ////////////////////////////////////////////////////
    userExists.nonce = Math.floor(Math.random() * 10000);
    await userExists.save();

    ////////////////////////////////////////////////////
    // Step 4: Create JWT
    ////////////////////////////////////////////////////
    const accessToken = generateToken(userExists._id);
    res.json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Signature verification failed");
  }
});

export { create };
