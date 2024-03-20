import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, Location } from '@angular/common';
import { Disney } from '../../model/disney_get_res';
import { Constants } from '../../config/constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { lmage } from '../../model/Image_get_res';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin-member-show',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterOutlet,
    RouterModule,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './admin-member-show.component.html',
  styleUrl: './admin-member-show.component.scss'
})
export class AdminMemberShowComponent {

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private constants: Constants,
    private router: Router,
    private header : HeaderComponent
  ) { }
  
  goBack(): void {
    this.location.back();
  }

}
