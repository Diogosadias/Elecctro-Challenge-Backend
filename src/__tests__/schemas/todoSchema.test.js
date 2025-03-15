import { todoResponseSchema, todoExample } from '../../schemas/todoSchema.js';

describe('Todo Schema', () => {
    describe('todoResponseSchema', () => {
        it('should validate a correct todo object', () => {
            const validTodo = {
                id: '123e4567-e89b-42d3-a456-556642440000',
                description: 'Test todo',
                state: 'INCOMPLETE',
                created_at: '2024-03-15T10:00:00Z',
                completed_at: null
            };

            const { error } = todoResponseSchema.validate(validTodo);
            expect(error).toBeUndefined();
        });

        describe('id validation', () => {
            it('should require id to be present', () => {
                const todoWithoutId = { ...todoExample };
                delete todoWithoutId.id;

                const { error } = todoResponseSchema.validate(todoWithoutId);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"id" is required');
            });

            it('should require id to be a valid UUID v4', () => {
                const todoWithInvalidId = {
                    ...todoExample,
                    id: 'invalid-uuid'
                };

                const { error } = todoResponseSchema.validate(todoWithInvalidId);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"id" must be a valid GUID');
            });
        });

        describe('description validation', () => {
            it('should require description to be present', () => {
                const todoWithoutDescription = { ...todoExample };
                delete todoWithoutDescription.description;

                const { error } = todoResponseSchema.validate(todoWithoutDescription);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"description" is required');
            });

            it('should require description to be at least 3 characters', () => {
                const todoWithShortDescription = {
                    ...todoExample,
                    description: 'ab'
                };

                const { error } = todoResponseSchema.validate(todoWithShortDescription);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"description" length must be at least 3 characters long');
            });

            it('should not allow description longer than 255 characters', () => {
                const longDescription = 'a'.repeat(256);
                const todoWithLongDescription = {
                    ...todoExample,
                    description: longDescription
                };

                const { error } = todoResponseSchema.validate(todoWithLongDescription);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"description" length must be less than or equal to 255 characters long');
            });
        });

        describe('state validation', () => {
            it('should require state to be present', () => {
                const todoWithoutState = { ...todoExample };
                delete todoWithoutState.state;

                const { error } = todoResponseSchema.validate(todoWithoutState);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"state" is required');
            });

            it('should only allow valid states', () => {
                const todoWithInvalidState = {
                    ...todoExample,
                    state: 'INVALID_STATE'
                };

                const { error } = todoResponseSchema.validate(todoWithInvalidState);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"state" must be one of [COMPLETE, INCOMPLETE]');
            });

            it('should accept both valid states', () => {
                const states = ['COMPLETE', 'INCOMPLETE'];

                states.forEach(state => {
                    const todo = { ...todoExample, state };
                    const { error } = todoResponseSchema.validate(todo);
                    expect(error).toBeUndefined();
                });
            });
        });

        describe('timestamps validation', () => {
            it('should require created_at to be present', () => {
                const todoWithoutCreatedAt = { ...todoExample };
                delete todoWithoutCreatedAt.created_at;

                const { error } = todoResponseSchema.validate(todoWithoutCreatedAt);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"created_at" is required');
            });

            it('should require created_at to be a valid ISO date', () => {
                const todoWithInvalidCreatedAt = {
                    ...todoExample,
                    created_at: 'invalid-date'
                };

                const { error } = todoResponseSchema.validate(todoWithInvalidCreatedAt);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"created_at" must be in ISO 8601 date format');
            });

            it('should allow completed_at to be null', () => {
                const todoWithNullCompletedAt = {
                    ...todoExample,
                    completed_at: null
                };

                const { error } = todoResponseSchema.validate(todoWithNullCompletedAt);
                expect(error).toBeUndefined();
            });

            it('should require completed_at to be a valid ISO date when present', () => {
                const todoWithInvalidCompletedAt = {
                    ...todoExample,
                    completed_at: 'invalid-date'
                };

                const { error } = todoResponseSchema.validate(todoWithInvalidCompletedAt);
                expect(error).toBeDefined();
                expect(error.details[0].message).toContain('"completed_at" must be in ISO 8601 date format');
            });
        });
    });

    describe('todoExample', () => {
        it('should be a valid todo object according to schema', () => {
            const { error } = todoResponseSchema.validate(todoExample);
            expect(error).toBeUndefined();
        });

        it('should contain all required fields', () => {
            const requiredFields = ['id', 'description', 'state', 'created_at', 'completed_at'];
            requiredFields.forEach(field => {
                expect(todoExample).toHaveProperty(field);
            });
        });
    });
}); 