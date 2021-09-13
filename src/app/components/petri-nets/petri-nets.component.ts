import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ThrowStmt } from "@angular/compiler";
import { _ROOT_DIRECTIVE_INDICES } from "@angular/core/src/render3/instructions";
declare var joint: any;


@Component({
    templateUrl: './petri-nets.component.html',
    styleUrls: ['./petri-nets.component.css']
})

export class PetriNetsComponent implements OnInit {
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
    simulationId = this.simulate();

    newPlace: any;
    newConditionalPlace: any;
    newTransition: any;
    initialPlace: any;
    initialTransition: any;
    stepName: string;
    conditionalStepName: string;
    conditionName: string;
    radioButtonValue: number;

    newSerialX: number;
    newSerialY: number;
    newTransitionSerialX: number;
    counter: number;

    paperScroller: any;
    lastLink: any;
    // link: any;
    element: any;
    nodes: any;
    selectedCell: any;

    ngOnInit() {
        this.newSerialX = 0;
        this.newSerialY = 0;
        this.newTransitionSerialX = 0;
        this.counter = 0;

        this.initialPlace = { x: 550, y: 160 };
        this.initialTransition = { x: 470, y: 160 };
        this.initDiagram();
        this.simulate();
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

        // var rect = new joint.shapes.standard.Rectangle();
        // rect.position(100, 30);
        // rect.resize(100, 40);
        // rect.attr({
        //     body: {
        //         fill: 'blue'
        //     },
        //     label: {
        //         text: 'Hello',
        //         fill: 'white'
        //     }
        // });
        // rect.addTo(this.graph);

        // var rect2 = rect.clone();
        // rect2.translate(300, 0);
        // rect2.attr('label/text', 'World!');
        // rect2.addTo(this.graph);

        // var link = new joint.shapes.standard.Link();
        // link.source(rect);
        // link.target(rect2);
        // link.addTo(this.graph);

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
                    'fill': '#7c68fc'
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

    public fireTransition(t, sec) {
        t = 200;

        var inbound = this.graph.getConnectedLinks(t, { inbound: true });
        var outbound = this.graph.getConnectedLinks(t, { outbound: true });

        var placesBefore = inbound.map(function (link) {
            return link.getSourceElement();
        });
        var placesAfter = outbound.map(function (link) {
            return link.getTargetElement();
        });

        var isFirable = true;
        placesBefore.forEach(function (p) {
            if (p.get('tokens') === 0) {
                isFirable = false;
            }
        });
        let V: any;

        if (isFirable) {

            placesBefore.forEach(function (p) {
                // Let the execution finish before adjusting the value of tokens. So that we can loop over all transitions
                // and call fireTransition() on the original number of tokens.
                setTimeout(function () {
                    p.set('tokens', p.get('tokens') - 1);
                }, 0);

                var links = inbound.filter(function (l) {
                    return l.getSourceElement() === p;
                });

                links.forEach(function (l) {
                    var token = V('circle', { r: 5, fill: '#feb662' });
                    l.findView(this.paper).sendToken(token, sec * 1000);
                });
            });

            placesAfter.forEach(function (p) {

                var links = outbound.filter(function (l) {
                    return l.getTargetElement() === p;
                });

                links.forEach(function (l) {
                    var token = V('circle', { r: 5, fill: '#feb662' });
                    l.findView(this.paper).sendToken(token, sec * 1000, function () {
                        p.set('tokens', p.get('tokens') + 1);
                    });
                });
            });
        }
    }

    public simulate() {
        var that = this;

        var transitions = [this.buffer, this.cAccept, this.cAccepted, this.cConsume, this.cReady];
        transitions.forEach(function (t) {
            // if (Math.random() < 0.7) {
            //     that.fireTransition(t, 1);
            // }
            that.fireTransition(t, 1);
        });

        return setInterval(function () {
            transitions.forEach(function (t) {
                // if (Math.random() < 0.7) {
                //     that.fireTransition(t, 1);
                // }
                that.fireTransition(t, 1);
            });
        }, 2000);
    }

    stopSimulation(simulationId) {
        clearInterval(simulationId);
    }

    //if split needs to be done (.position(680 + 50, 50) after cConsume)

    public AddPlaceTransition(placeText) {
        if (this.radioButtonValue == 1) {
            let lastChild = this.graph.getSinks();
            this.newPlace = this.pReady.clone()
                .attr('.label/text', this.stepName)
                .position(this.initialPlace.x + this.newSerialX, this.initialPlace.y + this.newSerialY)
                .set('tokens', 1);
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

        if (this.radioButtonValue == 2) {
            this.newPlace = this.pReady.clone()
                .attr('.label/text', this.stepName)
                .position(550, 50)
                .set('tokens', 1);
            this.newConditionalPlace = this.pReady.clone()
                .attr('.label/text', this.conditionalStepName)
                .position(560, 260)
                .set('tokens', 1);
            this.newTransition = this.cAccept.clone()
                .attr('.label/text', this.conditionName)
                .position(this.initialTransition.x, this.initialTransition.y);
            this.graph.addCell([this.newTransition, this.newPlace, this.newConditionalPlace,
                this.link(this.buffer, this.newTransition), 
                this.link(this.newTransition, this.newPlace),
                this.link(this.newTransition, this.newConditionalPlace)]);
        }

        if (this.radioButtonValue == 3) {
            this.newPlace = this.pReady.clone()
                .attr('.label/text', this.stepName)
                .position(550, 50)
                .set('tokens', 1);
            this.newConditionalPlace = this.pReady.clone()
                .attr('.label/text', this.conditionalStepName)
                .position(560, 260)
                .set('tokens', 1);
            this.conditionName = "send";
            this.newTransition = this.cAccept.clone()
                .attr('.label/text', this.conditionName)
                .position(this.initialTransition.x, this.initialTransition.y);
            this.graph.addCell([this.newTransition, this.newPlace, this.newConditionalPlace,
                this.link(this.buffer, this.newTransition), 
                this.link(this.newTransition, this.newPlace),
                this.link(this.newTransition, this.newConditionalPlace)]);
        }
    }

    public onItemChange(value) {
        this.radioButtonValue = value;
    }
}