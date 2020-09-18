import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { OrgChartComponent } from "./components/org-chart/org-chart.component";
import { TaskComponent } from "./components/task/task.component";
import { RouterModule } from "@angular/router";
import { rootRouterConfig } from "./app.routing";
import { LineBuilderComponent } from "./components/line-builder/line-builder.component";
import { PetriNetsComponent } from "./components/petri-nets/petri-nets.component";
import { StepExecutionComponent } from "./components/step-execution/step-execution.component";
import { TaskTrackComponent } from "./components/task-track/task-track.component";
import { AssignTaskComponent } from './components/assign-task/assign-task.component';

import { FormsModule } from "@angular/forms";

import { ActivityService } from "./services/activity.service";
import { StepService } from "./services/step.service";
import { WorkflowService } from './services/workflow.service';

import { Step } from './models/activity.model';

import { TempDataStorageService } from './services/temp-data-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    OrgChartComponent,
    LineBuilderComponent,
    PetriNetsComponent,
    TaskComponent,
    StepExecutionComponent,
    TaskTrackComponent,
    AssignTaskComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false })
  ],
  providers: [ActivityService, StepService, WorkflowService, TempDataStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
