import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 5050,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expiration: process.env.JWT_ACCESS_EXPIRATION!,
  jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION!,
};

// all the environment variables are loaded from the .env file and exported as a default object for use in other parts of the application. The exclamation marks after some of the environment variables indicate that these values are expected to be defined and will throw an error if they are not.
