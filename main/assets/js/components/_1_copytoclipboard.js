function showFlashMessage(element) {
  var event = new CustomEvent('showFlashMessage');
  element.dispatchEvent(event);
};

var flashMessage = document.getElementById('copyMessage');

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

var copyItems = document.getElementsByClassName("copytoclipboard");
if (copyItems) {
    for (let copyItem of copyItems) {
        copyItem.addEventListener('click', function() {
            copyToClipboard(copyItem.dataset.copy);
            showFlashMessage(flashMessage);
        });
    };
}