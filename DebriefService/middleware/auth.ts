import { JwtUtil } from "../jwt/jwtUtil.ts";
import { corsHeaders, logger } from "../consts/consts.ts";

export async function authGuard(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ success: false, message: "Missing token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const isValid = await JwtUtil.verifyAccessToken(token);
  if (!isValid) {
    logger.error("Invalid or blacklisted token");

    return new Response(JSON.stringify({ success: false, message: "Invalid token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  // If valid, return null, indicating the request may proceed
  return null;
}