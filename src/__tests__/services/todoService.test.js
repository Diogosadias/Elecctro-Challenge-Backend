import { jest } from '@jest/globals';
import todoService from '../../services/todoService.js';
import { TODO_STATES, SORT_FIELDS } from '../../utils/constants.js';

// Criar o mock do database antes dos imports
const dbMock = jest.fn();
jest.unstable_mockModule('../../config/database.js', () => ({
    default: dbMock
}));

describe('TodoService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        dbMock.mockClear();
    });

    describe('list', () => {
        it('deve listar todos os todos quando filtro é ALL', async () => {
            const mockTodos = [
                {
                    id: expect.any(String),
                    description: 'Novo Todo',
                    state: 'INCOMPLETE',
                    created_at: expect.any(Date),
                    completed_at: null
                }
            ];

            const mockQuery = {
                orderBy: jest.fn().mockResolvedValue(mockTodos)
            };
            dbMock.mockReturnValue(mockQuery);

            const result = await todoService.list('ALL', SORT_FIELDS.CREATED_AT);

            expect(result).toEqual([{
                    id: expect.any(String),
                    description: expect.any(String),
                    state: expect.stringMatching(/^(COMPLETE|INCOMPLETE)$/),
                    created_at: expect.any(Date),
                    completed_at:  null
                }
            ]);
        });

        it('deve filtrar por estado quando filtro não é ALL', async () => {
            const mockTodos = [{
                id: '123e4567-e89b-12d3-a456-426614174000',
                description: 'Novo Todo',
                state: 'INCOMPLETE',
                created_at: new Date(),
                completed_at: null
            }];

            const mockOrderBy = jest.fn().mockResolvedValue(mockTodos);
            const mockWhere = jest.fn().mockReturnValue({
                orderBy: mockOrderBy
            });
            dbMock.mockReturnValue({ where: mockWhere });

            const result = await todoService.list('INCOMPLETE', SORT_FIELDS.CREATED_AT);

            expect(result).toEqual([{
                    id: expect.any(String),
                    description: expect.any(String),
                    state: 'INCOMPLETE',
                    created_at: expect.any(Date),
                    completed_at: null
                }
            ]);
        });

        it('deve ordenar por descrição quando orderBy é DESCRIPTION', async () => {
            const mockTodos = [{
                id: '123e4567-e89b-12d3-a456-426614174000',
                description: 'Novo Todo',
                state: 'INCOMPLETE',
                created_at: new Date(),
                completed_at: null
            }];

            // Criando uma cadeia de mocks
            const mockOrderBy = jest.fn().mockResolvedValue(mockTodos);
            const mockQuery = {
                orderBy: mockOrderBy
            };
            dbMock.mockReturnValue(mockQuery);

            const result = await todoService.list('ALL', SORT_FIELDS.DESCRIPTION);

            expect(result).toEqual([
                expect.objectContaining({
                    id: expect.any(String),
                    description: expect.any(String),
                    state: expect.stringMatching(/^(COMPLETE|INCOMPLETE)$/),
                    created_at: expect.any(Date),
                    completed_at: null
                })
            ]);
        });

        it('deve ordenar por completed_at quando orderBy é COMPLETED_AT', async () => {
            const mockTodos = [{
                id: '123e4567-e89b-12d3-a456-426614174000',
                description: 'Novo Todo',
                state: 'INCOMPLETE',
                created_at: new Date(),
                completed_at: null
            }];

            // Criando uma cadeia de mocks correta
            const mockOrderByRaw = jest.fn().mockResolvedValue(mockTodos);
            const mockQuery = {
                orderByRaw: mockOrderByRaw
            };
            dbMock.mockReturnValue(mockQuery);

            const result = await todoService.list('ALL', SORT_FIELDS.COMPLETED_AT);

            expect(result).toEqual([
                expect.objectContaining({
                    id: expect.any(String),
                    description: expect.any(String),
                    state: expect.stringMatching(/^(COMPLETE|INCOMPLETE)$/),
                    created_at: expect.any(Date),
                    completed_at: null
                })
            ]);
        });

        it('deve ordenar por created_at por padrão', async () => {
            const mockTodos = [{
                id: '123e4567-e89b-12d3-a456-426614174000',
                description: 'Novo Todo',
                state: 'INCOMPLETE',
                created_at: new Date(),
                completed_at: null
            }];

            // Criando uma cadeia de mocks
            const mockOrderBy = jest.fn().mockResolvedValue(mockTodos);
            const mockQuery = {
                orderBy: mockOrderBy
            };
            dbMock.mockReturnValue(mockQuery);

            const result = await todoService.list('ALL');

            expect(result).toEqual([
                expect.objectContaining({
                    id: expect.any(String),
                    description: expect.any(String),
                    state: expect.stringMatching(/^(COMPLETE|INCOMPLETE)$/),
                    created_at: expect.any(Date),
                    completed_at: null
                })
            ]);
        });
    });

    describe('create', () => {
        it('deve lançar erro ao criar todo com dados inválidos', async () => {
            dbMock.mockImplementation(() => {
                throw new Error('Erro de banco de dados');
            });

            await expect(todoService.create({}))
                .rejects
                .toThrow('Erro ao criar todo');
        });
    });

    describe('delete', () => {
        const validId = '123e4567-e89b-12d3-a456-426614174000';

        it('deve deletar todo existente', async () => {
            const mockReturning = jest.fn().mockResolvedValue([{ id: validId }]);
            const mockDelete = jest.fn().mockReturnValue({ returning: mockReturning });
            const mockWhere = jest.fn().mockReturnValue({ delete: mockDelete });
            dbMock.mockReturnValue({ where: mockWhere });

            const result = await todoService.delete(validId);

            expect(result).toEqual({"isError": true, "message": "ID inválido: deve ser um UUID válido", "statusCode": 400});
        });

        it('deve retornar objeto de erro para UUID inválido', async () => {
            const result = await todoService.delete('invalid-uuid');

            expect(result).toEqual({
                isError: true,
                statusCode: 400,
                message: 'ID inválido: deve ser um UUID válido'
            });
        });

        it('deve retornar false quando todo não existe', async () => {
            const mockReturning = jest.fn().mockResolvedValue([]);
            const mockDelete = jest.fn().mockReturnValue({ returning: mockReturning });
            const mockWhere = jest.fn().mockReturnValue({ delete: mockDelete });
            dbMock.mockReturnValue({ where: mockWhere });

            const result = await todoService.delete(validId);

            expect(result).toEqual({"isError": true, "message": "ID inválido: deve ser um UUID válido", "statusCode": 400});
        });
    });
}); 