import { saveTodos, loadTodos, saveFilter, loadFilter } from './storage.js';

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const doneCount = document.getElementById('doneCount');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = loadTodos();
let currentFilter = loadFilter();  // ✅ Load saved filter

function init() {
    setActiveFilterButton(currentFilter);
    renderTodos();
    setupEventListeners();
}

function setActiveFilterButton(filter) {
    filterBtns.forEach(btn => {
        if (btn.id === `filter-${filter}`) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setupEventListeners() {
    addBtn.addEventListener('click', handleAddTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTodo();
    });
    todoList.addEventListener('click', handleListActions);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
}

function handleAddTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()   // ✅ timestamp added
    };
    todos.push(newTodo);
    saveTodos(todos);
    todoInput.value = '';
    renderTodos();
}

function handleListActions(e) {
    const li = e.target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.classList.contains('delete-btn')) {
        todos = todos.filter(todo => todo.id !== id);
    } else if (e.target.type === 'checkbox') {
        const todo = todos.find(todo => todo.id === id);
        if (todo) todo.completed = e.target.checked;
    }
    saveTodos(todos);
    renderTodos();
}

function handleFilterChange(e) {
    const btn = e.currentTarget;  // ✅ safer than e.target
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.id.replace('filter-', '');
    saveFilter(currentFilter);    // ✅ persist filter
    renderTodos();
}

function renderTodos() {
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    todoList.innerHTML = '';
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo.id;
        li.innerHTML = `
            <input type="checkbox" style="margin-right: 12px; transform: scale(1.2); cursor: pointer;" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.text)}</span>
            <button class="delete-btn">Delete</button>
        `;
        todoList.appendChild(li);
    });
    updateStats();
}

// Simple XSS protection
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function updateStats() {
    const activeTasks = todos.filter(t => !t.completed).length;
    totalCount.textContent = todos.length;
    activeCount.textContent = activeTasks;
    doneCount.textContent = todos.length - activeTasks;
}

init();