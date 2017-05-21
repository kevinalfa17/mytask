import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { HomePage2 } from '../home2/home';
import { Notifications } from '../notifications/notifications';
///////////////////////////////////////////////
declare var window;
import { GoogleCalendar } from '../googleCalendar/googleCalendar';
//////////////////////////////////////////////
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  

  constructor(public nav: NavController, public translate: TranslateService) {

    this.translate.setDefaultLang('es');

  }
////////////////////////////////////////////////////

/////////////////////////////////////////////////////
  goToHomePage2(): void {
    this.nav.push(HomePage2);
  }
  goToNot(): void {
    this.nav.push(GoogleCalendar);
  }
  call(passedNumber){
    passedNumber = encodeURIComponent(passedNumber);
    window.location = "tel:"+passedNumber;
  }
}
