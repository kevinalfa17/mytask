// Imports of diferent modules
import { Platform, NavController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from 'ng2-translate';
import { Component, NgZone } from '@angular/core';
import firebase from 'firebase';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
import moment from 'moment';

//Pages
import { LoginPage } from '../pages/login/login';
import { Notifications } from '../pages/notifications/notifications'
//Providers
import { NotificationData } from '../../src/providers/notification-provider';

/**
 * It's the principal code of the application
 */
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  public alert: any; // Use it to show alerts

  constructor(public platform: Platform, public zone: NgZone, public push: Push, public nav: NavController,
    public translate: TranslateService, statusBar: StatusBar, splashScreen: SplashScreen,
    public alertCtrl: AlertController, public localNotifications: LocalNotifications) {
    translate.setDefaultLang('es');
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
          this.rootPage = LoginPage;
          unsubscribe();
        } else {
          this.rootPage = TabsPage;
          unsubscribe();
        }
      });
    });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      

      platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack()) {
          this.nav.pop();
        } else {
          this.showAlert();
        }
      });

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

      pushObject.on('notification').subscribe((notification: any) => {
        if (notification.additionalData.foreground) {

          let youralert = this.alertCtrl.create({
            title: 'New notification',
            message: notification.message
          });
          youralert.present();
        }
      });

      pushObject.on('registration').subscribe((registration: any) => {

        alert(registration.registrationId);

      });

      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
      //////////////////////////////////////////////////////////////////////////////////////
      this.localNotifications.on('click', notification => {
        this.alert = this.alertCtrl.create({
          title: notification.title,
          message: notification.text,
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                this.alert = null;
              }
            },
            {
              text: 'Cancel',
              handler: () => {
                this.localNotifications.cancel(notification.id);
              }
            },
            {
              text: 'Posp',
              handler: () => {
                var localNotiN = {
                  id: moment.now(),
                  title: notification.title,
                  text: notification.text,
                  sound: notification.sound,
                  at: new Date(new Date().getTime() + 1800 * 1000),
                  icon: notification.icon
                };

                this.localNotifications.schedule(localNotiN);
              }
            }]
        });
        this.alert.present();
      });

    });
  }

  /**
   * Function used to show alert of go out the application
   */
  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }

  /**
   * Those functions are used to manage the lenguaje
   */
  translateToSpanish() {
    this.translate.use('es');
  }
  translateToEnglish() {
    this.translate.use('en');
  }
}