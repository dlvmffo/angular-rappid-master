import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { HttpModule } from '@angular/http';

import {MainPageComponent } from './components/main-page/main-page.component';

import { AppComponent } from './app.component';
import { TaskComponent } from "./components/task/task.component";
import { RouterModule } from "@angular/router";
import { rootRouterConfig } from "./app.routing";
import { PetriNetsComponent } from "./components/petri-nets/petri-nets.component";
import { StepExecutionComponent } from "./components/step-execution/step-execution.component";
import { TaskTrackComponent } from "./components/task-track/task-track.component";
import { AssignTaskComponent } from './components/assign-task/assign-task.component';
import { OverviewComponent } from './components/overview/overview.component';

import { FormsModule } from "@angular/forms";

import { ActivityService } from "./services/activity.service";
import { StepService } from "./services/step.service";
import { WorkflowService } from './services/workflow.service';

import { Step } from './models/activity.model';

import { TempDataStorageService } from './services/temp-data-storage.service';

import {IvyCarouselModule} from 'angular-responsive-carousel';
import {ToastaModule} from 'ngx-toasta';

@NgModule({
  declarations: [
    AppComponent,
    PetriNetsComponent,
    TaskComponent,
    StepExecutionComponent,
    TaskTrackComponent,
    AssignTaskComponent,
    MainPageComponent,
    OverviewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    IvyCarouselModule,
    ToastaModule.forRoot(),
    RouterModule.forRoot(rootRouterConfig, { useHash: false })
  ],
  exports: [BrowserModule, ToastaModule],
  providers: [ActivityService, StepService, WorkflowService, TempDataStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
