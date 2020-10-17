import { Component, OnInit } from '@angular/core';
import { StepService } from '../../services/step.service';
import { WorkflowService } from '../../services/workflow.service';
import { Activity, Step, Workflow } from '../../models/activity.model';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
    templateUrl: './assign-task.component.html',
    styleUrls: ['./assign-task.component.css']
})

export class AssignTaskComponent implements OnInit {
    public step: Step;
    public workflowList: Array<Workflow>;
    public activityList: Array<Activity>;
    public stepList: Array<Step>;
    public showStep: boolean;
    public sameOrCondition: boolean;
    public sameAndCondition: boolean;
    public orCondition: string;

    ngOnInit() {
        this.step = <Step>{};
        this.stepList = [];
        this.showStep = false;
        this.sameOrCondition, this.sameAndCondition = false;
        this.loadWorkflow();
        this.loadActivities();
    }
    constructor(private stepService: StepService, private workflowService: WorkflowService, private activityService: ActivityService){}

    loadWorkflow() {
        this.workflowService.getAllWorkflows().subscribe(workflow => {
            this.workflowList = workflow;
        })
    }

    public loadActivities() {
        this.activityService.getAllActivities().subscribe(res => {
            this.activityList = res;
        });
    }

    public getWorkflowSteps(workflowId) {
        // this.stepService.getStepById(workflowId).subscribe(steps => {
        //     this.stepList = steps;
        //     this.showStep = true;
        // })
        this.stepService.getAllSteps().subscribe(steps => {
            this.stepList = steps.filter(x => x.workflowId == workflowId);
            this.showStep = true;
        })
    }

    public assignWorkflow() {
        this.stepList.forEach(steps => {
            this.stepService.udpateStep(steps).subscribe((step) => {})
        })
    }
}