//Pages
import { AboutPage } from '../pages/about/about';
import { ChatPage } from '../pages/chat/chat';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';
import { AdminPage } from '../pages/admin/admin';
import { TaskTypesPage } from '../pages/task-types/task-types';
import { ChatViewPage } from '../pages/chat-view/chat-view';
import { CreateTypePage } from '../pages/create-type/create-type';
import { EditTypePage } from '../pages/edit-type/edit-type';
import { Notifications } from '../pages/notifications/notifications';
import { NotificationDetailPage } from '../pages/notification-detail/notification-detail';
import { Tasksinteractions } from '../pages/tasksinterations/tasksinteractions';
import { GoogleCalendar } from '../pages/googleCalendar/googleCalendar';
import {CreateTaskPage} from '../pages/create-task/create-task';
import {NewContactPage} from '../pages/new-contact/new-contact';
import {ContactListPage} from '../pages/contact-list/contact-list';


//Providers
import { Camera } from '@ionic-native/camera';
import { GetProviders } from './app.providers';

//Others
import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = {
    apiKey: "AIzaSyB5IMqaEgPDA_Js_T6ZlcjoqaZBoFQYTtw",
      authDomain: "project-10af2.firebaseapp.com",
      databaseURL: "https://project-10af2.firebaseio.com",
      projectId: "project-10af2",
      storageBucket: "project-10af2.appspot.com",
      messagingSenderId: "919226115038"
};

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {HttpModule} from '@angular/http';
import {TranslateModule, TranslateStaticLoader, TranslateLoader} from "ng2-translate";
export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
import { Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    ChatPage,
    ChatViewPage,
    HomePage,
    TabsPage,
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage,
    AdminPage,
    TaskTypesPage,
    CreateTypePage,
    EditTypePage,
    Notifications,
    Tasksinteractions,
    GoogleCalendar,
    CreateTaskPage,
    NewContactPage,
    ContactListPage,
    NotificationDetailPage
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
  AngularFireModule.initializeApp(firebaseConfig)
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
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage,
    AdminPage,
    TaskTypesPage,
    CreateTypePage,
    EditTypePage,
    Notifications,
    Tasksinteractions,
    GoogleCalendar,
    CreateTaskPage,
    NewContactPage,
    ContactListPage,
    NotificationDetailPage
  ],
  providers: GetProviders()
})
export class AppModule {}
