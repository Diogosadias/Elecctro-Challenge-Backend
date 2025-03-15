import Joi from 'joi';

export const todoResponseSchema = Joi.object({
    id: Joi.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .description('Todo unique identifier (UUID v4)'),
    
    description: Joi.string()
        .min(3)
        .max(255)
        .required()
        .description('Todo description'),
    
    state: Joi.string()
        .valid('COMPLETE', 'INCOMPLETE')
        .required()
        .description('Current todo state'),
    
    created_at: Joi.date()
        .iso()
        .required()
        .description('Todo creation timestamp'),
    
    completed_at: Joi.date()
        .iso()
        .allow(null)
        .description('Todo completion timestamp, null if not completed')
}).label('Todo').description('Todo item response schema');

export const todoExample = {
    id: '123e4567-e89b-42d3-a456-556642440000',
    description: 'Example todo item',
    state: 'INCOMPLETE',
    created_at: '2024-03-15T10:00:00Z',
    completed_at: null
}; 