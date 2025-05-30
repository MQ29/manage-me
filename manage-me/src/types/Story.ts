export type StoryStatus = "todo" | "doing" | "done"
export type StoryPriority = "niski" | "średni" | "wysoki"

export interface Story{
    id: string;
    name: string;
    description: string;
    priority: StoryPriority;
    projectId: string;
    createdAt: string;
    status: StoryStatus;
    ownerId: string;
}