import { cookies } from "next/headers";

async function Accounts() {
  // Await the cookies function to get the cookie store
  const cookieStore = await cookies();

  // Read a specific cookie
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await fetch(`${process.env.EXPRESS_API_URL}/accounts`, {
    method: "GET", // or 'POST', 'PUT', etc.
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json", // Usually required when sending data
    },
  });
  const data = await response.json();

  return (
    <main>
      <h1>Accounts</h1>
    </main>
  );
}

export default Accounts;
