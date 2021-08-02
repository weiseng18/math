import { VercelRequest, VercelResponse } from "@vercel/node"

const test = (req: VercelRequest, res: VercelResponse) => {
  res.send("API call successful")
}

export default {
  test,
}
