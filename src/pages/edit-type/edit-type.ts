import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { TypesProvider } from '../../providers/types-provider';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@IonicPage()
@Component({
  selector: 'page-edit-type',
  templateUrl: 'edit-type.html',
})

export class EditTypePage {

  typeName: string;
  subtypeName: string;
  key: string;
  name: string;
  subtypes: FirebaseListObservable<any[]>;
  subtypeDisable: boolean;
  typeDisable:boolean;

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param translate 
   * @param typesProvider 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService,
    public typesProvider: TypesProvider) {

    this.translate.setDefaultLang('es');
    this.key = navParams.data.typeKey;
    this.name = navParams.data.typeName;
    this.subtypes = typesProvider.getSubtypesRef(this.name);
    this.typeName = this.name;
    this.typeDisable = false;
    this.subtypeDisable = true;

  }

  /**
   * Delete subtype from list
   * @param key 
   */
  deleteSubtype(key) {
    this.typesProvider.removeSubtype(key);

  }

  /**
   * Add new subtype
   */
  addSubtype() {
    this.typesProvider.addNewSubtype(this.typeName, this.subtypeName);
    this.subtypeName = "";
    this.checkChanges();
  }

  /**
   * Edit an existing type
   */
  editType() {
    this.typesProvider.editType(this.key, this.typeName);
    this.navCtrl.pop();
  }

  /**
   * Wait for changes in inputs
   */
  checkChanges() {
    this.typeDisable = (this.typeName == "");
    this.subtypeDisable = (this.subtypeName == "");
  }


}
