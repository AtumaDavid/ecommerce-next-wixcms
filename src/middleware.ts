// cart should work even if user isnt logged in
import { OAuthStrategy, createClient } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const cookies = request.cookies;
  const res = NextResponse.next();

  // Check if the "refreshToken" cookie already exists
  if (cookies.get("refreshToken")) {
    // If the cookie exists, proceed with the response as is
    return res;
  }

  // If the cookie does not exist, create a Wix client for authentication
  const wixClient = createClient({
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
  });

  // Generate visitor tokens using the Wix client
  const token = await wixClient.auth.generateVisitorTokens();
  // Set the "refreshToken" cookie with the generated token, with a max age of 30 days
  res.cookies.set("refreshToken", JSON.stringify(token.refreshToken), {
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
};

// This middleware checks if a user has a "refreshToken" cookie.
// If the cookie exists, it allows the request to proceed without any changes.
// If the cookie does not exist, it creates a new Wix client and generates a visitor token.
// It then sets a new "refreshToken" cookie with the generated token, valid for 30 days.
// Finally, it returns the response, ensuring that the cart functionality can work even if the user is not logged in.
