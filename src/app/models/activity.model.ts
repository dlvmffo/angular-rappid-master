export class Activity {
    public id: number;
    public name: string;
    public progressStep: number;
    public progressTreeState: string;
}

export class Step {
    public id: number;
    public workflowId: number;
    public stepSequence: string;
    public stepSequenceCounter: number;
    public stepId: number;
    public name: string;
    public isCompleted: boolean;
    public isOrSplit: boolean;
    public isAndSplit: boolean;
    public orCondition: string;
    public orConditionResult: boolean;
    public andSplitChosen: boolean;

    public splitSequence: string;
    public activityId: number;
}

export class Workflow {
    public id: number;
    public name: string;
}