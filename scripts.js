import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCut67-ikjJJKtCeHawuAnPgxIPWmUzulo",
  authDomain: "todo-app-e24db.firebaseapp.com",
  projectId: "todo-app-e24db",
  storageBucket: "todo-app-e24db.appspot.com",
  messagingSenderId: "981480301377",
  appId: "1:981480301377:web:da49ae1751cc311deeb7c0"
};

const appSettings = {
  databaseURL: "https://todo-app-e24db-default-rtdb.europe-west1.firebasedatabase.app/"
}

// Initialize Firebase
const app = initializeApp(appSettings);
const database = getDatabase(app)
const toDoListInDB = ref(database, "TODO-List")



const datumP = document.getElementById("date-el")
const date = Date()

datumP.textContent = date.slice(0, 15)


const addBtn = document.getElementById("add-btn")
const overlay = document.getElementById("overlay")
const closeOverlay = document.getElementById("overlay-closing")

addBtn.addEventListener("click", function () {
  overlay.classList.add("open");
})

closeOverlay.addEventListener("click", function () {
  overlay.classList.remove("open")
})

const saveBtn = document.getElementById("save-btn")
let listArray = [
  {
    "task": "test",
    "notes": "note"
  }
]


function createOl() {
  onValue(toDoListInDB, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key
      const childData = childSnapshot.val()

      function addListItem(childKey) {

        const ol = document.getElementById("todo-ol")
        const li = document.createElement('li')
        li.setAttribute("id", childKey)

        li.addEventListener("click", function () {
          newDiv.classList.add("open");

          const overlayToClose = document.createElement('h5')
          overlayToClose.setAttribute("class", "overlayToClose")
          const listOverlay = document.getElementById("list-overlay")

          overlayToClose.classList.add("open")

          overlayToClose.addEventListener("click", function () {
            newDiv.classList.remove("open")
            ol.removeChild(overlayToClose)
          })

          if (ol && ol.querySelector('.overlayToClose')) {
            console.log("test")
          } else {

            ol.append(overlayToClose)
          }
        })

        const h2 = document.createElement('h2')
        h2.innerText = childData.task

        const p = document.createElement('p')
        p.textContent = childData.notes

        const newDiv = document.createElement('div')
        newDiv.setAttribute("class", "list-overlay")

        const divBtn = document.createElement('button')
        divBtn.innerText = "✅"
        divBtn.setAttribute("class", "deleteListItem")

        divBtn.addEventListener("click", function () {
          const itemKey = li.getAttribute("id");
          removeItem(itemKey);
        });

        newDiv.append(divBtn)

        li.append(h2, p, newDiv)
        ol.appendChild(li)
      }

      addListItem(childKey)
    })
  })
}

// Zorgt ervoor dat de database correct gedisplayed wordt.
createOl()

// Als er geklikt wordt dan wordt de input naar de database gestuurd, dan wordt de createOl() functie geroepen zodat de database weer gedisplayed wordt. En ook wordt de overlay gesloten.
saveBtn.addEventListener("click", function () {
  const inputTask = document.getElementById("input-task").value
  const inputNotes = document.getElementById("input-notes").value

  push(toDoListInDB, {
    "task": `${inputTask}`,
    "notes": `${inputNotes}`
  })

  let ol = document.getElementById("todo-ol")
  ol.innerHTML = ""
  createOl()
  overlay.classList.remove("open")
})


function removeItem(key) {
  remove(ref(database, `TODO-List/${key}`))
    .then(() => {
      // If removal from database is successful, remove from DOM
      const liToRemove = document.getElementById(key);
      if (liToRemove) {
        liToRemove.remove();
      }
      location.reload()
    })
}


