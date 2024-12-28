document.addEventListener("DOMContentLoaded", () => {
    const taskTableBody = document.getElementById("task-table-body");
    const taskNameInput = document.getElementById("task-name");
    const taskPriorityInput = document.getElementById("task-priority");
    const addTaskButton = document.getElementById("add-task");
    const toggleTaskFormButton = document.getElementById("toggle-task-form");
    const taskForm = document.getElementById("task-form");
    const filterStatus = document.getElementById("filter-status");
    const filterPriority = document.getElementById("filter-priority");
    const totalTasksEl = document.getElementById("total-tasks");
    const completedTasksEl = document.getElementById("completed-tasks");
    const pendingTasksEl = document.getElementById("pending-tasks");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderSummary() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === "Completed").length;
        const pendingTasks = totalTasks - completedTasks;

        totalTasksEl.textContent = totalTasks;
        completedTasksEl.textContent = completedTasks;
        pendingTasksEl.textContent = pendingTasks;
    }

    function renderTasks() {
        taskTableBody.innerHTML = "";

        const filteredTasks = tasks.filter(task => {
            const statusMatch = filterStatus.value === "All" || task.status === filterStatus.value;
            const priorityMatch = filterPriority.value === "All" || task.priority === filterPriority.value;
            return statusMatch && priorityMatch;
        });

        filteredTasks.forEach((task, index) => {
            const row = document.createElement("tr");
            row.classList.add(
                task.priority === "High" ? "bg-red-200" :
                task.priority === "Medium" ? "bg-yellow-200" : "bg-green-200"
            );
            row.classList.toggle("line-through", task.status === "Completed");

            row.innerHTML = `
                <td class="p-2">${task.name}</td>
                <td class="p-2">${task.priority}</td>
                <td class="p-2">${task.status}</td>
                <td class="p-2">
                    <button onclick="editTask(${index})" class="bg-yellow-500 text-white py-1 px-2 rounded">Edit</button>
                    <button onclick="toggleStatus(${index})" class="bg-blue-500 text-white py-1 px-2 rounded">Toggle Status</button>
                    <button onclick="deleteTask(${index})" class="bg-red-500 text-white py-1 px-2 rounded">Delete</button>
                </td>
            `;
            taskTableBody.appendChild(row);
        });

        renderSummary();
    }

    function addTask() {
        const taskName = taskNameInput.value.trim();
        const taskPriority = taskPriorityInput.value;

        if (taskName) {
            tasks.push({ name: taskName, priority: taskPriority, status: "Pending" });
            taskNameInput.value = "";
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function toggleStatus(index) {
        tasks[index].status = tasks[index].status === "Pending" ? "Completed" : "Pending";
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const task = tasks[index];
        taskNameInput.value = task.name;
        taskPriorityInput.value = task.priority;
        deleteTask(index);
    }

    toggleTaskFormButton.addEventListener("click", () => taskForm.classList.toggle("hidden"));
    addTaskButton.addEventListener("click", addTask);
    filterStatus.addEventListener("change", renderTasks);
    filterPriority.addEventListener("change", renderTasks);

    renderTasks();
});
