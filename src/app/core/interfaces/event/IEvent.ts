export interface IEvent{
    id? : number,
      start:  Date,
      end :  Date,
      title: string,
      comment: string,
      type?:string,
      description?:string
      customerId?:number,
      advisorId?:number,
      duration?:number,
      color?: {primary: string, secondary: string},
      draggable?:boolean,
      resizable?: {beforeStart:boolean,afterEnd:boolean},
      
}