export class Marker extends Realm.Object {
  static schema = {
    name: "Marker",
    properties: {
      _id: 'objectId',
      plant: "Plant",
      coordinate: "string",
      realm_id: "string?",
    },
    primaryKey: '_id',
  };
}
