const userModel = require("../models/user.model");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
}) => {
  if (!firstname || !lastname || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });

  return user;
};

module.exports.blacklistToken = async (token) => {
  try {
    await blacklistTokenModel.create({ token });
    return { success: true };
  } catch (error) {
    throw new Error("Failed to blacklist token");
  }
};
