import { component$ } from "@builder.io/qwik";
import { routeAction$ } from "@builder.io/qwik-city";
import { Signin } from "~/declarativeRoutes";

export const useLogoutAction = routeAction$(async (_data, requestEvent) => {
  console.log(requestEvent.cookie.has("session"));

  requestEvent.cookie.set("session", "", { path: "/", expires: new Date() });

  throw requestEvent.redirect(308, Signin());
});

export default component$(() => {
  const action = useLogoutAction();

  return (
    <div class="flex h-full flex-col items-center justify-center">
      Logged in
      <button
        type="button"
        class="mt-2 rounded bg-red-900 p-2 text-white hover:bg-red-900/90"
        onClick$={() => action.submit()}
      >
        Logout
      </button>
    </div>
  );
});
