import { useEffect, useState } from "react";
import { AddProject } from "./components/AddProject";
import { ProjectSelector } from "./components/ProjectSelector";
import type { Project } from "./types/Project";
import type { User } from "./types/User";
import { StoryList } from "./components/StoryList";
import api from "./api/api";
import { LoginForm } from "./components/LoginForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectsVersion, setProjectsVersion] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      api
        .get("me/")
        .then((res) => {
          setUser(res.data);
          setIsAuthenticated(true);
        })
        .catch(() => setIsAuthenticated(false));
    }
  }, []);

  async function handleLogin() {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const res = await api.get("me/");
        setUser({ ...res.data });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    setUser(null);
  }

  function refreshProjects() {
    setProjectsVersion((v) => v + 1);
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="p-4 max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center text-gray-900 dark:text-white">
          <span>
            <span className="font-bold">Zalogowany jako: </span>
            {user?.first_name} {user?.last_name}
            {user?.role && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({user.role})
              </span>
            )}
          </span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold flex items-center gap-2
                ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                }`}
              title="Przełącz tryb jasny/ciemny"
            >
              {darkMode ? "☀️ Tryb jasny" : "🌙 Tryb ciemny"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              Wyloguj
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <AddProject onAdd={refreshProjects} />
          <ProjectSelector
            key={projectsVersion}
            onProjectChange={setActiveProject}
          />

          {activeProject ? (
            <div>
              <StoryList projectId={activeProject.id} />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Wybierz projekt, żeby zobaczyć jego historyjki
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
