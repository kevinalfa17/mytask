import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfileData } from '../../providers/profile-data';
import { ChatProvider } from '../../providers/chat-provider';
import { Camera } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
@Component({
  templateUrl: 'chat-view.html',
})
export class ChatViewPage {
  message: string;
  uid:string;
  interlocutor:string;
  chats:FirebaseListObservable<any>;  
  image: string;
  @ViewChild(Content) content: Content;
  constructor(public nav:NavController, 
  params:NavParams, 
  public chatProvider:ChatProvider, 
  public af:AngularFire, 
  public profileData:ProfileData, public camera: Camera, public platform: Platform) {
    
    this.uid = params.data.uid;
    this.interlocutor = params.data.interlocutor;
    
    // Get Chat Reference
    chatProvider.getChatRef(this.uid, this.interlocutor)
    .then((chatRef:any) => {  
        this.chats = this.af.database.list(chatRef);
    });
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
  }


  sendMessage() {
      if(this.message) {
          let chat = {
              from: this.uid,
              message: this.message,
              type: 'message'
          };
          this.chats.push(chat);
          this.message = "";
      }
  };
  
  sendPicture() {
      //let chat = {from: this.uid, type: 'picture', picture:null};
      /*this.userProvider.getPicture()
      .then((image) => {
          chat.picture =  image;
          this.chats.push(chat);
      });*/
      if (this.platform.is("android")) {
      this.camera.getPicture({
        quality: 95,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth: 500,
        targetHeight: 500
      }).then((imagen) => {
        console.log(imagen);
        this.image = "data:image/jpeg;base64," + imagen;
      }, (err) => {
        console.log(err);
      });
    } else {

    }
  }
}