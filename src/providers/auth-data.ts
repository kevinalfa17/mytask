// Some important imports of modules
import { Injectable } from '@angular/core';
import firebase from 'firebase';


/**
 * This class it is used for the manage of the login and sing up 
 * in the app  
   */
@Injectable()
export class AuthData {
  constructor() { }

  /**
   * [loginUser We'll take an email and password and log the user into the firebase app]
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  /**
   * [signupUser description]
   * This function will take the user's email and password and create a new account on the Firebase app, once it does
   * it's going to log the user in and create a node on userProfile/uid with the user's email address, you can use
   * that node to store the profile information.
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  signupUser(email: string, password: string, picRef): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
      firebase.database().ref('/userProfile').child(newUser.uid).set({
        email: email,
        type: "user",
        phone: "00000000"
      });
      if (picRef != null) {
        firebase.storage().ref('/ProfilePictures').child(newUser.uid).child('profilePicture.png').putString(picRef, 'base64', { contentType: 'image/png' }).then((savedPicture) => {
          firebase.database().ref("/userProfile").child(newUser.uid).child('profilePicture').set(savedPicture.downloadURL);
        });
      } else {
        firebase.database().ref("/userProfile").child(newUser.uid).child('profilePicture').set("null");
      }
    });

  }

  /**
   * [resetPassword description]
   * This function will take the user's email address and send a password reset link, then Firebase will handle the
   * email reset part, you won't have to do anything else.
   *
   * @param  {string} email    [User's email address]
   */
  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  /**
   * This function doesn't take any params, it just logs the current user out of the app.
   */
  logoutUser(): firebase.Promise<void> {
    firebase.database().ref('/userProfile').child(firebase.auth().currentUser.uid).off();
    return firebase.auth().signOut();
  }

}
