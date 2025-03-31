import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-catan-home',
  imports: [],
  templateUrl: './catan-home.component.html',
  styleUrl: './catan-home.component.scss',
})
export class CatanHomeComponent {
  readExcel(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) return;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryString: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

      const sheetNames: string[] = workbook.SheetNames;
      console.log('sheetNames:', sheetNames);
      const sheetName: string = workbook.SheetNames[0];

      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // **セルの値を取得**
      const cellAddress = 'B2'; // 取得したいセルの位置（例：B2）
      const cellValue = worksheet[cellAddress]?.v; // 値を取得（?.でnull安全）

      console.log('B2の値:', cellValue);
    };
  }
}
