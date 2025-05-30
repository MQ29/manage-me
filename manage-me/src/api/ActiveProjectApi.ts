const ACTIVE_PROJECT_KEY = "activeProjectId";

export class ActiveProjectApi {
    static getActiveProjectId() : string | null{
        return localStorage.getItem(ACTIVE_PROJECT_KEY)
    }

    static setActiveProjectId(id: string) : void{
        localStorage.setItem(ACTIVE_PROJECT_KEY, id)
    }

    static clear(): void {
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
}