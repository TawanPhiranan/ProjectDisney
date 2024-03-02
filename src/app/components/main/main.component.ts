import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { Disney } from '../../model/disney_get_res';
import { Constants } from '../../config/constants';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, RouterModule,
    RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  id: any;
  disneys: Disney[] = [];
  user: any;

  constructor(private route: ActivatedRoute, private location: Location, private http: HttpClient,private constants: Constants) { 
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      // console.log(this.id);
      this.callApi();
    });
  }
  callApi(): void {
    const url = this.constants.API_ENDPOINT+`/profile/main?id=${this.id}`;
    this.http.get(url).subscribe((data: any) => {
      this.user = data[0] as Disney;
    });
  }
}
