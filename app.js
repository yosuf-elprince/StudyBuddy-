

/* ================== GLOBAL STATE ================== */

// Tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingTaskId = null;

// Habits
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Favorites (Resources)
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Theme
let theme = localStorage.getItem("theme") || "light";

/* ================== ELEMENTS ================== */

// Navigation
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section");

// Tasks
const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");
const categoryInput = document.getElementById("category");
const submitBtn = document.getElementById("submitBtn");

const titleError = document.getElementById("titleError");
const dateError = document.getElementById("dateError");

const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const sortBy = document.getElementById("sortBy");
const taskList = document.getElementById("taskList");

// Dashboard
const cardDue = document.getElementById("cardDue");
const cardCompleted = document.getElementById("cardCompleted");
const cardStreak = document.getElementById("cardStreak");
const progressBar = document.getElementById("progressBar");

// Habits
const habitForm = document.getElementById("habitForm");
const habitNameInput = document.getElementById("habitName");
const goalInput = document.getElementById("goal");
const habitList = document.getElementById("habitList");

// Resources
const searchRes = document.getElementById("searchRes");
const resCategory = document.getElementById("resCategory");
const resourceList = document.getElementById("resourceList");

// Settings
const themeSwitch = document.getElementById("themeSwitch");
const resetDataBtn = document.getElementById("resetData");

/* ================== NAVIGATION (SPA) ================== */

// زر الهامبرجر
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");   // أنيميشن 
  navMenu.classList.toggle("show");   // إظهار / إخفاء القائمة
});

// التنقل بين الصفحات (بدون Reload)
navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // إخفاء كل الأقسام
    sections.forEach(sec => sec.classList.add("hidden"));

    // إزالة active من الجميع
    navLinks.forEach(l => l.classList.remove("active"));

    // إظهار القسم المطلوب
    const target = link.dataset.section;
    document.getElementById(target).classList.remove("hidden");
    link.classList.add("active");

    // إغلاق القائمة بالموبايل
    navMenu.classList.remove("show");
    menuBtn.classList.remove("open");
  });
});

/* ================== TASKS ================== */

// التحقق من المدخلات
function validateTaskForm() {
  let valid = true;
  titleError.textContent = "";
  dateError.textContent = "";

  if (!titleInput.value.trim()) {
    titleError.textContent = "Title is required";
    valid = false;
  }

  if (!dueDateInput.value) {
    dateError.textContent = "Due date is required";
    valid = false;
  }

  submitBtn.disabled = !valid;
}

titleInput.addEventListener("input", validateTaskForm);
dueDateInput.addEventListener("input", validateTaskForm);

// إضافة / تعديل مهمة
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (submitBtn.disabled) return;

  if (editingTaskId) {
    const task = tasks.find(t => t.id === editingTaskId);
    task.title = titleInput.value;
    task.desc = descInput.value;
    task.dueDate = dueDateInput.value;
    task.priority = priorityInput.value;
    task.category = categoryInput.value;
    editingTaskId = null;
    submitBtn.textContent = "Add Task";
  } else {
    tasks.push({
      id: Date.now(),
      title: titleInput.value,
      desc: descInput.value,
      dueDate: dueDateInput.value,
      priority: priorityInput.value,
      category: categoryInput.value,
      completed: false
    });
  }

  taskForm.reset();
  submitBtn.disabled = true;
  saveTasks();
  renderTasks();
});

