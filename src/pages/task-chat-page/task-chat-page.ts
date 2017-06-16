import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfileData } from '../../providers/profile-data';
import { ChatProvider } from '../../providers/chat-provider';
import { Camera } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-task-chat-page',
  templateUrl: 'task-chat-page.html',
})
export class TaskChatPage {
  message: string;
  uid:string;
  chats:FirebaseListObservable<any>;  
  image: string;
  key:string;
  admin:boolean;

  @ViewChild(Content) content: Content;
  /**
   * Constructor
   * @param nav 
   * @param params 
   * @param chatProvider 
   * @param af 
   * @param profileData 
   * @param camera 
   * @param platform 
   */
  constructor(public nav:NavController, 
  params:NavParams, 
  public chatProvider:ChatProvider, 
  public af:AngularFire, 
  public profileData:ProfileData, public camera: Camera, public platform: Platform) {
    
    this.uid = profileData.currentUser.uid;
    this.key = params.get("key");
    this.admin = params.get("admin");

    // Get Chat Reference
    chatProvider.getTaskChatRef(this.key)
    .then((chatRef:any) => {  
        this.chats = this.af.database.list(chatRef);
    });
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
  }


  /**
   * Insert message in task chat
   */
  sendMessage() {
    var messageAux = "";
    
    if(this.admin == true){
      messageAux = this.profileData.currentUser.email +" (Admin): "+ this.message;
    }
    else{
      messageAux = this.profileData.currentUser.email +": "+ this.message
    }
      if(this.message) {
          let chat = {
              from: this.uid,
              message: messageAux,
              type: 'message'
          };
          this.chats.push(chat);
          this.message = "";
      }
  };
  
  /**
   * Insert picture in task chat
   */
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
        this.image = "data:image/jpeg;base64," + imagen;
      }, (err) => {
        console.log(err);
      });
    } else {

    }
  }
}