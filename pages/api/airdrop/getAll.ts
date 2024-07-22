import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  // Fetch data from Redis
  try {
    // Get all cycle:address keys
    const cycleKeys = await redis.zrange("airdrop_cycles", 0, -1);

    console.log("Cycle Keys : ", cycleKeys);

    // Fetch data for each key
    const dataPromises = cycleKeys.map((key) => redis.hgetall(key as string));
    const allData = await Promise.all(dataPromises);

    console.log("All Cycles : ", allData);

    return res.status(200).json({
      success: true,
      data: allData,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error fetching data from Redis",
      success: false,
    });
  }
}
