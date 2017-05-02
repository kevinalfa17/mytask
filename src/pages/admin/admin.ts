import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskTypesPage } from '../task-types/task-types';
import { TranslateService } from 'ng2-translate';


@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  constructor(public nav: NavController, public navParams: NavParams, public translate: TranslateService) {
    this.translate.setDefaultLang('es');
  }

   goToTaskTypesPage(): void {
    this.nav.push(TaskTypesPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admin');
  }

}
