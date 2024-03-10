import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Disney } from '../../model/disney_get_res';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { Location } from '@angular/common';



@Component({
  selector: 'app-admin-member',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-member.component.html',
  styleUrl: './admin-member.component.scss'
})
export class AdminMemberComponent {

  id: any;
  disneys: Disney[] = [];
  user: any;
  login: boolean = false;
  rank: any;
  profile : any;

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
    this.show();
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

  // ดึงข้อมูลมาโชว์
  show() {
    const url = this.constants.API_ENDPOINT + `/disney`;
    this.http.get(url).subscribe((data: any) => {
      this.profile = data;
      console.log(this.profile);
    });
  }

}
