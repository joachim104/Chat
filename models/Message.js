const Model = require("objection").Model;

class Message extends Model {
    static get tableName() {
        return 'messages';
      }

<<<<<<< HEAD
=======
      // denne funktion er en måde hvorpå databasens objekter bliver repræsenteret i Json-format
>>>>>>> 6888eb111e874c52bf8c399a9b31c80df5f32333
    static get jsonSchema() {
        return {
            type: "object",
            require: ['id', 'message', 'user-id', 'room-id'],

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