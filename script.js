document.addEventListener("DOMContentLoaded", () => {
  const addTaskButton = document.getElementById("addTaskButton");
  const newTaskInput = document.getElementById("newTaskInput");
  const pendingList = document.getElementById("pendingList");
  const doneList = document.getElementById("doneList");
  const pendingCount = document.getElementById("pendingCount");
  const doneCount = document.getElementById("doneCount");

  let pending = 0;
  let done = 0;

  // Update the counters initially
  updateCounters();

  // Event listener for adding tasks
  addTaskButton.addEventListener("click", addTask);
  newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText === "") return;

    const taskItem = createTaskItem(taskText);
    pendingList.appendChild(taskItem);
    pending++;
    updateCounters();
    newTaskInput.value = "";
  }

  function createTaskItem(text) {
    const li = document.createElement("li");
    li.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const label = document.createElement("label");
    label.textContent = text;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input hidden";

    const actions = document.createElement("div");
    actions.className = "actions";

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa fa-edit"></i>';
    editButton.title = "Edit Task";

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
    deleteButton.title = "Delete Task";

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(editInput);
    li.appendChild(actions);

    // Event Listeners
    checkbox.addEventListener("change", () =>
      toggleTask(checkbox, li, label, actions)
    );
    editButton.addEventListener("click", () => editTask(label, editInput));
    deleteButton.addEventListener("click", () => deleteTask(checkbox, li));

    editInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") saveEdit();
    });

    editInput.addEventListener("blur", saveEdit);

    function saveEdit() {
      const updatedText = editInput.value.trim();
      if (updatedText !== "") {
        label.textContent = updatedText;
      }
      label.classList.remove("hidden");
      editInput.classList.add("hidden");
    }

    return li;
  }

  function toggleTask(checkbox, taskItem, label, actions) {
    if (checkbox.checked) {
      // Move to Done
      doneList.appendChild(taskItem);
      label.classList.add("completed");
      pending--;
      done++;

      // Remove or hide the edit button
      const editButton = actions.querySelector(".fa-edit").parentElement;
      if (editButton) {
        editButton.classList.add("hidden");
      }
    } else {
      // Move to Pending
      pendingList.appendChild(taskItem);
      label.classList.remove("completed");
      done--;
      pending++;

      // Restore the edit button
      const editButton = actions.querySelector(".fa-edit").parentElement;
      if (editButton) {
        editButton.classList.remove("hidden");
      }
    }
    updateCounters();
  }

  function editTask(label, editInput) {
    label.classList.add("hidden");
    editInput.classList.remove("hidden");
    editInput.value = label.textContent;
    editInput.focus();
  }

  function deleteTask(checkbox, taskItem) {
    if (checkbox.checked) {
      done--;
    } else {
      pending--;
    }
    taskItem.remove();
    updateCounters();
  }

  function updateCounters() {
    pendingCount.textContent = pending;
    doneCount.textContent = done;
  }
});
