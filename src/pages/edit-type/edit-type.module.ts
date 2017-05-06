import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { EditTypePage } from './edit-type';

@NgModule({
  declarations: [
    EditTypePage,
  ],
  imports: [
   // IonicModule.forChild(EditType),
  ],
  exports: [
    EditTypePage
  ]
})
export class EditTypeModule {}
