import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { StepService } from 'src/app/services/step.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Step, Activity } from 'src/app/models/activity.model';

@Component({
    templateUrl: 'task-track.component.html',
    styleUrls: ['task-track.component.css']
})

export class TaskTrackComponent implements OnInit {
    @ViewChild('task-collection') myDiv: ElementRef;
   
    stepList: Array<Step>;
    activityList: Array<Activity>;

    constructor(private stepService: StepService, private activityService: ActivityService, private elemRef: ElementRef) {
    }

    ngOnInit() {
        this.createActivities();
    }

    loadActivity() {
        this.activityService.getAllActivities().subscribe(activities => {
            this.activityList = activities;
        })
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

    draw_circle(center_x, center_y, text) {
        var canvas = document.getElementById('myCanvas');
        var context = (canvas as any).getContext('2d');
        var centerX = center_x;
        var centerY = center_y;
        var radius = 30;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
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
        this.activityService.getAllActivities().subscribe((act) => {
            act.forEach((a, i) => {
                context.font = "11px Arial";
                context.fillText(a.name, actX, actY);
                this.stepService.getAllSteps().subscribe(step => {
                    debugger;
                    step.forEach((s,j) => {
                        if (s.stepSequence.includes('.')) {
                            let divisor = s.stepSequence.split(".")[1];
                            if (divisor == "1") {
                                if (a.progressStep == s.id) {
                                    this.draw_circle(x + xInc, y + yInc - 20, "token");
                                } else {
                                    this.draw_circle(x + xInc, y + yInc - 20, s.stepSequence);
                                }
                                if (j !== step.length - 1) {
                                    this.canvas_arrow(context, x+xInc+30, y+yInc, x+xInc+265, y+yInc);   
                                }
                            } else {
                                if (a.progressStep == s.id) {
                                    this.draw_circle(x + xInc - 150, y + yInc + 40, "token");
                                } else {
                                    this.draw_circle(x + xInc - 150, y + yInc + 50, s.stepSequence);
                                }
                                if (j !== step.length - 1) {
                                    this.canvas_arrow(context, x+xInc - 120, y+yInc+50, x+xInc+120, y+yInc+10);   
                                }
                                if (j !== step.length - 1) {
                                    this.canvas_arrow(context, x+xInc - 270, y+yInc, x+xInc - 180, y+yInc+50);   
                                }
                            }
                            
                        } else {
                            if (a.progressStep == s.id) {
                                this.draw_circle(x + xInc, y + yInc, "token");
                            } else {
                                this.draw_circle(x + xInc, y + yInc, s.stepSequence);
                            }
                            if (j !== step.length - 1) {
                                this.canvas_arrow(context, x+xInc+30, y+yInc, x+xInc+120, y+yInc);   
                            }
                        }
                        xInc = xInc + 150;
                    })
                    x = 100;
                    xInc = 0;
                    yInc = yInc + 70;
                })
                if (a.progressStep != 0 && a.progressStep != undefined) {

                }
                actY = actY + 70;
            })
        })
    }
}