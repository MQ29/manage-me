import { useEffect, useState, useCallback } from "react";
import type { Story, StoryPriority, StoryStatus } from "../types/Story";
import { StoryApi } from "../api/StoryApi";
import { UserApi } from "../api/UserApi";
import { TaskKanban } from "./TaskKanban";

const PRIORITIES: StoryPriority[] = ["niski", "średni", "wysoki"];
const STATUSES: StoryStatus[] = ["todo", "doing", "done"];
const STATUS_LABELS = {
  todo: "Czekające",
  doing: "W trakcie",
  done: "Zamknięte",
};

type StoryListProps = {
  projectId: string;
};

export function StoryList({ projectId }: StoryListProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<StoryStatus | "all">("all");
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<StoryPriority>("średni");

  const refresh = useCallback(async() => {
    setStories(await StoryApi.getByProject(projectId));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

 async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const currentUser = await UserApi.getCurrentUser();
    const ownerid = currentUser.id;
    await StoryApi.add({
      name,
      description,
      priority,
      projectId,
      status: "todo",
      ownerId: ownerid
    });
    setName("");
    setDescription("");
    setPriority("średni");
    await refresh();
  }

  function handleEdit(story: Story) {
    setEditingStory(story);
    setName(story.name);
    setDescription(story.description || "");
    setPriority(story.priority);
  }

async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingStory || !name.trim()) return;

    await StoryApi.update({
      ...editingStory,
      name,
      description,
      priority,
    });

    setEditingStory(null);
    setName("");
    setDescription("");
    setPriority("średni");
    await refresh();
  }

async function handleDelete(id: string) {
    await StoryApi.delete(id);
    await refresh();
  }

  const filteredStories =
    filter === "all" ? stories : stories.filter((s) => s.status === filter);

  return (
    <div>
      <form
        onSubmit={editingStory ? handleUpdate : handleAdd}
        className="flex flex-col gap-2 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingStory ? "Edytuj historyjkę" : "Dodaj historyjkę"}
          </h3>
          {editingStory && (
            <button
              type="button"
              onClick={() => {
                setEditingStory(null);
                setName("");
                setDescription("");
                setPriority("średni");
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Nazwa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
        />
        <textarea
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
        ></textarea>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as StoryPriority)}
          className="border dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-white"
        >
          {PRIORITIES.map((p) => (
            <option value={p} key={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 transition-colors duration-200"
        >
          {editingStory ? "Zapisz zmiany" : "Dodaj historyjkę"}
        </button>
      </form>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded transition-colors duration-200 ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          onClick={() => setFilter("all")}
        >
          Wszystkie
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            className={`px-3 py-1 rounded transition-colors duration-200 ${
              filter === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            onClick={() => setFilter(status)}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {filteredStories.length === 0 ? (
        <div className="text-gray-400 dark:text-gray-500">Brak historyjek</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filteredStories.map((story) => (
            <li
              key={story.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700 transition-colors duration-200"
            >
              <div
                className="flex justify-between items-start mb-2 cursor-pointer"
                onClick={() =>
                  setExpandedStoryId(
                    expandedStoryId === story.id ? null : story.id
                  )
                }
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {story.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(story);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(story.id);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-200"
                  >
                    Usuń
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {story.description}
              </p>
              <div className="flex gap-4 text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400">
                  Priorytet:{" "}
                  <span className="font-semibold">{story.priority}</span>
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  Status:{" "}
                  <span className="font-semibold">
                    {STATUS_LABELS[story.status]}
                  </span>
                </span>
              </div>
              {expandedStoryId === story.id && (
                <div className="mt-4 border-t dark:border-gray-700 pt-4">
                  <TaskKanban storyId={story.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
