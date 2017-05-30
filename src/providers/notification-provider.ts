import { Injectable } from '@angular/core';
import firebase from 'firebase';
import moment from 'moment';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfileData } from '../providers/profile-data'

@Injectable()
export class NotificationData {
    public userProfile: firebase.database.Reference;
    public notificationListOf: firebase.database.Reference;
    public taskListOf: firebase.database.Reference;
    public notificationListFor: firebase.database.Reference;
    public notificationListNode: firebase.database.Reference;

    public ListNotifications: any;
    public numberNewNotifications = 0;
    public notinull: any;
    public ListNotificationsForDelete = [];
    currentUseruid: any;
    constructor(af: AngularFire, public pd: ProfileData) {
        this.userProfile = firebase.database().ref('/userProfile').child(firebase.auth().currentUser.uid);
        this.notificationListOf = this.userProfile.child('notifications');
        this.taskListOf = this.userProfile.child('task');
        this.notificationListNode = firebase.database().ref('notifications');
        this.notinull = this.notificationListNode.child('0');
        this.notificationListFor = firebase.database().ref('/userProfile');
    }

    getNotificationList(): firebase.database.Reference {
        return this.notificationListOf;
    }

    getNotificationDetail(notificationtId): firebase.database.Reference {
        var tempname: string;

        this.notificationListOf.child(notificationtId).orderByChild('Type').on('value', snapshot => {
            tempname = snapshot.val().Name;
        });

        if (tempname == "null") {
            alert("yyeeeaahhh");
            return this.notinull;
        } else {
            this.notificationListOf.child(notificationtId).update({
                Read: "true"
            });
            this.notificationListNode.child(notificationtId).update({
                Read: "true"
            });
            return this.notificationListNode.child(notificationtId);
        }
    }

    deleteNotificationTemp(notificationtId) {
        this.notificationListOf.child(notificationtId).set({
            Name: "null"
        });
        this.ListNotificationsForDelete.push(notificationtId);
    }

    deleteNotifications() {
        var i = 0;
        while (i < this.ListNotificationsForDelete.length) {

            this.notificationListOf.child(this.ListNotificationsForDelete[i]).remove().then(function (ref) {
                console.log("Se elimino");
            }, function (error) {
                console.log("Error:", error);
            });
            i = i + 1;
        }
    }
    getNotifications() {
        this.notificationListOf.orderByChild('Type').on('value', snapshot => {
            let rawList = [];
            this.numberNewNotifications = 0;
            snapshot.forEach(snap => {
                if (snap.val().Read == 'false') {
                    this.numberNewNotifications = this.numberNewNotifications + 1;
                }

                if ((snap.val().Name != 'null') && (snap.val().Name != 'null0')) {
                    rawList.push({
                        id: snap.key,
                        Name: snap.val().Name,
                        Description: snap.val().Description,
                        Type: snap.val().Type,
                        From: snap.val().From,
                        Condition: snap.val().Condition,
                        DateSended: snap.val().DateSended,
                        HourSended: snap.val().HourSended
                    });
                }

                return false
            })
            this.ListNotifications = rawList;
            return this.ListNotifications;
        });

    }

    acceptNotification(Noti) {
        this.notificationListNode.child(Noti.id).update({
            Condition: "Accepted"
        });

        this.notificationListOf.child(Noti.id).update({
            Condition: "Accepted"
        });

        this.pd.insertNotification(Noti.From, "Task Accepted", Noti.Name, Noti.Type, this.currentUseruid, Noti.id, Noti.taskid);

        this.userProfile.child('tasks').child(Noti.taskid).set({
            State: true,
        });

        this.userProfile.child('taskManage').child('Accept').push({
            Name: Noti.Name,
            HourSended: Noti.HourSended
        });

        this.deleteNotificationTemp(Noti.id);
    }
    rejectNotification(Noti) {
        this.notificationListNode.child(Noti.id).update({
            Condition: "Rejected"
        });
        this.notificationListOf.child(Noti.id).update({
            Condition: "Rejected"
        });
        this.pd.insertNotification(Noti.From, "Task Rejected", Noti.Name, Noti.Type, this.currentUseruid, Noti.id, Noti.taskid);

        this.userProfile.child('tasks').child(Noti.taskid).set({
            State: false,
        });

        this.userProfile.child('taskManage').child('Rejected').push({
            Name: Noti.Name,
            HourSended: Noti.HourSended
        });
        this.deleteNotificationTemp(Noti.id);
    }
}