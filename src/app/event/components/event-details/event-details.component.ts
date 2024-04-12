import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IEvent } from 'src/app/core/interfaces/event/IEvent';
import { EventService } from '../../services/event/event.service';
import { CalendarEvent } from 'angular-calendar';
import { NgToastService } from 'ng-angular-popup';

interface CustomEvent extends CalendarEvent{
  comment?:string;
}

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit{

  @Output() formSubmitted:EventEmitter<any>=new EventEmitter<any>();
  public eventForm!:FormGroup;
  public isOldEvent:boolean = false;
  public eventId:number = 0;
  /**
   * 
   */
  public event: IEvent = {
    title: '',
    start: new Date(),
    end: new Date,
    comment: '',
    type:'',
    duration:0,
    customerId:0,
    advisorId:0,
    description:''
  };

  constructor(private fb:FormBuilder,private datePipe:DatePipe, private eventService: EventService, private toast: NgToastService){}
  

  ngOnInit(): void {
    this.createForm(); 

    this.eventService.getEventsFetched().subscribe((event) => {
      
      this.eventId = event.id || 0;
      //console.log("Event Id is :"+this.eventId);
     this.eventForm.patchValue({
      title:event.title,
      startDate: this.datePipe.transform(event.start,'yyyy-MM-ddTHH:mm:ss'),
      endDate:this.datePipe.transform(event.end,'yyyy-MM-ddTHH:mm:ss'),
      type:event.type,
      comment:event.comment
    });
     
    this.isOldEvent = true;
    });
  }

  

  public createForm(){
    this.eventForm=this.fb.group({
      title:new FormControl('',Validators.required),
      startDate:new FormControl('',Validators.required),
      endDate:new FormControl('',Validators.required),
      type:new FormControl('',Validators.required),
      comment:new FormControl('',Validators.required)
    });
  }

  public resetForm(){
    this.eventForm.patchValue({
      title:'',
      startDate:'',
      endDate:'',
      type:'',
      comment:''
    });
    this.isOldEvent = false;
  }

/**
 * Executes when an user submits the event details
 */
  public submit(){

    if(this.eventForm.valid){
      //this.formSubmitted.emit(this.eventForm.value);
      
      this.event.title = this.eventForm.value.title;
      this.event.start = new Date(this.eventForm.value.startDate);
      this.event.end = new Date(this.eventForm.value.endDate);
      this.event.comment = this.eventForm.value.comment;
      this.event.type = this.eventForm.value.type;
      
      this.formSubmitted.emit(this.event);

      const newEventInstance: CustomEvent = {...this.event};
      this.eventService.events = [... this.eventService.events,newEventInstance];
     
    }
  }

 

  /**
   * To navigate calendar on chosen date
   */
  public selectedStartDate(){
    //console.log(this.eventForm.value.startDate);
    this.eventService.selectDate(new Date(this.eventForm.value.startDate))
  }

  /**
   * To navigate calendar on chosen date
   */
  public selectedEndDate(){
    this.eventService.selectDate(new Date(this.eventForm.value.endDate))
  }

  /**
   * Delete an Event 
   */
  public deleteEvent() {
    const yesNo = confirm('Are you sure to delete?');
    if (yesNo) {
      this.eventService.deleteEvent(this.eventId).subscribe({
        next: (response) => {
          this.toast.success({
            detail: 'success',
            summary: response.message,
            duration: 4000,
          });
          //this.refreshCalendar();
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
      //this.closeModal();
    }
  }

  /**
   * Update an event
   */
  // public updateEvent() {
  //   this.eventService
  //     .updateEvent(this.eventId || 0, this.selectedEvent)
  //     .subscribe({
  //       next: (response) => {
  //         //this.closeModal();
  //         this.toast.success({
  //           detail: 'successs',
  //           summary: response.message,
  //           duration: 4000,
  //         });
  //         //this.refreshCalendar();
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         this.toast.error({
  //           detail: 'Error',
  //           summary: error.message,
  //           duration: 4000,
  //         });
  //       },
  //     });
  // }
}
