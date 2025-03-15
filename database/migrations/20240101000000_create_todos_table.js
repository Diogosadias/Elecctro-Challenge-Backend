exports.up = function(knex) {
    return knex.schema.createTable('todos', table => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('description',255).notNullable();
        table.string('state').defaultTo('INCOMPLETE').defaultTo('INCOMPLETE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('completed_at');
        
        table.index(['created_at'], 'idx_todos_created_at');
        table.index(['state'], 'idx_todos_state');
    });
    
};

exports.down = function(knex) {
    return knex.schema.dropTable('todos');
}; 