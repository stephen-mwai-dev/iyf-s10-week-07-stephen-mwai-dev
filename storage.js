const STORAGE_TODOS = 'premium_todos_v1';
const STORAGE_FILTER = 'premium_filter_v1';

export function saveTodos(todos) {
    try {
        localStorage.setItem(STORAGE_TODOS, JSON.stringify(todos));
    } catch (e) { console.error('Save failed', e); }
}

export function loadTodos() {
    try {
        const data = localStorage.getItem(STORAGE_TODOS);
        return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
}

export function saveFilter(filter) {
    try {
        localStorage.setItem(STORAGE_FILTER, filter);
    } catch (e) { console.error('Save filter failed', e); }
}

export function loadFilter() {
    try {
        return localStorage.getItem(STORAGE_FILTER) || 'all';
    } catch (e) { return 'all'; }
}