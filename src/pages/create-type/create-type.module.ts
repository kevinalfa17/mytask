import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CreateTypePage } from './create-type';

@NgModule({
  declarations: [
    CreateTypePage,
  ],
  imports: [
    //IonicModule.forChild(CreateTypePage),
  ],
  exports: [
    CreateTypePage
  ]
})
export class CreateTypeModule {}
