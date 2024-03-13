import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, Location } from '@angular/common';
import { Disney } from '../../model/disney_get_res';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { StatsService } from '../../services/api/stats.service';


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    ChartModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  id: any;
  imgID: any;
  disneys: Disney[] = [];
  user: any;
  login: boolean = false;
  editShow: any;
  updateName: any;
  today: any;


  data:
    | {
        labels: string[];
        datasets: {
          label: string;
          data: number[];
          fill: boolean;
          borderColor: string;
          tension: number;
        }[];
      }
    | undefined;

  options:
    | {
        maintainAspectRatio: boolean;
        aspectRatio: number;
        plugins: { legend: { labels: { color: string } } };
        scales: {
          x: {
            ticks: { color: string };
            grid: { color: string; drawBorder: boolean };
          };
          y: {
            ticks: { color: string };
            grid: { color: string; drawBorder: boolean };
          };
        };
      }
    | undefined;
  graph: any;
  graphday: any;
  rankAll: any;
  current: any;


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private constants: Constants,
    private router: Router,
    private stats: StatsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      // console.log(this.id);
      this.imgID = params['imgID'];
      // console.log(this.imgID);

      this.callApi();
    });
    this.showAll();
    this.chart();
    this.rankNOW(this.imgID);
    
    this.loadDataAsync();
  }

  callApi(): void {
    const url = this.constants.API_ENDPOINT + `/profile/main?id=${this.id}`;
    this.http.get(url).subscribe((data: any) => {
      this.user = data[0] as Disney;
      // console.log(this.user);
    });
  }

  goBack(): void {
    this.location.back();
  }

  logout() {
    this.login = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }

  showAll() {
    const url = this.constants.API_ENDPOINT + `/edit/` + this.imgID;
    this.http.get(url).subscribe((data: any) => {
      if (data) {
        this.editShow = data;
        console.log(this.editShow);
      }
    });
  }

  updateProfile(imgID: number, edit: any) {
    const url = this.constants.API_ENDPOINT + `/edit/${imgID}`;
    this.http.put(url, edit).subscribe((data: any) => {
      this.updateName = data;
      console.log(this.updateName);
      // this.user.username = edit.username;
    });
  }
 
  // Graph
  confirmUpdateProfile(imgID: number, imgName: string) {
    let edit = { imgName };
    if (confirm('Are you sure you want to update this information?')) {
      this.updateProfile(imgID, edit);
    } else {
    }
  }
  rankNOW(imgID1: string) {
    const url = this.constants.API_ENDPOINT + `/rank/rankAll`;
    this.http.get(url).subscribe((data: any) => {
      this.rankAll = data;
      const index = this.rankAll.findIndex(
        (item: any) => item.imgID === parseInt(imgID1)
      );
      console.log(index);

      if (index !== -1) {
        this.current = this.rankAll[index];
        console.log(this.current);
      } else {
        console.log('imgID not found');
      }
    });
  }
  chart() {
    const url = this.constants.API_ENDPOINT + `/rank/graph/` + this.imgID;
    this.http.get(url).subscribe((data: any) => {
      this.graph = data;
      console.log(this.graph);

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      // สร้าง labels จากข้อมูลที่ได้จาก API
      const labels = this.graph.map((item: { date: any }) => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      });
      const datascore = this.graph.map((item: { score: any }) => item.score);

      this.data = {
        labels: labels, // นำ labels ที่สร้างไว้มาใส่ตรงนี้
        datasets: [
          {
            label: 'First Dataset',
            data: datascore,
            fill: false,
            borderColor: '#f5c518',
            tension: 0.4,
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff',
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: '#ffffff',
            },
            grid: {
              color: '#9b9b9b',
              drawBorder: false,
            },
          },
        },
      };
    });
  }

  //สรุปผล

  image: any[] = [];
  BeforeRank: any[] = [];
  NowRank: any[] = [];
  async loadDataAsync() {
    const Url = this.constants.API_ENDPOINT + '/rank/scoreAll/' + this.imgID;
    this.http.get(Url).subscribe(async (data: any) => {
      this.image = data;
      console.log(this.image);  
      for (let i = 0; i < this.image.length; i++) {
        this.BeforeRank.push(await this.stats.getrankYesterday(this.image[i].imgID));
      }
      for (let i = 0; i < this.image.length; i++) {
        if (this.BeforeRank[i].length > 0) {
          this.NowRank.push(this.BeforeRank[i][0].rank);          
        } else {
          this.NowRank.push("new!!");
        }
      }
      console.log(this.NowRank);   

    });
  }
  

  // rankToday(imgID: string) {
  //   const url = this.constants.API_ENDPOINT + `/rank/today/${imgID}`;
  //   this.http.get(url).subscribe((data: any) => {
  //       this.today = data;
  //       console.log(this.today);
  //   });
// }




}
