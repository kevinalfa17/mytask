import { Component, ViewChild } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TypesProvider } from '../../providers/types-provider';
import { TranslateService } from 'ng2-translate';


@IonicPage()
@Component({
  selector: 'page-task-types',
  templateUrl: 'task-types.html',
})
export class TaskTypesPage {

  types:FirebaseListObservable<any[]>; 

  constructor(public navCtrl: NavController, public params: NavParams, public typesProvider:TypesProvider, 
  public af:AngularFire, public translate: TranslateService) {
     this.types = typesProvider.getTypesRef();
     this.translate.setDefaultLang('es');
  }


}
