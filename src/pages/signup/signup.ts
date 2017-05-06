import {
  NavController,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';


import { Camera } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm;
  loading: any;
  public image: string;



  constructor(public nav: NavController, public authData: AuthData, public platform: Platform,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public camera: Camera) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })
  }

  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  signupUser() {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {

      // if(this.image.length == 0){
        this.image = null;
      // }
      
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.image)
        .then(() => {
          this.loading.dismiss().then(() => {
            this.nav.setRoot(TabsPage);
          });
        }, (error) => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: this.image.length.toString(),
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  selectPicture() {
    if (this.platform.is("android")) {
      this.camera.getPicture({
        quality: 95,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500
      }).then((imagen) => {
        console.log(imagen);
        this.image = "data:image/jpeg;base64," + imagen;
      }, (err) => {
        console.log(err);
      });
    } else {

    }
  }
  takePicture() {
    if (this.platform.is("android")) {
      this.camera.getPicture({
        quality: 95,

        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: true
      }).then((imagen) => {
        console.log(imagen);
        this.image = imagen
      }, (err) => {
        console.log(err);
      });
    } else {

    }
  }
}
