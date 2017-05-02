import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ChatPage } from '../pages/chat/chat';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';

import {HttpModule} from '@angular/http';
import {TranslateModule, TranslateStaticLoader, TranslateLoader} from "ng2-translate";
export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

import { HomePage2 } from '../pages/home2/home';
import { EventCreatePage } from '../pages/event-create/event-create';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { EventListPage } from '../pages/event-list/event-list';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';
import { AuthData } from '../providers/auth-data';
import { EventData } from '../providers/event-data';
import { ProfileData } from '../providers/profile-data';
import { Camera } from '@ionic-native/camera';
import { GetProviders } from './app.providers';
/////////////////////////////////////////////////////
import { ChatViewPage } from '../pages/chat-view/chat-view';
import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = {
    apiKey: "AIzaSyB5IMqaEgPDA_Js_T6ZlcjoqaZBoFQYTtw",
      authDomain: "project-10af2.firebaseapp.com",
      databaseURL: "https://project-10af2.firebaseio.com",
      projectId: "project-10af2",
      storageBucket: "project-10af2.appspot.com",
      messagingSenderId: "919226115038"
};
/*const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}*/
////////////////////////////////////////////////////////

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    ChatPage,
    ChatViewPage,
    HomePage,
    TabsPage,
    HomePage2,
    EventCreatePage,
    EventDetailPage,
    EventListPage,
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
    menuType: 'push',
    platforms: {
      ios: {
        menuType: 'overlay',
      }
    }
  }
  ),    
  HttpModule,
  TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
//////////////////////////////////////////////////////
  AngularFireModule.initializeApp(firebaseConfig)
  /////////////////////////////////////////////////////
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    ChatPage,
    ChatViewPage,
    HomePage,
    TabsPage,
    HomePage2,
    EventCreatePage,
    EventDetailPage,
    EventListPage,
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage
  ],
  providers: GetProviders()
})
export class AppModule {}
