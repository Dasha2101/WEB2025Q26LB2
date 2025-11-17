class ToDo {
    constructor() {
        this.tasks = [];
        this.sortBy = 'default';
        this.init();
    }

    init() {
        this.createStructure();
        this.setupEventListeners();
        this.renderTasks();
    }

    createStructure() {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const header = document.createElement('h1');
        header.textContent = 'ToDo List';
        container.appendChild(header);

        const inputGroup = document.createElement('div');

        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.id = 'taskInput';

        const addButton = document.createElement('button');
        addButton.id = 'addTaskBtn';
        addButton.textContent = 'Добавить';

        // собираем форму для добавления
        inputGroup.appendChild(taskInput);
        inputGroup.appendChild(addButton);
        container.appendChild(inputGroup);


        //кнопки сортировки
        const sortGroup = document.createElement('div');
        sortGroup.className = 'sort-group';

        const sortByDateBtn = document.createElement('button');
        sortByDateBtn.id = 'sortByDateBtn';
        sortByDateBtn.textContent = 'Сортировать по дате';
        sortByDateBtn.className = 'sort-btn';

        const sortByStatusBtn = document.createElement('button');
        sortByStatusBtn.id = 'sortByStatusBtn';
        sortByStatusBtn.textContent = 'Сначала незавершенные';
        sortByStatusBtn.className = 'sort-btn';

        const resetSortBtn = document.createElement('button');
        resetSortBtn.id = 'resetSortBtn';
        resetSortBtn.textContent = 'Сбросить сортировку';
        resetSortBtn.className = 'sort-btn';

        sortGroup.appendChild(sortByDateBtn);
        sortGroup.appendChild(sortByStatusBtn);
        sortGroup.appendChild(resetSortBtn);
        container.appendChild(sortGroup);

        const tasksContainer = document.createElement('div');

        const taskList = document.createElement('ul');
        taskList.id = 'taskList';

        tasksContainer.appendChild(taskList);
        container.appendChild(tasksContainer);
    }

    setupEventListeners() {
        // добавляем задачу по нажатию
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.addTask();
        });
        
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        document.getElementById('sortByDateBtn').addEventListener('click', () => {
            this.sortTasksByDate();
        });

        document.getElementById('sortByStatusBtn').addEventListener('click', () => {
            this.sortTasksByStatus();
        });

        document.getElementById('resetSortBtn').addEventListener('click', () => {
            this.resetSort();
        });
    }



    }
    
    sortTasksByDate() {
        this.sortBy = 'date';
        this.tasks.sort((a, b) => {
            const dateA = new Date(a.createdAt.replace(/(\d+).(\d+).(\d+), (\d+):(\d+):(\d+)/, '$3-$2-$1T$4:$5:$6'));
            const dateB = new Date(b.createdAt.replace(/(\d+).(\d+).(\d+), (\d+):(\d+):(\d+)/, '$3-$2-$1T$4:$5:$6'));
            return dateB - dateA; // сначала новые
        });
        this.renderTasks();
        this.updateSortButtons();
    }

    //сорт. по статусу
    sortTasksByStatus() {
        this.sortBy = 'status';
        this.tasks.sort((a, b) => {
            //сперва незавершенные
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return 0;
        });
        this.renderTasks();
        this.updateSortButtons();
    }

    //сброс сортировки
    resetSort() {
        this.sortBy = 'default';
        // Восстанавливаем исходный порядок (по ID - чем больше ID, тем новее задача)
        this.tasks.sort((a, b) => a.id - b.id);
        this.renderTasks();
        this.updateSortButtons();
    }

    //обновление состояний кнопок
    updateSortButtons() {
        const sortByDateBtn = document.getElementById('sortByDateBtn');
        const sortByStatusBtn = document.getElementById('sortByStatusBtn');
        const resetSortBtn = document.getElementById('resetSortBtn');

        //сначвла сбрасываем
        sortByDateBtn.classList.remove('active');
        sortByStatusBtn.classList.remove('active');
        resetSortBtn.classList.remove('active');

        // текущее состояние
        switch (this.sortBy) {
            case 'date':
                sortByDateBtn.classList.add('active');
                sortByDateBtn.textContent = 'По дате';
                break;
            case 'status':
                sortByStatusBtn.classList.add('active');
                sortByStatusBtn.textContent = 'По статусу';
                break;
            default:
                resetSortBtn.classList.add('active');
                resetSortBtn.textContent = 'По умолчанию';
        }
    }


    // новая задача
    addTask() {
        const taskInput = document.getElementById('taskInput');
        const title = taskInput.value.trim();

        if (title === '') {
            alert('Пустое название задачи');
            return;
        }

        const newTask = {
            id: Date.now(),
            title: title,
            completed: false,
            createdAt: new Date().toLocaleString('ru-RU')
        };

        this.tasks.push(newTask);
        this.renderTasks();

        // очищаем поле после ввода
        taskInput.value = '';
        taskInput.focus();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.renderTasks();
    }

    TaskCompletion(id) {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
                this.renderTasks();
            }
        }

    startEditing(taskId) {
        const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);
        if (!taskItem) return;

        const taskTitle = taskItem.querySelector('.task-title');
        const taskDate = taskItem.querySelector('.task-date');
        const editForm = taskItem.querySelector('.edit-form');
        const actionButtons = taskItem.querySelector('.action-buttons');

        taskTitle.style.display = 'none';
        taskDate.style.display = 'none';
        actionButtons.style.display = 'none';
        editForm.style.display = 'block';
    }

    saveEdit(taskId) {
        const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);
        if (!taskItem) return;

        const editTitleInput = taskItem.querySelector('.edit-title-input');
        const editDateInput = taskItem.querySelector('.edit-date-input');
        
        const newTitle = editTitleInput.value.trim();
        const newDate = editDateInput.value;

        if (newTitle === '') {
            alert('Пустое название задачи');
            return;
        }

        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].title = newTitle;
            const date = new Date(newDate);
            this.tasks[taskIndex].createdAt = date.toLocaleString('ru-RU');
        }

        this.renderTasks();
    }

    // отображение всех задач
    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        if (this.tasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Нет задач';
            taskList.appendChild(emptyMessage);
            return;
        }

        // на каждое - элемент
        this.tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
            taskItem.dataset.id = task.id;
            
            // стилизация
            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';
            
            const taskTitle = document.createElement('div');
            taskTitle.className = 'task-title';
            taskTitle.textContent = task.title;

            const taskDate = document.createElement('div');
            taskDate.className = 'task-date';
            taskDate.textContent = `Добавлено: ${task.createdAt}`;

            // скрытая форма для редактирования
            const editForm = document.createElement('div');
            editForm.className = 'edit-form';
            editForm.style.display = 'none';
            
            // поля для ввода
            const editTitleInput = document.createElement('input');
            editTitleInput.type = 'text';
            editTitleInput.className = 'edit-title-input';
            editTitleInput.value = task.title;

            const editDateInput = document.createElement('input');
            editDateInput.type = 'datetime-local';
            editDateInput.className = 'edit-date-input';
            
            // в формат даты
            const date = new Date(task.createdAt.replace(/(\d+).(\d+).(\d+), (\d+):(\d+):(\d+)/, '$3-$2-$1T$4:$5:$6'));
            editDateInput.value = date.toISOString().slice(0, 16);

            const editButtons = document.createElement('div');
            editButtons.className = 'edit-buttons';

            const saveButton = document.createElement('button');
            saveButton.className = 'save-btn';
            saveButton.textContent = 'Сохранить';
            saveButton.addEventListener('click', () => {
                this.saveEdit(task.id);
            });

            editButtons.appendChild(saveButton);
            editForm.appendChild(editTitleInput);
            editForm.appendChild(editDateInput);
            editForm.appendChild(editButtons);

            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons';

            //изменяем статус задачи
            const completeButton = document.createElement('button');
            completeButton.className = `complete-btn ${task.completed ? 'cancel-btn' : ''}`;
            completeButton.textContent = task.completed ? 'Отменить' : 'Выполнено';
            completeButton.addEventListener('click', () => {
                this.TaskCompletion(task.id);
            });


            const editButton = document.createElement('button');
            editButton.className = 'edit-btn';
            editButton.textContent = 'Редактировать';
            editButton.addEventListener('click', () => {
                this.startEditing(task.id);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => {
                this.deleteTask(task.id);
            });

            actionButtons.appendChild(completeButton);
            actionButtons.appendChild(editButton);
            actionButtons.appendChild(deleteButton);

            taskContent.appendChild(taskTitle);
            taskContent.appendChild(taskDate);
            taskContent.appendChild(editForm);

            taskItem.appendChild(taskContent);
            taskItem.appendChild(actionButtons);
            taskList.appendChild(taskItem);

            this.updateSortButtons();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ToDo();
});

