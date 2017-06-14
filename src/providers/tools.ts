import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

declare var cordova: any;
declare var window;

@Injectable()
export class Tools {
  userData: any;
  mimes: any;

  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController, private vibration: Vibration, public platform: Platform) {

    this.mimes = {
      jpg: 'image/jpg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      bmp: 'image/bmp',
      pdf: 'application/pdf',
      mp3: 'audio/mpeg3',
      amr: 'audio/amr',
      m2a: 'audio/mpeg',
      voc: 'audio/voc',
      wav: 'audio/wav',
      mp4: 'video/mp4'
    }

  }

  presentToast(message: string, position: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: position
    });
    toast.present();
  }

  showAlert(message: string) {
    let alert = this.alertCtrl.create({
      title: 'myTasks',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  vibrate(data: any) {
    this.vibration.vibrate(data);
  }

  makeFileIntoBlob(_imagePath, name, type) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: type });
            imgBlob.name = name;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            alert('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  getfilename(filestring) {
    let file;
    file = filestring.replace(/^.*[\\\/]/, '');
    return file;
  }

  getfileext(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    return file;
  }

  getmime(file) {
    let ext = this.getfileext(file);
    if (this.mimes.hasOwnProperty(ext)) {
      return this.mimes[ext];
    } else {
      return 'application/octet-stream';
    }
  }

  randomString(len, charSet?) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }

}