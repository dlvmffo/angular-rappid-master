import { Component, OnInit } from '@angular/core';
import { StepService } from 'src/app/services/step.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Step, Activity } from 'src/app/models/activity.model';
import { TempDataStorageService } from 'src/app/services/temp-data-storage.service';

@Component({
    templateUrl: './step-execution.component.html',
    styleUrls: ['./step-execution.component.css']
})

export class StepExecutionComponent implements OnInit {
    public stepList: Array<Step>;
    public activity: Activity;
    public step: Step;
    public userId: string;
    public executionStart: boolean;
    
    constructor(private stepService: StepService, private activityService: ActivityService, private tempDataStorageService: TempDataStorageService) {

    }

    ngOnInit() {
        this.activity = <Activity>{};
        this.step = <Step>{};
        this.userId = "";
        this.executionStart = false;
        // this.loadSteps();
    }

    loadSteps() {
        this.stepService.getAllSteps().subscribe((step) => {
            this.stepList = step;
            this.stepList.forEach(s => {
                if (s.stepSequence.split(".")[1] == "1") {
                    s.splitSequence = "Split 1";
                }
                if (s.stepSequence.split(".")[1] == "2") {
                    s.splitSequence = "Split 2";
                }
            })
        })
    }

    startExecution() {
        this.executionStart = true;
        let activityId = 0;
        let activityName = "";
        this.stepService.getAllSteps().subscribe(step => {
            this.activityService.getAllActivities().subscribe(activity => {
                activityId = activity.find(x => x.name == this.userId).id;
                activityName = activity.find(x => x.name == this.userId).name;
                this.activity.id = activityId;
                this.activity.name = activityName;
                this.stepList = step.filter(y => y.activityId == activityId);
            });
        })
    }

    updateProgress(event, step) {
        debugger;
        if (event.currentTarget.checked) {
            this.activity.progressStep = step.id;
            this.activity.progressTreeState = step.stepSequence;
            this.step = step;
            this.step.isCompleted = true;
            this.stepService.udpateStep(this.step).subscribe(step => {})
            this.activityService.udpateActivity(this.activity).subscribe(act => {})
            this.tempDataStorageService.activitySource.next(true);
        }
    }
}