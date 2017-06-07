// Imports of diferent modules
import { Component } from '@angular/core';
import { AuthData } from '../../providers/auth-data';
import { TranslateService } from 'ng2-translate';
import { NavController } from 'ionic-angular';

// Pages used
import { ChatPage } from '../chat/chat';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { AdminPage } from '../admin/admin';

/**
 * It's the page used to give the tabs in the app
 */
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

  /**
   * Functions used for the translate
   */

  translateToSpanish() {
    this.translate.use('es');
  }
  translateToEnglish() {
    this.translate.use('en');
  }

  /**
   * Go out the curren user
   */
  goOut() {
    this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }
  /**
   * Go to the current user profile
   */
  gotoProfile() {
    this.nav.push(ProfilePage);
  }
}
