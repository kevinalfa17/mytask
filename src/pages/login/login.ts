// Some imports of modules
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { Platform } from 'ionic-angular';
import { AuthProviders, AuthMethods, AngularFire } from 'angularfire2';
import { GooglePlus } from '@ionic-native/google-plus';

//Providers
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';
// Pages referenced
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { TabsPage } from '../tabs/tabs';

/**
 * This page it's used to give o the user the ambient of 
 * a nice login
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'

})

export class LoginPage {
  userProfile: any = null; // Var where is the userProfile of firebase
  email: any; // The site where is saved the email gived for the user
  password: any; // The site where is saved the password gived for the user

  zone: NgZone; // Variable to keep the NgZone
  public loginForm; // Where is saved the information of the form filled
  loading: any; // Variable of loading

  constructor(public platform: Platform, public nav: NavController, public translate: TranslateService, public googlePlus: GooglePlus, private facebook: Facebook,
    public angfire: AngularFire, public authData: AuthData, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.translate.setDefaultLang('es');

    /**
     * Creates a ControlGroup that declares the fields available, their values and the validators that they are going
     * to be using.
     *
     * I set the password's min length to 6 characters because that's Firebase's default. 
     */
    this.zone = new NgZone({});
    firebase.auth().onAuthStateChanged(user => {
      this.zone.run(() => {
        if (user) {
          this.userProfile = user;
        } else {
          this.userProfile = null;
        }
      })
    });
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }
  /**
   * Functions used to translate the page
   */
  translateToSpanish() {
    this.translate.use('es');
  }
  translateToEnglish() {
    this.translate.use('en');
  }

  /**
   * If the form is valid it will call the AuthData service to log the user in displaying a loading component while
   * the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(authData => {
        this.loading.dismiss().then(() => {

          this.nav.setRoot(TabsPage);
        });
      }, error => {
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
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
   * This is the function used to reference the user profile of Facebook
   * and get information for the login
   */
  facebookLogin(): void {
    if (this.platform.is("android")) {

      this.facebook.login(['email']).then((response) => {

        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
            console.log("Firebase success: " + JSON.stringify(success));

            firebase.database().ref('/userProfile').child(success.uid).update({
              email: success.email,
              firstName: success.displayName,
              profilePicture: success.photoURL
            });
            this.userProfile = success;
            this.nav.setRoot(TabsPage);
          })
          .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
          });
      }).catch((error) => { console.log(error) });
    } else {
      var provider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(provider).then((newUser) => {
        var user = newUser.user;
        var uu = firebase.auth().currentUser.uid;
        var us = firebase.database().ref('/userProfile/' + uu);
        us.update({
          email: user.email,
          firstName: user.displayName,
          profilePicture: user.photoURL
        });
        this.userProfile = newUser;
        this.nav.setRoot(TabsPage);
      })
        .catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
        });
    }
  }

  /**
 * This is the function used to reference the user profile of Twitter
 * and get information for the login
 */
  twitterLogin() {
    this.angfire.auth.login({
      provider: AuthProviders.Twitter,
      method: AuthMethods.Popup
    }).then((response) => {
      console.log('Login success with twitter' + JSON.stringify(response));

      firebase.database().ref('/userProfile').child(response.uid).update({
        email: response.auth.email,
        firstName: response.auth.displayName,
        profilePicture: response.auth.photoURL
      });

      this.userProfile = response;
      this.nav.setRoot(TabsPage);

    }).catch((error) => {
      console.log(error);
    })

  }
  /**
   * This is the function used to reference the user profile of Google
   * and get information for the login
   */
  googleLogin() {
    if (this.platform.is("android")) {
      this.googlePlus.login({
        'webClientId': '919226115038-i4pn4k2avmqfkt4kkecm30oq54b0rbfp.apps.googleusercontent.com',
        'offline': true
      }).then(res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then(success => {
            console.log("Firebase success: " + JSON.stringify(success));

            firebase.database().ref('/userProfile').child(success.uid).update({
              email: success.email,
              firstName: success.displayName,
              profilePicture: success.photoURL
            });

            this.userProfile = success;
            this.nav.setRoot(TabsPage);
          })
          .catch(error => console.log("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => console.error("Error: ", err));
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((newUser) => {
        var user = newUser.user;
        var uu = firebase.auth().currentUser.uid;
        var us = firebase.database().ref('/userProfile/' + uu);
        us.update({
          email: user.email,
          firstName: user.displayName,
          profilePicture: user.photoURL
        });
        this.userProfile = newUser;
        this.nav.setRoot(TabsPage);
      })
        .catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
        });
    }
  }

  /**
   * Function used to dsplay and alert
   * @param value The value or information to alert
   * @param title The name of the notification
   */
  displayAlert(value, title) {
    let coolAlert = this.alertCtrl.create({
      title: title,
      message: JSON.stringify(value),
      buttons: [
        {
          text: "OK"
        }
      ]
    });
    coolAlert.present();

  }
  /**
   * Used to go to the sing up page
   */
  goToSignup(): void {
    this.nav.push(SignupPage);
  }

  /**
   * Used to go to the reset password page
   */
  goToResetPassword(): void {
    this.nav.push(ResetPasswordPage);
  }

}
