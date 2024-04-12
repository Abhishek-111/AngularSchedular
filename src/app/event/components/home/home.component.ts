import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/core/interfaces/user/IUser';
import { IEvent } from 'src/app/core/interfaces/event/IEvent';
import { EventService } from '../../services/event/event.service';
import {NgToastService} from 'ng-angular-popup'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userForm!: FormGroup;
  public userList: IUser[] = [];
  public isCustomerSelected: boolean = false;
  public isAdvisorSelected: boolean = false;
  public isCustomer: boolean = false;
  public isAdvisor: boolean = false;
  public formValue: string = '';
  public customer: IUser = {
    id: 0,
    name: '',
    email: '',
    username: '',
    city: '',
    role: '',
    phoneNumber: ''
  };
  public advisor: IUser = {
    id: 0,
    name: '',
    email: '',
    username: '',
    city: '',
    role: '',
    phoneNumber: ''
  };

  constructor(private service: UserService, private fb: FormBuilder, private eventService: EventService, private toast:NgToastService) { }
  ngOnInit(): void { }


  public deleteCustomer() {
    this.isCustomerSelected = false;
    this.customer.name = '';
    this.customer.phoneNumber = '';
    this.customer.city = '';
    this.customer.email = '';
    this.customer.username = '';
  }

  public deleteAdvisor() {
    this.isAdvisorSelected = false;
    this.advisor.name = '';
    this.advisor.phoneNumber = '';
    this.advisor.city = '';
    this.advisor.email = '';
    this.advisor.username = '';
  }

  public close() {
    let element = document.getElementsByClassName('user_d') as HTMLCollectionOf<HTMLElement>;
    element[0].style.display = 'none';
  }

  public searchUser() {
    if (this.isCustomer) {
      this.getCustomersByName();
    }
    else {
      this.getAdvisorsByName();
    }
  }

  public userSelected(id?: number, role?: string) {
    console.log(role);
    var userDetails;
    this.close();
    if (role == 'Customer') {
      this.isCustomer = false;
      this.isCustomerSelected = true;
      console.log(this.isCustomerSelected);
      this.service.getAllCustomers().subscribe({
        next: (res => {
          userDetails = res.filter(x => x.id == id)[0];
          this.customer = {
            id: userDetails.id,
            name: userDetails.name,
            email: userDetails.email,
            username: userDetails.username,
            city: userDetails.city,
            role: userDetails.role,
            phoneNumber: userDetails.phoneNumber
          };
        })
      })
    }
    else {
      this.isAdvisor = false;
      this.isAdvisorSelected = true;
      this.service.getAllAdvisors().subscribe({
        next: (res => {
          userDetails = res.filter(x => x.id == id)[0];
          this.advisor = {
            id: userDetails.id,
            name: userDetails.name,
            email: userDetails.email,
            username: userDetails.username,
            city: userDetails.city,
            role: userDetails.role,
            phoneNumber: userDetails.phoneNumber
          };
        })
      })
    }
  }

  public selectUser(e: any) {
    if (e == 'Customer') {
      let element = document.getElementsByClassName('user_d') as HTMLCollectionOf<HTMLElement>;
      element[0].style.display = 'block';
      this.isCustomer = true;
      this.formValue='';
      this.userList=[];
    }
    else {
      let element = document.getElementsByClassName('user_d') as HTMLCollectionOf<HTMLElement>;
      element[0].style.display = 'block';
      this.isAdvisor = true;
      this.formValue='';
      this.userList=[];
    }
  }

  public editUser(e:any){
    if (e.label == 'Customer') {
      let element = document.getElementsByClassName('user_d') as HTMLCollectionOf<HTMLElement>;
      element[0].style.display = 'block';
      this.formValue=e.name;
      this.isCustomer = true;
      this.getCustomersByName();
    }
    else {
      let element = document.getElementsByClassName('user_d') as HTMLCollectionOf<HTMLElement>;
      element[0].style.display = 'block';
      this.formValue=e.name;
      this.isAdvisor = true;
      this.getAdvisorsByName();
    }
  }

  public deleteUser(e:any){
    if(e=='Customer'){
      this.isCustomerSelected=false;
    }
    else{
      this.isAdvisorSelected=false;
    }
  }

  private getCustomersByName(){
    this.service.getAllCustomers().subscribe({
      next: (res => {
        console.log(res);
        this.userList = res;
        this.userList = this.userList.filter(x => (x.name || '').toLowerCase().includes(this.formValue?.toLowerCase() || ''));
      })
    })
  }

  private getAdvisorsByName(){
    this.service.getAllAdvisors().subscribe({
      next: (res => {
        this.userList = res;
        this.userList = this.userList.filter(x => (x.name || '').toLowerCase().includes(this.formValue?.toLowerCase() || ''));
      })
    })
  }

  // event details on submit
  public submitDetails(event:IEvent){

    const differenceInMs = event.end.getTime() - event.start.getTime();
    const millisecondPerDay = 1000*60*60*24;
    const durationInDays = Math.floor(differenceInMs/millisecondPerDay);
    event.duration = durationInDays+1;
     
    // event.customerId = 343;
    // event.advisorId = 454;
   
    this.eventService.addEvent(event)
    .subscribe({
      next:(response) => {
        this.toast.success({detail:"successs",summary:response.message,duration:5000});
        this.eventService.notifyEventUpdated(event);
      },
      error:(err) => {
        console.log(err);
      }
    });

   
  }
}

