import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { HomePage2 } from '../home2/home';
import { Notifications } from '../notifications/notifications';
///////////////////////////////////////////////

//////////////////////////////////////////////
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  enableSearch:boolean;
  constructor(public nav: NavController, public translate: TranslateService) {

    this.translate.setDefaultLang('es');
    this.enableSearch = false;

  }

  toggleSearchBar(){
    this.enableSearch = !this.enableSearch;
  }

  goToHomePage2(): void {
    this.nav.push(HomePage2);
  }
  goToNot(): void {
    this.nav.push(Notifications);
  }
}
