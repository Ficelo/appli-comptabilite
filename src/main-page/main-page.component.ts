import { Component } from '@angular/core';
import {ScrollListComponent} from "../scroll-list/scroll-list.component";
import {FileInputComponent} from "../file-input/file-input.component";
import {StatsComponent} from "../stats/stats.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    ScrollListComponent,
    FileInputComponent,
    StatsComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
