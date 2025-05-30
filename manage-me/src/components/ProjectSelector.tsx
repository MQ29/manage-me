import { useEffect, useState } from "react";
import { ActiveProjectApi } from "../api/ActiveProjectApi";
import type { Project } from "../types/Project";
import { ProjectApi } from "../api/ProjectApi";

type ProjectSelectorProps = {
  onProjectChange: (project: Project | null) => void;
};

export function ProjectSelector({ onProjectChange }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const all = await ProjectApi.getAll();
    setProjects(all);

    const activeId = ActiveProjectApi.getActiveProjectId();
    if (activeId) {
      const found = all.find((p) => p.id === activeId) ?? null;
      setActiveProject(found);
      onProjectChange(found);
    } else {
      setActiveProject(null);
      onProjectChange(null);
    }
  }

  function handleSelect(id: string) {
    ActiveProjectApi.setActiveProjectId(id);
    const found = projects.find((p) => p.id === id) ?? null;
    setActiveProject(found);
    onProjectChange(found);
  }

  function handleEdit(project: Project) {
    setEditId(project.id);
    setEditName(project.name);
    setEditDescription(project.description);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    await ProjectApi.update({ id: editId, name: editName, description: editDescription });
    setEditId(null);
    setEditName("");
    setEditDescription("");
    await refresh();
  }

  async function handleDelete(id: string) {
    await ProjectApi.delete(id);
    if (activeProject?.id === id) {
      ActiveProjectApi.clear();
      setActiveProject(null);
      onProjectChange(null);
    }
    await refresh();
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) =>
          editId === project.id ? (
            <form
              onSubmit={handleEditSubmit}
              key={project.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col gap-2 border-2 border-blue-400 dark:border-blue-500"
            >
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                placeholder="Nazwa projektu"
              />
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Opis projektu"
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors duration-200">
                  Zapisz
                </button>
                <button 
                  type="button" 
                  className="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200" 
                  onClick={() => setEditId(null)}
                >
                  Anuluj
                </button>
              </div>
            </form>
          ) : (
            <div
              key={project.id}
              className={`
                shadow rounded-lg p-4 flex flex-col border-2 cursor-pointer transition-all duration-200
                ${
                  activeProject?.id === project.id 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400" 
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
              onClick={() => handleSelect(project.id)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") handleSelect(project.id);
              }}
            >
              <div className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{project.name}</div>
              <div className="text-gray-600 dark:text-gray-300 flex-1 mb-2">
                {project.description || <span className="italic text-gray-400 dark:text-gray-500">Brak opisu</span>}
              </div>
              <div className="flex gap-2 mt-auto pt-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200"
                  onClick={e => {
                    e.stopPropagation();
                    handleEdit(project);
                  }}
                  type="button"
                >
                  Edytuj
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-200"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                  type="button"
                >
                  Usuń
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
