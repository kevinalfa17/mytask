// Some important imports of diferent modules
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { TranslateService } from 'ng2-translate'
//Providers
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';
//Pages
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

/**
 * This page it's used to sign up a new user
 */
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm; // Where it's the information that given by the user
  loading: any; // Variable of loanding
  public image: string; // The imagen to show in the html
  public image64: string; // The imagen to keep in the database

  constructor(public nav: NavController, public translate: TranslateService, public authData: AuthData, public platform: Platform,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public camera: Camera) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })

    this.translate.setDefaultLang('es');
  }

  /**
   * This function uses all the information given by the user and 
   * check the strings and later goes to sign up 
   */
  signupUser() {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.image64)
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

  /**
   * This function it's used to select a image from the galery to
   * show in profile picture
   */
  selectPicture() {
    if (this.platform.is("android")) {
      this.camera.getPicture({
        quality: 95,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: true
      }).then((imagen) => {
        console.log(imagen);
        this.image = "data:image/jpeg;base64," + imagen;
        this.image64 = imagen;
      }, (err) => {
        console.log(err);
      });
    } else {
      this.translate.get('TEXTNOPARAESTAPLATAFORMA').subscribe((text: string) => {
        let alert = this.alertCtrl.create({
          message: text,
          buttons: [
            {
              text: 'ok',
            }
          ]
        });
        alert.present();
      })
    }
  }

  /**
 * This function it's used to take a image from the galery to
 * show in profile picture
 */
  takePicture() {
    if (this.platform.is("android")) {
      this.camera.getPicture({
        quality: 95,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: true
      }).then((imagen) => {
        console.log(imagen);
        this.image = "data:image/jpeg;base64," + imagen;
        this.image64 = imagen;

      }, (err) => {
        console.log(err);
      });
    } else {
      this.translate.get('TEXTNOPARAESTAPLATAFORMA').subscribe((text: string) => {
        let alert = this.alertCtrl.create({
          message: text,
          buttons: [
            {
              text: 'ok',
            }
          ]
        });
        alert.present();
      })
    }
  }
}
