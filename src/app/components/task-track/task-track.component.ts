import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
declare var joint: any;
declare var V: any;
import { StepService } from 'src/app/services/step.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Step, Activity } from 'src/app/models/activity.model';

import { TempDataStorageService } from 'src/app/services/temp-data-storage.service';

@Component({
    templateUrl: 'task-track.component.html',
    styleUrls: ['task-track.component.css']
})

export class TaskTrackComponent implements OnInit, AfterViewInit {
    @ViewChild('task-collection') myDiv: ElementRef;
    //petri-net
    graph: any = new joint.dia.Graph;
    paper: any;
    pn = joint.shapes.pn;
    pReady: any;
    pIdle: any;
    buffer: any;
    cAccepted: any;
    cReady: any;
    pProduce: any;
    pSend: any;
    cAccept: any;
    cConsume: any;

    newPlace: any;
    newConditionalPlace: any;
    newTransition: any;
    initialPlace: any;
    initialTransition: any;

    newSerialX: number;
    newSerialY: number;
    newTransitionSerialX: number;
    counter: number;

    //
    stepList: Array<Step>;
    activityList: Array<Activity>;

    constructor(private stepService: StepService, private activityService: ActivityService, private elemRef: ElementRef,
        private tempDataStorageService: TempDataStorageService) {
        this.newSerialX = 0;
        this.newSerialY = 0;
        this.newTransitionSerialX = 0;
        this.counter = 0;

        this.initialPlace = { x: 550, y: 160 };
        this.initialTransition = { x: 470, y: 160 };
    }

    ngOnInit() {
        this.createActivities();
        setTimeout(() => {
            this.createActivities();
        }, 1);
    }

    ngAfterViewInit() {
        this.tempDataStorageService.activity.subscribe(act => {
            if (act == true) {
                location.reload();
            }
            alert(act)
            location.reload();
        })
    }

    loadActivity() {
        this.activityService.getAllActivities().subscribe(activities => {
            this.activityList = activities;
        })
    }

    initDiagram() {
        joint.setTheme('modern');

        this.paper = new joint.dia.Paper({
            el: document.getElementById('paper'),
            width: 2000,
            height: 350,
            gridSize: 10,
            defaultAnchor: { name: 'perpendicular' },
            defaultConnectionPoint: { name: 'boundary' },
            model: this.graph
        });
        this.pReady = new this.pn.Place({
            position: { x: 140, y: 50 },
            attrs: {
                '.label': {
                    'text': 'ready',
                    'fill': '#7c68fc'
                },
                '.root': {
                    'stroke': '#9586fd',
                    'stroke-width': 3
                },
                '.tokens > circle': {
                    'fill': '#7a7e9b'
                }
            },
            tokens: 1
        });
        this.pIdle = this.pReady.clone()
            .attr('.label/text', 'idle')
            .position(140, 260)
            .set('tokens', 2);

        this.buffer = this.pReady.clone()
            .position(350, 160)
            .set('tokens', 12)
            .attr({
                '.label': {
                    'text': 'buffer'
                },
                '.alot > text': {
                    'fill': '#fe854c',
                    'font-family': 'Courier New',
                    'font-size': 20,
                    'font-weight': 'bold',
                    'ref-x': 0.5,
                    'ref-y': 0.5,
                    'y-alignment': -0.5,
                    'transform': null
                }
            });

        this.cAccepted = this.pReady.clone()
            .attr('.label/text', 'accepted')
            .position(550, 50)
            .set('tokens', 1);

        this.cReady = this.pReady.clone()
            .attr('.label/text', 'accepted')
            .position(560, 260)
            .set('ready', 3);

        this.pProduce = new this.pn.Transition({
            position: { x: 50, y: 160 },
            attrs: {
                '.label': {
                    'text': 'produce',
                    'fill': '#fe854f'
                },
                '.root': {
                    'fill': '#9586fd',
                    'stroke': '#9586fd'
                }
            }
        });

        this.pSend = this.pProduce.clone()
            .attr('.label/text', 'send')
            .position(270, 160);

        this.cAccept = this.pProduce.clone()
            .attr('.label/text', 'accept')
            .position(470, 160);

        this.cConsume = this.pProduce.clone()
            .attr('.label/text', 'consume')
            .position(680, 160);

        //this.pReady, this.pIdle, this.buffer, this.cAccepted, this.cReady, this.pProduce, this.pSend, this.cAccept, this.cConsume
        this.graph.addCell([this.pReady, this.buffer, this.pSend]);

        this.graph.addCell([
            this.link(this.pReady, this.pSend),
            this.link(this.pSend, this.buffer)
        ]);

        this.stepService.getAllSteps().subscribe((step) => {
            step.forEach(s => {
                this.createPetriNet(s.name);
            });

            this.activityService.getAllActivities().subscribe((act) => {
                act.forEach((a, i) => {
                    var childdiv = document.createElement('div');
                    if (a.progressStep != 0 && a.progressStep != undefined) {
                        //childdiv.id = a.progressStep;
                    }
                    childdiv.innerHTML = a.name;
                    document.getElementById("task-collection").appendChild(childdiv);
                })

                let ch = document.getElementById("task-collection").childNodes;
                (ch as any).forEach((divEl, i) => {
                    this.graph.attributes.cells.models.forEach(element => {
                        let grapht = element.attr('.label/text');
                        if (grapht == (divEl as HTMLElement).id) {
                            element.attr('.label/text', "here is token");
                            element.attr('.label/fill', "#228B22");
                            element.attr('.label/font-size', "20");
                            element.attr('.label/font-weight', "bold");
                            element.attr('.root/stroke', "#fe854f")
                            element.attr('.root/stroke-width', "5")
                        }
                    });
                    var div = document.getElementById("paper"),
                        clone = div.cloneNode(true);
                    div.id = i.toString();
                    divEl.appendChild(clone);
                });
            })
        });
    }

