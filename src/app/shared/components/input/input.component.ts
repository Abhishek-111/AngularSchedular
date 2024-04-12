import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers:
  [
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:forwardRef(()=>InputComponent),
      multi:true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  
  @Input() public label:string='';
  @Input() public inputType:string='';
  @Input() public isDisabled:boolean=true;
  private onChange = (val: any) => { };
  private onTouch = () => { };
  public data:string='';

 

  set value(val:any){
    this.data=val;
    this.onChange(this.data);
    this.onTouch();
  }

  public writeValue(obj: any): void {
    this.value=obj;
  }
  public registerOnChange(fn: any): void {
    this.onChange=fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouch=fn;
  }

   public valueChanged(){
    this.value=this.data;
  }

}
