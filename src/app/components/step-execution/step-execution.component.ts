import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepService } from 'src/app/services/step.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Step, Activity } from 'src/app/models/activity.model';
import { TempDataStorageService } from 'src/app/services/temp-data-storage.service';
import { trigger, transition, animate, style, state, query, stagger } from '@angular/animations';

@Component({
  templateUrl: './step-execution.component.html',
  styleUrls: ['./step-execution.component.css'],
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
        query('.execute', style({ opacity: 0, transform: 'translate(-40px)' })),

        query('.execute', stagger('500ms', [
          animate('800ms 1.2s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ]))
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 0, width: '0px' })),
          ]),
        ])
      ]),
    ]),
  ]
})

export class StepExecutionComponent implements OnInit {
  public stepList: Array<Step>;
  public activity: Activity;
  public step: Step;
  public userId: string;
  public executionStart: boolean;
  public stepListLength: number;

  constructor(private stepService: StepService, private activityService: ActivityService, private tempDataStorageService: TempDataStorageService, private router: Router) {

  }

  ngOnInit() {
    this.activity = <Activity>{};
    this.step = <Step>{};
    this.userId = "";
    this.executionStart = false;
    this.stepListLength = -1;
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

  anotherUser() {
    window.open('http://localhost:4200/step-execution');
  }

  menuRoute(menu) {
    this.router.navigate([menu]);
  }

  trackTask() {
    this.router.navigate(['task-track']);
  }

  startExecution() {
    this.executionStart = true;
    let activityId = 0;
    let activityName = "";
    this.stepService.getAllSteps().subscribe(step => {
      this.stepListLength = step.length;
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
    if (event.currentTarget.checked) {
      this.activity.progressStep = step.id;
      this.activity.progressTreeState = step.stepSequence;
      this.step = step;
      this.step.isCompleted = true;
      this.stepService.udpateStep(this.step).subscribe(step => { })
      this.activityService.udpateActivity(this.activity).subscribe(act => { })
      this.tempDataStorageService.activitySource.next(true);
    }
  }
}