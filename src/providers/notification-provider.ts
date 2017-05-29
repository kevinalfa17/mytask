import { Injectable } from '@angular/core';
import firebase from 'firebase';
import moment from 'moment';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class NotificationData {
    public userProfile: firebase.database.Reference;
    public notificationListOf: firebase.database.Reference;
    public notificationListFor: firebase.database.Reference;
    listForDeletions: FirebaseListObservable<any[]>;
    public ListNotifications: any;
    public numberNewNotifications = 0;

    constructor(public af: AngularFire) {
        this.userProfile = firebase.database().ref('userProfile').child(firebase.auth().currentUser.uid);
        this.notificationListOf = this.userProfile.child('notifications');
        //this.notificationsReference = this.userProfile.child(firebase.auth().currentUser.uid).child('notifications');
    }

    getNotificationList(): firebase.database.Reference {
        return this.notificationListOf;
    }

    getNotificationDetail(notificationtId): firebase.database.Reference {
        this.notificationListOf.child(notificationtId).update({
            Read: "true"
        });
        return this.notificationListOf.child(notificationtId);
    }

    createNotification(destinatario: string, descriptionNoti: string, nameNoti: string, typeNoti: string, FromNoti: String): firebase.Promise<any> {
        this.notificationListFor = firebase.database().ref(`userProfile/${destinatario}/notifications`);
        return this.notificationListFor.push({
            Name: nameNoti,
            Description: descriptionNoti,
            Type: typeNoti,
            From: FromNoti,
            DateSended: moment().format('D/M/YYYY'),
            HourSended: moment().format('h:mm:s a'),
            Condition: 'Pending',
            Read: 'false',
        });
    }
    deleteNotification(notificationtId) {
        this.notificationListOf.child(notificationtId).remove(function (error) {
            if (error) {
                return ('Error al eliminar al registro');
            } else {
                return ('se elimino el registro');
            }
        });
    }
    getNotifications() {
        this.notificationListOf.orderByChild('Type').on('value', snapshot => {
            let rawList = [];
            this.numberNewNotifications = 0;
            snapshot.forEach(snap => {
                if (snap.val().Read == 'false') {
                    this.numberNewNotifications = this.numberNewNotifications + 1;
                }
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
                return false
            })
            this.ListNotifications = rawList;
            return this.ListNotifications;
        });

    }

    acceptNotification(Noti) {
        this.notificationListOf.child(Noti.id).update({
            Condition: "Accepted"
        });

        this.userProfile.child('taskManage').child('Accept').push({
            Name: Noti.Name,
            HourSended: Noti.HourSended
        });
    }
    rejectNotification(Noti) {
        this.notificationListOf.child(Noti.id).update({
            Condition: "Rejected"
        });

        this.userProfile.child('taskManage').child('Rejected').push({
            Name: Noti.Name,
            HourSended: Noti.HourSended
        });
    }
}