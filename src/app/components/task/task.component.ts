import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { eventNames } from 'process';
import { ActivityService } from 'src/app/services/activity.service';
import { StepService } from 'src/app/services/step.service';
import { Activity, Step } from 'src/app/models/activity.model';
declare var joint: any;
declare var V: any;

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

    public taskList: Array<string>;

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
        this.taskList = [];
        this.counter = 0;
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
        this.step.stepId = this.counter + 1;
        this.taskList.push(this.taskName);
        this.step.name = this.taskName;
        this.taskName = "";
        this.step.isCompleted = false;
        this.stepService.createStep(this.step).subscribe(step => {
            this.loadActivities();
        })
        this.checkboxId = this.checkboxId + 1;
        this.checkboxIdArray.push(this.checkboxId);
        var div = document.createElement("div");
        // div.style.height = "30px";
        div.style.background = "white";
        div.style.color = "black";
        div.style.fontSize = "20px";
        div.style.padding = "10px 10px 10px 10px";
        div.style.border = "3px solid gray";
        div.style.marginTop = "30px";
        // div.style.marginLeft = "200px";
        div.className += "task-block";
        div.id = this.checkboxId.toString();
        div.innerHTML = this.taskName;

        document.getElementById("main").appendChild(div)

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = "value";
        checkbox.id = this.checkboxId.toString();
        checkbox.className += "checkbox-block";
        checkbox.style.width = "50px";
        checkbox.style.height = "40px";
        checkbox.style.marginRight = "30px";
        checkbox.style.marginTop = "-48px";
        checkbox.style.cssFloat = "right";

        document.getElementById("main").appendChild(checkbox);

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
        if (value == "parent" && checked == false) {
            $("#andSplit").trigger('click');
            this.step.parentId = this.counter;
            this.step.stepId = this.counter + 0.1;
            if (value == "andSplit" && checked == true) {
                this.step.isAndSplit = true;
                this.step.isOrSplit = false;
            }
            if (value == "orSplit" && checked == true) {
                this.step.isAndSplit = false;
                this.step.isOrSplit = true;
            }
        } 
        if (value == "parent" && checked == true) {
            (document.getElementById("andSplit") as any).checked = false;
            (document.getElementById("orSplit") as any).checked = false;
        }
        if ((value == "andSplit" || value == "orSplit") && checked == true) {
            (document.getElementById("parent") as any).checked = false;
        }
    }
}