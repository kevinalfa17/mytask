import { Injectable } from '@angular/core';
import firebase from 'firebase';
import moment from 'moment';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfileData } from '../providers/profile-data'

@Injectable()
export class NotificationData {
    public userProfile: firebase.database.Reference;
    public notificationListNode: firebase.database.Reference;

    public ListNotifications: any;
    public numberNewNotifications = 0;
    public notinull: any;
    public ListNotificationsForDelete: any;
    constructor(public pd: ProfileData) {
        this.userProfile = firebase.database().ref('/userProfile');
        this.notificationListNode = firebase.database().ref('notifications');
        this.notinull = this.notificationListNode.child('0');
        this.ListNotifications = [];
        this.ListNotificationsForDelete = [];
    }

    getNotificationsList(currentUser) {
        this.getNotifications(currentUser);
        console.log('iiiiiiiiiiiiiizzzzzzzzzzzziiiiiiiiiiiiii');
        console.log(this.ListNotifications[0]);
        return this.ListNotifications;
    }

    getNotificationDetail(notificationtId, currentUser): firebase.database.Reference {
        var tempname: string;
        var tem = this.userProfile.child(currentUser).child('notifications');

        tem.child(notificationtId).orderByChild('Type').on('value', snapshot => {
            tempname = snapshot.val().Name;
        });

        if (tempname == "null") {
            alert("yyeeeaahhh");
            return this.notinull;
        } else {
            tem.child(notificationtId).update({
                Read: "true"
            });
            this.notificationListNode.child(notificationtId).update({
                Read: "true"
            });
            return this.notificationListNode.child(notificationtId);
        }
    }

    deleteNotificationTemp(notificationtId, currentUser) {
        var tem = this.userProfile.child(currentUser).child('notifications');
        tem.child(notificationtId).set({
            Name: "null"
        });
        this.ListNotificationsForDelete.push(notificationtId);
    }

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
                        Type: snap.val().Type,
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

    acceptNotification(Noti, currentUser) {
        var tem = this.userProfile.child(currentUser).child('notifications');

        this.notificationListNode.child(Noti.id).update({
            Condition: "Accepted"
        });

        this.pd.insertNotification(Noti.From, "Task Accepted", Noti.Name, Noti.Type, currentUser.uid, Noti.id, Noti.taskid);

        this.userProfile.child('tasks').child(Noti.taskid).set({
            State: true,
        });

        this.userProfile.child('taskManage').child('Accept').push({
            Name: Noti.Name,
            HourSended: Noti.HourSended
        });

        this.deleteNotificationTemp(Noti.id, currentUser);
    }
    rejectNotification(Noti, currentUser) {
        var tem = this.userProfile.child(currentUser).child('notifications');
        this.notificationListNode.child(Noti.id).update({
            Condition: "Rejected"
        });

        this.pd.insertNotification(Noti.From, "Task Rejected", Noti.Name, Noti.Type, currentUser.uid, Noti.id, Noti.taskid);

        this.userProfile.child('tasks').child(Noti.taskid).set({
            State: false,
        });

        this.userProfile.child('taskManage').child('Rejected').push({
            Name: Noti.Name,
            HourSended: Noti.HourSended
        });
        this.deleteNotificationTemp(Noti.id, currentUser);
    }
}