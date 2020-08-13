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

    constructor(private cd: ChangeDetectorRef, private activityService: ActivityService, private stepService: StepService) {
    }

    ngOnInit() {
        this.checkboxId = 0;
        this.taskCollectionId = 0;
        this.taskCollectionDivId = 'taskcollection' + this.taskCollectionId;
        this.cd.markForCheck();

        //petri net
        this.initDiagram();
        this.newSerialX = 0;
        this.newSerialY = 0;
        this.newTransitionSerialX = 0;
        this.counter = 0;
        this.selectedDivName = "";
        this.checkboxIdArray = [];

        this.initialPlace = { x: 550, y: 160 };
        this.initialTransition = { x: 470, y: 160 };
        this.activity = <Activity>{};
        this.step = <Step>{};
        this.loadActivities();
        this.taskList = [];
    }

    ngAfterViewChecked() {
        // this.checkboxIdArray.forEach(element => {
        //     let divId = document.getElementById("check"+element);
        //     divId.onclick = this.checkboxClicked;
        // });
        for (let i = 0; i < this.taskCollectionId; i++) {
            let divId = document.getElementById(`taskcollection${i}`);
            divId.onclick = this.checkboxClicked;
        }
        this.getCheckInfo();
    }

    public loadActivities() {
        this.activityService.getAllActivities().subscribe(res => {
            this.activityList = res;
        });
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

    public createTask() {
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
        checkbox.onclick = this.checkboxClicked;

        document.getElementById("main").appendChild(checkbox);

        //create petri nets
        let lastChild = this.graph.getSinks();
        var token = V('circle', { r: 5, fill: '#feb662' });
        this.newPlace = this.pReady.clone()
            .attr('.label/text', this.taskName)
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

        this.taskName = "";
    }

    private checkboxClicked(event) {
        debugger;
        // alert(event.currentTarget.checked);
        // alert(event.currentTarget.id);
        let div = document.getElementById(event.currentTarget.id);
            let divName = div.innerHTML;
            if (divName.length <= 30) {
                let div = document.getElementById("task-form");
                div.innerText = divName;
            } else {
                alert("too long")
                // let div = document.getElementById("task-form");
                // div.innerText = divName;
            }
            if (this.taskCollectionDivId !== event.currentTarget.id) {

            }
    }

    public getCheckInfo() {
        let div = document.getElementById("task-form");
        let text = div.innerText;
        let graph = this.graph;
        let grapht: string;
        graph.attributes.cells.models.forEach(element => {
            grapht = element.attr('.label/text');
            if(grapht == text) {
                element.attr('.label/text', "here is token");
                element.attr('.label/fill', "#228B22");
                element.attr('.label/font-size', "20");
                element.attr('.label/font-weight', "bold");
                element.attr('.root/stroke', "#fe854f")
                element.attr('.root/stroke-width', "5")
            }
        });
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
        // clone.id = "some_id";
        document.getElementById("task-collection").appendChild(clone);

        let btn = document.getElementById("btn");
        btn.setAttribute('disabled', 'disabled');
    }
}