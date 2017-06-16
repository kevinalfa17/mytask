import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AlarmSelectorPage } from './alarm-selector-page';

@NgModule({
  declarations: [
    AlarmSelectorPage,
  ],
  imports: [
    //IonicModule.forChild(AlarmSelectorPage),
  ],
  exports: [
    AlarmSelectorPage
  ]
})
export class AlarmSelectorPageModule {}
