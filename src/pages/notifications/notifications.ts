//Some imports of diferent modules
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase'
import moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';
//Providers
import { NotificationDetailPage } from '../notification-detail/notification-detail';
import { EventData } from '../../providers/event-data';
import { NotificationData } from '../../providers/notification-provider';
import { ProfileData } from '../../providers/profile-data';
import { MediaData } from '../../providers/media-provider'

///quitar
import { TaskProvider } from '../../providers/task-provider'

/**
 * This page it's used to show the diferent remote notifications and 
 * allows you to interact with
 */
@Component({
    selector: 'notifications',
    templateUrl: 'notifications.html',
})
export class Notifications {
    public notificationsList: any; // The list where it's saved the diferent notifications
    public currentUser: any; // The information of the current user

    public au: any; // AUN NO SE
    public vi: any; // AUN NO SE


    constructor(public taskp: TaskProvider, public navCtrl: NavController, public profiledata: ProfileData, public notificationData: NotificationData, public localNotifications: LocalNotifications, public media: MediaData) {
    }

    /**
     * Function used to reload and see the changing data and refresh the diferent lists
     */
    ionViewWillEnter() {
        this.currentUser = this.profiledata.currentUser.uid;
        //this.notificationData.getNotifications(this.currentUser);
        console.log('aqui');
        console.log(this.currentUser);
        this.notificationsList = this.notificationData.getNotificationsList(this.currentUser);
    }

    /**
     * This function goes to the notification detail page to show the information
     * @param notificationId The key of the notification to show
     */
    goToNotificationDetail(notificationId) {
        this.navCtrl.push(NotificationDetailPage, { notificationId: notificationId, currentUser: this.currentUser });
    }

    ///////////////////////SOLO SON PARA PRUEBAS, BORRAR LUEGO///////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * DELETE THIS!!!!!!!!!!!!!!!!!!!!
     */
    addLocalnoti() {
        this.notificationData.addLocalNotification("Jugar", "PERO YA PERRO", "minute", 5, "", "");
    }
    cancelLocalNotification() {

    }
    chooseFile() {

        this.media.captureFile(this.currentUser);
    }

    recordAudio() {
        this.media.captureAudio(this.currentUser);
    }

    recordVideo() {
        this.vi = this.media.captureVideo(this.currentUser);

        //this.media.savedInStorage(this.currentUser, this.vi, "video");
    }

    send() {
        this.taskp.sendInvite('IZI PICI', 'HERE', 'GG DISCRETOS',
            '2017-07-28T09:00:00-07:00', '2017-07-29T09:00:00-07:00', ["jgon.peralta@gmail.com", "gbarboza963@gmail.com"])
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}