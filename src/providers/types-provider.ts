import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class TypesProvider {

  types:FirebaseListObservable<any[]>; 
  subtypes:FirebaseListObservable<any[]>; 

  constructor(public af: AngularFire) {
    this.types = af.database.list('/types');
    this.subtypes = af.database.list('/taskSubtypes');

  }

  getTypesRef() {
    return this.types;
  }


  addNewType(name) {

    let type = {
      typeName: name,
    };

    this.types.push(type);
  };

  addNewSubtype(name,subName) {

    let subtype = {
          typeName: name,
          subtypeName:subName
    };

        this.subtypes.push(subtype);
  };

  editType(key,newName) {
    this.types.update(key,{typeName: newName });
  };

  editSubtype(key,newName) {
    this.subtypes.update(key,{subtypeName: newName });
  };

  removeType(key) {
    this.types.remove(key);
  };
   
  removeSubyype(key) {
    this.subtypes.remove(key);
  };

}
