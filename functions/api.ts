import serverless from "serverless-http";
import { app, connectDB } from "../server";

export const handler = serverless(app, {
  request: async (request, event, context) => {
    await connectDB();
    console.log(`[API] Request: ${request.method} ${request.url}`);
    return request;
  }
});
