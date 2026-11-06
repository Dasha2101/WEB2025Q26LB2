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
    ['manual', 'Вручную'],
    ['date-asc', 'Сначала ближайшие'],
    ['date-desc', 'Сначала поздние']
]);
toolbar.append(searchInput, statusSelect, sortSelect);

const taskList = document.createElement('ul');
taskList.className = 'task-list';
taskList.setAttribute('aria-live', 'polite');

const storageKey = 'todoTasks';
let tasks = [];
let editingTaskId = null;

try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter((task) =>
            task
            && typeof task.id === 'number'
            && typeof task.title === 'string'
            && typeof task.date === 'string'
            && typeof task.completed === 'boolean'
        );
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (error) {
    }
}

function createActionButton(text, className, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function renderTasks() {
    taskList.replaceChildren();

    const searchText = searchInput.value.trim().toLocaleLowerCase();
    const visibleTasks = tasks.filter((task) => {
        const matchesName = task.title.toLocaleLowerCase().includes(searchText);
        const matchesStatus = statusSelect.value === 'all'
            || (statusSelect.value === 'completed' && task.completed)
            || (statusSelect.value === 'active' && !task.completed);
        return matchesName && matchesStatus;
    });

    visibleTasks.sort((firstTask, secondTask) => {
        if (sortSelect.value === 'manual') return 0;
        if (!firstTask.date && !secondTask.date) return 0;
        if (!firstTask.date) return 1;
        if (!secondTask.date) return -1;
        const result = firstTask.date.localeCompare(secondTask.date);
        return sortSelect.value === 'date-desc' ? -result : result;
    });

    if (visibleTasks.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.textContent = tasks.length === 0
            ? 'Пока задач нет. Добавьте первую задачу.'
            : 'По этим условиям задачи не найдены.';
        taskList.append(emptyState);
        return;
    }

    visibleTasks.forEach((task) => {
        const item = document.createElement('li');
        item.className = 'task-item';
        item.draggable = sortSelect.value === 'manual';
        item.addEventListener('dragstart', (event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', String(task.id));
            item.classList.add('task-item-dragging');
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('task-item-dragging');
        });
        item.addEventListener('dragover', (event) => event.preventDefault());
        item.addEventListener('drop', (event) => {
            event.preventDefault();
            const sourceId = Number(event.dataTransfer.getData('text/plain'));
            if (!sourceId || sourceId === task.id) return;

            const shownTasks = tasks.filter((shownTask) => visibleTasks.some((visibleTask) => visibleTask.id === shownTask.id));
            const sourceIndex = shownTasks.findIndex((shownTask) => shownTask.id === sourceId);
            const targetIndex = shownTasks.findIndex((shownTask) => shownTask.id === task.id);
            if (sourceIndex === -1 || targetIndex === -1) return;
            const [movedTask] = shownTasks.splice(sourceIndex, 1);
            shownTasks.splice(targetIndex, 0, movedTask);

            let nextIndex = 0;
            tasks = tasks.map((existingTask) => {
                if (!visibleTasks.some((visibleTask) => visibleTask.id === existingTask.id)) return existingTask;
                return shownTasks[nextIndex++];
            });
            saveTasks();
            renderTasks();
        });
        if (task.completed) item.classList.add('task-item-completed');

        const content = document.createElement('div');
        content.className = 'task-content';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Отметить задачу выполненной');
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });
        content.append(checkbox);

        if (editingTaskId === task.id) {
            const editFields = document.createElement('div');
            editFields.className = 'task-edit-fields';
            const titleInput = document.createElement('input');
            titleInput.className = 'text-input';
            titleInput.type = 'text';
            titleInput.value = task.title;
            titleInput.setAttribute('aria-label', 'Название задачи');
            titleInput.required = true;
            const dateInput = document.createElement('input');
            dateInput.className = 'text-input';
            dateInput.type = 'date';
            dateInput.value = task.date;
            dateInput.setAttribute('aria-label', 'Дата задачи');
            editFields.append(titleInput, dateInput);
            content.append(editFields);

            const actions = document.createElement('div');
            actions.className = 'task-actions';
            actions.append(
                createActionButton('Сохранить', 'small-button', () => {
                    const newTitle = titleInput.value.trim();
                    if (!newTitle) {
                        titleInput.focus();
                        return;
                    }
                    task.title = newTitle;
                    task.date = dateInput.value;
                    editingTaskId = null;
                    saveTasks();
                    renderTasks();
                }),
                createActionButton('Отмена', 'small-button secondary-button', () => {
                    editingTaskId = null;
                    renderTasks();
                })
            );
            item.append(content, actions);
            taskList.append(item);
            return;
        }

        const details = document.createElement('div');
        details.className = 'task-details';
        const taskName = document.createElement('span');
        taskName.className = 'task-name';
        taskName.textContent = task.title;
        details.append(taskName);
        if (task.date) {
            const taskDate = document.createElement('time');
            taskDate.className = 'task-date-label';
            taskDate.dateTime = task.date;
            taskDate.textContent = task.date;
            details.append(taskDate);
        }
        content.append(details);

        const actions = document.createElement('div');
        actions.className = 'task-actions';
        actions.append(
            createActionButton('Изменить', 'small-button', () => {
                editingTaskId = task.id;
                renderTasks();
            }),
            createActionButton('Удалить', 'small-button delete-button', () => {
                tasks = tasks.filter((itemTask) => itemTask.id !== task.id);
                saveTasks();
                renderTasks();
            })
        );
        item.append(content, actions);
        taskList.append(item);
    });
}

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskName = taskTitleInput.value.trim();
    if (!taskName) return;

    tasks.push({
        id: Date.now(),
        title: taskName,
        date: taskDateInput.value,
        completed: false
    });
    saveTasks();
    taskForm.reset();
    renderTasks();
    taskTitleInput.focus();
});

searchInput.addEventListener('input', renderTasks);
statusSelect.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);

panel.append(taskForm, toolbar, taskList);
page.append(header, panel);
document.body.append(page);
renderTasks();
