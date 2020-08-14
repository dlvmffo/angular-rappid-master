import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { eventNames } from 'process';
import { ActivityService } from 'src/app/services/activity.service';
import { StepService } from 'src/app/services/step.service';
import { Activity, Step } from 'src/app/models/activity.model';
declare var joint: any;
declare var V: any;

interface TaskList {
    stepNumber: number,
    taskName: string;
}

@Component({
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
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

    public counter: number;

    constructor(private cd: ChangeDetectorRef, private activityService: ActivityService, private stepService: StepService) {
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
            taskName: "",
            stepNumber: 0
        }];
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

    public createTask() {
        let parent = document.getElementById("parent");
        if ((parent as any).checked) {
            this.step.stepId = Math.floor(this.taskList[this.taskList.length -1].stepNumber) + 1;
            this.step.parentId = 0;
        } else {
            this.step.parentId =this.taskList[this.taskList.length -1].stepNumber;
            this.step.stepId = this.taskList[this.taskList.length -1].stepNumber + 0.1;
            this.step.stepId = parseFloat(this.step.stepId.toFixed(2));
        }
        this.taskList.push({taskName: this.taskName, stepNumber: this.step.stepId});
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
        }
        if ((value == "andSplit" || value == "orSplit") && checked) {
            (document.getElementById("parent") as any).checked = false;
        }
    }
}