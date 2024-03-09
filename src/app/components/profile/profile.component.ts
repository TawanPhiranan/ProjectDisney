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
import { Observable, lastValueFrom } from 'rxjs';
import { lmage } from '../../model/Image_get_res';
import { FormsModule } from '@angular/forms';


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
    FormsModule
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

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private constants: Constants,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      // console.log(this.id);
      this.callApi();
    });
    this.showImg();
  }

  callApi(): void {
    const url = this.constants.API_ENDPOINT + `/profile/main?id=${this.id}`;
    this.http.get(url).subscribe((data: any) => {
      this.user = data[0] as Disney;
      // console.log(this.user);
    });
  }

  logout() {
    this.login = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }

  onFileSelected(eventData: any) {
    if (eventData?.target?.files && eventData.target.files.length > 0) {
      const selectedFile = eventData.target.files[0];
      console.log('Selected file:', selectedFile);

      this.handleFileUpload(selectedFile);
    }
  }
  async handleFileUpload(selectedFile: File) {
    if (selectedFile) {
      console.log('Uploading..........');
      const url1 = this.constants.API_ENDPOINT + `/upload`;
      const formData = new FormData();
      formData.append('file', selectedFile);
      this.response = await lastValueFrom(this.http.post(url1, formData));
      // console.log('File uploaded. Response:', this.response);

      const firebaseURL = this.response.url;
      console.log(firebaseURL);
      
      this.addDB(firebaseURL);
      this.resetInput();
    }
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
        this.http.post(dbUrl2, {
          imgID: data.last_idx
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
    const inputElement = document.getElementById('fileInput') as HTMLInputElement;
    inputElement.value = "";
  }

  goBack(): void {
    this.location.back();
  }

  urlShow : any[] = [];

  //show url
  showImg() {
    const urll = this.constants.API_ENDPOINT + `/profile/show?userID=${this.id}`;
    this.http.get(urll).subscribe((data: any) => {
      this.urlShow = data;
      console.log(this.urlShow);
    });
  }


  updateProfile(id: number, show: any) {
    const url = this.constants.API_ENDPOINT + `/profile/${id}`;
    this.http.put(url, show).subscribe((data: any) => {
      this.update = data;
      console.log(this.update);
    });
  }
    
  }