// عرض المهام
function renderTasks() {
  taskList.innerHTML = "";
  let filtered = [...tasks];

  // فلترة الحالة
  if (statusFilter.value !== "all") {
    filtered = filtered.filter(t =>
      statusFilter.value === "completed" ? t.completed : !t.completed
    );
  }

  // فلترة الفئة
  if (categoryFilter.value !== "all") {
    filtered = filtered.filter(t => t.category === categoryFilter.value);
  }

  // ترتيب
  if (sortBy.value === "date") {
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else {
    const p = ["High", "Medium", "Low"];
    filtered.sort((a, b) => p.indexOf(a.priority) - p.indexOf(b.priority));
  }


  filtered.forEach(task => {
    const li = document.createElement("li");

    // المكتملة بحط عليها خط عشان تبين
    if (task.completed) {
      li.style.opacity = "0.6";
      li.style.textDecoration = "line-through";
    }

    li.innerHTML = `
    <strong>${task.title}</strong> (${task.dueDate})
    <div>
      <button onclick="toggleTask(${task.id})">✓</button>
      <button onclick="editTask(${task.id})">Edit</button>
      <button onclick="deleteTask(${task.id})">✕</button>
    </div>
  `;

    taskList.appendChild(li);
  });


  updateCategoryFilter();
  updateDashboard();
}

window.toggleTask = id => {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
};

window.editTask = id => {
  const task = tasks.find(t => t.id === id);
  titleInput.value = task.title;
  descInput.value = task.desc;
  dueDateInput.value = task.dueDate;
  priorityInput.value = task.priority;
  categoryInput.value = task.category;
  editingTaskId = id;
  submitBtn.textContent = "Save Task";
  submitBtn.disabled = false;
};

window.deleteTask = id => {
  if (!confirm("Delete this task?")) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCategoryFilter() {
  const cats = [...new Set(tasks.map(t => t.category).filter(Boolean))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categoryFilter.appendChild(opt);
  });
}

statusFilter.onchange =
  categoryFilter.onchange =
  sortBy.onchange = renderTasks;

/* ================== DASHBOARD ================== */

function updateDashboard() {
  const completed = tasks.filter(t => t.completed).length;
  progressBar.value = tasks.length ? (completed / tasks.length) * 100 : 0;

  const today = new Date();
  const dueSoon = tasks.filter(t => {
    const d = new Date(t.dueDate);
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 2 && !t.completed;
  });

  cardDue.textContent = `Due Soon: ${dueSoon.length}`;
  cardCompleted.textContent = `Completed: ${completed}`;
  cardStreak.textContent = `Habits: ${habits.length}`;
}

/* ================== HABITS ================== */

function renderHabits() {
  habitList.innerHTML = "";
  // ===== Weekly Habit Summary =====
  const summary = document.createElement("div");
  summary.className = "card";
  summary.style.marginBottom = "20px";

  const totalHabits = habits.length;

  // العادة مكتملة إذا كل الأيام true
  const completedHabits = habits.filter(h =>
    h.days.every(d => d === true)
  ).length;

  summary.innerHTML = `
  <strong>Weekly Habit Summary</strong><br>
  Completed Habits: ${completedHabits} / ${totalHabits}
`;

  habitList.appendChild(summary);

  habits.forEach((habit, i) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <strong>${habit.name}</strong>
      <div class="days">
        ${habit.days.map((d, idx) => `
          <button
            class="${d ? "done" : ""}"
            onclick="toggleHabitDay(${i}, ${idx})">
            ${idx + 1}
          </button>
        `).join("")}
      </div>
      <button onclick="autoHabitDay(${i})">Auto ✔</button>
    `;
    // إذا كل الأيام true → العادة مكتملة
    if (habit.days.every(d => d === true)) {
      card.classList.add("habit-complete");

      const doneBadge = document.createElement("div");
      doneBadge.textContent = "✔ ";
      doneBadge.className = "habit-done-mark";

      card.appendChild(doneBadge);
    }

    habitList.appendChild(card);
  });

  updateDashboard();
  localStorage.setItem("habits", JSON.stringify(habits));
}

habitForm.addEventListener("submit", e => {
  e.preventDefault();
  const count = Math.min(7, Math.max(1, +goalInput.value));
  habits.push({
    name: habitNameInput.value,
    days: Array(count).fill(false)
  });
  habitForm.reset();
  renderHabits();
});

window.toggleHabitDay = (i, d) => {

  if (habits[i].days[d]) return;

  habits[i].days[d] = true;
  renderHabits();
};

window.autoHabitDay = i => {
  const idx = habits[i].days.findIndex(d => !d);
  if (idx === -1) return;

  habits[i].days[idx] = true;
  renderHabits();
};
/* ================== RESOURCES ================== */
let renderResources;
let allResources = [];
fetch("resources.json")
  .then(res => res.json())
  .then(data => {

    const cats = [...new Set(data.map(r => r.category))];
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      resCategory.appendChild(opt);
    });

    renderResources = function () {
      resourceList.innerHTML = "";

      data
        .filter(r =>
          r.title.toLowerCase().includes(searchRes.value.toLowerCase())
        )
        .filter(r =>
          resCategory.value === "all" || r.category === resCategory.value
        )
        .forEach(r => {
          const card = document.createElement("div");
          card.className = "card";

          const isFav = favorites.includes(r.id);

          card.innerHTML = `
            <a href="${r.link}" target="_blank">${r.title}</a>
            <button
              class="star-btn ${isFav ? "active" : ""}"
              onclick="toggleFavorite(${r.id})">
              ★
            </button>
          `;
          resourceList.appendChild(card);
        });
    }

    searchRes.oninput = resCategory.onchange = renderResources;
    renderResources();
  });

window.toggleFavorite = id => {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderResources();
};

/* ================== SETTINGS ================== */

// تحميل الوضع الليلي
if (theme === "dark") {

  document.body.classList.add("dark");

  themeSwitch.checked = true;
}

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

// إعادة تعيين كل البيانات
resetDataBtn.addEventListener("click", () => {
  if (confirm("Reset all data?")) {
    localStorage.clear();
    location.reload();
  }
});

/* ================== INIT ================== */

renderTasks();
renderHabits();
updateDashboard();