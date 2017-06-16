// Some important imports of modules
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AlertController } from 'ionic-angular';
import moment from 'moment';
//Some imports of other files
import { ProfileData } from '../providers/profile-data';

/**
 * This class it's used for give the tools for the manage of the local and remote
 * notifications
 */

@Injectable()
export class NotificationData {
    public userProfile: firebase.database.Reference; // Reference for the userProfile node in the database
    public ListNotifications: any; // List used to save somee information taken of the notification list
    public numberNewNotifications = 0; // The number of notifications doesn't read
    public notinull: any; // The reference to the null notification
    public ListNotificationsForDelete: any; // The list of notifications for delete later
    public localNotificationsList: any; // The list of the local notifications
    public localNotificationsCount: number; // The number of the local notifications

    constructor(public pd: ProfileData, public localNotifications: LocalNotifications, public alertCtrl: AlertController) {
        this.userProfile = firebase.database().ref('/userProfile');
        this.ListNotifications = [];
        this.ListNotificationsForDelete = [];
        this.localNotificationsList = [];
        this.localNotificationsCount = 0;
    }
    /**
     * This function it's used for get the notifications of the user
     * @param currentUser The current user
     */
    getNotificationsList(currentUser) {
        return this.ListNotifications;
    }
    /**
     * It's used to get the details of one notification
     * @param notificationtId The key of the notification 
     * @param currentUser The uid of the currrent user 
     */
    getNotificationDetail(notificationtId, currentUser): firebase.database.Reference {
        var tempname: string;
        var tem = this.userProfile.child(currentUser).child('notifications');

        tem.child(notificationtId).orderByChild('type').on('value', snapshot => {
            tempname = snapshot.val().Name;
        });

        if (tempname == "null") {
            alert("yyeeeaahhh");
            return this.notinull;
        } else {
            
            tem.child(notificationtId).update({
                Read: "true"
            });
            return tem.child(notificationtId);
        }
    }
    /**
     * This function it's used to delete temporarily a notification
     * @param notificationtId The key of the notification 
     * @param currentUser The uid of the currrent user 
     */
    deleteNotificationTemp(notificationtId, currentUser) {
        var tem = this.userProfile.child(currentUser).child('notifications');
        tem.child(notificationtId).set({
            Name: "null"
        });
        this.ListNotificationsForDelete.push(notificationtId);
    }

    /**
     * This function it's used to delete a notification
     * @param currentUser The uid of the currrent user
     */
    deleteNotifications(currentUser) {
        var tem = this.userProfile.child(currentUser).child('notifications');
        var i = 0;
        while (i < this.ListNotificationsForDelete.length) {

            tem.child(this.ListNotificationsForDelete[i]).remove().then(function (ref) {
                console.log("Se elimino");
            }, function (error) {
                console.log("Error:", error);
            });
            i = i + 1;
        }
    }

    /**
     * It's used to get all the remote notifications of one user
     * @param currentUser The uid of the currrent user
     */
    getNotifications(currentUser) {
        this.userProfile.child(currentUser).child('notifications').orderByChild('Name').on('value', snapshot => {
            let rawList = [];
            this.numberNewNotifications = 0;
            snapshot.forEach(snap => {
                console.log(snap.val().Name);
                if (snap.val().Read == 'false') {
                    this.numberNewNotifications = this.numberNewNotifications + 1;
                }

                if ((snap.val().Name != 'null') && (snap.val().Name != 'null0')) {
                    rawList.push({
                        id: snap.key,
                        Name: snap.val().Name,
                        Description: snap.val().Description,
                        type: snap.val().type,
                        From: snap.val().From,
                        Condition: snap.val().Condition,
                        DateSended: snap.val().DateSended,
                        HourSended: snap.val().HourSended
                    });
                } return false
            })
            this.ListNotifications = rawList;
        });

    }

    /**
     * It's used to accept a notification
     * @param Noti The object of one notification to take the information
     * @param currentUser The uid of the currrent user
     */
    acceptNotification(Noti, currentUser) {
        this.pd.insertNotification(Noti.From, "Task Accepted", Noti.Name, 'Accepted', currentUser.uid, Noti.taskid, Noti.comment);

        this.userProfile.child('taskManage').child('Accept').push({
            Name: Noti.Name,
            HourSended: Noti.HourSended
        });

        this.deleteNotificationTemp(Noti.id, currentUser);
    }

    /**
     * The function it's used to reject a notification
     * @param Noti The object of one notification to take the information
     * @param currentUser The uid of the currrent user
     */
    rejectNotification(Noti, currentUser) {
        this.pd.insertNotification(Noti.From, "Task Rejected", Noti.Name, "Rejected", currentUser.uid, Noti.taskid, Noti.comment);

        this.userProfile.child('taskManage').child('Rejected').push({
            Name: Noti.Name,
            HourSended: Noti.HourSended
        });
        this.deleteNotificationTemp(Noti.id, currentUser);
    }

    /**
     * This is a function used to add a new local notification for the device
     * @param NotiTitle The title of the notification 
     * @param Notitext The text to put in the notification
     * @param NotiTime The recurrence of the local notification
     * @param FromNow A number of seconds to notified later
     * @param Sound The sound to use
     * @param Icon The icon to use
     */
    addLocalNotification(NotiTitle: string, Notitext: string, NotiTime: string, FromNow: number, Sound: string, Icon: string) {
        if (Sound == "") {
            Sound = "file://assets/sound/noti.mp3";
        }
        if (Icon == "") {
            Icon = "file://assets/icon/noti.png";
        }
        var localNoti = {
            id: moment.now(),
            title: NotiTitle,
            text: Notitext,
            sound: Sound,
            at: new Date(new Date().getTime() + FromNow * 1000),
            every: NotiTime,
            icon: Icon
        };
        this.localNotificationsCount = this.localNotificationsCount + 1;
        this.localNotifications.schedule(localNoti);
    }
    /**
     * It's used to cancel one local notification
     * @param id The id of the notiication to cancel
     */
    cancelLocalNotification(id: number) {
        var numNotif = this.localNotificationsCount;

        for (var i = 0; i < numNotif; ++i) {
            var notif = this.localNotifications[i];
            if (notif.id == id) {
                this.localNotifications.cancel(notif.id);
                console.log("cancelada");
            }
        }
    }
    /**
     *  It's a function used to edit one local notification
     * @param id The id of the notiication to edit
     * @param NotiTitle The new title 
     * @param Notitext The new text or description
     * @param NotiTime The new recurrence
     * @param FromNow The new time to advice
     */
    editLocalNotification(id: number, NotiTitle: string, Notitext: string, NotiTime: string, FromNow: number) {
        var numNotif = this.localNotificationsCount;

        for (var i = 0; i < numNotif; ++i) {
            var notif = this.localNotifications[i];
            if (notif.id == id) {
                this.localNotifications.update({
                    id: id,
                    title: NotiTitle,
                    text: Notitext,
                    sound: "file://sounds/alert.caf",
                    at: new Date(new Date().getTime() + FromNow * 1000),
                    every: NotiTime,
                    icon: "file://img/noti.png"
                });
            }
        }
    }
}