import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {ScrollPanelModule} from "primeng/scrollpanel";
import {CardModule} from "primeng/card";
import {NgForOf} from "@angular/common";
import {PanelModule} from "primeng/panel";
import {DropdownModule} from "primeng/dropdown";
import {fileDataService} from "../services/fileData.service";
import {of} from "rxjs";
import {CategoriesEnum} from "../enums/categories.enum";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-scroll-list',
  standalone: true,
  imports: [
    ScrollPanelModule,
    CardModule,
    NgForOf,
    PanelModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './scroll-list.component.html',
  styleUrl: './scroll-list.component.css'
})
export class ScrollListComponent implements OnChanges{

  data : any[];
  categoriesOptions : any[];

  constructor(protected dataService: fileDataService) {
    this.data = this.dataService.getData();
    this.categoriesOptions = Object.entries(CategoriesEnum).map(([key, value]) => {
      return { label: value, value: key };
    });
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  onCategoryChange(event: any, action: any, index: number) {
    const selectedCategoryKey = event.value as keyof typeof CategoriesEnum;
    const selectedCategory = CategoriesEnum[selectedCategoryKey];
    action["Categorie"] = selectedCategory;
    this.dataService.updateData(action, index);
  }


  protected readonly of = of;
  protected readonly CategoriesEnum = CategoriesEnum;
}
