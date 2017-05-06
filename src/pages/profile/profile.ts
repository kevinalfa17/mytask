import { NavController, AlertController } from 'ionic-angular';
import { Component, OnInit, NgZone } from '@angular/core';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';



@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public userProfile: any;
  profilePicture: string;
  public birthDate: string;

  constructor(public navCtrl: NavController, public profileData: ProfileData, public authData: AuthData, public alertCtrl: AlertController) {

  }

  ionViewDidEnter() {
    this.profileData.getUserProfile().then(profileSnap => {
      this.userProfile = profileSnap;
      this.birthDate = this.userProfile.birthDate;
      this.profilePicture = this.userProfile.profilePicture;
    });
  }

  logOut() {
    this.authData.logoutUser().then(() => {
      this.profileData.gooutuser();
      this.navCtrl.setRoot(LoginPage);

    });
  }

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

  updateDOB(birthDate) {
    this.profileData.updateDOB(birthDate);
  }

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

  

  goToHome(): void {
    this.navCtrl.setRoot(TabsPage);
  }
}
