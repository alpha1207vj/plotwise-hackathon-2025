const toggle_button = document.querySelectorAll('.question .label i');
const questions = document.querySelector('.question');

toggle_button.forEach((e)=>
{
    e.addEventListener('click',(event)=>
    {
        
        let data_value = event.currentTarget.dataset.box;
        const accordion = document.querySelector(`.accordion${data_value}`)
        accordion.classList.toggle('active');
         console.log(data_value);
    })
})