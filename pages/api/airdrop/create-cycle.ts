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
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { elements } = req.body;

  if (!Array.isArray(elements)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid request body" });
  }

  console.log("Elements: ", elements);

  try {
    const pipeline = redis.pipeline();

    for (const element of elements) {
      pipeline.hset(`cycle:${element.cycle}:${element.address}`, {
        cycle: element.cycle.toString(),
        address: element.address,
        amount: element.amount.toString(),
        created_at: new Date().getTime().toString(),
      });

      // Add to a sorted set for easy retrieval by cycle
      pipeline.zadd("airdrop_cycles", {
        score: element.cycle,
        member: `cycle:${element.cycle}:${element.address}`,
      });
    }

    await pipeline.exec();

    res
      .status(200)
      .json({ success: true, message: "Data added to Redis successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error adding data to Redis" });
  }
}
