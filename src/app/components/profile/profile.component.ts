import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, Location } from '@angular/common';
import { Constants } from '../../config/constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(private constants: Constants, private http: HttpClient, private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  // imgFirebase(){
  //   const url = this.constants.API_ENDPOINT+`/upload`;

  // }

  // imgDB(){

  // }


}
