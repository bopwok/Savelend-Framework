var tabtn = document.querySelectorAll('.toggle-active') // Using a class instead, see note below.


tabtn.forEach((button) => {
    button.addEventListener('click', (e) => {
        for (var item of tabtn) {
            item.classList.remove('active');
        }
        
        button.classList.toggle('active');

        e.preventDefault();
        return false;
    });
});