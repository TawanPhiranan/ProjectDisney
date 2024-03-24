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
import { ChartModule } from 'primeng/chart';


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
    ChartModule,
  ],
  templateUrl: './admin-member-show.component.html',
  styleUrl: './admin-member-show.component.scss'
})
export class AdminMemberShowComponent {

  id: any;
  disneys: Disney[] = [];
  user: any;
  member : any;

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
current: any = {};

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private constants: Constants,
    private router: Router,
    private header : HeaderComponent
  ) { }
  

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.member = params['member'];
      // console.log(this.id);
      this.callApi();
    });
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


    
  chart() {
    // const url = this.constants.API_ENDPOINT + `/rank/graph/` + this.imgID;
    // this.http.get(url).subscribe((data: any) => {
    //   this.graph = data;
      // console.log(this.graph);

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      // สร้าง labels จากข้อมูลที่ได้จาก API
      // const labels = this.graph.map((item: { date: any }) => {
      //   const date = new Date(item.date);
      //   return date.toLocaleDateString('en-US', {
      //     day: '2-digit',
      //     month: 'short',
      //     year: 'numeric',
      //   });
      // });
      // labels.push('Today'); // เพิ่ม label สำหรับข้อมูลวันนี้

      // const datascore = this.graph.map((item: { score: any }) => item.score);
      // const todayscore = [this.current.total_score];

      this.data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'First Dataset',
                  data: [65, 59, 80, 81, 56, 55, 40],
                  fill: false,
                  borderColor: documentStyle.getPropertyValue('--blue-500'),
                  tension: 0.4
              },
              {
                  label: 'Second Dataset',
                  data: [28, 48, 40, 19, 86, 27, 90],
                  fill: false,
                  borderColor: documentStyle.getPropertyValue('--pink-500'),
                  tension: 0.4
              }
          ]
      };

      this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              y: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };
  }

}
