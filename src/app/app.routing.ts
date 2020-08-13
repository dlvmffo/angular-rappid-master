import { Routes } from "@angular/router";
import { OrgChartComponent } from "./components/org-chart/org-chart.component";
import { LineBuilderComponent } from "./components/line-builder/line-builder.component";
import { PetriNetsComponent } from "./components/petri-nets/petri-nets.component";
import { TaskComponent } from './components/task/task.component';
import { StepExecutionComponent } from './components/step-execution/step-execution.component';
import { TaskTrackComponent } from './components/task-track/task-track.component';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'task',
    pathMatch: 'full'
  },
  {
    path: 'org-chart',
    component: OrgChartComponent,
    pathMatch: 'full'
  },
  {
    path: 'line-builder',
    component: LineBuilderComponent,
    pathMatch: 'full'
  },
  {
    path: 'petri-nets',
    component: PetriNetsComponent,
    pathMatch: 'full'
  },
  {
    path: 'task',
    component: TaskComponent,
    pathMatch: 'full'
  },
  {
    path: 'step-execution',
    component: StepExecutionComponent,
    pathMatch: 'full'
  },
  {
    path: 'task-track',
    component: TaskTrackComponent,
    pathMatch: 'full'
  }
];
