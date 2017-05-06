import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { TypesProvider } from '../../providers/types-provider';


@IonicPage()
@Component({
  selector: 'page-create-type',
  templateUrl: 'create-type.html',
})
export class CreateTypePage {


  typeName: string;
  subtypeName: string;
  subtypes: Array<string>;
  subtypeDisable: boolean;
  typeDisable: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService,
    public typesProvider: TypesProvider) {

    this.translate.setDefaultLang('es');
    this.subtypes = [];
    this.typeDisable = true;
    this.subtypeDisable = true;
  }

  deleteSubtype(i) {
    this.subtypes.splice(i, 1);

  }

  addSubtype() {

    this.subtypes.push(this.subtypeName);
    this.subtypeName = "";
    this.checkChanges();
  }

  createType() {
    //Add type
    this.typesProvider.addNewType(this.typeName);

    //Add Each subtype
    this.subtypes.forEach((item) => {
      this.typesProvider.addNewSubtype(this.typeName,item)
    });


    this.navCtrl.pop();
  }

  checkChanges() {
    this.typeDisable = (this.typeName == "");
    this.subtypeDisable = (this.subtypeName == "");
  }


}
