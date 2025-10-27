class ToDo {
    constructor() {
        this.tasks = [];
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
        taskInput.placeholder = 'Новая задача...';

        const addButton = document.createElement('button');
        addButton.id = 'addTaskBtn';
        addButton.textContent = 'Добавить';

        //собираем форму для добавления
        inputGroup.appendChild(taskInput);
        inputGroup.appendChild(addButton);
        container.appendChild(inputGroup);

        const tasksContainer = document.createElement('div');

        const taskList = document.createElement('ul');
        taskList.id = 'taskList';

        tasksContainer.appendChild(taskList);
        container.appendChild(tasksContainer);
    }

    setupEventListeners() {
        //добавляем задачу по нажатию
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.addTask();
        });
    }

    //новая задача
    addTask() {
        const taskInput = document.getElementById('taskInput');
        const title = taskInput.value.trim();

        if (title === '') {
            alert('Пожалуйста, введите название задачи');
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

        //очищаем поле после ввода
        taskInput.value = '';
        taskInput.focus();
    }

    //отображение всех задач
    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        if (this.tasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Нет задач';
            taskList.appendChild(emptyMessage);
            return;
        }

        //на каждое - элемент
        this.tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;
            
            //содержание задачи
            const taskContent = document.createElement('div');
            
            const taskTitle = document.createElement('div');
            taskTitle.textContent = task.title;

            const taskDate = document.createElement('div');
            taskDate.textContent = `Добавлено: ${task.createdAt}`;

            taskContent.appendChild(taskTitle);
            taskContent.appendChild(taskDate);
            taskItem.appendChild(taskContent);

            taskList.appendChild(taskItem);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new ToDo();
});