import { Component, ViewChild } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TypesProvider } from '../../providers/types-provider';


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

  types:FirebaseListObservable<any[]>; 

  constructor(public navCtrl: NavController, public params: NavParams, public typesProvider:TypesProvider, 
  public af:AngularFire) {
     this.types = typesProvider.getTypesRef();
  }


}
