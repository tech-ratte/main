import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { coreImports } from '../../../core/core.imports';

@Component({
  selector: 'app-catan-home',
  imports: [...coreImports],
  templateUrl: './catan-home.component.html',
  styleUrl: './catan-home.component.scss',
})
export class CatanHomeComponent {
  progress: string = '';
  sheetName: string = '';
  columnsTitle: string[] = [
    '日付',
    'ゲーム',
    '勝者',
    '道ボーナス',
    '騎士ボーナス',
    '1人目',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '2人目',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '3人目',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '4人目',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '5人目',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '6人目',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '合計',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    'ターン数',
  ];
  data: any[] = [];

  readExcel(event: any) {
    this.progress = 'ファイル選択完了';
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) return;

    this.progress = '読み取り開始';
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryString: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

      this.progress = 'ワークブック読み込み';
      this.sheetName = workbook.SheetNames[3];

      const worksheet: XLSX.WorkSheet = workbook.Sheets[this.sheetName];

      // **セルの値を取得**
      const columns = [
        'A',
        'B',
        'C',
        'E',
        'F',
        'DQ',
        'DR',
        'DS',
        'DT',
        'DU',
        'DV',
        'DW',
        'DX',
        'DY',
        'DZ',
        'EA',
        'EB',
        'EC',
        'ED',
        'EE',
        'EF',
        'EG',
        'EH',
        'EI',
        'EJ',
        'EK',
        'EL',
        'EM',
        'EN',
        'EO',
        'EP',
        'EQ',
        'ER',
        'ES',
        'ET',
        'EU',
        'EV',
        'EW',
        'EX',
        'EY',
        'EZ',
        'FA',
        'FB',
        'FC',
        'FD',
        'FF',
        'FF',
        'FG',
        'FH',
        'FI',
        'FJ',
        'FK',
        'FL',
        'FM',
        'FN',
        'FO',
        'FP',
        'FQ',
        'FR',
        'FS',
        'FT',
        'FU',
        'FV',
        'FW',
        'FX',
        'FY',
        'FZ',
        'GA',
        'GB',
        'GC',
        'GD',
        'GG',
        'GF',
        'GG',
        'GH',
        'GI',
        'GJ',
        'GK',
        'GL',
        'GM',
        'GN',
        'GO',
        'GP',
        'GQ',
        'GR',
        'GS',
        'GT',
        'GU',
        'GV',
        'GW',
      ];
      const startRow = 2;
      const endRow = 152;
      const interval = 2;
      for (let row = startRow; row < endRow; row += interval) {
        var rowData = [];
        for (const col of columns) {
          if (
            col == 'A' ||
            col == 'B' ||
            col == 'C' ||
            col == 'E' ||
            col == 'F' ||
            col == 'DQ' ||
            col == 'EC' ||
            col == 'EO' ||
            col == 'FA' ||
            col == 'FM' ||
            col == 'FY' ||
            col == 'GK'
          ) {
            var cellAddress = `${col}${row}`;
          } else {
            var cellAddress = `${col}${row + 1}`;
          }
          const cellValue = worksheet[cellAddress]?.v ?? null;
          rowData.push(cellValue);
        }
        this.data.push(rowData);
      }
      this.progress = '読み取り完了';
    };
    reader.readAsBinaryString(target.files[0]);
  }
}
