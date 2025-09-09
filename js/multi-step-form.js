
const toggleButton = document.querySelectorAll('.next_button');
const toggleButton2 = document.querySelectorAll('.back_button');
const Loader = document.querySelector('.loader');
const Loader2 = document.querySelector('.loader_container_child');

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
        alert("Please fill all fields before proceeding.");
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

      const targetButton = document.querySelector(`.button-${data_value}`);
      targetButton.disabled = true;

      const data_value1 = parseFloat(data_value) + 1;
      const toogleForm  = document.querySelector(`.form-${data_value}`);
      const toogleForm1 = document.querySelector(`.form-${data_value1}`);

      toogleForm.style.display  = 'none';
      console.log(toogleForm.style.display);
      toogleForm1.style.display = 'block';

      targetButton.disabled = false;
    }
  });
});


toggleButton2.forEach((e)=>{
 e.addEventListener('click',(event)=>
{
  event.preventDefault();
  current_Percent = parseFloat(getComputedStyle(Loader).width);
  current_Percent1 = parseFloat(getComputedStyle(Loader2).width);
  console.log((current_Percent*100)/current_Percent1);
  Loader.style.width = `${((current_Percent*100)/current_Percent1).toFixed(0) - 49}%`;
    let data_value  = parseFloat(event.currentTarget.dataset.box);
  const targetButton2 = document.querySelector(`.button-${data_value}-1`);
  targetButton2.disabled = true;
  let data_value1 = parseFloat(data_value) - 1;
  const toogleForm = document.querySelector(`.form-${data_value}`);
  const toogleForm1 = document.querySelector(`.form-${data_value1}`);
  toogleForm.style.display = 'none';
  toogleForm1.style.display = 'block';
   console.log(toogleForm1.style.display);
     targetButton2.disabled = false;
})
})

window.onload = function() {
    swal("Hello world!");
};