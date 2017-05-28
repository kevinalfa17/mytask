import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { TypesProvider } from '../../providers/types-provider';
import { AngularFire, FirebaseListObservable } from 'angularfire2';




/**
 * Generated class for the CreateTask page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-create-task',
  templateUrl: 'create-task.html',
})
export class CreateTaskPage {

  types: FirebaseListObservable<any[]>;
  subtypes: FirebaseListObservable<any[]>;
  taskName:string;



  constructor(public navCtrl: NavController, public navParams: NavParams, public typesProvider: TypesProvider,
    public af: AngularFire, public translate: TranslateService) {

    this.types = typesProvider.getTypesRef();
    this.translate.setDefaultLang('es');
    
  }

  loadSubtypes(selectedType){
    console.log(selectedType);
    this.subtypes = this.typesProvider.getSubtypesRef(selectedType);
    console.log(this.subtypes)
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateTask');
  }

}
