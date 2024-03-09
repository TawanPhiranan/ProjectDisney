import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Constants } from '../../config/constants';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatFormFieldModule, RouterModule,
    RouterOutlet, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  id: any;
  type: any;
  constructor(private constants: Constants, private http: HttpClient, private router: Router) { }
  login(email: HTMLInputElement, password: HTMLInputElement) {
    const url = this.constants.API_ENDPOINT + `/disney/login`;
    if (email.value && password.value) {
      this.http.post(url, {
        email: email.value,
        password: password.value
      }).subscribe((data: any) => {
        // console.log(data);
        if (data && data.message === "Match found") {
          const userID = data.result[0].userID;
          const typeID = data.result[0].typeID;
          console.log("Login successful");
          // console.log(data.result);
          if (typeID === 1) {
            this.router.navigate(['/'], { queryParams: { id: userID } });
          } else if (typeID === 2) {
            this.router.navigate(['/adminMember']);
          }

        } else {
          console.log("Email or password is incorrect");
          this.router.navigate(['/']);
        }
      });
    }
  }



}



// if (data.typeID === 1) {
//   this.router.navigate(['/main'], { queryParams: { id: this.id } });
// } else if (data.typeID === 2) {
//   this.router.navigate(['/adminMember']);
// }