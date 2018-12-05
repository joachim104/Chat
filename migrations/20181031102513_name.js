
exports.up = function(knex, Promise) {
	return knex.schema
	.createTable('users', function(table) {
		table.increments('id').primary();
        table.string('username');
        table.string('password'); 
    })
    .createTable('messages', function(table) {
		table.increments('id').primary();
        table.string('message');
        table.string('user_id');
        table.string('room_id'); 
    })
    .createTable('rooms', function(table) {
		table.increments('id').primary();
        table.string('name');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
      .dropTableIfExists('users')
      .dropTableIfExists('messages')
      .dropTableIfExists('rooms');
};
