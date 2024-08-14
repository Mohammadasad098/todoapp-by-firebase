import { onAuthStateChanged , signOut , } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth , db } from "./config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";





onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
      
    } else {
        window.location = 'index.html'
    }
  });



  const logout = document.querySelector('#logout-btn')
  const form = document.querySelector("#form");
  const todo = document.querySelector("#todo");
  const ul = document.querySelector("#ul");
  const select = document.querySelector("#select");
  const citiesBtn = document.querySelectorAll(".cities-btn");
  const reset = document.querySelector(".reset");

  logout.addEventListener('click' , ()=> {
    signOut(auth).then(() => {
        console.log('logout successfully');
        window.location = 'index.html'
      }).catch((error) => {
        console.log(error);
        
      });
  })



//global array
let arr = [];

// single city query

citiesBtn.forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    arr = [];
    console.log(event.target.innerHTML);
    const todosRef = collection(db, "todos");
    const q = query(
      todosRef,
      where("city", "==", event.target.innerHTML),
      orderBy("time", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), id: doc.id });
    });
    console.log(arr);
    renderTodo();
  });
});

reset.addEventListener("click", getData);

// get all data
async function getData() {
  arr = [];
  const q = query(collection(db, "todos"), orderBy("time", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), id: doc.id });
  });
  console.log(arr);
  renderTodo();
  
}

getData();

// render data on screen
function renderTodo() {
  ul.innerHTML = "";
  if (arr.length === 0) {
    ul.innerHTML = "data not found";
    return;
  }
  arr.map((item) => {
    ul.innerHTML += `
        <li>${item.todo} &nbsp; &nbsp;
        <button class="deleteBtn btn btn-dark my-3">Delete Todo</button>
        <button class="editBtn btn btn-dark my-3">Edit Todo</button>
        </li>
        <p>${item.time ? item.time.toDate() : "no time"}</p>
        <hr/>
        `;
  });

  const deleteBtn = document.querySelectorAll(".deleteBtn");
  const editBtn = document.querySelectorAll(".editBtn");

  deleteBtn.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      console.log(arr[index]);
      await deleteDoc(doc(db, "todos", arr[index].id));
      console.log("Data deleted");
      arr.splice(index, 1);
      renderTodo();
    });
  });
  editBtn.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      const updatedNewValue = prompt("enter new value");
      const todoUpdate = doc(db, "todos", arr[index].id);
      await updateDoc(todoUpdate, {
        todo: updatedNewValue,
      });
      console.log("Data updated");
      arr[index].todo = updatedNewValue;
      renderTodo();
    });
  });
}

// add todo in database
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const docRef = await addDoc(collection(db, "todos"), {
      todo: todo.value,
      city: select.value,
      time: Timestamp.fromDate(new Date()),
    });
    console.log("Document written with ID: ", docRef.id);
    arr.push({
      todo: todo.value,
      id: docRef.id,
      city: select.value,
    });
    renderTodo();
    todo.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});