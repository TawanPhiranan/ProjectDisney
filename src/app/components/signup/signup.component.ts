import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../../config/constants';
import { Disney } from '../../model/disney_get_res';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatFormFieldModule, 
    HttpClientModule, RouterOutlet, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  username: string = '';
  email:    string = '';
  password: string = '';
  imgUser:  string = '';
  typeID:   number = 0;

  constructor(private constants: Constants, private http: HttpClient) {}

  addNew(username:HTMLInputElement, email :HTMLInputElement, password : HTMLInputElement) {
    const url = this.constants.API_ENDPOINT+`/disney`;
    this.http.post(url, {
      username: username.value,
      email: email.value,
      password: password.value
    }).subscribe((data: any) => {
      console.log(data);
    });
  }
}


