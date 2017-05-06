import { Component, ViewChild } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TypesProvider } from '../../providers/types-provider';
import { TranslateService } from 'ng2-translate';
import { EditTypePage } from '../edit-type/edit-type';
import { CreateTypePage } from '../create-type/create-type';



/**
 * Generated class for the TaskTypes page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-task-types',
  templateUrl: 'task-types.html',
})
export class TaskTypesPage {

  types: FirebaseListObservable<any[]>;

  constructor(public nav: NavController, public params: NavParams, public typesProvider: TypesProvider,
    public af: AngularFire, public translate: TranslateService) {
    this.types = typesProvider.getTypesRef();
    this.translate.setDefaultLang('es');
  }

  goToEditTypePage(key, name) {
    let param = { typeKey: key, typeName: name };
    this.nav.push(EditTypePage, param);
  }

  goToCreateTypePage(){
    this.nav.push(CreateTypePage);
  }

  deleteType(key) {
    this.typesProvider.removeType(key);
  }




}
