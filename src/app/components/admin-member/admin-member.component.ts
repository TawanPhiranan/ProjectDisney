import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-member',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-member.component.html',
  styleUrl: './admin-member.component.scss'
})
export class AdminMemberComponent {

}
