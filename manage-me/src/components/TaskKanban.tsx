import { useState, useEffect } from "react";
import { TaskApi } from "../api/TaskApi";
import { UserApi } from "../api/UserApi";
import type { Task } from "../types/Task";
import type { User } from "../types/User";
import { TaskForm } from "./TaskForm";

const statuses = [
  { label: "Do zrobienia", value: "todo" },
  { label: "W trakcie", value: "doing" },
  { label: "Zrobione", value: "done" },
];

type Props = {
  storyId: string;
};

export function TaskKanban({ storyId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  useEffect(() => {
    refresh();
    UserApi.getAll().then(setUsers);
  }, [storyId]);

  async function refresh() {
    setTasks((await TaskApi.getAll()).filter((t) => t.storyId === storyId));
    setOpenTaskId(null);
  }

async function handleAssign(task: Task, userId: string) {
    await TaskApi.update({
      ...task,
      assigneeId: userId,
      status: "doing",
      startedAt: task.startedAt ?? new Date().toISOString(),
    });
    await refresh();
  }

async function handleFinish(task: Task) {
    await TaskApi.update({
      ...task,
      status: "done",
      finishedAt: new Date().toISOString(),
    });
    await refresh();
  }

  return (
    <div>
      <TaskForm storyId={storyId} onTaskAdded={refresh} />
      <div className="flex gap-4 mb-4">
        {statuses.map(({ label, value }, idx) => (
          <div
            key={value}
            className={`flex-1 min-w-[240px] bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-2 flex flex-col ${
              idx < statuses.length - 1
                ? "border-r-4 border-gray-200 dark:border-gray-700"
                : ""
            }`}
          >
            <div className="font-bold text-lg mb-4 text-center border-b pb-2 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
              {label}
            </div>
            <div className="flex-1 flex flex-col gap-2 min-h-[200px]">
              {tasks.filter((t) => t.status === value).length === 0 ? (
                <div className="text-center text-gray-400 dark:text-gray-500 italic mt-4">
                  Brak zadań
                </div>
              ) : (
                tasks
                  .filter((t) => t.status === value)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow p-3 overflow-visible"
                    >
                      <div
                        className="font-semibold cursor-pointer text-gray-900 dark:text-white"
                        onClick={() =>
                          setOpenTaskId(openTaskId === task.id ? null : task.id)
                        }
                      >
                        {task.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {task.description}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Priorytet: <b>{task.priority}</b>
                      </div>
                      {openTaskId === task.id && (
                        <div className="mt-2 border-t dark:border-gray-600 pt-2 text-sm flex flex-col gap-1 text-gray-700 dark:text-gray-300">
                          <div>
                            <span className="font-semibold">
                              Szacowany czas:
                            </span>{" "}
                            {task.estimatedHours}h
                          </div>
                          <div>
                            <span className="font-semibold">
                              Data utworzenia:
                            </span>{" "}
                            {new Date(task.createdAt).toLocaleString()}
                          </div>
                          {task.startedAt && (
                            <div>
                              <span className="font-semibold">Start:</span>{" "}
                              {new Date(task.startedAt).toLocaleString()}
                            </div>
                          )}
                          {task.finishedAt && (
                            <div>
                              <span className="font-semibold">Koniec:</span>{" "}
                              {new Date(task.finishedAt).toLocaleString()}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold">Osoba:</span>{" "}
                            {task.assigneeId ? (
                              users.find((u) => u.id === task.assigneeId)
                                ?.first_name +
                              " " +
                              users.find((u) => u.id === task.assigneeId)
                                ?.first_name
                            ) : (
                              <span className="italic text-gray-400 dark:text-gray-500">
                                nieprzypisana
                              </span>
                            )}
                          </div>
                          {!task.assigneeId && (
                            <div className="flex flex-col gap-2">
                              <label className="block text-sm">
                                Przypisz do:
                              </label>
                              <select
                                onChange={(e) =>
                                  handleAssign(task, e.target.value)
                                }
                                defaultValue=""
                                className="border dark:border-gray-600 rounded px-2 py-1 w-full dark:bg-gray-800 dark:text-white"
                              >
                                <option value="" disabled>
                                  Wybierz użytkownika
                                </option>
                                {users
                                  .filter(
                                    (u) =>
                                      u.role === "developer" ||
                                      u.role === "devops"
                                  )
                                  .map((u) => (
                                    <option key={u.id} value={u.id}>
                                      {u.first_name} {u.last_name} ({u.role})
                                    </option>
                                  ))}
                              </select>
                            </div>
                          )}
                          {task.status === "doing" && (
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1 mt-2 transition-colors duration-200"
                              onClick={() => handleFinish(task)}
                            >
                              Oznacz jako ukończone
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
