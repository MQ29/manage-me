import { useState } from "react";
import api from "../api/api";
import { GoogleLoginButton } from "./GoogleLoginButton";

type Props = {
  onLogin: () => void;
};

export function LoginForm({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post("login/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      onLogin();
    } catch {
      setError("Nieprawidłowy login lub hasło");
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4 border dark:border-gray-700 transition-all duration-200"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Logowanie
        </h2>
        <input
          className="border dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-white transition-colors duration-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Login"
          autoFocus
        />
        <input
          className="border dark:border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-white transition-colors duration-200"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Zaloguj
        </button>
        <div className="mt-4 flex justify-center">
          <GoogleLoginButton onSuccess={onLogin} />
        </div>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center mt-2 font-medium">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
