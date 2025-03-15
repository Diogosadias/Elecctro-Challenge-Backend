import { TODO_STATES, SORT_FIELDS } from '../../utils/constants.js';

describe('Constants', () => {
    describe('TODO_STATES', () => {
        it('should have correct todo states', () => {
            expect(TODO_STATES).toEqual({
                COMPLETE: 'COMPLETE',
                INCOMPLETE: 'INCOMPLETE'
            });
        });

        it('should have exactly two states', () => {
            expect(Object.keys(TODO_STATES)).toHaveLength(2);
        });

        it('should have correct values', () => {
            expect(TODO_STATES.COMPLETE).toBe('COMPLETE');
            expect(TODO_STATES.INCOMPLETE).toBe('INCOMPLETE');
        });

        it('should not have additional states', () => {
            const expectedKeys = ['COMPLETE', 'INCOMPLETE'];
            const actualKeys = Object.keys(TODO_STATES);
            expect(actualKeys.sort()).toEqual(expectedKeys.sort());
        });
    });

    describe('SORT_FIELDS', () => {
        it('should have correct sort fields', () => {
            expect(SORT_FIELDS).toEqual({
                DESCRIPTION: 'DESCRIPTION',
                CREATED_AT: 'CREATED_AT',
                COMPLETED_AT: 'COMPLETED_AT'
            });
        });

        it('should have exactly three sort fields', () => {
            expect(Object.keys(SORT_FIELDS)).toHaveLength(3);
        });

        it('should have correct values', () => {
            expect(SORT_FIELDS.DESCRIPTION).toBe('DESCRIPTION');
            expect(SORT_FIELDS.CREATED_AT).toBe('CREATED_AT');
            expect(SORT_FIELDS.COMPLETED_AT).toBe('COMPLETED_AT');
        });

        it('should not have additional fields', () => {
            const expectedKeys = ['DESCRIPTION', 'CREATED_AT', 'COMPLETED_AT'];
            const actualKeys = Object.keys(SORT_FIELDS);
            expect(actualKeys.sort()).toEqual(expectedKeys.sort());
        });
    });

    describe('Cross-constant validation', () => {
        it('should have no overlapping values between constants', () => {
            const todoStateValues = Object.values(TODO_STATES);
            const sortFieldValues = Object.values(SORT_FIELDS);
            
            // Verifica se não há valores duplicados entre os conjuntos
            const allValues = [...todoStateValues, ...sortFieldValues];
            const uniqueValues = new Set(allValues);
            expect(allValues.length).toBe(uniqueValues.size);
        });

        it('should maintain consistent uppercase format', () => {
            // Verifica se todos os valores estão em maiúsculas
            [...Object.values(TODO_STATES), ...Object.values(SORT_FIELDS)].forEach(value => {
                expect(value).toBe(value.toUpperCase());
            });
        });
    });
}); 