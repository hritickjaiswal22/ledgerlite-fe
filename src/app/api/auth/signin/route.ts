import { handleAuthRequest } from "@/app/api/auth/auth-handler";

const EXPRESS_URL = process.env.EXPRESS_API_URL;

export async function POST(request: Request) {
  return handleAuthRequest(request, `${EXPRESS_URL}/auth/signin`);
}
