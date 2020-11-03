import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Http, Headers, Response } from '@angular/http';
import { Activity } from '../models/activity.model';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

const API_URL = environment.apiUrl;

@Injectable()
export class ActivityService {

    constructor(
        private http: Http
    ) {
    }

    // API: GET /todos
    public getAllActivities = (): Observable<Activity[]> => {
        return this.http.get(this.getUrlWithDomain('api/Activities'),
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
    public createActivity(activity: Activity): Observable<Activity> {
        return this.http
            .post(API_URL + 'api/Activities', activity).pipe(map(response => {
                return response.json();
            }))
    }

    // API: GET /todos/:id
    public getTodoById(todoId: number) {
        // will use this.http.get()
    }

    public udpateActivity(activity: Activity): Observable<Activity> {
        debugger;
        return this.http
            .put(API_URL + 'api/Activities/' + activity.id, activity).pipe(map(response => {
                return response.json();
            }))
    }

    // DELETE /todos/:id
    public deleteTodoById(todoId: number) {
        // will use this.http.delete()
    }

    public getUrlWithDomain(url: string) {
        return environment.apiUrl + url;
    }
}