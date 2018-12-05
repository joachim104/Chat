const Model = require("objection").Model;

class Message extends Model {
    static get tableName() {
        return 'messages';
      }

      // denne funktion er en måde hvorpå databasens objekter bliver repræsenteret i Json-format
    static get jsonSchema() {
        return {
            type: "object",
            // require: ['id', 'message', 'user-id', 'room-id'],

            properties: {
                id: {type: 'integer'},
                message: {type: 'string'},
                user_id: {type: 'integer'},
                room_id: {type: 'integer'}
            }

            
        }
    }
}

module.exports = Message;