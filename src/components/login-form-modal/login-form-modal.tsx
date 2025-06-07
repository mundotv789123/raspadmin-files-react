import { LoginRequest } from "@/services/models/auth-models";
import useAuthService from "@/services/services/auth-service";
import { useActionState, useState } from "react";

export default function LoginFormModal() {
  const loginService = useAuthService();

  async function login(_status: string | null, payload: FormData) {
    try {
      const data = {
        username: payload.get("username") as string,
        password: payload.get("password") as string,
      };
      await loginService.login(data);
      location.reload();
    } catch (error) {
      console.log(error);
      const defaultMessage = "Ocorreu um erro ao enviar requisição";
      if (error instanceof Error) {
        return error.message ?? defaultMessage;
      }
      return defaultMessage;
    }

    return null;
  }

  const [errorMessage, formAction, loading] = useActionState<
    string | null,
    FormData
  >(login, null);
  const [formState, setFormState] = useState<LoginRequest>();

  return (
    <div className="fixed h-screen w-screen flex justify-center items-center p-5 bg-zinc-950">
      <div className="bg-zinc-700 p-6 rounded-xl w-screen md:w-64 animate-modal-down text-center">
        <h2 className="font-bold text-2xl mb-4">Login</h2>
        <form
          className="max-w-sm mx-auto"
          method="post"
          action={formAction}
          onChange={(e) => {
            setFormState({
              username: e.currentTarget.username.value as string,
              password: e.currentTarget.password.value as string,
            });
          }}
        >
          <div className="mb-4">
            <input
              type="text"
              name="username"
              value={formState?.username ?? ""}
              className="outline-none bg-zinc-700 border text-white border-gray-300  text-sm rounded-lg block w-full p-2 text-center"
              placeholder="username"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formState?.password ?? ""}
              className="outline-none bg-zinc-700 text-white border border-gray-300 text-sm rounded-lg block w-full p-2 text-center"
              placeholder="password"
            />
          </div>
          {errorMessage && (
            <p className="text-red-400 mb-4 text-sm">{errorMessage}</p>
          )}
          {loading && <div className="bg-white h-1 animate-loading mb-4"></div>}
          <div className="text-center">
            <button
              type="submit"
              className="text-white border border-white bg-zinc-700 hover:bg-zinc-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
              disabled={loading}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
