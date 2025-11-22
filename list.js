class ToDo {
    constructor() {
        this.tasks = [];
        this.sortBy = 'default';
        this.filterBy = 'all';
        this.searchQuery = '';
        this.draggedItem = null;
        this.init();
    }

    init() {
        this.loadTasksFromStorage();
        this.createStructure();
        this.setupEventListeners();
        this.renderTasks();
    }

    //загружаем и сохраняем задачи в local storage
    loadTasksFromStorage() {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            try {
                this.tasks = JSON.parse(savedTasks);
                //даты в формате строки надо преобразовать в date!
                this.tasks.forEach(task => {
                    if (typeof task.createdAt === 'string') {
                    }
                });
            } catch (error) {
                console.error('Ошибка при загрузке задач:', error);
                this.tasks = [];
            }
        }
    }

    saveTasksToStorage() {
        try {
            localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Ошибка при сохранении задач:', error);//если будут ошибки надо понять какие...
        }
    }


    createStructure() {
        const container = document.createElement('div');
        container.className = 'todo-container'; 
        document.body.appendChild(container);

        const header = document.createElement('h1');
        header.textContent = 'ToDo List';
        container.appendChild(header);

        //поиск по названию
        const searchGroup = document.createElement('div');
        searchGroup.className = 'search-group';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'searchInput';
        searchInput.placeholder = 'Поиск задачи';
        searchInput.className = 'search-input';

        const clearSearchBtn = document.createElement('button');
        clearSearchBtn.id = 'clearSearchBtn';
        clearSearchBtn.textContent = '×';
        clearSearchBtn.className = 'clear-search-btn';
        clearSearchBtn.style.display = 'none';//пока прячем

        searchGroup.appendChild(searchInput);
        searchGroup.appendChild(clearSearchBtn);
        container.appendChild(searchGroup);


        //тут первичные элементы - добавляем новую задачу
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.id = 'taskInput';
        taskInput.placeholder = 'Новая задача';

        const addButton = document.createElement('button');
        addButton.id = 'addTaskBtn';
        addButton.textContent = 'Добавить';

        // собираем форму для добавления
        inputGroup.appendChild(taskInput);
        inputGroup.appendChild(addButton);
        container.appendChild(inputGroup);


    //панель управления задачи
    const controlPanel = document.createElement('div');
    controlPanel.className = 'control-panel';

        
        //список фильтров
        const filterToggleBtn = document.createElement('button');
        filterToggleBtn.id = 'filterToggleBtn';
        filterToggleBtn.textContent = 'Фильтры';
        filterToggleBtn.className = 'sort-btn';
        controlPanel.appendChild(filterToggleBtn);//
        
        const filterDropdown = document.createElement('div');
        filterDropdown.id = 'filterDropdown';
        filterDropdown.className = 'filter-dropdown';
        filterDropdown.style.display = 'none';

        const filterTitle = document.createElement('div');
        filterTitle.className = 'filter-title';
        filterTitle.textContent = 'Фильтровать задачи:';

        const filterAllBtn = document.createElement('button');
        filterAllBtn.id = 'filterAllBtn';
        filterAllBtn.textContent = 'Все задачи';
        filterAllBtn.className = 'filter-btn active';

        const filterActiveBtn = document.createElement('button');
        filterActiveBtn.id = 'filterActiveBtn';
        filterActiveBtn.textContent = 'Только активные';
        filterActiveBtn.className = 'filter-btn';

        const filterCompletedBtn = document.createElement('button');
        filterCompletedBtn.id = 'filterCompletedBtn';
        filterCompletedBtn.textContent = 'Только выполненные';
        filterCompletedBtn.className = 'filter-btn';

        const resetFilterBtn = document.createElement('button');
        resetFilterBtn.id = 'resetFilterBtn';
        resetFilterBtn.textContent = 'Сбросить фильтры';
        resetFilterBtn.className = 'reset-filter-btn';

        filterDropdown.appendChild(filterTitle);
        filterDropdown.appendChild(filterAllBtn);
        filterDropdown.appendChild(filterActiveBtn);
        filterDropdown.appendChild(filterCompletedBtn);
        filterDropdown.appendChild(resetFilterBtn);
        controlPanel.appendChild(filterDropdown);//

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
        controlPanel.appendChild(sortGroup);//
    
        container.appendChild(controlPanel);//

        const tasksContainer = document.createElement('div');
        tasksContainer.className = 'tasks-container';

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
        //обработчики для поиска
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTasks(e.target.value);
        });

        document.getElementById('clearSearchBtn').addEventListener('click', () => {
            this.clearSearch();
        });
        
        //обработчики для сортировки
        document.getElementById('sortByDateBtn').addEventListener('click', () => {
            this.sortTasksByDate();
        });

        document.getElementById('sortByStatusBtn').addEventListener('click', () => {
            this.sortTasksByStatus();
        });

        document.getElementById('resetSortBtn').addEventListener('click', () => {
            this.resetSort();
        });

        //обработчики для фильтрации

        document.getElementById('filterToggleBtn').addEventListener('click', () => {
            this.toggleFilterDropdown();
        });

        document.getElementById('filterAllBtn').addEventListener('click', () => {
            this.filterTasks('all');
        });

        document.getElementById('filterActiveBtn').addEventListener('click', () => {
            this.filterTasks('active');
        });

        document.getElementById('filterCompletedBtn').addEventListener('click', () => {
            this.filterTasks('completed');
        });

        document.getElementById('resetFilterBtn').addEventListener('click', () => {
            this.resetFilter();
        });
    }

    //Методы для drag and drop
    handleDragStart(e) {
        this.draggedItem = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        
        //нужно установить данные, которые будем переносить
        const taskId = parseInt(e.target.dataset.id);
        e.dataTransfer.setData('text/plain', taskId.toString());
    }

    //перетаскивание над элементом
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';   
        const afterElement = this.getDragAfterElement(e.clientY);
        const taskList = document.getElementById('taskList');
        
        if (afterElement == null) {
            taskList.appendChild(this.draggedItem);
        } else {
            taskList.insertBefore(this.draggedItem, afterElement);
        }
    }

    //ищем позицию для вставки
    getDragAfterElement(y) {
        const draggableElements = [...document.querySelectorAll('.task-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        
        this.updateTaskOrder();
        this.saveTasksToStorage();
    }

    updateTaskOrder() {
        const taskItems = document.querySelectorAll('.task-item');
        const newOrder = [];
        
        taskItems.forEach(item => {
            const taskId = parseInt(item.dataset.id);
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                newOrder.push(task);
            }
        });
        
        this.tasks = newOrder;
    }



    //методы для поиска
    searchTasks(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.renderTasks();
        this.updateSearch();
    }

    clearSearch() {
        this.searchQuery = '';
        document.getElementById('searchInput').value = '';
        this.renderTasks();
        this.updateSearch();
    }

    updateSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        
        if (this.searchQuery) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }

    // Получение задач с учетом поиска
    getSearchedTasks(tasks) {
        if (!this.searchQuery) {
            return tasks;
        }
        
        return tasks.filter(task => 
            task.title.toLowerCase().includes(this.searchQuery)
        );
    }
   
    //выпадающий список
    toggleFilterDropdown() {
        const dropdown = document.getElementById('filterDropdown');
        const toggleBtn = document.getElementById('filterToggleBtn');
        
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            
        } else {
            dropdown.style.display = 'block';
            
        }
    }


    filterTasks(filterType) {
        this.filterBy = filterType;
        this.renderTasks();
        this.updateFilterButtons();
        // Закрываем выпадающий список после выбора
        document.getElementById('filterDropdown').style.display = 'none';
        document.getElementById('filterToggleBtn').textContent = 'Фильтры';
    }

    resetFilter() {
        this.filterBy = 'all';
        this.renderTasks();
        this.updateFilterButtons();
        document.getElementById('filterDropdown').style.display = 'none';
        document.getElementById('filterToggleBtn').textContent = 'Фильтры';
    }

    updateFilterButtons() {
        const filterAllBtn = document.getElementById('filterAllBtn');
        const filterActiveBtn = document.getElementById('filterActiveBtn');
        const filterCompletedBtn = document.getElementById('filterCompletedBtn');

        //сброс состояний
        filterAllBtn.classList.remove('active');
        filterActiveBtn.classList.remove('active');
        filterCompletedBtn.classList.remove('active');

        //какое сейчас состояние фильтра?
        switch (this.filterBy) {
            case 'all':
                filterAllBtn.classList.add('active');
                break;
            case 'active':
                filterActiveBtn.classList.add('active');
                break;
            case 'completed':
                filterCompletedBtn.classList.add('active');
                break;
        }
    }

    getFilteredTasks() {
        switch (this.filterBy) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'all':
            default:
                return this.tasks;
        }
    }

    //по новому сортируем тк теперь еще учитываем фильтры
    applySorting(tasks) {
        switch (this.sortBy) {
            case 'date':
                return tasks.sort((a, b) => {
                    const dateA = new Date(a.createdAt.replace(/(\d+).(\d+).(\d+), (\d+):(\d+):(\d+)/, '$3-$2-$1T$4:$5:$6'));
                    const dateB = new Date(b.createdAt.replace(/(\d+).(\d+).(\d+), (\d+):(\d+):(\d+)/, '$3-$2-$1T$4:$5:$6'));
                    return dateB - dateA; // сначала новые
                });
            case 'status':
                return tasks.sort((a, b) => {
                    if (a.completed && !b.completed) return 1;
                    if (!a.completed && b.completed) return -1;
                    return 0;
                });
            default:
                return tasks.sort((a, b) => a.id - b.id);
        }
    }


    sortTasksByDate() {
        this.sortBy = 'date';
        this.renderTasks();
        this.updateSortButtons();
    }

    //сорт. по статусу
    sortTasksByStatus() {
        this.sortBy = 'status';
        this.renderTasks();
        this.updateSortButtons();
    }

    //сброс сортировки
    resetSort() {
        this.sortBy = 'default';
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
                break;
            case 'status':
                sortByStatusBtn.classList.add('active');
                break;
            default:
                resetSortBtn.classList.add('active');
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
        this.saveTasksToStorage();
        this.renderTasks();

        // очищаем поле после ввода
        taskInput.value = '';
        taskInput.focus();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasksToStorage();
        this.renderTasks();
    }

    TaskCompletion(id) {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
                this.saveTasksToStorage();
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
            this.saveTasksToStorage();
        }

        this.renderTasks();
    }

    // отображение всех задач
    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        let tasksToRender = this.getFilteredTasks();
        //применить поиск сюда
        tasksToRender = this.getSearchedTasks(tasksToRender);

        //применяем сортировку
        tasksToRender = this.applySorting([...tasksToRender]);
        // если нет задач
        if (tasksToRender.length === 0) {
            const emptyMessage = document.createElement('li');
            switch (this.filterBy) {
                case 'active':
                    emptyMessage.textContent = 'Нет активных задач';
                    break;
                case 'completed':
                    emptyMessage.textContent = 'Нет выполненных задач';
                    break;
                default:
                    emptyMessage.textContent = 'Нет задач';
            }
            taskList.appendChild(emptyMessage);
            this.updateFilterButtons();
            this.updateSortButtons();
            return;
        }
        

        //индикатор фильтров и сортировки
        const infoIndicator = document.createElement('div');
        infoIndicator.className = 'info-indicator';
        
        let filterText = '';
        switch (this.filterBy) {
            case 'active':
                filterText = 'Активные задачи';
                break;
            case 'completed':
                filterText = 'Выполненные задачи';
                break;
            default:
                filterText = 'Все задачи';
        }
        
        let sortText = '';
        switch (this.sortBy) {
            case 'date':
                sortText = ' (отсортировано по дате)';
                break;
            case 'status':
                sortText = ' (отсортировано по статусу)';
                break;
            default:
                sortText = '';
        }

        infoIndicator.textContent = `${filterText}${sortText}`;
        taskList.appendChild(infoIndicator);

        //информацию из поиска в инфоиндикатор - по нему ищем
        let searchText = '';
        if (this.searchQuery) {
            searchText = ` по запросу "${this.searchQuery}"`;
        }

        infoIndicator.textContent = `${filterText}${searchText}${sortText}`;
        taskList.appendChild(infoIndicator);
        
        // на каждое - элемент
        tasksToRender.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
            taskItem.dataset.id = task.id;
            //атрибуты для drag and drop
            taskItem.draggable = true;
            taskItem.addEventListener('dragstart', (e) => this.handleDragStart(e));
            taskItem.addEventListener('dragend', (e) => this.handleDragEnd(e));

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

        });

            //это обработчик для контейнера, где хранится список
            taskList.addEventListener('dragover', (e) => this.handleDragOver(e));

            this.updateFilterButtons();
            this.updateSortButtons();
            this.updateSearch();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ToDo();
});