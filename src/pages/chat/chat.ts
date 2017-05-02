import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileData } from '../../providers/profile-data';
import { ChatProvider } from '../../providers/chat-provider';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ChatViewPage } from '../chat-view/chat-view';

@Component({
    templateUrl: 'chat.html'
})
export class ChatPage {
    chats: Observable<any[]>;
    constructor(public chatProvider: ChatProvider,
        public profileData: ProfileData,
        public af: AngularFire,
        public nav: NavController) {

        //this.chats = this.chatProvider.getChats().map(users => {
          //  return users.map(user => {
            //    user.info = this.af.database.object(`/userProfile/${user.$key}`);
              //  return user;
           // });
        //});


        /*this.chatProvider.getChats().then(chats => {
            this.chats = chats.map(users => {
                return users.map(user => {
                    user.info = this.af.database.object(`/users/${user.$key}`);
                    return user;
                });
            });
        });*/
    }

    openChat(key) {
        let param = { uid: this.profileData.currentUser.uid, interlocutor: key };
        this.nav.push(ChatViewPage, param);
    }
}
