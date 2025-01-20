import {Component, OnInit} from '@angular/core';
import {fileDataService} from "../services/fileData.service";
import {ChartModule} from "primeng/chart";
import {CategoriesEnum} from "../enums/categories.enum";
import {Button} from "primeng/button";
import {MessageService} from "primeng/api";
import {Clipboard} from '@angular/cdk/clipboard';
import {NgForOf} from "@angular/common";
import {MultiSelectModule} from "primeng/multiselect";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    ChartModule,
    Button,
    NgForOf,
    MultiSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {

  data : any[];
  chartOptions : any;
  pieOptions : any;
  formGroup!: FormGroup;

  categoriesAffichage = {
    [CategoriesEnum.ALIMENTATION]: true,
    [CategoriesEnum.SHOPPING]: true,
    [CategoriesEnum.LOGEMENT]: true,
    [CategoriesEnum.A_CATEGORISER_RENTREE]: true,
    [CategoriesEnum.A_CATEGORISER_SORTIE]: true,
    [CategoriesEnum.SANTE]: true,
    [CategoriesEnum.BANQUES_ASSURANCES]: true,
    [CategoriesEnum.LOISIRS]: true,
    [CategoriesEnum.REVENUS]: true,
    [CategoriesEnum.EDUCATION]: true
  };


  // Faire en sorte que quand on clique ça enlève ou rajoute
  categoryDictionary= {
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

  allCategories = Object.keys(CategoriesEnum).map(key => CategoriesEnum[key as keyof typeof CategoriesEnum]);
  formControl = new FormControl<string[]>([]);

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

  ngOnInit() {
    // Initialize formGroup with formControl
    this.formGroup = new FormGroup({
      formControl: this.formControl
    });

    // Set initial values for categoriesAffichage based on the form control
    const initialSelection = Object.keys(this.categoriesAffichage)
      .filter(category => this.categoriesAffichage[category as CategoriesEnum]);

    this.formControl.setValue(initialSelection);

    // Listen to changes in form control value (selected categories)
    this.formControl.valueChanges.subscribe(selectedCategories => {
      // Update categoriesAffichage based on the selection
      for (let category of this.allCategories) {
        this.categoriesAffichage[category] = selectedCategories?.includes(category) ?? false;
      }
    });
  }


  createUsableData(data: any[]) {

    this.categoryDictionary= {
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
      if (action["Debit"]) {
        let montant = parseFloat(action["Debit"].replace(",", "."));
        let categorie: string = action["Categorie"];
        if (Object.values(CategoriesEnum).includes(categorie as CategoriesEnum)) {
          console.log("categorie before : ", this.categoryDictionary[categorie as CategoriesEnum])
          this.categoryDictionary[categorie as CategoriesEnum] += montant;
          console.log("categorie after : ", this.categoryDictionary[categorie as CategoriesEnum])
        } else {
          console.warn(`Invalid category: ${categorie}`);
        }
      }
    }

    const labels = [];
    for (let label of Object.values(CategoriesEnum)) {
      if (this.categoriesAffichage[label]) {
        labels.push(label);
      }
    }

    const dataValues = labels.map((label) => this.categoryDictionary[label]);

    const backgroundColors = [
      "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598",
      "#66c2a5", "#3288bd", "#5e4fa2", "#ff8c00"
    ];

    const borderColors = [
      "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598",
      "#66c2a5", "#3288bd", "#5e4fa2", "#ff8c00"
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
  protected readonly Object = Object;
}
