import { component$ } from "@builder.io/qwik";
import { routeAction$, type RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = async ({ cookie, redirect }) => {
  const hasAuthCookie = cookie.get("auth_session");
  if (!hasAuthCookie) {
    throw redirect(308, "/");
  }
};

export const useLogoutAction = routeAction$(async (_data, requestEvent) => {
  console.log(requestEvent.cookie.has("auth_session"));

  requestEvent.cookie.delete("auth_session");

  console.log(requestEvent.cookie.has("auth_session"));

  return {
    success: true,
  };
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
