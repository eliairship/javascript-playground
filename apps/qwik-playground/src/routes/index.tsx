import { component$ } from "@builder.io/qwik";
import { routeAction$, zod$, z, Form } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";

export const useLoginAction = routeAction$(
  async (user) => {
    return { success: true, user };
  },
  // Zod schema is used to validate the FormData
  zod$({
    email: z.string().email(),
    password: z.string().min(1, "Please enter your password"),
  }),
);

export default component$(() => {
  const action = useLoginAction();
  console.log("🚀 ~ action:", action);

  return (
    <div class="flex h-screen flex-col items-center justify-center">
      <div
        class="bg-card text-card-foreground rounded-lg border shadow-sm"
        data-v0-t="card"
      >
        <div class="flex flex-col space-y-2 p-6">
          <h3 class="whitespace-nowrap text-2xl font-semibold tracking-tight">
            Login
          </h3>
          <p class="text-muted-foreground text-sm">
            Enter your email below to login to your account.
          </p>
        </div>
        <Form action={action} class="space-y-4 p-6">
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="email"
            >
              Email
            </label>
            <input
              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
              name="email"
              placeholder="Email"
            />
            {action.value?.failed && (
              <p class="text-red-700">{action.value.fieldErrors.email}</p>
            )}
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="password"
            >
              Password
            </label>
            <input
              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              name="password"
              placeholder="Password"
              type="password"
            />
            {action.value?.failed && (
              <p class="text-red-700">{action.value.fieldErrors.password}</p>
            )}
          </div>
          <div class="flex items-center p-6">
            <button
              class="ring-offset-background focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              type="submit"
            >
              Login
            </button>
          </div>
        </Form>
      </div>
      {action.value?.success && <p class="pt-4">Logged in successfully</p>}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
