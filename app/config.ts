import {createThirdwebClient} from "thirdweb";

// Validate environment variables
if (!process.env.NEXT_PUBLIC_CLIENT_ID) {
  console.warn("NEXT_PUBLIC_CLIENT_ID is not set. Please add it to your .env.local file");
}

export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
  // Note: clientSecret should only be used server-side, not in client-side code
  // Remove clientSecret from client-side configuration
});
