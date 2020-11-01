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

    public stepMainBranch;
    public stepAndFirstBranch;
    public stepAndSecondBranch;
    public stepOrFirstBranch;
    public stepOrSecondBranch;

    ngOnInit() {
        this.step = <Step>{};
        this.stepList = [];
        this.showStep = false;
        this.sameOrCondition, this.sameAndCondition = false;
        this.loadWorkflow();
        this.loadActivities();

        this.stepMainBranch = [];
        this.stepAndFirstBranch = [];
        this.stepAndSecondBranch = [];
        this.stepOrFirstBranch = [];
        this.stepOrSecondBranch = [];
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
        this.stepService.getAllSteps().subscribe(steps => {
            this.stepList = steps.filter(x => x.workflowId == workflowId);
            this.stepList.forEach(step => {
                if (step.isAndSplit) {
                    if (step.stepSequence.split('.')[1] == '1') {
                        this.stepAndFirstBranch.push(step);
                    } else {
                        this.stepAndSecondBranch.push(step);
                    }
                }
                else if (step.isOrSplit) {
                    if (step.stepSequence.split('.')[1] == '1') {
                        this.stepOrFirstBranch.push(step);
                    } else {
                        this.stepOrSecondBranch.push(step);
                    }
                }
                else {
                    this.stepMainBranch.push(step);
                }
            })
            this.showStep = true;
        })
    }

    public assignWorkflow() {
        this.stepList.forEach(steps => {
            this.stepService.udpateStep(steps).subscribe((step) => {})
        })
    }
}