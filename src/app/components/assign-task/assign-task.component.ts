import { Component, OnInit } from '@angular/core';
import { StepService } from '../../services/step.service';
import { WorkflowService } from '../../services/workflow.service';
import { Step, Workflow } from '../../models/activity.model';

@Component({
    templateUrl: './assign-task.component.html',
    styleUrls: ['./assign-task.component.css']
})

export class AssignTaskComponent implements OnInit {
    public stepList: Step;
    public workflowList: Array<Workflow>;

    ngOnInit() {
        this.stepList = <Step>{};
        this.loadWorkflow();
    }
    constructor(private stepService: StepService, private workflowService: WorkflowService){}

    loadWorkflow() {
        this.workflowService.getAllWorkflows().subscribe(workflow => {
            this.workflowList = workflow;
        })
    }
}