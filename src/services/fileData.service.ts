import {Injectable} from "@angular/core";
import {CategoriesEnum} from "../enums/categories.enum";

@Injectable({
  providedIn: "root"
})
export class fileDataService {
  private data : any[] = [];

  getData() : any[] {
    return this.data;
  }

  setData(newData : any[]) {
    this.data = newData;
    var categories = []
    console.log(this.data)
  }

  updateData(updatedAction: any, index: number) {
    this.data[index] = updatedAction;
  }

  getDepenseCategorie(categorie : CategoriesEnum) {
    let total = 0;
    for (let a of this.data){
      if (a["Categorie"] == categorie) {
        const debit = parseFloat(a["Debit"]) || 0;
        const credit = parseFloat(a["Credit"]) || 0;
        total += debit + credit;
      }
    }

    return total;
  }

  getDepensesAlimentation() {
    let total = 0;
    for (let a of this.data){
      if (a["Categorie"] == CategoriesEnum.ALIMENTATION) {
        const debit = parseFloat(a["Debit"]) || 0;
        const credit = parseFloat(a["Credit"]) || 0;
        total += debit + credit;
      }
    }

    return total;
  }

  getDepensesLoyerMaison(){
    let total = 0;
    for (let a of this.data){
      if(a["Categorie"] == CategoriesEnum.LOGEMENT){
        total += parseFloat(a["Debit"]) || parseFloat(a["Credit"]);
      }
    }

    return total;
  }

  getDepensesAutres(){
    let total = 0;
    for (let a of this.data){
      if(a["Categorie"] == CategoriesEnum.SHOPPING){
        total += parseFloat(a["Debit"]) || parseFloat(a["Credit"]);
      }
    }
    return total;
  }

  getGainAides(){
    let total = 0;
    for (let a of this.data){
      if(a["Categorie"] == CategoriesEnum.REVENUS){
        total += parseFloat(a["Debit"]) || parseFloat(a["Credit"]);
      }
    }
    return total;
  }
}
