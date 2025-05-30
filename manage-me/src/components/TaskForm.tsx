import { useState } from "react";
import { TaskApi } from "../api/TaskApi";
import type { TaskPriority } from "../types/Task";

type Props = {
  storyId: string;
  onTaskAdded: () => void;
};

export function TaskForm({ storyId, onTaskAdded }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("średni");
  const [estimatedHours, setEstimatedHours] = useState(1);

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    await TaskApi.add({
      name,
      description,
      priority,
      storyId,
      estimatedHours,
    });
    setName("");
    setDescription("");
    setEstimatedHours(1);
    setPriority("średni");
    onTaskAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow transition-colors duration-200">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        className="border dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white transition-colors duration-200"
        placeholder="Nazwa zadania"
        required
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white transition-colors duration-200"
        placeholder="Opis"
      />
      <div className="flex gap-2 items-center text-gray-900 dark:text-white">
        <span>Priorytet:</span>
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as TaskPriority)}
          className="border dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white transition-colors duration-200"
        >
          <option value="niski">Niski</option>
          <option value="średni">Średni</option>
          <option value="wysoki">Wysoki</option>
        </select>
        <span>Szac. godziny:</span>
        <input
          type="number"
          min={1}
          value={estimatedHours}
          onChange={e => setEstimatedHours(Number(e.target.value))}
          className="border dark:border-gray-600 rounded p-1 w-16 dark:bg-gray-700 dark:text-white transition-colors duration-200"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 self-end transition-colors duration-200"
      >
        Dodaj
      </button>
    </form>
  );
}
