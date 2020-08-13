import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class TempDataStorageService {
    public activitySource = new Subject<any>();
    activity = this.activitySource.asObservable();

    activityData(data: any) {
        this.activitySource.next(data);
    }
}