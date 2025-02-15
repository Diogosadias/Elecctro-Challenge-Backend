import { v4 as uuidv4 } from 'uuid';

/**
 * Representa um item Todo na aplicação
 * @class
 */
class Todo {
    /**
     * Cria uma nova instância de Todo
     * @constructor
     * @param {string} description - A descrição da tarefa
     * @throws {Error} Se a descrição estiver vazia ou não for uma string
     * @property {string} id - Identificador único UUID v4
     * @property {('INCOMPLETE')} state - Estado atual do Todo
     * @property {string} description - Descrição da tarefa
     * @property {string} createdAt - Data de criação em formato ISO
     * @property {string|null} completedAt - Data de conclusão em formato ISO
     */
    constructor(description) {
        if (!description || typeof description !== 'string') {
            throw new Error('Description is required and must be a string');
        }

        this.id = uuidv4();
        this.state = 'INCOMPLETE';
        this.description = description;
        this.createdAt = new Date().toISOString();
        this.completedAt = null;
    }
}

export default Todo; 