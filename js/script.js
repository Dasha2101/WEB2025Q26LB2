const page = document.createElement('main');
page.className = 'page';

const header = document.createElement('header');
header.className = 'page-header';

const title = document.createElement('h1');
title.className = 'page-title';
title.textContent = 'Мои задачи';

const description = document.createElement('p');
description.className = 'page-description';
description.textContent = 'Простой to-do list на каждый день';
header.append(title, description);

const panel = document.createElement('section');
panel.className = 'todo-panel';
panel.setAttribute('aria-label', 'Список');

const taskForm = document.createElement('form');
taskForm.className = 'task-form';
taskForm.addEventListener('submit', (event) => event.preventDefault());

function createField(labelText, input, id) {
    const field = document.createElement('div');
    field.className = 'field';
    const label = document.createElement('label');
    label.className = 'field-label';
    label.htmlFor = id;
    label.textContent = labelText;
    input.id = id;
    field.append(label, input);
    return field;
}

const taskTitleInput = document.createElement('input');
taskTitleInput.className = 'text-input';
taskTitleInput.type = 'text';
taskTitleInput.name = 'title';
taskTitleInput.placeholder = 'Например, подготовить отчёт';
taskTitleInput.required = true;

const taskDateInput = document.createElement('input');
taskDateInput.className = 'text-input';
taskDateInput.type = 'date';
taskDateInput.name = 'date';

const addButton = document.createElement('button');
addButton.className = 'primary-button';
addButton.type = 'submit';
addButton.textContent = 'Добавить';
taskForm.append(
    createField('Новая задача', taskTitleInput, 'task-title'),
    createField('Дата', taskDateInput, 'task-date'),
    addButton
);

const toolbar = document.createElement('div');
toolbar.className = 'toolbar';
const searchInput = document.createElement('input');
searchInput.className = 'text-input';
searchInput.type = 'search';
searchInput.placeholder = 'Поиск по названию';
searchInput.setAttribute('aria-label', 'Поиск по названию');

function createSelect(label, choices) {
    const select = document.createElement('select');
    select.className = 'select-input';
    select.setAttribute('aria-label', label);
    choices.forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        select.append(option);
    });
    return select;
}

const statusSelect = createSelect('Фильтр по статусу', [
    ['all', 'Все задачи'],
    ['active', 'Невыполненные'],
    ['completed', 'Выполненные']
]);
const sortSelect = createSelect('Сортировка задач', [
    ['date-asc', 'Сначала ближайшие'],
    ['date-desc', 'Сначала поздние']
]);
toolbar.append(searchInput, statusSelect, sortSelect);

const taskList = document.createElement('ul');
taskList.className = 'task-list';
taskList.setAttribute('aria-live', 'polite');
const emptyState = document.createElement('li');
emptyState.className = 'empty-state';
emptyState.textContent = 'Пока задач нет. Добавьте первую задачу.';
taskList.append(emptyState);

panel.append(taskForm, toolbar, taskList);
page.append(header, panel);
document.body.append(page);
