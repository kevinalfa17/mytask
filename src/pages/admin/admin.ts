import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskTypesPage } from '../task-types/task-types';


@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  constructor(public nav: NavController, public navParams: NavParams) {
  }

   goToTaskTypesPage(): void {
    this.nav.push(TaskTypesPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admin');
  }

}
