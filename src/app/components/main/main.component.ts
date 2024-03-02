import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { Disney } from '../../model/disney_get_res';
import { Constants } from '../../config/constants';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, RouterModule,
    RouterOutlet, HttpClientModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {


  id: any;
  disneys: Disney[] = [];
  user: any;
  img1: any;
  img2: any;


  constructor(private route: ActivatedRoute, private location: Location, private http: HttpClient, private constants: Constants, private router: Router) {

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      // console.log(this.id);
      this.callApi();
    });
    this.UrlAll();
  }
  callApi(): void {
    const url = this.constants.API_ENDPOINT + `/profile/main?id=${this.id}`;
    this.http.get(url).subscribe((data: any) => {
      this.user = data[0] as Disney;
      // console.log(this.user);
    });
  }

  // กำหนดเส้นทาง
  Choose_route() {
    const route = this.user ? '/profile' : '/login';
    const queryParams = this.user ? { id: this.user.userID } : null;
    this.router.navigate([route], { queryParams });
  }

  UrlAll() {
    const url = this.constants.API_ENDPOINT + `/profile/image`;
    this.http.get(url).subscribe((data: any) => {
      this.img1 = data[this.randomVote(data)];
      do {
        this.img2 = data[this.randomVote(data)];
      } while (this.img2 === this.img1);
    });
  }
  
  randomVote(array: any[]): number {
    return Math.floor(Math.random() * array.length);
  }

  goBack(): void {
    this.location.back();
  }
}