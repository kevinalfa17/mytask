//Providers
import { AuthData } from '../providers/auth-data';
import { EventData } from '../providers/event-data';
import { ProfileData } from '../providers/profile-data';
import { ChatProvider } from '../providers/chat-provider';
import { UtilsProvider } from '../providers/utils-provider';
import { TypesProvider } from '../providers/types-provider';
import { ContactsProvider } from '../providers/contacts-provider';
import { TaskProvider } from '../providers/task-provider';
import { NotificationData } from '../providers/notification-provider';


//Others
import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NavController } from 'ionic-angular';
import {InAppBrowser} from '@ionic-native/in-app-browser'
import {File} from '@ionic-native/file'
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
////////////////////////////////////////////////////
import { Push } from '@ionic-native/push';
import { GooglePlus } from '@ionic-native/google-plus';



/////////////////////////////////////////////////////
export class CameraMock extends Camera{
  getPicture(options) {
    return new Promise((resolve, reject) => {
      resolve(this.fakeImage);
    })
  }

  fakeImage = "base94";
}
 
export function GetProviders() {
  let providers;
  if(document.URL.includes('https://') || document.URL.includes('http://')){
    // Use browser providers
    providers = [
      {provide: Camera, useClass: CameraMock},
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      AuthData,
      EventData,
      NavController,
      Push,
      ProfileData,
      SplashScreen,
      StatusBar,
      Facebook,
      GooglePlus,
      ChatProvider,
      UtilsProvider,
      TypesProvider,
      InAppBrowser,
      File,
      LocalNotifications,
      ContactsProvider,
      TaskProvider,
      NotificationData
    ];
  } else {
    // Use device providers
    providers = [
      Camera,
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      AuthData,
      EventData,
      NavController,
      Push,
      ProfileData,
      SplashScreen,
      StatusBar,
      Facebook,
      GooglePlus,
      ChatProvider,
      UtilsProvider,
      TypesProvider,
      InAppBrowser,
      File,
      LocalNotifications,
      ContactsProvider,
      TaskProvider,
      NotificationData
    ];  
  }
  return providers;
}
