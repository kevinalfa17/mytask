//Providers
import { AuthData } from '../providers/auth-data';
import { EventData } from '../providers/event-data';
import { ProfileData } from '../providers/profile-data';
import { ChatProvider } from '../providers/chat-provider';
import { UtilsProvider } from '../providers/utils-provider';
import { TypesProvider } from '../providers/types-provider';

//Others
import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
////////////////////////////////////////////////////
import { Push } from '@ionic-native/push';
import { GooglePlus } from '@ionic-native/google-plus';
/////////////////////////////////////////////////////

class CameraMock extends Camera {
  getPicture(options){
    return new Promise( (resolve, reject) => {
      resolve("ADD_BASE64_STRING_RESPONSE_HERE");
    });
  }
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
      TypesProvider
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
      TypesProvider
    ];  
  }
  return providers;
}
