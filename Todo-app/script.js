// Grab elements from the page

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const count = document.getElementById('count');
const bar = document.getElementById('bar-fill');


// Load saved tasks (or start empty)

let tasks = JSON.parse(localStorage.getItem('tasks-v1') || '[]');


function save(){
    localStorage.setItem('tasks-v1',JSON.stringify(tasks)); // Converts taks array to JSON and saves it so it survives refreshes
}

// Escape any </> --> prevent HTML injection
function escapeHTML(s){ 
    const p = document.createElement('p');
    p.innerText = s;
    return p.innerHTML;
}

// Rebuilds the list + progress
function render(){
    list.innerHTML=''; // Clears the current task list --> ensures you don't get duplicates when rebuild

    // Loop over data array --> t: task object, i: index of that task
    tasks.forEach((t, i) => {
        const li = document.createElement('li'); // create a new <li> node to represent a task
        li.className = 'task' + (t.done ? 'done' : '');

        li.className = 'task' + (t.done ? ' done' : '');
        li.innerHTML = `
            <input class="toggle" type="checkbox" ${t.done ? 'checked' : ''} />
            <div class="label">${escapeHTML(t.text)}</div>
            <button type="button" class="icon edit" aria-label="Edit">✎</button>
            <button type="button" class="icon delete" aria-label="Delete">✕</button>
        `;



        const checkbox = li.querySelector('input[type="checkbox"]');
        const label    = li.querySelector('.label');
        const btnEdit  = li.querySelector('.edit');
        const btnDel   = li.querySelector('.delete');

        // Toggle complete
        checkbox.addEventListener('change', () => {
        tasks[i].done = checkbox.checked;
        save(); render();
        });

        // Delete task
        btnDel.addEventListener('click', () => {
        tasks.splice(i,1);
        save(); render();
        });

        // Edit task
        btnEdit.addEventListener('click', () => editItem(i));
        label.addEventListener('dblclick', () => editItem(i));

        list.appendChild(li); // Adds the fully prepared <li> to the <ul> --> happens for every task

    });

    // progress
    const done = tasks.filter(t => t.done).length;
    count.textContent = `${done} / ${tasks.length || 0}`;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    bar.style.width = pct + '%';
}

function editItem(i){
  const current = tasks[i].text;
  const next = prompt('Edit task:', current);
  if (next === null) return;
  const trimmed = next.trim();
  if (trimmed) {
    tasks[i].text = trimmed;
    save(); render();
  }
}

// --- Init & events ---
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const txt = input.value.trim();
  if(!txt) return;
  tasks.push({ text: txt, done:false });
  input.value = '';
  save(); render();
});

render();