export class Activity {
    public id: number;
    public name: string;
    public progressStep: number;
}

export class Step {
    public id: number;
    public stepId: number;
    public name: string;
    public isCompleted: boolean;
    public parentId: number;
    public isOrSplit: boolean;
    public isAndSplit: boolean;
}