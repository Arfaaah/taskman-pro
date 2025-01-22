document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login');
    const registerButton = document.getElementById('register');
    const todoSection = document.getElementById('todo-section');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const taskPrioritySelect = document.getElementById('task-priority');
    const searchInput = document.getElementById('search');

    let token = localStorage.getItem('token');
    let username = localStorage.getItem('username');
    let tasks = [];

    if (token) {
        todoSection.style.display = 'block';
        usernameInput.value = '';
        passwordInput.value = '';
        fetchTasks();
    }

    // Register user
    registerButton.addEventListener('click', async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (username && password) {
            try {
                const response = await fetch('http://127.0.0.1:3000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('An error occurred');
            }
        } else {
            alert('Please enter a username and password.');
        }
    });

    // Login user
    loginButton.addEventListener('click', async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (username && password) {
            try {
                const response = await fetch('http://127.0.0.1:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                if (response.ok) {
                    token = data.token;
                    username = data.username;
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username);
                    todoSection.style.display = 'block';
                    usernameInput.value = '';
                    passwordInput.value = '';
                    fetchTasks();
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('An error occurred');
            }
        } else {
            alert('Please enter a username and password.');
        }
    });

    // Add task
    addTaskButton.addEventListener('click', async () => {
        const title = taskTitleInput.value;
        const description = taskDescriptionInput.value;
        const deadline = taskDeadlineInput.value;
        const priority = taskPrioritySelect.value;

        if (title && description && deadline && priority) {
            try {
                const response = await fetch('http://127.0.0.1:3000/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, description, deadline, priority })
                });
                const data = await response.json();
                if (response.ok) {
                    tasks.push(data);
                    renderTasks();
                    taskTitleInput.value = '';
                    taskDescriptionInput.value = '';
                    taskDeadlineInput.value = '';
                    taskPrioritySelect.value = 'low';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('An error occurred');
            }
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Task click event (update or delete)
    taskList.addEventListener('click', async (e) => {
        if (e.target.type === 'checkbox') {
            const index = e.target.dataset.index;
            const task = tasks[index];
            task.completed = e.target.checked;
            try {
                const response = await fetch(`http://127.0.0.1:3000/tasks/${task._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(task)
                });
                if (response.ok) {
                    renderTasks();
                } else {
                    alert('An error occurred');
                }
            } catch (error) {
                alert('An error occurred');
            }
        } else if (e.target.classList.contains('delete')) {
            const index = e.target.dataset.index;
            const task = tasks[index];
            try {
                const response = await fetch(`http://127.0.0.1:3000/tasks/${task._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    tasks.splice(index, 1);
                    renderTasks();
                } else {
                    alert('An error occurred');
                }
            } catch (error) {
                alert('An error occurred');
            }
        }
    });

    // Search tasks
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        renderTasks(query);
    });

    // Fetch tasks from the API
    async function fetchTasks(query = '') {
        try {
            const response = await fetch('http://127.0.0.1:3000/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                tasks = data;
                renderTasks(query);
            } else {
                alert('An error occurred');
            }
        } catch (error) {
            alert('An error occurred');
        }
    }

    // Render tasks on the page
    function renderTasks(query = '') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(query));
        filteredTasks.forEach((task, index) => {
            const taskElement = document.createElement('li');
            taskElement.innerHTML = `
                <input type="checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
                <span>${task.title}</span> - ${task.description} - Deadline: ${new Date(task.deadline).toLocaleDateString()} - Priority: ${task.priority}
                <button class="delete" data-index="${index}">Delete</button>
            `;
            taskList.appendChild(taskElement);
        });
    }
});


