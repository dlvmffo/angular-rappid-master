import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css']
})

export class MainPageComponent {
    constructor(private router: Router) {

    }
    startExecution() {
        this.router.navigate(['overview']);
    }
}