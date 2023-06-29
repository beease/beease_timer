import { Response } from "express";



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

export default { handleAsyncError };
