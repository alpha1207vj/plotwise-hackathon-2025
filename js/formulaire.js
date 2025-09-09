const toggleButton = document.querySelectorAll('.next_button');
const toggleButton2 = document.querySelectorAll('.back_button');
const Loader = document.querySelector('.loader');
const Loader2 = document.querySelector('.loader_container_child');
const form = document.querySelector("form");
// ==================== NEXT BUTTON ====================
toggleButton.forEach((e) => {
  e.addEventListener('click', (event) => {

    event.preventDefault();

    // Only proceed on first click in a rapid sequence
    if (event.detail && event.detail === 1) {
        
      // Select the fieldset associated with this button
      const data_value = event.currentTarget.dataset.box;
      const currentFieldset = document.querySelector(`.form-${data_value}`);

      // Get all input elements in the fieldset
      const inputs = currentFieldset.querySelectorAll('input');

      // Check if all inputs are filled (ignoring spaces)
      const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');

      if (!allFilled) {
        swal("Remplissez le formulaire");
        return; // stop execution if not all inputs are filled
      }

      // Proceed with your loader and toggle logic
      const current_Percent1 = parseFloat(getComputedStyle(Loader2).width);
      const current_Percent  = parseFloat(getComputedStyle(Loader).width);

      let result = (current_Percent * 100) / current_Percent1;
      console.log(result.toFixed(0));

      let final_width = result + 49;
      if (final_width > 100) {
        final_width = 0;
      }
      Loader.style.width = `${final_width}%`;


      // Toggle the current and next form fieldsets
      const data_value1 = parseFloat(data_value) + 1;
      const toogleForm  = document.querySelector(`.form-${data_value}`);
      const toogleForm1 = document.querySelector(`.form-${data_value1}`);

      toogleForm.style.display  = 'none';
      console.log(toogleForm.style.display);
      if (data_value1 === 3)
      {
        toogleForm1.style.display = 'flex';
        document.querySelector('h5').style.display = 'none';
      }
      else
      {
        toogleForm1.style.display = 'block';
      }
     
    }
  });
});

// ==================== BACK BUTTON ====================
toggleButton2.forEach((e) => {
  e.addEventListener('click', (event) => {

    event.preventDefault();

    // Only proceed on first click in a rapid sequence
    if (event.detail && event.detail === 1) {

      // Get current width of the loader and its container
      current_Percent  = parseFloat(getComputedStyle(Loader).width);
      current_Percent1 = parseFloat(getComputedStyle(Loader2).width);

      // Log current progress for debugging
      console.log((current_Percent * 100) / current_Percent1);

      // Adjust the loader width when going back
      Loader.style.width = `${((current_Percent * 100) / current_Percent1).toFixed(0) - 49}%`;

      // Identify the current step from the button's data attribute
      let data_value = parseFloat(event.currentTarget.dataset.box);


      // Calculate the previous step
      let data_value1 = parseFloat(data_value) - 1;

      // Toggle the current and previous form fieldsets
      const toogleForm  = document.querySelector(`.form-${data_value}`);
      const toogleForm1 = document.querySelector(`.form-${data_value1}`);

      toogleForm.style.display  = 'none';
      toogleForm1.style.display = 'block';

      // Log the previous form display for debugging
      console.log(toogleForm1.style.display);
    }

  });
});

// ==================== PAGE LOAD ====================
window.onload = function() {
    swal("Bienvenue !", "Veuillez remplir ce formulaire d'inscription en suivant les étapes.");
};


form.addEventListener("submit", function(event) {
  event.preventDefault();

  // Build a JSON object from inputs
  const data = {
   name: document.getElementById("name_input").value,
    firstName: document.getElementById("first_name_input").value,
    dateOfBirth: document.getElementById("date_input").value,
    age: document.getElementById("age_input").value,
    phone: document.getElementById("tel_input").value,
    address: document.getElementById("adress_input")?.value 
  };

  // Send JSON to server
  fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(data => {
    document.querySelector('.success_image').src = 'RET/smile.svg';
    console.log("✅ Success:", data);
    document.querySelector('.form-3 p').textContent = 'Vos donnees ont ete conservees avec succes';
  })
  .catch(err => {
    console.error("❌ Error:", err);
     document.querySelector('.success_image').src = 'RET/sweat_smile.svg';
     document.querySelector('.form-3 p').textContent = "Vos donnees n'ont pas ete conservees, veuillez reprendre"
     document.querySelecto('.button_box .next_step_button').display = 'none';
    alert("Erreur lors de l'envoi du formulaire.");
  });
});
