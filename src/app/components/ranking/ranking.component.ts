import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, Location } from '@angular/common';
import { Disney } from '../../model/disney_get_res';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { MatTableModule } from '@angular/material/table';
import { StatsService } from '../../services/api/stats.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatTableModule,
  ],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent {
  id: any;
  disneys: Disney[] = [];
  user: any;
  login: boolean = false;
  rank: any;
  imgID: any;
  yesterday: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private constants: Constants,
    private router: Router,
    private stats: StatsService
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      // console.log(this.id);
      this.callApi();
    });
    this.loadDataAsync();
  }

  callApi(): void {
    const url = this.constants.API_ENDPOINT + `/profile/main?id=${this.id}`;
    this.http.get(url).subscribe((data: any) => {
      this.user = data[0] as Disney;
      // console.log(this.user);
    });
  }

  imgIDurl: any[] = [];



  goBack(): void {
    this.location.back();
  }

  logout() {
    this.login = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }

  image: any[] = [];
  BeforeRank: any[] = [];
  NowRank: any[] = [];
  async loadDataAsync() {
    const Url = this.constants.API_ENDPOINT + '/rank/score';
    this.http.get(Url).subscribe(async (data: any) => {
      this.image = data;
      // console.log(this.image);  
      for (let i = 0; i < this.image.length; i++) {
        this.BeforeRank.push(await this.stats.getAllDailystats(this.image[i].imgID));
      }
      for (let i = 0; i < this.image.length; i++) {
        if (this.BeforeRank[i].length > 0) {
          this.NowRank.push(this.BeforeRank[i][0].rank);
        } else {
          this.NowRank.push("new!!");
        }
      }
      console.log(this.NowRank);


      // const compareRanks = this.NowRank.map((nowRank, index) => {
      //   if (nowRank === "new!!") {
      //     return "No previous rank";
      //   } else {
      //     const beforeRank = this.BeforeRank[index][0].rank;
      //     console.log(beforeRank);
      //     // console.log(nowRank);
      
      //     return nowRank - beforeRank; // คำนวณค่าผลต่างระหว่างลำดับปัจจุบันกับเมื่อวาน
      //   }
      // });
      
      // console.log(compareRanks);
      

    });
  }
}
