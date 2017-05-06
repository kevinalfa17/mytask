import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { EventData } from '../../providers/event-data';
import firebase from 'firebase'

import { ProfileData } from '../../providers/profile-data';

@Component({
    selector: 'tasksinteractions',
    templateUrl: 'tasksinteractions.html',
})
export class Tasksinteractions {
    public tasksAcceptList: any;
    public tasksRejectedList: any;

    public tasksAcceptReference: firebase.database.Reference;
    public tasksRejectedReference: firebase.database.Reference;
    public currentUser: any;



    constructor(public navCtrl: NavController, public profilData: ProfileData) { }

    ionViewDidEnter() {

        this.currentUser = this.profilData.currentUser;
        this.tasksAcceptReference = firebase.database().ref(`userProfile/${this.currentUser.uid}/taskManage/Accept`);
        this.tasksRejectedReference = firebase.database().ref(`userProfile/${this.currentUser.uid}/taskManage/Rejected`);

        this.tasksAcceptReference.on('value', snapshot => {

            let rawList = [];
            snapshot.forEach(snap => {
                rawList.push({
                    id: snap.key,
                    Name: snap.val().Name,
                    Description: snap.val().Description,
                });
                return false
            })
            if (rawList.length == 0) {
                rawList.push({
                    id: 0,
                    Name: "No hay tareas aceptadas",
                    Description: "Vacio",
                });
                this.tasksAcceptList = rawList;
            } else {
                this.tasksAcceptList = rawList;
            }
        });

        this.tasksRejectedReference.on('value', snapshot => {

            let rawList = [];
            snapshot.forEach(snap => {
                rawList.push({
                    id: snap.key,
                    Name: snap.val().Name,
                    Description: snap.val().Description,
                });
                return false
            })
            if (rawList.length == 0) {
                rawList.push({
                    id: 0,
                    Name: "No hay tareas rechazadas",
                    Description: "Vacio",
                });
                this.tasksRejectedList = rawList;
            } else {
                this.tasksRejectedList = rawList;
            }

        });
    }

    goTotaskDetail(eventId) {
        // this.nav.push(EventDetailPage, { eventId: eventId });
    }

}