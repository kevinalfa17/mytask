import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { HomePage2 } from '../home2/home';
///////////////////////////////////////////////
//////////////////////////////////////////////
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public nav: NavController, public translate: TranslateService) {

    this.translate.setDefaultLang('es');

  }

  translateToSpanish() {
    this.translate.use('es');
  }
  translateToEnglish() {
    this.translate.use('en');
  }
  goToHomePage2(): void {
    this.nav.push(HomePage2);
  }
}
