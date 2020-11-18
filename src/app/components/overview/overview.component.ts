import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit {
    public images;

    constructor(private router: Router) {

    }

    ngOnInit() {
        this.images = [
            { path: '../../../assets/surgeon.jpg' },
            { path: '../../../assets/surgeon.jpg' }
        ]
    }

    menuRoute(menu) {
        this.router.navigate([menu]);
    }

    startSimulation() {
        this.router.navigate(['task']);
    }
}