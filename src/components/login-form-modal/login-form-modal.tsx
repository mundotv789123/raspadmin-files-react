import AuthService from "@/services/services/auth-service";
import { FormEvent, useState } from "react";

export default function LoginFormModal() {
  const loginService = new AuthService();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  function submit(event: FormEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;

    setLoading(true);
    setErrorMessage(null);
    loginService
      .login({
        username: username,
        password: password,
      })
      .then(() => {
        location.reload();
        setErrorMessage(null);
      })
      .catch((error) => {
        setErrorMessage(error.message ?? "Erro genérico");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="fixed h-screen w-screen flex justify-center items-center p-5 bg-zinc-950">
      <div className="bg-zinc-700 p-6 rounded-xl w-screen md:max-w-80 max-w-64 animate-modal-down text-center">
        <h2 className="font-bold text-2xl mb-4">Login</h2>
        <form className="max-w-sm mx-auto" onSubmit={submit}>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              className="outline-none bg-zinc-700 border text-white border-gray-300  text-sm rounded-lg block w-full p-2 text-center"
              placeholder="username"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
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
              className="bg-white text-zinc-700 border border-white hover:bg-gray-300 hover:text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2 text-center"
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
