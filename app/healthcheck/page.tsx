import { NextApiRequest, NextApiResponse } from "next";

export default async function Page(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "Server is running" });
}
