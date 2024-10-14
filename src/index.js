// index.js

// Callbacks
const handleClick = (ramen) => {
  // Add code
  document.querySelector('#ramen-detail .name').textContent = ramen.name;
  document.querySelector('#ramen-detail .restaurant').textContent = ramen.restaurant;
  document.querySelector('#ramen-detail img').src = ramen.image;
  document.querySelector('#ramen-detail img').alt = ramen.name;
  document.querySelector('#rating-display').textContent = ramen.rating;
  document.querySelector('#comment-display').textContent = ramen.comment;

  // Store current ramen ID for updating and deleting
  document.querySelector('#ramen-detail').dataset.id = ramen.id;
};

const addSubmitListener = () => {
  // Add code

  const form = document.getElementById('new-ramen');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newRamen = {
      name: form.name.value,
      restaurant: form.restaurant.value,
      image: form.image.value,
      rating: form.rating.value,
      comment: form['new-comment'].value
    };

    // Add new ramen to the menu
    addRamenToMenu(newRamen);

    // Optionally, persist the new ramen on the server
    createRamen(newRamen);

    // Reset the form
    form.reset();
  });
}

const displayRamens = () => {
  // Add code
  fetch('http://localhost:3000/ramens')
  .then(response => response.json())
  .then(ramens => {
    ramens.forEach(ramen => {
      addRamenToMenu(ramen);
    });

    // Display details of the first ramen on page load
    if (ramens.length > 0) {
      handleClick(ramens[0]);
    }
  });
};

const main = () => {
  // Invoke displayRamens here
  // Invoke addSubmitListener here
  displayRamens();
  addSubmitListener();
  addEditListener();
  addDeleteListener();
}

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};


// Add a ramen image to the #ramen-menu div
function addRamenToMenu(ramen) {
  const img = document.createElement('img');
  img.src = ramen.image;
  img.alt = ramen.name;
  document.getElementById('ramen-menu').appendChild(img);

  // Add event listener to display ramen details on click
  img.addEventListener('click', () => handleClick(ramen));
}

// Create new ramen on the server (POST request)
function createRamen(ramenData) {
  fetch('http://localhost:3000/ramens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ramenData)
  });
}

// Update ramen details based on the edit form submission
function addEditListener() {
  const editForm = document.getElementById('edit-ramen');
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const ramenId = document.querySelector('#ramen-detail').dataset.id;
    const updatedData = {
      rating: document.getElementById('new-rating').value,
      comment: document.getElementById('new-comment').value
    };

    // Update the displayed ramen's rating and comment
    document.querySelector('#rating-display').textContent = updatedData.rating;
    document.querySelector('#comment-display').textContent = updatedData.comment;

    // Persist the updates on the server
    updateRamen(ramenId, updatedData);

    // Reset the edit form
    editForm.reset();
  });
}

// Update ramen on the server (PATCH request)
function updateRamen(ramenId, updatedData) {
  fetch(`http://localhost:3000/ramens/${ramenId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  });
}

// Delete ramen when clicking a delete button
function addDeleteListener() {
  const deleteButton = document.getElementById('delete-ramen');
  deleteButton.addEventListener('click', () => {
    const ramenId = document.querySelector('#ramen-detail').dataset.id;
    if (ramenId) {
      // Remove the ramen from the menu
      const ramenImg = Array.from(document.getElementById('ramen-menu').children)
        .find(img => img.alt === document.querySelector('#ramen-detail .name').textContent);
      if (ramenImg) ramenImg.remove();

      // Clear the ramen detail section
      clearRamenDetails();

      // Optionally, delete the ramen from the server
      deleteRamen(ramenId);
    }
  });
}

// Delete ramen from the server (DELETE request)
function deleteRamen(ramenId) {
  fetch(`http://localhost:3000/ramens/${ramenId}`, {
    method: 'DELETE'
  });
}

// Clear ramen details from the #ramen-detail div
function clearRamenDetails() {
  document.querySelector('#ramen-detail .name').textContent = 'Insert Name Here';
  document.querySelector('#ramen-detail .restaurant').textContent = 'Insert Restaurant Here';
  document.querySelector('#ramen-detail img').src = '';
  document.querySelector('#ramen-detail img').alt = 'Insert Image Here';
  document.querySelector('#rating-display').textContent = 'Insert Rating Here';
  document.querySelector('#comment-display').textContent = 'Insert Comment Here';
  delete document.querySelector('#ramen-detail').dataset.id;
}

// Start the app once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', main);

const form = document.getElementById('new-ramen');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Other code...
  });
}
document.body.innerHTML = `
  <form id="new-ramen">
    <!-- Form content here -->
  </form>
`;

