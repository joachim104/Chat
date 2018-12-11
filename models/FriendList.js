const Model = require("objection").Model;

class FriendList extends Model {
    static get tableName() {
        return 'room_user';
      }

      // denne funktion er en måde hvorpå databasens objekter bliver repræsenteret i Json-format
    static get jsonSchema() {
        return {
            type: "object",
            // require: ["id", 'user-id', 'room-id'],

            properties: {
                id: {type: 'integer'},
                room_id: {type: 'integer'},
                user_id: {type: 'integer'}

            }

            
        }
    }
}

module.exports = RoomUser;