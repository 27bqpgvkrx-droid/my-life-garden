/* ==========================================
   MY LIFE GARDEN
   Global Script
========================================== */
const STORAGE_KEYS = {
  TASKS: "mlg_tasks",
  EVENTS: "mlg_events",
  REFLECTIONS: "mlg_reflections",
  MEMORIES: "mlg_memories"
};
/* ==========================================
   UTILITIES
========================================== */
function getData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function uid() {
  return Date.now() + Math.random().toString(16).slice(2);
}
function formatDate(date) {
  return new Date(date).toLocaleString();
}
/* ==========================================
   HOME PAGE
========================================== */
function initHomePage() {
  const todayEl = document.getElementById("todayDate");
  const quoteEl = document.getElementById("dailyQuote");
  const plantEl = document.getElementById("plantStatus");
  if (!todayEl) return;
  const quotes = [
    "Small steps still grow beautiful gardens 🌱",
    "Bloom at your own pace 🌸",
    "Every day adds a new leaf 🌿",
    "Progress is a form of magic ✨",
    "Water your dreams daily 🌷"
  ];
  todayEl.textContent = new Date().toDateString();
  quoteEl.textContent =
    quotes[Math.floor(Math.random() * quotes.length)];
  const growth = calculateGrowth();
  plantEl.textContent =
    `Current Growth: ${growth.percent}%`;
}
/* ==========================================
   TASKS
========================================== */
function initTasks() {
  const form = document.getElementById("taskForm");
  const board = document.getElementById("taskBoard");
  if (!form || !board) return;
  renderTasks();
  form.addEventListener("submit", e => {
    e.preventDefault();
    const title =
      document.getElementById("taskTitle").value;
    const tasks = getData(STORAGE_KEYS.TASKS);
    tasks.push({
      id: uid(),
      title,
      done: false
    });
    saveData(STORAGE_KEYS.TASKS, tasks);
    form.reset();
    renderTasks();
  });
  function renderTasks() {
    board.innerHTML = "";
    const tasks = getData(STORAGE_KEYS.TASKS);
    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className =
        `task-card paper-appear ${
          task.done ? "done" : ""
        }`;
      card.style.transform =
        `rotate(${Math.random()*6-3}deg)`;
      card.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        <br>
        <button class="scrap-btn complete-btn">
        ${task.done ? "Undo" : "Complete"}
        </button>
        <button class="scrap-btn edit-btn">
        Edit
        </button>
        <button class="scrap-btn delete-btn">
        Delete
        </button>
      `;
      card
        .querySelector(".complete-btn")
        .onclick = () => {
          task.done = !task.done;
          saveData(STORAGE_KEYS.TASKS, tasks);
          renderTasks();
        };
      card
        .querySelector(".edit-btn")
        .onclick = () => {
          const value =
            prompt("Edit task", task.title);
          if (!value) return;
          task.title = value;
          saveData(STORAGE_KEYS.TASKS, tasks);
          renderTasks();
        };
      card
        .querySelector(".delete-btn")
        .onclick = () => {
          const updated =
            tasks.filter(t => t.id !== task.id);
          saveData(
            STORAGE_KEYS.TASKS,
            updated
          );
          renderTasks();
        };
      board.appendChild(card);
    });
  }
}
/* ==========================================
   REFLECTIONS
========================================== */
function initReflections() {
  const form =
    document.getElementById("reflectionForm");
  const list =
    document.getElementById("reflectionList");
  if (!form || !list) return;
  render();
  form.addEventListener("submit", e => {
    e.preventDefault();
    const mood =
      document.getElementById("mood").value;
    const reflection =
      document.getElementById("reflectionText").value;
    const entries =
      getData(STORAGE_KEYS.REFLECTIONS);
    entries.unshift({
      id: uid(),
      mood,
      reflection,
      createdAt: new Date()
    });
    saveData(
      STORAGE_KEYS.REFLECTIONS,
      entries
    );
    form.reset();
    render();
  });
  function render() {
    list.innerHTML = "";
    const entries =
      getData(STORAGE_KEYS.REFLECTIONS);
    entries.forEach(entry => {
      const div =
        document.createElement("div");
      div.className =
        "entry-card paper-appear";
      div.innerHTML = `
        <h3>${entry.mood}</h3>
        <p>
          ${entry.reflection}
        </p>
        <small>
          ${formatDate(entry.createdAt)}
        </small>
        <br><br>
        <button class="scrap-btn edit">
          Edit
        </button>
        <button class="scrap-btn delete">
          Delete
        </button>
      `;
      div.querySelector(".edit")
      .onclick = () => {
        const updated =
          prompt(
            "Edit reflection",
            entry.reflection
          );
        if (!updated) return;
        entry.reflection = updated;
        saveData(
          STORAGE_KEYS.REFLECTIONS,
          entries
        );
        render();
      };
      div.querySelector(".delete")
      .onclick = () => {
        saveData(
          STORAGE_KEYS.REFLECTIONS,
          entries.filter(
            e => e.id !== entry.id
          )
        );
        render();
      };
      list.appendChild(div);
    });
  }
}
/* ==========================================
   MEMORY WALL
========================================== */
function initMemoryWall() {
  const form =
    document.getElementById("memoryForm");
  const wall =
    document.getElementById("memoryWall");
  if (!form || !wall) return;
  render();
  form.addEventListener("submit", e => {
    e.preventDefault();
    const type =
      document.getElementById("memoryType").value;
    const text =
      document.getElementById("memoryText").value;
    const memories =
      getData(STORAGE_KEYS.MEMORIES);
    memories.push({
      id: uid(),
      type,
      text
    });
    saveData(
      STORAGE_KEYS.MEMORIES,
      memories
    );
    form.reset();
    render();
  });
  function render() {
    wall.innerHTML = "";
    const memories =
      getData(STORAGE_KEYS.MEMORIES);
    memories.forEach(memory => {
      const card =
        document.createElement("div");
      const random =
        Math.random() > 0.5;
      card.className =
        random ? "polaroid" : "scrap";
      card.style.top =
        Math.random()*700 + "px";
      card.style.left =
        Math.random()*75 + "%";
      card.style.transform =
        `rotate(${Math.random()*20-10}deg)`;
      card.innerHTML = `
        <h4>${memory.type}</h4>
        <p>${memory.text}</p>
        <br>
        <button class="scrap-btn delete">
        Delete
        </button>
      `;
      card
      .querySelector(".delete")
      .onclick = () => {
        saveData(
          STORAGE_KEYS.MEMORIES,
          memories.filter(
            m => m.id !== memory.id
          )
        );
        render();
      };
      wall.appendChild(card);
    });
  }
}
/* ==========================================
   PLANNER
========================================== */
let currentMonth =
new Date().getMonth();
let currentYear =
new Date().getFullYear();
function initPlanner() {
  const calendar =
    document.getElementById("calendar");
  if (!calendar) return;
  renderCalendar();
  document
    .getElementById("prevMonth")
    ?.addEventListener(
      "click",
      () => {
        currentMonth--;
        if(currentMonth<0){
          currentMonth=11;
          currentYear--;
        }
        renderCalendar();
      }
    );
  document
    .getElementById("nextMonth")
    ?.addEventListener(
      "click",
      () => {
        currentMonth++;
        if(currentMonth>11){
          currentMonth=0;
          currentYear++;
        }
        renderCalendar();
      }
    );
}
function renderCalendar() {
  const daysContainer =
    document.getElementById("days");
  if (!daysContainer) return;
  const monthLabel =
    document.getElementById("monthLabel");
  const firstDay =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();
  const totalDays =
    new Date(
      currentYear,
      currentMonth+1,
      0
    ).getDate();
  monthLabel.textContent =
    new Date(
      currentYear,
      currentMonth
    ).toLocaleString(
      "default",
      {month:"long",year:"numeric"}
    );
  daysContainer.innerHTML = "";
  for(let i=0;i<firstDay;i++){
    daysContainer.innerHTML +=
    `<div class="day"></div>`;
  }
  const events =
    getData(STORAGE_KEYS.EVENTS);
  for(let day=1;day<=totalDays;day++){
    const div =
      document.createElement("div");
    div.className="day";
    const dateKey =
      `${currentYear}-${currentMonth}-${day}`;
    const dayEvents =
      events.filter(
        e => e.date===dateKey
      );
    div.innerHTML =
      `<div class="day-number">${day}</div>`;
    dayEvents.forEach(event => {
      div.innerHTML += `
      <div class="event-sticker ${event.category}">
      ${event.title}
      </div>
      `;
    });
    div.onclick = () => {
      const title =
        prompt("Event");
      if(!title) return;
      const category =
        prompt(
          "Category:\npersonal\nstudy\nhealth\ngoals\nfun",
          "personal"
        );
      events.push({
        id:uid(),
        title,
        category,
        date:dateKey
      });
      saveData(
        STORAGE_KEYS.EVENTS,
        events
      );
      renderCalendar();
    };
    daysContainer.appendChild(div);
  }
}
/* ==========================================
   GARDEN
========================================== */
function calculateGrowth() {
  const tasks =
    getData(STORAGE_KEYS.TASKS)
      .filter(t=>t.done).length;
  const reflections =
    getData(STORAGE_KEYS.REFLECTIONS)
      .length;
  const total =
    tasks + reflections;
  let stage = 1;
  if(total >= 15){
    stage = 4;
  }
  else if(total >= 10){
    stage = 3;
  }
  else if(total >= 5){
    stage = 2;
  }
  return {
    total,
    stage,
    percent:
      Math.min(
        100,
        Math.floor(total/15*100)
      )
  };
}
function initGarden() {
  const svg =
    document.getElementById("gardenPlant");
  if(!svg) return;
  const level =
    document.getElementById("growthLevel");
  const percent =
    document.getElementById("growthPercent");
  const message =
    document.getElementById("growthMessage");
  const growth =
    calculateGrowth();
  level.textContent =
    `Stage ${growth.stage}`;
  percent.textContent =
    `${growth.percent}%`;
  if(growth.stage===1){
    svg.innerHTML =
    `<circle cx="200" cy="200" r="30"
      fill="#F7D5E5"/>`;
    message.textContent =
    "A tiny bud is beginning.";
  }
  if(growth.stage===2){
    svg.innerHTML =
    `
    <line x1="200" y1="300"
          x2="200" y2="120"
          stroke="#B7C58B"
          stroke-width="10"/>
    <ellipse cx="170" cy="180"
    rx="40" ry="20"
    fill="#B7C58B"/>
    <ellipse cx="230" cy="220"
    rx="40" ry="20"
    fill="#B7C58B"/>
    `;
    message.textContent =
    "Leaves are growing beautifully.";
  }
  if(growth.stage===3){
    svg.innerHTML =
    `
    <circle cx="200" cy="110"
    r="40"
    fill="#F2C9D8"/>
    <line x1="200" y1="300"
    x2="200" y2="140"
    stroke="#B7C58B"
    stroke-width="10"/>
    `;
    message.textContent =
    "Your flower has bloomed.";
  }
  if(growth.stage===4){
    svg.innerHTML =
    `
    <circle cx="200" cy="110"
    r="55"
    fill="#F18B6D"/>
    <circle cx="150" cy="100"
    r="25"
    fill="#F7D5E5"/>
    <circle cx="250" cy="100"
    r="25"
    fill="#F7D5E5"/>
    <line x1="200" y1="300"
    x2="200" y2="140"
    stroke="#B7C58B"
    stroke-width="10"/>
    `;
    message.textContent =
    "Magical bloom unlocked ✨🦋🌸";
  }
}
/* ==========================================
   AUTO INIT
========================================== */
document.addEventListener(
  "DOMContentLoaded",
  () => {
    initHomePage();
    initTasks();
    initPlanner();
    initReflections();
    initMemoryWall();
    initGarden();
  }
);
