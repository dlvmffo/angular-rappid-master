import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Http, Headers, Response } from '@angular/http';
import { Step } from '../models/activity.model';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import * as signalR from "@aspnet/signalr";

const API_URL = environment.apiUrl;

@Injectable()
export class StepService {
    private hubConnection: signalR.HubConnection

    constructor(
        private http: Http
    ) {
    }

    // public startConnection = () => {
    //     this.hubConnection = new signalR.HubConnectionBuilder()
    //                             .withUrl(this.getUrlWithDomain('api/Steps'))
    //                             .build();
    //     this.hubConnection
    //       .start()
    //       .then(() => console.log('Connection started'))
    //       .catch(err => console.log('Error while starting connection: ' + err))
    //   }

    // API: GET /todos
    public getAllSteps = (): Observable<Step[]> => {
        // this.startConnection();
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

    // API: GET 
    public getStepById(id: number) {
        return this.http
        .get(API_URL + 'api/Steps/' + id).pipe(map(response => {
            return response.json();
        }))
    }

    public udpateStep(activity: Step): Observable<Step> {
        return this.http
            .put(API_URL + 'api/Steps/' + activity.id, activity).pipe(map(response => {
                return response.json();
            }))
    }

    // DELETE /todos/:id
    public deleteStepById(activityId: number) {
        // will use this.http.delete()
        return this.http
        .delete(API_URL + 'api/Steps/' + activityId).pipe(map(response => {
            return response.json();
        }))
    }

    public getUrlWithDomain(url: string) {
        return environment.apiUrl + url;
    }
}