import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewComponent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { IEvent } from 'src/app/core/interfaces/event/IEvent';
import { Subject } from 'rxjs';
import { EventService } from '../../services/event/event.service';
import { NgToastService } from 'ng-angular-popup';

interface CustomEvent extends CalendarEvent {
  comment?: string;
  type?: string;
  
}

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @Output() newEventEmitter: EventEmitter<CustomEvent> =
    new EventEmitter<CustomEvent>();

  public selectedDate: Date = new Date();
  public dateOfEvent:string = '';

  

  

  public view: CalendarView = CalendarView.Month;

  public CalendarView = CalendarView;

  public viewDate: Date = new Date();

  public eventList: IEvent[] = [];

  public eventsOfSelectedDate: IEvent[] = [];

  public refresh = new Subject<void>();

  public activeDayIsOpen: boolean = true;

  public jumpToDate: Date = new Date();
  public activeDayCssClass: string = '';

  public selectedEvent: IEvent = {
    id: 0,
    title: '',
    start: new Date(),
    end: new Date(),
    comment: '',
    type: '',
    duration: 0,
    description: '',
  };

  constructor(
    public eventService: EventService,
    private cdr: ChangeDetectorRef,
    private toast: NgToastService
  ) {}

  /**
   * Fetches events from the backend
   */
  ngOnInit(): void {
    this.jumpToSelectedDate();
    this.loadEvents();

    this.eventService.getEventsUpdated().subscribe((newlyAddedEvent) => {
      //this.loadEvents();
      this.refreshCalendar();
      //this.eventService.events.push(newlyAddedEvent)
    });
  }

  public loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (response) => {
        this.eventList = response;

        this.eventList.forEach((event) => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
          event.color = { primary: '#4287f5', secondary: '#4287f5' }; //  #4287f5
          (event.draggable = true),
            (event.resizable = { beforeStart: true, afterEnd: true });
          
            
          this.eventService.events = [...this.eventService.events, event];
         
          
        });

        this.refreshCalendar();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * Refresh the calendar to show events
   */
  public refreshCalendar() {
    this.cdr.detectChanges();
  }

  /**
   * This method executes on clicking any date on the calendar
   * @param param0
   */
  public dayClicked({date,events,}: {date: Date;events: CalendarEvent[];}): void {
    //console.log('Date is:- ' + date);
    const clickedDate = new Date(date);
    //const clickedDateOnly = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());

    let dateClicked =
      clickedDate.getFullYear().toString() +
      clickedDate.getMonth().toString() +
      clickedDate.getDate().toString();
   // console.log('Date Clicked:' + dateClicked);
    this.dateOfEvent = clickedDate.getDate().toString()+'-'+clickedDate.getMonth().toString()+'-'+clickedDate.getFullYear().toString();

    this.eventsOfSelectedDate = [];

    // console.log("clicked Date only: "+clickedDate.getFullYear().toString()+clickedDate.getMonth().toString()+clickedDate.getDate().toString());
    //console.log("Event DATE is:- "+events);
    this.eventService.events.forEach((event) => {
      const eventStartDate = new Date(event.start);
      const eventEndDate = new Date(event.end || event.start);
      //const eventEndDateOnly = new Date(eventEndDate.getFullYear(),eventEndDate.getMonth(), eventEndDate.getDate());

      // const eventStartDateOnly = new Date(
      //   eventStartDate.getFullYear(),
      //   eventStartDate.getMonth(),
      //   eventStartDate.getDate()
      // );
      let eventStartDate2 =
        eventStartDate.getFullYear().toString() +
        eventStartDate.getMonth().toString() +
        eventStartDate.getDate().toString();
      let eventEndDate2 =
        eventEndDate.getFullYear().toString() +
        eventEndDate.getMonth().toString() +
        eventEndDate.getDate().toString();

      //console.log("Eventtt"+Number(eventStartDate2));
      if (
        Number(dateClicked) >= Number(eventStartDate2) &&
        Number(dateClicked) <= Number(eventEndDate2)
      ) {
        console.log('Event falls in any scheduled event');
        
        // show events in modal
        //console.log(event.title);
        //console.log(event.customerId)

        const selectedEvent = {
          title:event.title,
          id:Number(event.id),
          start:event.start,
          end:event.end || event.start,
          comment:event.comment || '',
          type:event.type,
          customerId:event.customerId,
          advisorId:event.advisorId,
        };
        
        this.eventsOfSelectedDate.push(selectedEvent);
      }
      
    });
    if(this.eventsOfSelectedDate.length == 1){
      this.eventService.notifyEventFetched(this.eventsOfSelectedDate[0]);
    }
    else if(this.eventsOfSelectedDate.length > 1){
      this.openEventsOnADayModal(this.selectedEvent);
    }
   
    

    

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  /**
   * Method to handle the drag event, It updates the newStart and newEnd of the
   * dragged event.
   * @param param0
   */
  public eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.eventService.events = this.eventService.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });

    const selectedEvent = {
      title:event.title,
      id:Number(event.id),
      start:event.start,
      end:event.end || event.start,
      comment:event.comment || '',
      type:event.type,
      customerId:event.customerId,
      advisorId:event.advisorId,
    };
    
    this.updateEvent(selectedEvent);
  }

 
  /**
   * Executes on Clicking any event on calendar
   * @param action
   * @param event
   */
  public handleEvent(action: string, event: CustomEvent): void {
    this.selectedEvent.id = Number(event.id);
    this.selectedEvent.title = event.title;
    this.selectedEvent.start = event.start;
    this.selectedEvent.end = event.end || new Date();
    this.selectedEvent.comment = event.comment || '';
    // update event
    this.openUpdateModal(this.selectedEvent);
  }

  /**
   * Sets the view format of the calendar - month, week or day
   * @param view
   */
  public setView(view: CalendarView) {
    this.view = view;
  }

  /**
   * Closes the month view Day
   */
  public closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  /**
   * Opens up the update modal to update the event
   * @param eventToUpdate
   */
  public openUpdateModal(eventToUpdate: CustomEvent) {
    const modalDiv = document.getElementById('myModal3');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  /**
   * Closes the modal
   */
  public closeModal() {
    const modalDiv = document.getElementById('myModal3');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  /**
   * Method to update the event
   */
  public updateEvent(selectedEvent: IEvent) {
    this.eventService
      .updateEvent(this.selectedEvent.id || 0, selectedEvent)
      .subscribe({
        next: (response) => {
          this.closeModal();
          this.toast.success({
            detail: 'successs',
            summary: response.message,
            duration: 4000,
          });
          this.refreshCalendar();
        },
        error: (error) => {
          console.log(error);
          this.toast.error({
            detail: 'Error',
            summary: error.message,
            duration: 4000,
          });
        },
      });
  }

  /**
   * Method to delete the event
   */
  public deleteEvent() {
    const yesNo = confirm('Are you sure to delete?');
    if (yesNo) {
      this.eventService.deleteEvent(this.selectedEvent.id || 0).subscribe({
        next: (response) => {
          this.closeModal();
          this.toast.success({
            detail: 'success',
            summary: response.message,
            duration: 4000,
          });
          this.refreshCalendar();
        },
        error: (error) => {
          this.toast.error({
            detail: 'error',
            summary: error.message,
            duration: 4000,
          });
        },
      });
    } else {
      this.closeModal();
    }
  }

  public openEventsOnADayModal(events: CustomEvent) {
    const modalDiv = document.getElementById('myModal2');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
    }
  }

  public closeModalOfEvents(){
    const modalDiv = document.getElementById('myModal2');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
    }
  }

  public targetEvent(eventId?:number){
      this.eventsOfSelectedDate.forEach((event) => {
        if(event.id === eventId){
          const selectedEvent = {
            title:event.title,
            id:Number(event.id),
            start:event.start,
            end:event.end || event.start,
            comment:event.comment || '',
            type:event.type,
            customerId:event.customerId,
            advisorId:event.advisorId,
          };

          this.eventService.notifyEventFetched(selectedEvent);
        }
      });
      this.closeModalOfEvents();
  }

  public isJumpToDate(day: any): boolean {
    return day.date.getTime() === this.jumpToDate.getTime();
  }
  public jumpToSelectedDate() {
    this.eventService.jumpToDate.subscribe((date) => {
      this.viewDate = new Date(date);
      this.jumpToDate = new Date(date);
      console.log(this.jumpToDate);
      this.activeDayIsOpen = true;
      this.activeDayCssClass = 'custom-active-day';
      this.refreshCalendar();
    });
    
  }
}
