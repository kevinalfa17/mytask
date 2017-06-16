import { Component, ViewChild } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TypesProvider } from '../../providers/types-provider';
import { TranslateService } from 'ng2-translate';
import { EditTypePage } from '../edit-type/edit-type';
import { CreateTypePage } from '../create-type/create-type';


@IonicPage()
@Component({
  selector: 'page-task-types',
  templateUrl: 'task-types.html',
})
export class TaskTypesPage {

  types: FirebaseListObservable<any[]>;

  /**
   * 
   * @param nav 
   * @param params 
   * @param typesProvider 
   * @param af 
   * @param translate 
   */
  constructor(public nav: NavController, public params: NavParams, public typesProvider: TypesProvider,
    public af: AngularFire, public translate: TranslateService) {
    this.types = typesProvider.getTypesRef();
    this.translate.setDefaultLang('es');
  }

  /**
   * Open edit type page
   * @param key 
   * @param name 
   */
  goToEditTypePage(key, name) {
    let param = { typeKey: key, typeName: name };
    this.nav.push(EditTypePage, param);
  }

  /**
   * Open create type page
   */
  goToCreateTypePage(){
    this.nav.push(CreateTypePage);
  }

  /**
   * Delete and existing type
   * @param key 
   */
  deleteType(key) {
    this.typesProvider.removeType(key);
  }




}
