import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  
  constructor(private constants : Constants,private http:HttpClient) { }

  public async getAllDailystats(options?:any){
    let url = '';
    if(options){
      const id = options;
      url = this.constants.API_ENDPOINT + '/rank/yesterday/' + id;
    }else{
      url = this.constants.API_ENDPOINT + '/rank/yesterday';
    }
    const response = await lastValueFrom(this.http.get(url));
    return response as any[];
  }

  
}
