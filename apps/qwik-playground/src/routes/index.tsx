import type { QRL } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import {
  type SubmitHandler,
  formAction$,
  useForm,
  zodForm$,
} from "@modular-forms/qwik";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Please enter your password"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export const useFormAction = formAction$<LoginForm>((values) => {
  console.log("formAction", values);

  // Runs on server
}, zodForm$(LoginSchema));

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: "",
  password: "",
}));

export default component$(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: zodForm$(LoginSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit: QRL<SubmitHandler<LoginForm>> = $((values, event) => {
    console.log("handleSubmit", values);

    // Runs on client
  });

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
        <Form onSubmit$={handleSubmit} class="space-y-4 p-6">
          <Field name="email">
            {(field, props) => (
              <div class="space-y-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for={field.name}
                >
                  Email
                </label>
                <input
                  class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id={field.name}
                  placeholder="Email"
                  value={field.value}
                  {...props}
                />
                {field.error && <p class="text-red-700">{field.error}</p>}
              </div>
            )}
          </Field>
          <Field name="password">
            {(field, props) => (
              <div class="space-y-2">
                <label
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for={field.name}
                >
                  Password
                </label>
                <input
                  class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id={field.name}
                  placeholder="Password"
                  type="password"
                  value={field.value}
                  {...props}
                />
                {field.error && <p class="text-red-700">{field.error}</p>}
              </div>
            )}
          </Field>
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