    public link(a, b) {
        return new this.pn.Link({
            source: { id: a.id, selector: '.root' },
            target: { id: b.id, selector: '.root' },
            attrs: {
                '.connection': {
                    'fill': 'none',
                    'stroke-linejoin': 'round',
                    'stroke-width': '2',
                    'stroke': '#4b4a67'
                }
            }
        });
    }

    createPetriNet(taskName) {
        //create petri nets
        let lastChild = this.graph.getSinks();
        var token = V('circle', { r: 5, fill: '#feb662' });
        this.newPlace = this.pReady.clone()
            .attr('.label/text', taskName)
            .position(this.initialPlace.x + this.newSerialX, this.initialPlace.y + this.newSerialY)

            // this.newPlace = this.pReady.clone()
            // .attr('.label', {
            //     'text': this.taskName,
            //     'fill': '#7c68fc',
            //     'font-size': 20,
            //     'font-weight': 'bold'
            // })
            // .attr('.root', {
            //     'stroke': '#fe854f',
            //     'stroke-width': 5
            // })


            .position(this.initialPlace.x + this.newSerialX, this.initialPlace.y + this.newSerialY)
            .set('tokens', 1)
        this.newTransition = this.cAccept.clone()
            .attr('.label/text', 'send')
            .position(this.initialTransition.x + this.newTransitionSerialX, this.initialTransition.y);
        this.graph.addCell([this.newTransition, this.newPlace, this.link(this.newTransition, this.newPlace),
        this.link(lastChild[lastChild.length - 1], this.newTransition)]);
        if (this.counter == 0) {
            this.graph.addCell([this.link(this.buffer, this.newTransition)]);
        }
        this.counter = 1;
        this.newTransitionSerialX = 200;
        this.newSerialX = 200;
        this.initialPlace.x = this.initialPlace.x + this.newSerialX;
        this.initialTransition.x = this.initialTransition.x + this.newTransitionSerialX;
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
                    step.forEach((s,j) => {
                        if (a.progressStep == s.id) {
                            this.draw_circle(x + xInc, y + yInc, "token");
                        } else {
                            this.draw_circle(x + xInc, y + yInc, s.stepSequence);
                        }
                        if (j !== step.length - 1) {
                            this.canvas_arrow(context, x+xInc+30, y+yInc, x+xInc+120, y+yInc);   
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