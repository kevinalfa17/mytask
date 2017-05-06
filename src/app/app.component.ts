import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from 'ng2-translate';
import { Component, NgZone } from '@angular/core';
import firebase from 'firebase';
import { LoginPage } from '../pages/login/login';

///////////////////////////////
import { Push, PushObject, PushOptions } from '@ionic-native/push';

///////////////////////////////
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  

  constructor(public platform: Platform, public zone: NgZone, public push: Push, public nav: NavController,
    public translate: TranslateService, statusBar: StatusBar, splashScreen: SplashScreen) {
    translate.setDefaultLang('es');
    ///////////////////////////////////////////////////////////////////////
    this.zone = new NgZone({});
    firebase.initializeApp({
      apiKey: "AIzaSyB5IMqaEgPDA_Js_T6ZlcjoqaZBoFQYTtw",
      authDomain: "project-10af2.firebaseapp.com",
      databaseURL: "https://project-10af2.firebaseio.com",
      projectId: "project-10af2",
      storageBucket: "project-10af2.appspot.com",
      messagingSenderId: "919226115038"
    });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (!user) {
          //this.nav.setRoot(LoginPage);
        /this.rootPage = LoginPage; /////////AQUI PAG PRINCIPAL
          unsubscribe();
        } else {
          //this.nav.setRoot(TabsPage);
          this.rootPage = TabsPage;
          unsubscribe();
        }
      });
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      //////////////////////////////////////////////////////////////////////////////////////
      const options: PushOptions = {
        android: {
          senderID: '919226115038'
        },
        ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
        },
        windows: {}
      };

      const pushObject: PushObject = this.push.init(options);

      pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

      pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
      //////////////////////////////////////////////////////////////////////////////////////
    });
  }
  translateToSpanish() {
    this.translate.use('es');
  }
  translateToEnglish() {
    this.translate.use('en');
  }
}