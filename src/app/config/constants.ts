import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
  export class Constants {
    
    public readonly API_ENDPOINT: string = 'https://projectdisneyapi-2.onrender.com';
    // public readonly API_ENDPOINT: string =  'http://localhost:3000';

  }
