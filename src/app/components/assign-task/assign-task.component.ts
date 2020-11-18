import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state, query, stagger } from '@angular/animations';
import { StepService } from '../../services/step.service';
import { WorkflowService } from '../../services/workflow.service';
import { Activity, Step, Workflow } from '../../models/activity.model';
import { ActivityService } from 'src/app/services/activity.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './assign-task.component.html',
    styleUrls: ['./assign-task.component.css'],
    animations: [
        trigger('flyInOut', [
          state('in', style({ transform: 'translateX(0)' })),
          transition('void => *', [
            style({ transform: 'translateX(-100%)' }),
            animate(100)
          ]),
          transition('* => void', [
            animate(100, style({ transform: 'translateX(100%)' }))
          ])
        ]),
        trigger('explainerAnim', [
            transition('* => *', [
                query('.col', style({ opacity: 0, transform: 'translate(-40px)' })),

                query('.col', stagger('500ms', [
                    animate('800ms 1.2s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
                ]))
            ])
        ])
      ]
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

    public stepMainBranch: Array<Step>;
    public stepAndFirstBranch: Array<Step>;
    public stepAndSecondBranch: Array<Step>;
    public stepOrFirstBranch: Array<Step>;
    public stepOrSecondBranch: Array<Step>;

    public assignedActivity: number;

    public orACondition: string;
    public orBConditon: string;

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

        this.assignedActivity = 0;

        this.orACondition = "";
        this.orBConditon = "";
    }
    constructor(private stepService: StepService, private workflowService: WorkflowService, private activityService: ActivityService, private router: Router){}

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

    public mainBranchAssign(event) {
        this.stepMainBranch.forEach(step => {
            step.activityId = parseInt(event.target.value);
            this.stepService.udpateStep(step).subscribe();
        });
    }

    public andFirstBranchAssign(event) {
        this.stepAndFirstBranch.forEach(step => {
            step.activityId = parseInt(event.target.value);
            this.stepService.udpateStep(step).subscribe();
        });
    }

    public andSecondBranchAssign(event) {
        this.stepAndSecondBranch.forEach(step => {
            step.activityId = parseInt(event.target.value);
            this.stepService.udpateStep(step).subscribe();
        });
    }

    public orFirstBranchAssign(event) {
        this.stepOrFirstBranch.forEach(step => {
            step.activityId = parseInt(event.target.value);
            this.stepService.udpateStep(step).subscribe();
        });
    }
    public orSecondBranchAssign(event) {
        this.stepOrSecondBranch.forEach(step => {
            step.activityId = parseInt(event.target.value);
            this.stepService.udpateStep(step).subscribe();
        });
    }

    public orAConditionUpdate() {
        this.orACondition;
        this.stepOrFirstBranch.forEach(step => {
            step.orCondition = this.orACondition;
            this.stepService.udpateStep(step).subscribe();
        })
    }

    public orBConditionUpdate() {
        this.orBConditon;
        this.stepOrSecondBranch.forEach(step => {
            step.orCondition = this.orBConditon;
            this.stepService.udpateStep(step).subscribe();
        })
    }

    public stepExecute() {
        this.router.navigate(['step-execution']);
    }
}