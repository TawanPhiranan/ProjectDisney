import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Constants } from '../../config/constants';
import { Disney } from '../../model/disney_get_res';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  id : any;
  user : any;
  login: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private location: Location, 
    private http: HttpClient, 
    private constants: Constants, 
    private router: Router,) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
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
  shouldShowHeader(): boolean {
    const hideHeaderUrls = ['/login', '/signup']; // ระบุ URL ที่ไม่ต้องการให้แสดง header
    const currentUrl = this.router.url;
    return !hideHeaderUrls.includes(currentUrl);
}


  goBack(): void {
    this.location.back();
  }

  logout() {
    this.login = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }

   // กำหนดเส้นทาง
   Choose_route() {
    const route = this.user ? '/profile' : '/login';
    const queryParams = this.user ? { id: this.user.userID } : null;
    this.router.navigate([route], { queryParams });
  }

  Choose_route1() {
    const route1 = this.user ? '/ranking' : '/login';
    const queryParams = this.user ? { id: this.user.userID } : null;
    this.router.navigate([route1], { queryParams });
  }

  Choose_route2() {
    const route2 = this.user ? '/' : '/login';
    const queryParams = this.user ? { id: this.user.userID } : null;
    this.router.navigate([route2], { queryParams });
  }
}
