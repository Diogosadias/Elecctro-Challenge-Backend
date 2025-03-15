import { validateUUID, validateTodoState } from '../../utils/validators.js';

describe('Validators', () => {
    describe('validateUUID', () => {
        it('should return true for valid UUID v4', () => {
            // Arrange
            const validUUIDs = [
                '123e4567-e89b-42d3-a456-556642440000',
                'c73bcdcc-2669-4bf6-81d3-e4ae73fb11fd',
                '507f191e-a19b-4d63-b5aa-2f855bee6eb6'
            ];

            // Act & Assert
            validUUIDs.forEach(uuid => {
                expect(validateUUID(uuid)).toBe(true);
            });
        });

        it('should return false for invalid UUIDs', () => {
            // Arrange
            const invalidUUIDs = [
                '',                                    // empty string
                'not-a-uuid',                         // invalid format
                '123e4567-e89b-12d3-a456-556642440000', // wrong version (v1)
                '123e4567-e89b-42d3-7456-556642440000', // invalid variant
                null,                                 // null
                undefined,                            // undefined
                '123e4567-e89b-42d3-a456-55664244000'  // too short
            ];

            // Act & Assert
            invalidUUIDs.forEach(uuid => {
                expect(validateUUID(uuid)).toBe(false);
            });
        });
    });

    describe('validateTodoState', () => {
        it('should return true for valid states', () => {
            // Arrange
            const validStates = ['COMPLETE', 'INCOMPLETE'];

            // Act & Assert
            validStates.forEach(state => {
                expect(validateTodoState(state)).toBe(true);
            });
        });

        it('should return false for invalid states', () => {
            // Arrange
            const invalidStates = [
                '',             // empty string
                'COMPLETED',    // wrong spelling
                'IN_PROGRESS', // not allowed state
                'complete',    // wrong case
                'incomplete',  // wrong case
                null,         // null
                undefined,    // undefined
                123          // wrong type
            ];

            // Act & Assert
            invalidStates.forEach(state => {
                expect(validateTodoState(state)).toBe(false);
            });
        });
    });
}); 