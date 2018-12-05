const Model = require("objection").Model;

// her injecter vi models metoder ind i denne user klasse
class User extends Model {

    static get tableName() {
        return 'users';
      }

    // denne funktion er en måde hvorpå databasens objekter bliver repræsenteret i Json-format
    static get jsonSchema() {
        return {
            type: 'object',
            require: ['username', 'password'],

            properties: {
                id: {type: 'integer'},
                username: {type: 'string'},
                password: {type: 'string'} 
            }
        }
    } 
}

module.exports = User;

