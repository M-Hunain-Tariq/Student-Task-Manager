/* =========================
   ELEMENTS
========================= */

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const emptyState = document.getElementById("emptyState");

const themeBtn = document.getElementById("themeBtn");

const addTaskText = addTaskBtn.querySelector("span");


/* =========================
   TASK DATA
========================= */

let tasks = JSON.parse(
    localStorage.getItem("taskflow-tasks")
) || [];

let editingTaskId = null;


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "taskflow-tasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function (task) {

        const taskItem = document.createElement("li");

        taskItem.className = "task-item";

        taskItem.dataset.id = task.id;


        /* =========================
           TASK TEXT
        ========================= */

        const taskContent =
            document.createElement("span");

        taskContent.className =
            "task-content";

        taskContent.textContent =
            task.text;


        if (task.completed) {

            taskContent.classList.add(
                "completed"
            );

        }


        /* =========================
           COMPLETE TASK
        ========================= */

        taskContent.addEventListener(
            "click",
            function () {

                task.completed =
                    !task.completed;

                saveTasks();

                renderTasks();

                updateDashboard();

            }
        );


        /* =========================
           ACTIONS
        ========================= */

        const actions =
            document.createElement("div");

        actions.className =
            "task-actions";


        /* =========================
           EDIT BUTTON
        ========================= */

        const editButton =
            document.createElement("button");

        editButton.className =
            "edit-btn";

        editButton.textContent = "✎";

        editButton.setAttribute(
            "aria-label",
            "Edit task"
        );


        editButton.addEventListener(
            "click",
            function () {

                taskInput.value =
                    task.text;

                editingTaskId =
                    task.id;

                addTaskText.textContent =
                    "Update Task";

                errorMessage.textContent =
                    "Edit your task and click Update Task.";

                taskInput.focus();

            }
        );


        /* =========================
           DELETE BUTTON
        ========================= */

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-btn";

        deleteButton.textContent = "×";

        deleteButton.setAttribute(
            "aria-label",
            "Delete task"
        );


        deleteButton.addEventListener(
            "click",
            function () {

                taskItem.style.transform =
                    "translateX(20px)";

                taskItem.style.opacity = "0";


                setTimeout(function () {

                    tasks =
                        tasks.filter(
                            function (item) {

                                return item.id !== task.id;

                            }
                        );


                    saveTasks();

                    renderTasks();

                    updateDashboard();

                }, 180);

            }
        );


        /* =========================
           APPEND
        ========================= */

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);

        taskItem.appendChild(taskContent);

        taskItem.appendChild(actions);

        taskList.appendChild(taskItem);

    });


    filterTasks();

}


/* =========================
   ADD / UPDATE TASK
========================= */

function addTask() {

    const taskText =
        taskInput.value.trim();


    /* Empty validation */

    if (taskText === "") {

        errorMessage.textContent =
            "Please enter a task first.";

        taskInput.focus();

        return;

    }


    /* =========================
       UPDATE EXISTING TASK
    ========================= */

    if (editingTaskId !== null) {

        const task =
            tasks.find(
                function (item) {

                    return item.id === editingTaskId;

                }
            );


        if (task) {

            task.text = taskText;

        }


        editingTaskId = null;

        addTaskText.textContent =
            "Add Task";

        errorMessage.textContent =
            "";

        taskInput.value = "";

        saveTasks();

        renderTasks();

        updateDashboard();

        taskInput.focus();

        return;

    }


    /* =========================
       CREATE NEW TASK
    ========================= */

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    tasks.push(newTask);


    /* Save */

    saveTasks();


    /* Reset */

    taskInput.value = "";

    errorMessage.textContent = "";


    /* Update UI */

    renderTasks();

    updateDashboard();

    taskInput.focus();

}


/* =========================
   ADD BUTTON
========================= */

addTaskBtn.addEventListener(
    "click",
    addTask
);


/* =========================
   ENTER KEY
========================= */

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


/* =========================
   SEARCH + FILTER
========================= */

function filterTasks() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filterValue =
        filterSelect.value;


    const taskItems =
        document.querySelectorAll(
            ".task-item"
        );


    let visibleTasks = 0;


    taskItems.forEach(
        function (taskItem) {

            const taskId =
                Number(taskItem.dataset.id);


            const task =
                tasks.find(
                    function (item) {

                        return item.id === taskId;

                    }
                );


            if (!task) {

                return;

            }


            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(searchText);


            let matchesFilter = true;


            if (filterValue === "active") {

                matchesFilter =
                    !task.completed;

            }


            if (filterValue === "completed") {

                matchesFilter =
                    task.completed;

            }


            const shouldShow =
                matchesSearch &&
                matchesFilter;


            if (shouldShow) {

                taskItem.style.display =
                    "flex";

                visibleTasks++;

            } else {

                taskItem.style.display =
                    "none";

            }

        }
    );


    /* =========================
       EMPTY STATE
    ========================= */

    if (tasks.length === 0) {

        emptyState.querySelector("h3")
            .textContent =
            "No tasks yet";

        emptyState.querySelector("p")
            .textContent =
            "Add your first task and start making progress.";

        emptyState.style.display =
            "block";

    }

    else if (visibleTasks === 0) {

        emptyState.querySelector("h3")
            .textContent =
            "No matching tasks";

        emptyState.querySelector("p")
            .textContent =
            "Try another search or change the filter.";

        emptyState.style.display =
            "block";

    }

    else {

        emptyState.style.display =
            "none";

    }

}


searchInput.addEventListener(
    "input",
    filterTasks
);


filterSelect.addEventListener(
    "change",
    filterTasks
);


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const active =
        total - completed;


    totalCount.textContent =
        total;

    activeCount.textContent =
        active;

    completedCount.textContent =
        completed;


    /* =========================
       PROGRESS
    ========================= */

    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressText.textContent =
        `${percentage}% complete`;


    progressFill.style.width =
        `${percentage}%`;

}


/* =========================
   THEME
========================= */

function updateThemeIcon() {

    if (
        document.body.classList.contains(
            "light"
        )
    ) {

        themeBtn.textContent = "☀";

    } else {

        themeBtn.textContent = "☾";

    }

}


themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "light"
        );


        const isLight =
            document.body.classList.contains(
                "light"
            );


        localStorage.setItem(
            "taskflow-theme",
            isLight
                ? "light"
                : "dark"
        );


        updateThemeIcon();

    }
);


/* =========================
   LOAD THEME
========================= */

const savedTheme =
    localStorage.getItem(
        "taskflow-theme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light"
    );

}


updateThemeIcon();


/* =========================
   INITIAL LOAD
========================= */

renderTasks();

updateDashboard();