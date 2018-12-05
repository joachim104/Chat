const Model = require("objection").Model;

class Room extends Model {

    static get tableName() {
        return 'rooms';
      }

    // denne funktion er en måde hvorpå databasens objekter bliver repræsenteret i Json-format
    static get jsonSchema() {
        return {
            type: 'object',
            require: ['id', 'name'],

            properties: {
                id: {type: 'integer'},
                name: {type: 'string'}
            }
        }
    } 
}

module.exports = Room;