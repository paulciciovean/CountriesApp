import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private apiServerUrl = 'https://restcountries.com/v3.1';
  constructor(private http: HttpClient) { }

  public getAllCountries()
  {
    return this.http.get(`${this.apiServerUrl}/all`)
  }
}
