import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { Disney } from '../../model/disney_get_res';
import { Constants } from '../../config/constants';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    RouterOutlet,
    HttpClientModule, LoginComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  id: any;
  disneys: Disney[] = [];
  user: any;
  img1: any;
  img2: any;
  imgid1: any;
  imgid2: any;
  user2: any;
  user1: any;
  login: boolean = false;
  scord1: number = 0;
  scord2: number = 0;


  constructor(private route: ActivatedRoute, private location: Location, private http: HttpClient, private constants: Constants,
    private router: Router) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
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
    });
  }

  // กำหนดเส้นทาง
  Choose_route() {
    const route = this.user ? '/profile' : '/login';
    const queryParams = this.user ? { id: this.user.userID } : null;
    this.router.navigate([route], { queryParams });
  }
  // Choose_route(userNumber: number) {
  //   const userID = userNumber === 1 ? this.user1.userID : this.user2.userID;
  //   const route = userID ? '/profile' : '/login';
  //   const queryParams = userID ? { id: userID } : null;
  //   this.router.navigate([route], { queryParams });
  // }

  UrlAll() {
    const url = this.constants.API_ENDPOINT + `/profile/image`;
    this.http.get(url).subscribe((data: any) => {
      this.img1 = data[this.randomVote(data)];
      this.imgid1 = this.img1.imgID;
      do {
        this.img2 = data[this.randomVote(data)];
      } while (this.img2 === this.img1);
      this.imgid2 = this.img2.imgID;

      this.userPro();

    });
  }

  userPro(): void {
    // card 1 
    const url = this.constants.API_ENDPOINT + `/profile/idm?id=${this.imgid1}`;
    this.http.get(url).subscribe((data: any) => {
      this.user1 = data[0] as Disney;
      // console.log(this.user1);
    });
    // card 2
    const url1 = this.constants.API_ENDPOINT + `/profile/idm?id=${this.imgid2}`;
    this.http.get(url1).subscribe((data: any) => {
      this.user2 = data[0] as Disney;
      // console.log(this.user2);

    });
  }

  vote(winnerImgId: number, loserImgId: number, check: number) {
    const url = this.constants.API_ENDPOINT + "/vote";
    const K = 32; // K-factor for Elo Rating
    // let scord1 = 0; // Initial score for img1
    // let scord2 = 0; // Initial score for img2

    // Calculate winScore and loseScore
    const winScore = 1 / (1 + 10 ** ((this.scord2 - this.scord1) / 400));
    const loseScore = 1 / (1 + 10 ** ((this.scord1 - this.scord2) / 400));

    if (check == 1) {
      // Calculate new ratings
      const RatingA = K * (1 - winScore);
      console.log(RatingA);

      const RatingB = K * (0 - loseScore);
      console.log(RatingB);


      // Send HTTP POST requests to update ratings
      this.http.post(url + '/win', {
        imgID: winnerImgId,
        score: RatingA
      }).subscribe((data: any) => {
        console.log(data);
      });

      this.http.post(url + '/lose', {
        imgID: loserImgId,
        score: RatingB
      }).subscribe((data: any) => {
        console.log(data);
      });
    }
  }



  randomVote(array: any[]): number {
    return Math.floor(Math.random() * array.length);
  }


  logout() {
    this.login = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }


  goBack(): void {
    this.location.back();
  }
}
