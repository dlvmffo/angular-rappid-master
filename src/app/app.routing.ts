import { Routes } from "@angular/router";
import { PetriNetsComponent } from "./components/petri-nets/petri-nets.component";
import { TaskComponent } from './components/task/task.component';
import { StepExecutionComponent } from './components/step-execution/step-execution.component';
import { TaskTrackComponent } from './components/task-track/task-track.component';
import { AssignTaskComponent } from './components/assign-task/assign-task.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { OverviewComponent } from './components/overview/overview.component';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'main-page',
    pathMatch: 'full'
  },
  {
    path: 'main-page',
    component: MainPageComponent,
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
  },
  {
    path: 'assign-task',
    component: AssignTaskComponent,
    pathMatch: 'full'
  },
  {
    path: 'overview',
    component: OverviewComponent,
    pathMatch: 'full'
  }
];
