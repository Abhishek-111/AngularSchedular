import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IEvent } from 'src/app/core/interfaces/event/IEvent';
import { IResponse } from 'src/app/core/interfaces/response/IResponse';
import { ConfigService } from 'src/app/core/services/config/config.service';


interface CustomEvent extends CalendarEvent{
  comment?:string;
  type?:string;
}
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient, private configService: ConfigService) { }
  public events: CustomEvent[] = [];

  public jumpToDate = new BehaviorSubject<string>(new Date().toString());

  public selectDate(startDate: Date){
    this.jumpToDate.next(startDate.toDateString());
  }

  private eventsSource = new BehaviorSubject<IEvent[]>([]);
  events$: Observable<IEvent[]> = this.eventsSource.asObservable();

  public getNewEvent(): IEvent[] {
    return this.eventsSource.getValue();
  }

  /**
   * To display newly added event on calendar
   */
  private eventsUpdated$ : Subject<IEvent> = new Subject<IEvent>();

  public getEventsUpdated():Observable<IEvent>{
    return this.eventsUpdated$.asObservable();
  }
  public notifyEventUpdated(newlyAddedEvent: IEvent):void{
    this.eventsUpdated$.next(newlyAddedEvent);
  }

  /**
   * Fill the event boxes on clicking any scheduled event 
   */
  private eventFetched$ : Subject<IEvent> = new Subject<IEvent>();
  public getEventsFetched():Observable<IEvent>{
    return this.eventFetched$.asObservable();
  }
  public notifyEventFetched(selectedEvent:IEvent):void{
    this.eventFetched$.next(selectedEvent);
  }

  /**
   * Fetch all the events from the backend
   * @returns 
   */
  public getEvents():Observable<IEvent[]>{
    return this.http.get<IEvent[]>(this.configService.getApiUrl() +'/api/Appointment/getAllAppointments');
  }

   /**
    * Add a new Appointment to database
    * @param event 
    * @returns 
    */
  public addEvent(event:IEvent):Observable<IResponse>{
    return this.http.post<IResponse>(this.configService.getApiUrl() + `/api/Appointment/addAppointment`,event);
  }

  /**
   * Update an existing Appointment detail
   * @param eventId 
   * @param event 
   * @returns 
   */
  public updateEvent(eventId:number, event: IEvent):Observable<IResponse>{
    return this.http.put<IResponse>(this.configService.getApiUrl()+`/api/Appointment/editAppointment/${eventId}`,event);
  }


  /**
   * Delete an appointment detail
   * @param eventId 
   * @returns 
   */
  public deleteEvent(eventId:number):Observable<IResponse>{
    return this.http.delete<IResponse>(this.configService.getApiUrl()+`/api/Appointment/deleteAppointment/${eventId}`);
  }
}
