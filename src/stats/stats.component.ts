import {Component} from '@angular/core';
import {fileDataService} from "../services/fileData.service";
import {ChartModule} from "primeng/chart";
import {CategoriesEnum} from "../enums/categories.enum";
import {Button} from "primeng/button";
import {MessageService} from "primeng/api";
import {Clipboard} from '@angular/cdk/clipboard';
import {NgForOf} from "@angular/common";
import {MultiSelectModule} from "primeng/multiselect";

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    ChartModule,
    Button,
    NgForOf,
    MultiSelectModule
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {

  data : any[];
  chartOptions : any;
  pieOptions : any;

  categoriesAffichage = [
    CategoriesEnum.LOGEMENT,
    CategoriesEnum.ALIMENTATION,
    CategoriesEnum.LOISIRS,
    CategoriesEnum.SHOPPING,
    CategoriesEnum.SANTE,
    CategoriesEnum.EDUCATION,
    CategoriesEnum.BANQUES_ASSURANCES,
    CategoriesEnum.A_CATEGORISER_SORTIE
  ]

  constructor(protected dataService: fileDataService, private messageService : MessageService, private clipboard : Clipboard) {
    this.data = this.dataService.getData();
    this.chartOptions = {
      animation: {
        duration: 0
      },
      hover: {
        animationDuration: 0
      },
      responsiveAnimationDuration: 0
    };
    this.pieOptions = {
      animation: {
        duration: 0
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      }
    };
  }



  createUsableData(data: any[]) {
    let categoryDictionary: { [key in CategoriesEnum]: number } = {
      [CategoriesEnum.ALIMENTATION]: 0,
      [CategoriesEnum.SHOPPING]: 0,
      [CategoriesEnum.LOGEMENT]: 0,
      [CategoriesEnum.A_CATEGORISER_RENTREE]: 0,
      [CategoriesEnum.A_CATEGORISER_SORTIE]: 0,
      [CategoriesEnum.SANTE]: 0,
      [CategoriesEnum.BANQUES_ASSURANCES]: 0,
      [CategoriesEnum.LOISIRS]: 0,
      [CategoriesEnum.REVENUS]: 0,
      [CategoriesEnum.EDUCATION]: 0
    };

    for (let action of data) {
      if (action["Debit"] !== "") {
        let montant = parseFloat(action["Debit"]);
        let categorie: string = action["Categorie"];

        if (Object.values(CategoriesEnum).includes(categorie as CategoriesEnum)) {
          categoryDictionary[categorie as CategoriesEnum] += montant;
        } else {
          console.warn(`Invalid category: ${categorie}`);
        }
      }
    }

    const labels = Object.values(CategoriesEnum);
    const dataValues = labels.map((label) => categoryDictionary[label]);

    const backgroundColors = [
      'rgba(255, 159, 64, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)'
    ];

    const borderColors = [
      'rgb(255, 159, 64)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)'
    ];

    return {
      labels: labels,
      datasets: [
        {
          label: 'Amount by Category',
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }
      ]
    };
  }

  copyToClipboard(){
    this.clipboard.copy("Loyer & charges : " + this.dataService.getDepenseCategorie(CategoriesEnum.LOGEMENT) + "\nBouffe : " +  this.dataService.getDepenseCategorie(CategoriesEnum.ALIMENTATION) + "\nAutres : " + this.dataService.getDepenseCategorie(CategoriesEnum.SHOPPING) + "\nCAF : " + this.dataService.getDepenseCategorie(CategoriesEnum.REVENUS));
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copié dans le presse papier' })
  }

  protected readonly fileDataService = fileDataService;
  protected readonly CategoriesEnum = CategoriesEnum;
}
