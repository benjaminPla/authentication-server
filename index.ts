import express, { Request, Response } from "express";
import "dotenv/config";
import bcrypt from "bcrypt";
import type { IResponse, IUser } from "./interfaces";
import { connectToMongoDB, User } from "./mongo";
import jwt from "jsonwebtoken";
import { missingEmailField, missingPasswordField } from "./middlewares";

const app = express();
app.use(express.json());

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

const port = 5000;
app.listen(port, () => {
  console.log(`Authentication server running on port: ${port}`);
});
