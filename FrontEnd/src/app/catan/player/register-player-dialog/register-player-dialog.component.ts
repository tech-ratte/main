import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  NativeDateAdapter,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { Role, Roles } from '../player.model';
import { coreImports } from '../../../../core/core.imports';
import { SheardFieldComponent } from '../../../../core/sheard-field/shared-field.component';
import { Option } from '../../../../core/core.model';
import { TimeFormatService } from '../../../../core/time-format/time-format.service';

@Component({
  selector: 'app-register-player-dialog',
  imports: [...coreImports, SheardFieldComponent],
  templateUrl: './register-player-dialog.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  styleUrl: './register-player-dialog.component.scss',
})
export class RegisterPlayerDialogComponent {
  // Playerテーブルに対応
  playerForm: FormGroup;
  // ユーザ権限
  roles: Option[] = Roles;
  isAdmin: boolean = false;
  isGeneral: boolean = false;
  // isAdmin = this.data.role == Role.Admin;
  // isGeneral = this.data.role == Role.General;

  // 画像プレビュー
  iconPreview: string | ArrayBuffer | null = null;
  // 画像選択
  onImageChange(event: any): void {
    const file = event.target.files[0];
    // 画像ファイルのみ
    if (file && file.type.startsWith('image/')) {
      // 画像が選択された場合、iconフィールドをフォームに追加
      if (!this.playerForm.contains('icon')) {
        this.playerForm.addControl('icon', new FormControl(file));
        // iconがすでにある場合、値を更新
      } else {
        this.playerForm.get('icon')?.setValue(file);
      }
      // プレビュー設定
      const reader = new FileReader();
      reader.onload = () => {
        this.iconPreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  }

  // プレイヤー登録
  onRegister(): void {
    const newPlayer = new FormData();
    for (const key of Object.keys(this.playerForm.controls)) {
      // 画像ファイルがある場合
      if (key == 'icon') {
        newPlayer.append(
          'icon',
          this.playerForm.get(key)?.value,
          `${this.playerForm.get('username')?.value}_icon.png`,
        );
      } else {
        newPlayer.append(key, this.playerForm.get(key)?.value);
      }
    }
    // 編集時
    this.data && newPlayer.append('id', this.data.id);
    this.dialogRef.close(newPlayer);
  }

  // ダイアログキャンセル
  onCancel(): void {
    this.dialogRef.close(this.playerForm.reset());
  }

  constructor(
    private fb: FormBuilder,
    private timeFormatService: TimeFormatService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RegisterPlayerDialogComponent>,
  ) {
    // Playerテーブルに対応
    this.playerForm = this.fb.group({
      name: [this.data ? this.data.name : '', [Validators.required]],
      username: [this.data ? this.data.username : '', [Validators.required]],
      password: [this.data ? this.data.password : '', [Validators.required]],
      birthday: [this.data ? this.data.birthday : '', [Validators.required]],
      role: [
        { value: this.data ? this.data.role : Role.General, disabled: this.isGeneral },
        [Validators.required],
      ],
    });

    // 画像ファイルダウンロード、blob変換
    async function fetchImageAsFile(url: string, filename: string): Promise<File> {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    }

    // プレイヤーの編集時
    if (this.data) {
      // isGraduatedフィールドをフォームに追加
      this.playerForm.addControl('isGraduated', new FormControl(data.isGraduated));

      // アイコンが設定されている場合
      if (!this.data.icon.includes('default')) {
        fetchImageAsFile(this.data.icon, 'icon.png').then((file) => {
          // iconフィールドをフォームに追加
          this.playerForm.addControl('icon', new FormControl(file));
          // プレビュー設定
          const reader = new FileReader();
          reader.onload = () => {
            this.iconPreview = reader.result;
          };
          reader.readAsDataURL(file);
        });
      }
    }

    // yyyy-mm-dd に変換して FormControl に反映
    this.playerForm.get('birthday')?.valueChanges.subscribe((date) => {
      if (date) {
        const formattedDate = this.timeFormatService.convertDateToDateField(date);
        this.playerForm.get('birthday')?.setValue(formattedDate, { emitEvent: false }); // 変更をトリガーしない
      }
    });
  }
}
