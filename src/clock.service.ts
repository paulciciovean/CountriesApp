import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClockService {

  private apiClockUrl = 'http://worldtimeapi.org/api/timezone';
  constructor(private http: HttpClient) { }
  public getClock(continent: string,capital:string)
  {
    if(continent=='North America' || continent=='South America')
      continent='America';
      
    return this.http.get(`${this.apiClockUrl}/`+`${continent}/`+`${capital}`)
  }
}
