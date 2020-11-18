import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { StepService } from 'src/app/services/step.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Step, Activity } from 'src/app/models/activity.model';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'task-track.component.html',
    styleUrls: ['task-track.component.css']
})

export class TaskTrackComponent implements OnInit {
    @ViewChild('task-collection') myDiv: ElementRef;
   
    stepList: Array<Step>;
    activityList: Array<Activity>;

    constructor(private stepService: StepService, private activityService: ActivityService, private elemRef: ElementRef, private router: Router) {
    }

    ngOnInit() {
        this.createActivities();
    }

    loadActivity() {
        this.activityService.getAllActivities().subscribe(activities => {
            this.activityList = activities;
        })
    }

    menuRoute(menu) {
        this.router.navigate([menu]);
    }

    canvas_arrow(context, fromx, fromy, tox, toy) {
        var headlen = 10; 
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        context.stroke();
    }

    draw_circle(center_x, center_y, text, colorfill) {
        var canvas = document.getElementById('myCanvas');
        var context = (canvas as any).getContext('2d');
        var centerX = center_x;
        var centerY = center_y;
        var radius = 30;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = colorfill;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
        context.font = '15pt Calibri';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.fillText(text, center_x, center_y);
    }

    createActivities() {
        var canvas = document.getElementById('myCanvas');
        var context = (canvas as any).getContext('2d');
        let x = 100;
        let y = 50;
        let xInc = 0;
        let yInc = 0;

        let actX = 0;
        let actY = 50;


        // draw for each user/activities:


        this.activityService.getAllActivities().subscribe((act) => {
            let counterXBack = 0;
            let isOrSplitTrue = false;
            act.forEach((a, i) => {
                context.font = "11px Arial";
                context.fillText(a.name, actX, actY);
                this.stepService.getAllSteps().subscribe(stepInitial => {
                    let step: Array<Step> = [];
                    step = stepInitial.filter(x => x.activityId == a.id);
                    step.forEach((s,j) => {
                        if (s.stepSequence.includes('.')) {
                            if (s.isOrSplit && s.orConditionResult) {
                                isOrSplitTrue = true;
                                if (a.progressStep == s.id) {
                                    this.draw_circle(x + xInc, y + yInc, "token", "green");
                                }
                                else if (a.progressStep < s.id) {
                                    this.draw_circle(x + xInc, y + yInc, s.stepSequence, "white");
                                } 
                                else {
                                    this.draw_circle(x + xInc, y + yInc, s.stepSequence, "yellow");
                                }
                                if (j !== step.length - 1) {
                                    this.canvas_arrow(context, x+xInc+30, y+yInc, x+xInc+120, y+yInc);   
                                }
                                counterXBack++;
                            }
                            if (s.isOrSplit && !s.orConditionResult) {
                                isOrSplitTrue = true;
                                let divisor = s.stepSequence.split(".")[1];
                                let secondDivisor = s.stepSequence.split(".")[2];
                               
                                if (divisor == "1") {
                                    this.draw_circle(x + xInc, y + yInc, s.stepSequence, "red");
                                    if (j !== step.length - 1) {
                                        this.canvas_arrow(context, x+xInc+30, y+yInc, x+xInc+120, y+yInc);   
                                    }
                                    counterXBack++;
                                } else {
                                    if (secondDivisor == "1") {
                                        this.canvas_arrow(context, x+xInc+30- 150*(counterXBack+1), y+yInc, x+xInc+30- 150*(counterXBack+1), y+yInc+70); 
                                    }
                                    this.draw_circle(x + xInc - 150*counterXBack, y + yInc + 70, s.stepSequence, "red");
                                    if (j !== step.length - 1) {
                                        this.canvas_arrow(context, x+xInc+30- 150*(counterXBack+1), y+yInc+70, x+xInc+120- 150*(counterXBack+1), y+yInc+70);   
                                    }
                                }
                              
                            }
                            if (s.isAndSplit) {
                                if (a.progressStep == s.id) {
                                    this.draw_circle(x + xInc, y + yInc, "token", "green");
                                }
                                else if (a.progressStep < s.id) {
                                    this.draw_circle(x + xInc, y + yInc, s.stepSequence, "white");
                                } 
                                else {
                                    this.draw_circle(x + xInc, y + yInc, s.stepSequence, "yellow");
                                }
                                if (j !== step.length - 1) {
                                    this.canvas_arrow(context, x+xInc+30, y+yInc, x+xInc+120, y+yInc);   
                                }
                            }
                        } else {
                            if (isOrSplitTrue) {
                                if (a.progressStep == s.id) {
                                    this.draw_circle(x + xInc , y + yInc, "token", "green");
                                }
                                else if (a.progressStep < s.id) {
                                    this.draw_circle(x + xInc , y + yInc, s.stepSequence, "white");
                                } 
                                else {
                                    this.draw_circle(x + xInc, y + yInc, s.stepSequence, "yellow");
                                }
                                this.canvas_arrow(context, x+xInc+30 - 150*(counterXBack+1), y+yInc+70, x+xInc-30, y+yInc);
                            }
                            else {
                                if (a.progressStep == s.id) {
                                    this.draw_circle(x + xInc, y + yInc, "token", "green");
                                }
                                else if (a.progressStep < s.id) {
                                    this.draw_circle(x + xInc, y + yInc, s.stepSequence, "white");
                                } 
                                else {
                                    this.draw_circle(x + xInc, y + yInc, s.stepSequence, "yellow");
                                }
                                if (j !== step.length - 1) {
                                    this.canvas_arrow(context, x+xInc+30, y+yInc, x+xInc+120, y+yInc);   
                                }
                            }
                        }
                     
                     
                        xInc = xInc + 150;
                    })
                    x = 100;
                    xInc = 0;
                    yInc = yInc + 170;
                })
                actY = actY + 170;
            })
        })
    }
}