const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */
const saveTask = (title) =>
  db.collection("materias").doc().set({
    title
  });

const getTasks = () => db.collection("materias").get();

const onGetTasks = (callback) => db.collection("materias").onSnapshot(callback);

const deleteTask = (id) => db.collection("materias").doc(id).delete();

const getTask = (id) => db.collection("materias").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('materias').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
    <h3 class="h5">${task.title}</h3>
    
    <div>
      <button class="btn btn-primary btn-delete" data-id="${doc.id}">
        🗑 Eliminar
      </button>
      <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
        🖉 Modificar
      </button>
    </div>
  </div>`;
    });

    function myFunction() {
      if (confirm("¿seguro que desea eliminar la materia?")) {
      
      } else {
      console.box("ok");
      }
      
    }
    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
    
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        if(confirm("¿seguro que desea eliminar la materia?")){
          try {
              await deleteTask(e.target.dataset.id);
            } catch (error) {
              console.log(error);
            }
      }else{console.log("ok")}
})
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
        
          taskForm["task-title"].value = task.title;  
          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["task-title"];
  

  try {
    if (!editStatus) {
      await saveTask(title.value);
    } else {
      await updateTask(id, {
        title: title.value
      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    title.focus();
  } catch (error) {
    console.log(error);
  }
});
