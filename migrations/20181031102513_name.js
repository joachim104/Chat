exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('users', function(table) {
            table.increments('id').primary();
            table.string('username');
            table.string('password');
        })
        .createTable("friend_list", function(table){
            table.increments("id").primary();
            table.integer("user_id").unsigned().notNullable();
            table.integer("friend_id").unsigned().notNullable();
            table.foreign("user_id").references("users.id");
            table.foreign("friend_id").references("users.id");
        })
        .createTable('rooms', function(table) {
            table.increments('id').primary();
            table.string('name');
            table.string("room_name_id")
        })
        .createTable('messages', function(table) {
            table.increments('id').primary();
            table.string('message');
            table.integer('user_id').unsigned().notNullable();
            table.string('room_id')
            table.foreign('user_id').references('users.id');
        })
};

exports.down = function(knex, Promise) {
    return knex.schema
  	.dropTableIfExists('users')
  	.dropTableIfExists('messages')
  	.dropTableIfExists('rooms')
    .dropTableIfExists("friend_list");
};