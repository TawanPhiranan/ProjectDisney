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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HeaderComponent } from '../header/header.component';


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
    HttpClientModule, LoginComponent, MatProgressBarModule
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
  scord1: any = 0;
  scord2: any = 0;
  canVote: boolean = true;
  userID: any;

  RatingA: any;
  RatingB: any;
  winScore: any;
  loseScore: any;
  K: any;
  check: any;

 

  constructor(private route: ActivatedRoute, private location: Location, private http: HttpClient, private constants: Constants,
    private router: Router, private header: HeaderComponent
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      // console.log(this.id);
      // this.userID = params['userID'];
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

  UrlAll() {
    const url = this.constants.API_ENDPOINT + `/profile/image`;
    this.http.get(url).subscribe((data: any) => {
      this.img1 = data[this.randomVote(data)];
      this.imgid1 = this.img1.imgID;

      //sum img1
      const urlImg1 = this.constants.API_ENDPOINT + `/vote/` + this.imgid1;
      this.http.get(urlImg1).subscribe((data: any) => {
        this.scord1 = data[0].total_score;
        if (this.scord1 == null) {
          this.scord1 = 0;
        }
        console.log("imgID : " + this.imgid1 + " = " + this.scord1);
      });

      do {
        this.img2 = data[this.randomVote(data)];
      } while (this.img2 === this.img1);

      //sum img2
      this.imgid2 = this.img2.imgID;
      const urlImg2 = this.constants.API_ENDPOINT + `/vote/` + this.imgid2;
      this.http.get(urlImg2).subscribe((data: any) => {
        this.scord2 = data[0].total_score;
        if (this.scord2 == null) {
          this.scord2 = 0;
        }
        console.log("imgID : " + this.imgid2 + " = " + this.scord2);
      });
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

    if (this.canVote) {
      this.canVote = false;
      setTimeout(() => {
        this.canVote = true;
      }, 7000);
      // this.UrlAll();
      this.startCountdown();
    } else {
      console.log('Please wait 10 seconds before voting again.');
    }


    const url = this.constants.API_ENDPOINT + "/vote";
    const K = 32; // K-factor for Elo Rating
    this.K =K;

    // Calculate winScore and loseScore
    const winScore = 1 / (1 + 10 ** ((this.scord2 - this.scord1) / 400));
    const loseScore = 1 / (1 + 10 ** ((this.scord1 - this.scord2) / 400));
    this.winScore  = winScore;
    this.loseScore = loseScore;

    if (check == 1) {
      this.check = check;
      // Calculate new ratings
      const RatingA = K * (1 - winScore);
      console.log(`RatingA with ID ${winnerImgId}: ${RatingA}`);

      const RatingB = K * (0 - loseScore);
      console.log(`RatingB with ID ${loserImgId}: ${RatingB}`);

      this.RatingA = RatingA;
      this.RatingB = RatingB;

      // Send HTTP POST requests to update ratings
      this.http.post(url + '/win', {
        imgID: winnerImgId,
        score: RatingA
      }).subscribe((data: any) => {
        // console.log(data);
      });

      this.http.post(url + '/lose', {
        imgID: loserImgId,
        score: RatingB
      }).subscribe((data: any) => {
        // console.log(data);
      });
    } else if (check == 0) {
      this.check = check;

      // Calculate new ratings
      const RatingA = K * (0 - winScore);
      console.log(`RatingA with ID ${ loserImgId}: ${RatingA}`);

      const RatingB = K * (1 - loseScore);
      console.log(`RatingB with ID ${winnerImgId}: ${RatingB}`);

      this.RatingA = RatingA;
      this.RatingB = RatingB;

      // Send HTTP POST requests to update ratings
      this.http.post(url + '/win', {
        imgID: winnerImgId,
        score: RatingB
      }).subscribe((data: any) => {
        // console.log(data);
      });

      this.http.post(url + '/lose', {
        imgID: loserImgId,
        score: RatingA
      }).subscribe((data: any) => {
        // console.log(data);
      });
    }
  }

  //เวลาในการสุ่ม
  countdown: number = 5; // เวลาที่เหลือในการรอ (วินาที)
  countdownInterval: any; // ตัวแปรสำหรับ interval

  startCountdown() {
    this.countdown = 5;
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
        this.UrlAll(); // หยุด interval เมื่อเวลาหมด
      }
    }, 1000); // ระยะเวลาในการเรียกใช้ function ทุกๆ 1 วินาที
  }


  randomVote(array: any[]): number {
    return Math.floor(Math.random() * array.length);
  }


  // กำหนดเส้นทาง
  Choose_route1() {
    const route = this.user ? '/profiles' : '/login';
    const queryParams = this.user ? { id: this.user.userID, userID: this.user1.userID } : null;
    this.router.navigate([route], { queryParams });
  }

  Choose_route2() {
    const route = this.user ? '/profiles' : '/login';
    const queryParams = this.user ? { id: this.user.userID, userID: this.user2.userID } : null;
    this.router.navigate([route], { queryParams });
  }


  logout() {
    this.login = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }


  goBack(): void {
    this.location.back();
  }
}
