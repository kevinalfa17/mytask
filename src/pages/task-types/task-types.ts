import { Component, ViewChild } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TypesProvider } from '../../providers/types-provider';
<<<<<<< HEAD
import { TranslateService } from 'ng2-translate';
import { EditTypePage } from '../edit-type/edit-type';
import { CreateTypePage } from '../create-type/create-type';
=======
>>>>>>> c6c38244d016aefd5d59ab1059a4f9bef231498d


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

<<<<<<< HEAD
  constructor(public nav: NavController, public params: NavParams, public typesProvider: TypesProvider,
    public af: AngularFire, public translate: TranslateService) {
    this.types = typesProvider.getTypesRef();
    this.translate.setDefaultLang('es');
=======
  constructor(public navCtrl: NavController, public params: NavParams, public typesProvider:TypesProvider, 
  public af:AngularFire) {
     this.types = typesProvider.getTypesRef();
>>>>>>> c6c38244d016aefd5d59ab1059a4f9bef231498d
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
