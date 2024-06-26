export class Person extends Realm.Object {
  static schema = {
    name: "Person",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      email: "string",
      name: "string",
      surname: "string",
      nick: "string",
      age: "int",
    },
  };
}
