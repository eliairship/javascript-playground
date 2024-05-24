import { Dashboard } from "@/routes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SignInPage = () => {
  async function handleSignIn(formData: FormData) {
    "use server";

    const rawFormData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const res = await fetch(
      "https://javascript-playground-5ccu.onrender.com/auth/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rawFormData),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to sign in - Response not ok");
    }

    const data = await res.json();

    if (!data?.accessToken) {
      throw new Error("Failed to sign in - No access token");
    }
    cookies().set("session", data.accessToken);

    redirect(Dashboard());
  }

  // TODO: Add error handling
  return (
    <div>
      Sign In
      <form action={handleSignIn}>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInPage;
