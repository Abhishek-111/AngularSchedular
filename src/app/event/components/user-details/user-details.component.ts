import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/core/interfaces/user/IUser';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit,OnChanges {
  @Input() public isUserSelected: boolean = false;
  @Input() public label: string = '';
  @Input() public userDetails!:IUser;
  @Output() userSelected:EventEmitter<any>=new EventEmitter<any>();
  @Output() editUser:EventEmitter<any>=new EventEmitter<any>();
  @Output() userDeleted:EventEmitter<any>=new EventEmitter<any>();

  public userForm!: FormGroup;
  public user: IUser = {
    id: 0,
    name: '',
    email: '',
    username: '',
    city: '',
    role: '',
    phoneNumber: ''
  };

  constructor(private fb: FormBuilder) { }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    if(this.userDetails.name && this.isUserSelected){
      this.userForm.patchValue({
        name:this.userDetails.name,
        phoneNumber:this.userDetails.phoneNumber,
        city:this.userDetails.city,
        email:this.userDetails.email,
        username:this.userDetails.username
      })
    }
  }
  ngOnInit(): void {
    this.createForm();
  }


  public createForm() {
    this.userForm = this.fb.group({
      name: new FormControl(this.user.name, Validators.required),
      phoneNumber: new FormControl(this.user.phoneNumber, Validators.required),
      city: new FormControl(this.user.city, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
      username: new FormControl( this.user.username, Validators.required)
    });
  }

  public deleteUser() {
    this.userForm.patchValue( {
      name: '',
      email: '',
      username: '',
      city: '',
      phoneNumber: ''
    });
    this.userDeleted.emit(this.label);
  }

  public changeUser() {
    this.editUser.emit({label:this.label,name:this.userDetails.name});
   }

  public selectUser() {
    this.userSelected.emit(this.label);
   }
}
