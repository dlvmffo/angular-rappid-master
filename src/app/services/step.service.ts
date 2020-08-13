import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Http, Headers, Response } from '@angular/http';
import { Step } from '../models/activity.model';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

const API_URL = environment.apiUrl;

@Injectable()
export class StepService {

    constructor(
        private http: Http
    ) {
    }

    // API: GET /todos
    public getAllSteps = (): Observable<Step[]> => {
        return this.http.get(this.getUrlWithDomain('api/Steps'),
            {
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://localhost:4200/'
                })
            }).pipe(map((response) => {
                return response.json();
            }));
    }

    // API: POST /todos
    public saveStep = (): Observable<Step[]> => {
        return this.http.post(this.getUrlWithDomain('api/Steps'),
            {
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://localhost:4200/'
                })
            }).pipe(map((response) => {
                return response.json();
            }));
    }

    public createStep(activity: Step): Observable<Step> {
        return this.http
            .post(API_URL + 'api/Steps', activity).pipe(map(response => {
                return response.json();
            }))
    }

    // API: GET /todos/:id
    public getTodoById(todoId: number) {
        // will use this.http.get()
    }

    public udpateStep(activity: Step): Observable<Step> {
        return this.http
            .put(API_URL + 'api/Steps/' + activity.id, activity).pipe(map(response => {
                return response.json();
            }))
    }

    // DELETE /todos/:id
    public deleteStepById(todoId: number) {
        // will use this.http.delete()
    }

    public getUrlWithDomain(url: string) {
        return environment.apiUrl + url;
    }
}