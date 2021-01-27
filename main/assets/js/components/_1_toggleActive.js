var tabtn = document.querySelectorAll('.bottom-navbar-item') // Using a class instead, see note below.


tabtn.forEach((button) => {
    button.addEventListener('click', (e) => {
        for (var item of tabtn) {
            item.removeAttribute('data-state');
        }
        
        button.setAttribute('data-state', 'active');

        e.preventDefault();
        return false;
    });
});