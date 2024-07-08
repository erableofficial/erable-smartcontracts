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
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { cycleId } = req.body;

  console.log(`cycle:${cycleId}`);

  if (!cycleId) {
    console.log("Cycle ID is required");
    return res
      .status(400)
      .json({ success: false, message: "Cycle ID is required" });
  }

  try {
    // Delete all keys matching the cycle ID
    const cycleKeys = await redis.keys(`cycle:${cycleId}:*`);
    await redis.del(...cycleKeys);
    console.log("Cycle keys deleted successfully");

    console.log(cycleKeys);

    await redis.zrem("airdrop_cycles", ...cycleKeys);
    console.log("CycleKeys deleted from Redis");

    return res
      .status(200)
      .json({ success: true, message: "Cycle deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting cycle from Redis" });
  }
}
