import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user/IUser';
import { ConfigService } from 'src/app/core/services/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient,private configService:ConfigService) { }

  public getCustomerByName(name:string):Observable<IUser[]>{
    let val=JSON.stringify(name);
    return this.http.post<IUser[]>(this.configService.getApiUrl()+'/api/User/getCustomers',val,{headers:new HttpHeaders({'Content-Type':'application/json'})});
  }

  public getAllCustomers():Observable<IUser[]>{
    return this.http.get<IUser[]>(this.configService.getApiUrl()+'/api/User/getAllCustomers');
  }

  public getCustomerById(id:number):Observable<IUser>{
    return this.http.get<IUser>(this.configService.getApiUrl()+`/api/User/getCustomer/${id}`);
  }

  public getAdvisorById(id:number):Observable<IUser>{
    return this.http.get<IUser>(this.configService.getApiUrl()+`/api/User/getAdvisor/${id}`);
  }

  public getAdvisorByName(name:string):Observable<IUser[]>{
    let val=JSON.stringify(name);
    return this.http.post<IUser[]>(this.configService.getApiUrl()+'/api/User/getAdvisors',val,{headers:new HttpHeaders({'Content-Type':'application/json'})});
  }

  public getAllAdvisors():Observable<IUser[]>{
    return this.http.get<IUser[]>(this.configService.getApiUrl()+'/api/User/getAllAdvisors');
  }
}
