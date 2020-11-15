//Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const otherBodyInput = document.querySelector('#otherBody');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

let db;
window.onload = function() {
  let request = window.indexedDB.open('eventList_db', 1);

  request.onerror = function() {
    console.log('Database failed to open');
  };

  request.onsuccess = function() {
  console.log('Database opened successfully');

  db = request.result;

  displayData();
};

request.onupgradeneeded = function(e) {
  // Grab a reference to the opened database
  let db = e.target.result;

  // Create an objectStore to store our notes in (basically like a single table)
  // including a auto-incrementing key
  let objectStore = db.createObjectStore('eventList_os', { keyPath: 'id', autoIncrement:true });

  // Define what data items the objectStore will contain
  objectStore.createIndex('title', 'title', { unique: false });
  objectStore.createIndex('otherBody', 'otherBody', { unique: false });
  objectStore.createIndex('body', 'body', { unique: false });

  console.log('Database setup complete');
};

form.onsubmit = addData;
// Define the addData() function
function addData(e) {
  // prevent default - we don't want the form to submit in the conventional way
  e.preventDefault();

  // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
  let newItem = { title: titleInput.value, otherBody: otherBodyInput.value, body: bodyInput.value };

  // open a read/write db transaction, ready for adding the data
  let transaction = db.transaction(['eventList_os'], 'readwrite');

  // call an object store that's already been added to the database
  let objectStore = transaction.objectStore('eventList_os');

  // Make a request to add our newItem object to the object store
  let request = objectStore.add(newItem);
  request.onsuccess = function() {
    // Clear the form, ready for adding the next entry
    titleInput.value = '';
    otherBodyInput.value = '';
    bodyInput.value = '';
  };

  // Report on the success of the transaction completing, when everything is done
  transaction.oncomplete = function() {
    console.log('Transaction completed: database modification finished.');

    // update the display of data to show the newly added item, by running displayData() again.
    displayData();
  };

  transaction.onerror = function() {
    console.log('Transaction not opened due to error');
  };
}

// Define the displayData() function
function displayData() {
  // Here we empty the contents of the list element each time the display is updated
  // If you didn't do this, you'd get duplicates listed each time a new note is added
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  // Open our object store and then get a cursor - which iterates through all the
  // different data items in the store
  let objectStore = db.transaction('eventList_os').objectStore('eventList_os');
  objectStore.openCursor().onsuccess = function(e) {
    // Get a reference to the cursor
    let cursor = e.target.result;

    // If there is still another data item to iterate through, keep running this code
    if(cursor) {
      // Create a list item, h3, and p to put each data item inside when displaying it
      // structure the HTML fragment, and append it inside the list
      const listItem = document.createElement('li');
      const h3 = document.createElement('h3');
      const para = document.createElement('p');
      const para2 = document.createElement('p');  /*hours>*/


      listItem.appendChild(h3);
      listItem.appendChild(para);
      listItem.appendChild(para2);
      list.appendChild(listItem);

      // Put the data from the cursor inside the h3 and para
      h3.textContent = "Activity: " + cursor.value.title;
      para.textContent = "Details: " + cursor.value.otherBody;
      para2.textContent = "Date: " + cursor.value.body;

      // Store the ID of the data item inside an attribute on the listItem, so we know
      // which item it corresponds to. This will be useful later when we want to delete items
      listItem.setAttribute('data-eventList-id', cursor.value.id);

      // Create a button and place it inside each listItem
      const deleteBtn = document.createElement('button');
      listItem.appendChild(deleteBtn);
      deleteBtn.textContent = 'Delete';

      // Set an event handler so that when the button is clicked, the deleteItem()
      // function is run
      deleteBtn.onclick = deleteItem;

      // Iterate to the next item in the cursor
      cursor.continue();
    } else {
      // Again, if list item is empty, display a 'No notes stored' message
      if(!list.firstChild) {
        const listItem = document.createElement('li');
        listItem.textContent = 'No events stored.';
        list.appendChild(listItem);
      }
      // if there are no more cursor items to iterate through, say so
      console.log('Events all displayed');
    }
  };
}

// Define the deleteItem() function
function deleteItem(e) {
  // retrieve the name of the task we want to delete. We need
  // to convert it to a number before trying it use it with IDB; IDB key
  // values are type-sensitive.
  let studentListId = Number(e.target.parentNode.getAttribute('data-eventList-id'));

  // open a database transaction and delete the task, finding it using the id we retrieved above
  let transaction = db.transaction(['eventList_os'], 'readwrite');
  let objectStore = transaction.objectStore('eventList_os');
  let request = objectStore.delete(studentListId);

  // report that the data item has been deleted
  transaction.oncomplete = function() {
    // delete the parent of the button
    // which is the list item, so it is no longer displayed
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log('Event ' + eventListId + ' deleted.');

    // Again, if list item is empty, display a 'No notes stored' message
    if(!list.firstChild) {
      let listItem = document.createElement('li');
      listItem.textContent = 'No events stored.';
      list.appendChild(listItem);
    }
  };
}

};