import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, Location } from '@angular/common';
import { Disney } from '../../model/disney_get_res';
import { Constants } from '../../config/constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { Observable, lastValueFrom } from 'rxjs';
import { lmage } from '../../model/Image_get_res';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-profile',
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
    MatTooltipModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  file?: File;
  id: any;
  disneys: Disney[] = [];
  Image: lmage[] = [];

  user: any;
  login: boolean = false;
  response: any;

  update: any;
  urlShowAll: any;
  userID: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private constants: Constants,
    private router: Router,
    private header: HeaderComponent
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      // console.log(this.id);
      this.userID = params['userID'];
      // this.member = params['member'];      
      this.callApi();
    });
    this.showImg();
    this.showAll();
  }

  callApi(): void {
    const url = this.constants.API_ENDPOINT + `/profile/main?id=${this.id}`;
    this.http.get(url).subscribe((data: any) => {
      this.user = data[0] as Disney;
      console.log(this.user.typeID);
    });
  }

  logout() {
    this.login = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }

  onFileSelected(eventData: any, uploadType: number) {
    if (eventData?.target?.files && eventData.target.files.length > 0) {
      const selectedFile = eventData.target.files[0];
      console.log('Selected file:', selectedFile);
      this.handleFileUpload(selectedFile, uploadType);
    }
  }
  async handleFileUpload(selectedFile: File, uploadType: number) {
    if (selectedFile) {
      console.log('Uploading..........');
      const url1 = this.constants.API_ENDPOINT + `/upload`;
      const formData = new FormData();
      formData.append('file', selectedFile);
      this.response = await lastValueFrom(this.http.post(url1, formData));
      // console.log('File uploaded. Response:', this.response);

      const firebaseURL = this.response.url;
      console.log(firebaseURL);

      if (uploadType === 0) {
        this.addDB(firebaseURL);
        this.resetInput();
      } else if (uploadType === 1) {
        this.addProfileToDB(firebaseURL);
      }
    }
  }

  addProfileToDB(url: any) {
    const dbUrl = this.constants.API_ENDPOINT + '/upload/img/profile';
    this.http
      .put(dbUrl, {
        userID: this.id, // ใช้ค่า id ที่ได้จาก queryParams
        url: url,
      })
      .subscribe((data: any) => {
        console.log(data);
      });
    setTimeout(() => {
      this.showAll();
    }, 3000);
  }

  addDB(url: any): void {
    const uploadDay = new Date().toISOString();

    const dbUrl = this.constants.API_ENDPOINT + '/upload/img/';
    this.http
      .post(dbUrl, {
        userID: this.id, // ใช้ค่า id ที่ได้จาก queryParams
        url: url,
        uploadDay: uploadDay
      })
      .subscribe((data: any) => {
        console.log(data);
        console.log(data.last_idx);
        const dbUrl2 = this.constants.API_ENDPOINT + '/vote/newimg';
        this.http
          .post(dbUrl2, {
            imgID: data.last_idx,
          })
          .subscribe((data: any) => {
            console.log(data);
          });
      });


    setTimeout(() => {
      this.showImg();
    }, 3000);
  }

  //ล้างค่า
  resetInput() {
    const inputElement = document.getElementById(
      'fileInput'
    ) as HTMLInputElement;
    inputElement.value = '';
  }

  goBack(): void {
    this.location.back();
  }

  urlShow: any[] = [];

  //show url
  showImg() {
    let url;
    if (this.userID) {
      url = this.constants.API_ENDPOINT + `/profile/show?userID=${this.userID}`;
      this.http.get(url).subscribe((data: any) => {
        this.urlShow = data;
        console.log(this.urlShow);
      });
    } else {
      url = this.constants.API_ENDPOINT + `/profile/show?userID=${this.id}`;
      this.http.get(url).subscribe((data: any) => {
        this.urlShow = data;
        // console.log(this.urlShow);
      });
    }
  }

  showAll() {
    let userId;
    if (this.userID) {
      userId = this.userID;
      const url = this.constants.API_ENDPOINT + `/profile/showall?userID=${userId}`;
      this.http.get(url).subscribe((data: any) => {
        this.urlShowAll = data;
        console.log(this.urlShowAll);
      });
    } else {
      userId = this.id;
      const url = this.constants.API_ENDPOINT + `/profile/showall?userID=${userId}`;
      this.http.get(url).subscribe((data: any) => {
        this.urlShowAll = data;
        console.log(this.urlShowAll);
      });
    }
  }

  updateProfile(id: number, show: any) {
    const url = this.constants.API_ENDPOINT + `/profile/${id}`;
    this.http.put(url, show).subscribe((data: any) => {
      this.update = data;
      console.log(this.update);
      this.urlShowAll.username = show.username;
    });
  }

  confirmUpdateProfile(id: any, username: string, email: string, password: string) {
    if (confirm('Are you sure you want to update this information?')) {
      let show: any;
      if (password.trim() === '') {
        show = { username, email };
      } else {
        show = { username, email, password };
      }
      this.updateProfile(id, show);
    } else {
      // ไม่ต้องทำอะไรเมื่อผู้ใช้ยกเลิกการอัปเดต
    }
  }


  removeImage(imgID: any) {
    const confirmed = confirm('Are you sure you want to delete this image?');
    if (!confirmed) {
      return;
    }

    const url = this.constants.API_ENDPOINT + `/upload/${imgID}`;
    this.http.delete(url).subscribe((data: any) => {
      console.log(data);
    });
    setTimeout(() => {
      this.showImg();
    }, 3000);
  }



  isValidUser(show: any): boolean {
    return show && this.userID === this.id;
  }

}
