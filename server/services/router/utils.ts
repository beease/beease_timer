import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { VERIFY_TOKEN } from "../auth";

export const checkRoleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (allowedRoles.length === 0) {
      next();
    } else {
      const token = req.headers?.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ data: {}, msg: "No token, authorization denied" });
      }
      return VERIFY_TOKEN(token, allowedRoles).then((response) => {
        if (response.status === 200) {
          req.body.tokenPayload = response.data;
          next();
        } else {
          return res.status(response.status).json(response.msg);
        }
      });
    }
  };
};

export const handleAsyncError = async (
  res: Response,
  executeOperation: () => Promise<any>
) => {
  try {
    const data = await executeOperation();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { handleAsyncError, checkRoleMiddleware };
