import {Component, Output, ViewChild} from '@angular/core';
import {FileUpload, FileUploadEvent, FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {fileDataService} from "../services/fileData.service";

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [
    FileUploadModule,
    ReactiveFormsModule
  ],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css'
})
export class FileInputComponent {

  @ViewChild('fileUpload') fileUpload!: FileUpload;
  form!: FormGroup;
  reader : FileReader
  csvData: any[] = [];
  csvHeaders: string[] = [];

  constructor(private fb: FormBuilder, private dataService : fileDataService) {
    this.reader = new FileReader();

    this.reader.onload = (event: any) => {
      const fileContent = event.target.result;
      //console.log('File content:', fileContent);
      this.parseCSV(fileContent)
    };

    this.reader.onerror = (event) => {
      console.error('Error reading file:', event);
    };
  }
  ngOnInit() {
    this.form = this.fb.group({
      myFile: new FormControl(),
    });
  }
  uploadFile(event : FileUploadHandlerEvent) {
    for (let file of event.files) {
      this.form.patchValue({ myFile: file });
      this.form.get('myFile')?.updateValueAndValidity();
      //console.log(this.form.value.myFile)
      this.readFile()
    }
  }

  readFile() {
    const file = this.form.value.myFile;
    if (file) {
      this.reader.readAsText(file);
    }
  }

  parseCSV(data: string) {
    const lines = data.split('\n');

    this.csvHeaders = lines[0].split(';').map(header => header.trim());

    const result: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(';');

      if (row.length === this.csvHeaders.length) {
        const obj: any = {};

        for (let j = 0; j < this.csvHeaders.length; j++) {
          obj[this.csvHeaders[j]] = row[j].trim();
        }
        result.push(obj);
      }
    }

    this.csvData = result;
    //console.log('CSV Data:', this.csvData);
    this.dataService.setData(this.csvData);
    //console.log(this.dataService.getData())
  }

}
