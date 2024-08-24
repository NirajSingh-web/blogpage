const dotenv=require("dotenv");
dotenv.config();
const config_file = {
  mongodb_url: process.env.MONGODB_URL,
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
};
module.exports=config_file;
