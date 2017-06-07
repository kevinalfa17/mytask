//Important imports of diferent modules
import { NavController, AlertController } from 'ionic-angular';
import { Component, OnInit, NgZone } from '@angular/core';
//Providers
import { ProfileData } from '../../providers/profile-data';
import { NotificationData } from '../../providers/notification-provider';
import { AuthData } from '../../providers/auth-data';
//Pages
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { NotificationDetailPage } from '../notification-detail/notification-detail'

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public userProfile: any; // The information of the current user
  public profilePicture: string; // The link to the profile picture
  public birthDate: string; // The birthdate

  constructor(public navCtrl: NavController, public notificationData: NotificationData, public profileData: ProfileData, public authData: AuthData, public alertCtrl: AlertController) {

  }

  /**
  * Function used to reload and see the changing data and refresh the diferent lists
  */
  ionViewDidEnter() {
    this.profileData.getUserProfile().then(profileSnap => {
      this.userProfile = profileSnap;
      this.birthDate = this.userProfile.birthDate;
      this.profilePicture = this.userProfile.profilePicture;
    });
  }

  /**
   * This function it's used to go out the current user
   */
  logOut() {
    this.authData.logoutUser().then(() => {
      this.profileData.gooutuser();
      this.navCtrl.setRoot(LoginPage);
    });
  }

  /**
   * Used to go and update the name of the user
   */
  updateName() {
    let alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Used to go and update the birthdate of the user
   */
  updateDOB(birthDate) {
    this.profileData.updateDOB(birthDate);
  }

  /**
   * Used to go and update the email of the user
   */
  updateEmail() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateEmail(data.newEmail, data.password);
          }
        }
      ]
    });
    alert.present();
  }
  /**
   * Used to go and update the password of the user
   */
  updatePassword() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updatePassword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Used to go and update the address of the user
   */
  updateaddress() {
    let alert = this.alertCtrl.create({
      message: "Your address",
      inputs: [
        {
          name: 'address',
          placeholder: 'Your address',
          value: this.userProfile.address
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateaddress(data.address);
          }
        }
      ]
    });
    alert.present();
  }

  /**
 * Used to go and update the name of the phone
 */
  updatephone() {
    let alert = this.alertCtrl.create({
      message: "Your phone",
      inputs: [
        {
          name: 'phone',
          placeholder: 'Your phone',
          value: this.userProfile.phone
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updatephone(data.phone);
          }
        }
      ]
    });
    alert.present();
  }


  /**
   * Used to go to Home page
   */
  goToHome(): void {
    this.navCtrl.setRoot(TabsPage);
  }
}
