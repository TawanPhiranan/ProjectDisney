import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, Location } from '@angular/common';
import { Disney } from '../../model/disney_get_res';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, CommonModule, MatTableModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  id: any;
  disneys: Disney[] = [];
  user: any;
  login: boolean = false;
  rank : any;


  constructor(
    private route: ActivatedRoute, 
    private location: Location, 
    private http: HttpClient, 
    private constants: Constants, 
    private router: Router) {
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      // console.log(this.id);
      this.callApi();
    });
    this. rankScore();
  }

  callApi(): void {
    const url = this.constants.API_ENDPOINT + `/profile/main?id=${this.id}`;
    this.http.get(url).subscribe((data: any) => {
      this.user = data[0] as Disney;
      // console.log(this.user);
    });
  }


  rankScore(){
    const Url = this.constants.API_ENDPOINT + '/vote/rank/score';
    this.http.get(Url).subscribe((data: any) => {
      this.rank = data;
      console.log(this.rank);
    });
  }


  goBack(): void {
    this.location.back();
  }


  logout() {
    this.login = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }



}
  
