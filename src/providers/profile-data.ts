// Some important imports of modules
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFire } from 'angularfire2';
import moment from 'moment';

/**
 * This class it's used to manage all the characteristics of the
 * current user in the app
 */
@Injectable()
export class ProfileData {
  public userProfile: firebase.database.Reference; //take the reference of firebase about the userProfile node 
  public currentUser: firebase.User; // To take the  changing user

  /**
   * 
   * @param af reference to angularfire to use it
   * In the constructor it's the revision of the current user of firebase
   */
  constructor(public af: AngularFire) {
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user;
    });
    this.userProfile = firebase.database().ref('/userProfile');
  }

  /**
   * Only seach about the information o the current user and 
   * returns the promise
   */
  getUserProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/userProfile')
        .child(firebase.auth().currentUser.uid)
        .on('value', data => {
          resolve(data.val());
        });
    });
  }

  /**
   * Function used change the name of the current user, returns a promise
   * @param firstName String of the new name
   * @param lastName  String of the new lastname
   */
  updateName(firstName: string, lastName: string): firebase.Promise<any> {
    return this.userProfile.child(this.currentUser.uid).update({
      firstName: firstName,
      lastName: lastName,
    });
  }

  /**
   * This function it's used to put or change the birthdate
   * @param birthDate New date
   */
  updateDOB(birthDate: string): firebase.Promise<any> {
    return this.userProfile.child(this.currentUser.uid).update({
      birthDate: birthDate,
    });
  }

  /**
   * It's used to change the email of the local users
   * @param newEmail New email to change
   * @param password Actual password for security
   */
  updateEmail(newEmail: string, password: string): firebase.Promise<any> {
    const credential = firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, password);
    return this.currentUser.reauthenticate(credential).then(user => {
      this.currentUser.updateEmail(newEmail).then(user => {
        this.userProfile.child(this.currentUser.uid)
          .update({ email: newEmail });
      });
    });
  }

  /**
   * It's used to change the current password of the local users
   * @param newPassword New password to change 
   * @param oldPassword Actual password for security
   */
  updatePassword(newPassword: string, oldPassword: string): firebase.Promise<any> {
    const credential = firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, oldPassword);

    return this.currentUser.reauthenticate(credential).then(user => {
      this.currentUser.updatePassword(newPassword).then(user => {
        console.log("Password Changed");
      }, error => {
        console.log(error);
      });
    });
  }

  /**
   * It's used to put or change the address of the users
   * @param newAddress New addres to keep
   */
  updateaddress(newAddress: string): firebase.Promise<any> {
    return this.userProfile.child(this.currentUser.uid).update({
      address: newAddress,
    });
  }

  /**
   * It's used to put or change the current password of the users
   * @param newphone The phone number of he user
   */
  updatephone(newphone: string): firebase.Promise<any> {
    return this.userProfile.child(this.currentUser.uid).update({
      phone: newphone,
    });
  }
  /**
   * Used to get the emails of all the users
   */
  getAllUsers() {
    return this.af.database.list('/userProfile');
  }

  /**
   * Resturns the current user uid
   */
  getuidcurrent() {
    return this.currentUser.uid;
  }

  /**
   * Go out the current user
   */
  gooutuser() {
    this.currentUser.reload();
  }

  /**
   * This function it's used to insert a new task in the node of task
   * and create a new node in the userdata to reference later
   * @param email The email of the person to add the task
   * @param key The key of the task used in the tasknode
   * @param subnode The name of the node where is the information of the task
   * @param task
   */
  insertTask(email, key, subnode, task) {
    var userkey;
    let subscription = this.af.database.list('/userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      },
      preserveSnapshot: true
    }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        if (snapshot.key !== null) {
          var yourRef = this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`);
          task.phone = snapshot.val().phone;
          yourRef.update(key, task);
          subscription.unsubscribe();
        }

      });
    })

  }

  /**
   * Update status for user and all its delegated admins
   * @param email 
   * @param key 
   * @param newStatus 
   */
  updateStatus(email, key, newStatus) {

    var userkey;
    let subscription = this.af.database.list('/userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      },
      preserveSnapshot: true
    }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        if (snapshot.key !== null) {
          var yourRef = this.af.database.object(`/userProfile/${snapshot.key}/delegatedTasks/${key}`);
          yourRef.update({ status: newStatus })
          subscription.unsubscribe();
        }

      });
    })

  }

  /**

   * This function it's used to insert a new notification in the node of notifications
   * and create a new node in the userdata to reference later
   * @param email The list of emails to notificate something
   * @param description The comment of the task 
   * @param name The name used for the task
   * @param type The type of task 
   * @param creatorid The id of the creator user 
   * @param key The key of the task for use it later
   */
  insertNotification(email, description, name, type, creatorid, key, comment) {

    var userkey;
    let subscription = this.af.database.list('/userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      },
      preserveSnapshot: true
    }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        if (snapshot.key !== null) {

          let noti = {
            Name: name,
            Description: description,
            type: type,
            Read: "false",
            Creatoremail: this.currentUser.email,
            taskid: key,
            From: this.currentUser.email,
            DateSended: moment().format('D/M/YYYY'),
            HourSended: moment().format('h:mm:s a'),
            comment: comment
          }
          this.af.database.list(`/userProfile/${snapshot.key}/notifications`).push(noti)
          subscription.unsubscribe();
        }
      });
    })

  }

  /**
   * Delete task for user and all its delegated admins
   * @param email 
   * @param key 
   * @param subnode 
   */
  endTask(email, key, subnode) {

    var userkey;
    let subscription = this.af.database.list('/userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      },
      preserveSnapshot: true
    }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        if (snapshot.key !== null) {
          var yourRef = this.af.database.object(`/userProfile/${snapshot.key}/${subnode}/${key}`);
          yourRef.remove();
          subscription.unsubscribe();
        }

      });
    })

  }

  /**
   * Update comment for user and all its delegated admins
   * @param email 
   * @param key 
   * @param value 
   * @param field 
   * @param subnode 
   */
  updateComment(email, key, value, field, subnode) {

    var userkey;
    let subscription = this.af.database.list('/userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      },
      preserveSnapshot: true
    }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        if (snapshot.key !== null) {
          if (field == "comments") {
            this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`).update(key, { comments: value })
          }
          else if (field == "alarm") {
            this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`).update(key, { alarm: value })
          }
          else if (field == "alarm1") {
            this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`).update(key, { alarm1: value })
          }
          else if (field == "alarm2") {
            this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`).update(key, { alarm2: value })
          }
          else if (field == "alarm3") {
            this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`).update(key, { alarm3: value })
          }
          else if (field == "endTime") {
            this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`).update(key, { endTime: value })
          }
          else if (field == "startDay") {
            this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`).update(key, { startDay: value })
          }
          else if (field == "startTime") {
            this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`).update(key, { startTime: value })
          }

          subscription.unsubscribe();
        }

      });
    })
    //subscription.unsubscribe();

  }


}
