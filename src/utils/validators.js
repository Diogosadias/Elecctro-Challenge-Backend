/**
 * Valida se uma string é um UUID v4 válido
 * @param {string} uuid - String para validar
 * @returns {boolean} true se for um UUID v4 válido, false caso contrário
 */
export const validateUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

/**
 * Valida o estado de um todo
 * @param {string} state - Estado para validar
 * @returns {boolean} true se for um estado válido, false caso contrário
 */
export const validateTodoState = (state) => {
    return ['COMPLETE', 'INCOMPLETE'].includes(state);
}; 