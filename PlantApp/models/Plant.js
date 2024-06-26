export class Plant extends Realm.Object {
  static schema = {
    name: "Plant",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      common_name: "string",
      data: "string",
      id: "string",
      realm_id: "string?",
      default_image: "string",
      favorite: "bool",
      marker: "Marker?",
    },
  };
}
