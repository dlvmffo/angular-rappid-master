import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';
import { StepService } from 'src/app/services/step.service';
import { WorkflowService } from 'src/app/services/workflow.service';
import { Activity, Step, Workflow } from 'src/app/models/activity.model';
import { Router } from '@angular/router';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';
import { values } from 'underscore';
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
    public disableAndSplit = true;
    public disableOrSplit = true;
    public disableSplitAgain = true;

    public showInputField = false;

    public nodeClickInfo = '';
    public stepsList: Array<Step> = [];
    public editedStepInfo: Step = <Step>{};
    public editStepShow = false;

    constructor(private cd: ChangeDetectorRef, 
        private activityService: ActivityService, 
        private stepService: StepService,
        private workflowService: WorkflowService,
        private router: Router,
        private toastaService:ToastaService, private toastaConfig: ToastaConfig) {
            this.toastaConfig.theme = 'material';
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

    menuRoute(menu) {
        this.router.navigate([menu]);
    }

    public createWorkflow() {
        this.workflowService.createWorkflow(this.workflow).subscribe(workflow => {});
        this.showSteps = true;
    }

    editStep() {
        this.editStepShow = false;
        this.stepService.udpateStep(this.editedStepInfo).subscribe((step) => {
            alert('Successfully edited');
            this.stepService.getAllSteps().subscribe(steps => {
                this.stepsList = steps;
            });
        })
        this.editedStepInfo = <Step>{};
    }

    getStepForEdit(id: number) {
        this.editStepShow = true;
        this.stepService.getStepById(id).subscribe((step) => {
            this.editedStepInfo = step;
        })
    }

    deleteStep(id: number) {
        var toastOptions:ToastOptions = {
            title: "My title",
            msg: "The message",
            showClose: true,
            timeout: 5000,
            theme: 'default',
            onAdd: (toast:ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function(toast:ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };
        this.stepService.deleteStepById(id).subscribe(() => {
            this.toastaService.success(toastOptions);
            alert('successfully deleted');
            this.stepService.getAllSteps().subscribe(steps => {
                this.stepsList = steps;
            });
        });
    }

    public createTask() {
        this.showInputField = false;
        this.disableAndSplit = this.disableOrSplit = this.disableSplitAgain = false;
        this.step.workflowId = 1; //this.counter
        this.counter++;
        if (this.nodeClickInfo === 'parent') {
            this.step.stepId = Math.floor(this.taskList[this.taskList.length - 1].stepId) + 1;
            this.step.isOrSplit, this.step.isAndSplit = false;
            this.step.stepSequenceCounter = 1;
            this.disableOrSplit = this.disableAndSplit = false;
        } else {
            if (this.nodeClickInfo === 'orSplit') { 
                this.step.isOrSplit = true;
                this.disableAndSplit = true;
            }
            if (this.nodeClickInfo === 'andSplit') {
                this.step.isAndSplit = true;
                this.disableOrSplit = true;
            }
            // this.step.parentId =this.taskList[this.taskList.length -1].stepNumber;
            this.step.stepId = this.taskList[this.taskList.length - 1].stepId + 0.1;
            this.step.stepId = parseFloat(this.step.stepId.toFixed(2));
        }
        if ((this.step.stepId).toString().includes('.')) {
            let stepIdToSequence = (this.step.stepId).toString().split('.')[1];
            parseInt(stepIdToSequence) + 1;

            var splitagain = document.getElementById("splitagain");
            if (this.nodeClickInfo === 'splitAgain') {
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
            this.stepService.getAllSteps().subscribe(steps => {
                this.stepsList = steps;
            });
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
        this.nodeClickInfo = event;
        this.showInputField = true;
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