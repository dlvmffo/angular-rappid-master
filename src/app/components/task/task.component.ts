import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';
import { StepService } from 'src/app/services/step.service';
import { WorkflowService } from 'src/app/services/workflow.service';
import { Activity, Step, Workflow } from 'src/app/models/activity.model';
import { Router } from '@angular/router';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';
declare var joint: any;
declare var V: any;

interface TaskList {
    stepId: number,
    stepSequence: string,
    taskName: string;
}

@Component({
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css'],
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
        ])
      ]
})

export class TaskComponent implements OnInit, AfterViewChecked {
    public taskName: string;
    public checkboxId: number;
    public userId: number;
    public taskCollectionId: number;
    public taskCollectionDivId: string;
    public selectedDivName: string;
    public checkboxIdArray: any;

    public activityList: Array<Activity>;
    public activity: Activity; 
    public stepList: Array<Step>;
    public step: Step;

    public taskList: Array<TaskList>;
    public workflow: Workflow;

    public counter: number;
    public showSteps: boolean;

    constructor(private cd: ChangeDetectorRef, 
        private activityService: ActivityService, 
        private stepService: StepService,
        private workflowService: WorkflowService,
        private router: Router) {
    }

    ngOnInit() {
        this.checkboxId = 0;
        this.taskCollectionId = 0;
        this.taskCollectionDivId = 'taskcollection' + this.taskCollectionId;
        this.cd.markForCheck();
        this.activity = <Activity>{};
        this.step = <Step>{};
        this.loadActivities();
        this.taskList = [{
            stepId: 0,
            taskName: "",
            stepSequence: ""
        }];
        this.step.stepSequenceCounter = 1;
        this.workflow = <Workflow>{};
        this.showSteps = false;
        this.counter = 1;
    }

    ngAfterViewChecked() {
        for (let i = 0; i < this.taskCollectionId; i++) {
            let divId = document.getElementById(`taskcollection${i}`);
        }
    }

    public loadActivities() {
        this.activityService.getAllActivities().subscribe(res => {
            this.activityList = res;
        });
    }

    public createWorkflow() {
        this.workflowService.createWorkflow(this.workflow).subscribe(workflow => {});
        this.showSteps = true;
    }

    public createTask() {
        this.step.workflowId = 1; //this.counter
        this.counter++;
        let parent = document.getElementById("parent");
        let orSplit = document.getElementById("orSplit");
        let andSplit = document.getElementById("andSplit");
        if ((parent as any).checked) {
            this.step.stepId = Math.floor(this.taskList[this.taskList.length - 1].stepId) + 1;
            this.step.isOrSplit, this.step.isAndSplit = false;
            this.step.stepSequenceCounter = 1;
        } else {
            if ((orSplit as any).checked) { this.step.isOrSplit = true; }
            if ((andSplit as any).checked) { this.step.isAndSplit = true; }
            // this.step.parentId =this.taskList[this.taskList.length -1].stepNumber;
            this.step.stepId = this.taskList[this.taskList.length - 1].stepId + 0.1;
            this.step.stepId = parseFloat(this.step.stepId.toFixed(2));
        }
        if ((this.step.stepId).toString().includes('.')) {
            let stepIdToSequence = (this.step.stepId).toString().split('.')[1];
            parseInt(stepIdToSequence) + 1;

            var splitagain = document.getElementById("splitagain");
            if ((splitagain as any).checked == true) {
                this.step.stepSequenceCounter = this.step.stepSequenceCounter + 1;
                (splitagain as any).checked = false;
                let newTaskList = [];
                let currentStep = this.step.stepSequence.split('.')[0];
                this.taskList.forEach(ta => {
                    if (ta.stepSequence.split('.')[0] == currentStep) {
                        newTaskList.push(ta);
                    }
                })
                let newTaskListCount = newTaskList.length - 1;
                this.step.stepId = this.step.stepId - (newTaskListCount/10);
                stepIdToSequence = "1";
            }
            
            this.step.stepSequence = this.step.stepId.toString().split(".")[0] + "." + this.step.stepSequenceCounter + "." + stepIdToSequence;
        } else {
            this.step.stepSequence = this.step.stepId.toString();
        }

        this.taskList.push({ taskName: this.taskName, stepId: this.step.stepId, stepSequence: this.step.stepSequence });
        
        this.step.name = this.taskName;
        this.taskName = "";
        this.step.isCompleted = false;
        this.stepService.createStep(this.step).subscribe(step => {
            this.loadActivities();
        })
        this.taskName = "";
    }

    public createNewTaskCollection() {
        this.activity.name = `User${this.taskCollectionId + 1}`;
        this.activity.progressStep = 0;
        this.activityService.createActivity(this.activity).subscribe(activity => {
            this.loadActivities();
        })
        this.taskCollectionId = this.taskCollectionId + 1;
        this.taskCollectionDivId = `taskcollection${this.taskCollectionId}`;
        if (this.taskCollectionId == 0) {
            var div = document.getElementById(`taskcollection${this.taskCollectionId.toString()}`),
                clone = div.cloneNode(true);
        } else {
            var div = document.getElementById(`taskcollection${(this.taskCollectionId - 1).toString()}`),
                clone = div.cloneNode(true);
        }
        document.getElementById("task-collection").appendChild(clone);

        let btn = document.getElementById("btn");
        btn.setAttribute('disabled', 'disabled');
    }

    parentNodeCheck(event) {
        let value = event.currentTarget.value;
        let checked = event.currentTarget.checked;
        if (value == "parent" && !checked) {
            $("#andSplit").trigger('click');
            if (value == "andSplit" && checked) {
                this.step.isAndSplit = true;
                this.step.isOrSplit = false;
            }
            if (value == "orSplit" && checked) {
                this.step.isAndSplit = false;
                this.step.isOrSplit = true;
            }
        }
        if (value == "parent" && checked) {
            (document.getElementById("andSplit") as any).checked = false;
            (document.getElementById("orSplit") as any).checked = false;
            this.step.isAndSplit, this.step.isOrSplit = false;
        }
        if ((value == "andSplit" || value == "orSplit") && checked) {
            (document.getElementById("parent") as any).checked = false;
        }
        if (value == "splitAgain" && checked) {

        }
    }

    createUser() {
        this.activity.progressStep = 0;
        this.activity.progressTreeState = "";
        this.activityService.createActivity(this.activity).subscribe(act => {
            this.activity.name = '';
            this.loadActivities();
        });
    }

    assignTasks() {
        this.router.navigate(['assign-task']);
    }
}