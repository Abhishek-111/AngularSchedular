import { IEvent } from "./IEvent";

export class Event implements IEvent{
    constructor(
        
        public start:Date,
        public end:Date,
        public title:string,
        public comment:string,
        public id?:number,
        public type?:string,
        public description?: string,
        public duration?:number,
        public customerId?: number,
        public advisorId?: number,
        public draggable?:boolean,
        public color?: {primary: "#4287f5", secondary: "#4287f5"},
        public resizable?: {beforeStart:boolean,afterEnd:boolean},

    ){}
}