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

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatToolbarModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

  id: any;
  imgID : any;
  disneys: Disney[] = [];
  user: any;
  login: boolean = false;
  editShow : any;
  updateName: any;


  constructor(private route: ActivatedRoute, private location: Location, private http: HttpClient, private constants: Constants,  private router: Router) {
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      // console.log(this.id);
      this.imgID = params['imgID']
      // console.log(this.imgID);
      
      this.callApi();
    });
    this.showAll();
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

  showAll(){
    const url = this.constants.API_ENDPOINT + `/edit/`+this.imgID;
    this.http.get(url).subscribe((data: any) => {
      if(data){
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
    }); 
  }
  
  confirmUpdateProfile(imgID: number, edit: boolean) {
    if (confirm("Are you sure you want to update this information?")) {
      this.updateProfile(imgID, edit);
    } else {
      
    }
  }

}
