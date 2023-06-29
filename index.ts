import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import "dotenv/config";
import bcrypt from "bcrypt";
import type { IResponse, IUser } from "./interfaces";
import { connectToMongoDB, User } from "./mongo";
import jwt from "jsonwebtoken";
import { missingEmailField, missingPasswordField } from "./middlewares";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1, // allow 100 requests per 15 minutes, then...
  delayMs: 500,
});

const app = express();
app.use(express.json());
app.use(limiter);
app.use(speedLimiter);

const connString: string | undefined = process.env.MONGO_URL;
connectToMongoDB(connString);

app.post(
  "/register",
  missingEmailField,
  missingPasswordField,
  async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {
      email,
      password,
      role = 0,
    }: { email: string; password: string; role?: number } = req.body;

      console.log({password})
    try {
      const hashPassword = bcrypt.hashSync(password, 10);
      const newUser = new User({ email, password: hashPassword, role });
      await newUser.save();

      return res.status(200).json({
        ok: true,
        statusCode: 200,
        message: "User Successfully Created",
        details: newUser,
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        return res.status(409).json({
          ok: false,
          statusCode: 409,
          message: "Email Already Exists",
          details: error,
        });
      }
      return res.status(500).json({
        ok: false,
        statusCode: 500,
        message: "Internal Server Error",
        details: error,
      });
    }
  }
);

app.post(
  "/login",
  missingEmailField,
  missingPasswordField,
  async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
      const user: IUser | null = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          ok: false,
          statusCode: 401,
          message: "Authentication Fails",
          details: "",
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (isValidPassword) {
        const token = jwt.sign(
          { email: user.email, role: user.role },
          process.env.JWT_TOKEN || "",
          {
            expiresIn: "1m",
          }
        );

        return res.status(200).json({
          ok: true,
          statusCode: 200,
          message: `Welcome ${email}`,
          details: { token },
        });
      } else {
        return res.status(401).json({
          ok: false,
          statusCode: 401,
          message: "Authentication Fails",
          details: "",
        });
      }
    } catch (error) {
      return res.status(500).json({
        ok: false,
        statusCode: 500,
        message: "Internal Server Error",
        details: error,
      });
    }
  }
);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Authentication server running on port: ${port}`);
});
