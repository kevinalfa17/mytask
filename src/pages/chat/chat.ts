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

    /**
     * Constructor
     * @param chatProvider 
     * @param profileData 
     * @param af 
     * @param nav 
     */
    constructor(public chatProvider: ChatProvider,
        public profileData: ProfileData,
        public af: AngularFire,
        public nav: NavController) {
    }

    /**
     * Open a chat window with the specific locutor key
     * @param key 
     */
    openChat(key) {
        let param = { uid: this.profileData.currentUser.uid, interlocutor: key };
        this.nav.push(ChatViewPage, param);
    }
}
