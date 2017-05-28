import { Component } from '@angular/core';
import { ChatPage } from '../chat/chat';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { AuthData } from '../../providers/auth-data';
import { TranslateService } from 'ng2-translate';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AdminPage } from '../admin/admin';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public indNavs = 0;

  tab1Root = HomePage;
  tab2Root = AdminPage;
  tab3Root = ContactPage;
  constructor(public nav: NavController, public authData: AuthData, public translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  translateToSpanish() {
    this.translate.use('es');
  }
  translateToEnglish() {
    this.translate.use('en');
  }
  goOut() {
    this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }
  gotoProfile() {
    this.nav.push(ProfilePage);
  }
}
