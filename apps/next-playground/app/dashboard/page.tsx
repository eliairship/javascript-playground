import { Signin } from "@/routes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// TODO: Check Token expiration
async function getProtected(accessToken: string) {
  try {
    const res = await fetch(
      "https://javascript-playground-5ccu.onrender.com/protected",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to get user data - Response not ok");
    }

    const data = await res.json();
    if (!data?.user) {
      throw new Error("Failed to get user data - No data");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}
const DashboardPage = async () => {
  const accessToken = cookies().get("session");
  console.log(accessToken?.value);

  if (!accessToken?.value) {
    redirect(Signin());
  }

  const data = await getProtected(accessToken.value);
  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage;
