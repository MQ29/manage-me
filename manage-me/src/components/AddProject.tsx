import { useState } from "react";
import { ProjectApi } from "../api/ProjectApi";

type AddProjectProps = {
  onAdd: () => void; 
};

export function AddProject({ onAdd }: AddProjectProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    ProjectApi.add({ name, description });
    setName("");
    setDescription("");
    onAdd();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700 transition-colors duration-200">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nazwa projektu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white transition-colors duration-200"
          required
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Opis projektu"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white transition-colors duration-200"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          Dodaj projekt
        </button>
      </div>
    </form>
  );
}
