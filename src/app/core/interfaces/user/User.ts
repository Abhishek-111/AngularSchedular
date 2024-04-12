import { IUser } from "./IUser";


export class User implements IUser {

    constructor(
        public id?: number,
        public name?: string,
        public username?: string,
        public email?: string,
        public phoneNumber?: string,
        public city?:string,
        public role?:string
    ) { }
}