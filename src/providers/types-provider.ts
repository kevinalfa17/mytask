import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class TypesProvider {

  types:FirebaseListObservable<any[]>; 
  subtypes:FirebaseListObservable<any[]>; 
  totalSubtypes:FirebaseListObservable<any[]>; 

  /**
   * Constructor
   * @param af 
   */
  constructor(public af: AngularFire) {
    this.types = af.database.list('/types');
    this.totalSubtypes = af.database.list('/subtypes');

  }

  /**
   * Get types from data base
   */
  getTypesRef() {
    return this.types;
  }

  /**
   * Get subtypes from data base
   * @param typeName 
   */
  getSubtypesRef(typeName: string){
    this.subtypes = this.af.database.list('subtypes', {
      query: {
        orderByChild: 'typeName',
        equalTo: typeName
      }
    });
    return this.subtypes;
  }

  /**
   * Create new type in DB
   * @param name 
   */
  addNewType(name) {

    let type = {
      typeName: name,
    };

    this.types.push(type);
  };

  /**
   * Create new subtype in DB
   * @param name 
   * @param subName 
   */
  addNewSubtype(name,subName) {

    let subtype = {
          typeName: name,
          subtypeName:subName
    };

        this.totalSubtypes.push(subtype);
  };

  /**
   * Edit existing type
   * @param key 
   * @param newName 
   */
  editType(key,newName) {
    this.types.update(key,{typeName: newName });
  };

  /**
   * Edit existing subtype
   * @param key 
   * @param newName 
   */
  editSubtype(key,newName) {
    this.subtypes.update(key,{subtypeName: newName });
  };

  /**
   * Remove specific type in DB
   * @param key 
   */
  removeType(key) {
    this.types.remove(key);
  };
   
  /**
   * Remove specific subtype in DB
   * @param key 
   */
  removeSubtype(key) {
    this.subtypes.remove(key);
  };

}
