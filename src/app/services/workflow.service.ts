import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Http, Headers } from '@angular/http';
import { Workflow } from '../models/activity.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

const API_URL = environment.apiUrl;

@Injectable()
export class WorkflowService {

    constructor(private http: Http) {}

    public getAllWorkflows = (): Observable<Workflow[]> => {
        // this.startConnection();
        return this.http.get(this.getUrlWithDomain('api/Workflows'),
            {
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).pipe(map((response) => {
                return response.json();
            }));
    }

    public createWorkflow(activity: Workflow): Observable<Workflow> {
        return this.http
            .post(API_URL + 'api/Workflows', activity).pipe(map(response => {
                return response.json();
            }))
    }

    public getUrlWithDomain(url: string) {
        return environment.apiUrl + url;
    }

    public udpateWorkflow(workflow: Workflow): Observable<Workflow> {
        return this.http
            .put(API_URL + 'api/Workflows/' + workflow.id, workflow).pipe(map(response => {
                return response.json();
            }))
    }

    // DELETE /todos/:id
    public deleteWorkflowById(todoId: number) {
        // will use this.http.delete()
    }

}