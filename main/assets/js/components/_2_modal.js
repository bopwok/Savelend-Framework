(function () {
    var Modal = function (elem) {
        this.element = elem;
        this.elementId = this.element.getAttribute('id');
        this.trigger = document.querySelectorAll('[aria-controls="' + this.elementId + '"]');
        this.modalVisibleClass = 'modal--is-visible';

        this.selectedTrigger = false;
        this.sheetIsOpen = false;

        initSheet(this);
        initSheetEvents(this);
    }

    function initSheet(sheet) {
        // init aria-labels
        for (var i = 0; i < sheet.trigger.length; i++) {
            Util.setAttributes(sheet.trigger[i], {
                'aria-expanded': 'false',
                'aria-haspopup': 'true'
            });
        }
    };

    function initSheetEvents(sheet) {
        for (var i = 0; i < sheet.trigger.length; i++) {
            (function (i) {
                sheet.trigger[i].addEventListener('click', function (event) {
                    event.preventDefault();
                    // if the popover had been previously opened by another trigger element -> close it first and reopen in the right position
                    //if (Util.hasClass(sheet.element, sheet.modalVisibleClass) && sheet.selectedTrigger != sheet.trigger[i]) {
                      // toggleSheet(sheet, false, false); // close menu
                    //}
                    // toggle popover
                    sheet.selectedTrigger = sheet.trigger[i];
                    toggleSheet(sheet, !Util.hasClass(sheet.element, sheet.modalVisibleClass));
                });
            })(i);
        }
    };

    function toggleSheet(sheet, bool) {
        // toggle popover visibility
        Util.toggleClass(sheet.element, sheet.modalVisibleClass, bool);
        sheet.sheetIsOpen = bool;
        body = document.getElementsByTagName('body');
        if (bool) {
            sheet.selectedTrigger.setAttribute('aria-expanded', 'true');
            Util.addClass(body[0], 'no-scroll');
            // move focus
            // add class to popover trigger
            Util.addClass(sheet.selectedTrigger);
        } else {
            Util.removeClass(body[0], 'no-scroll');
            sheet.selectedTrigger.setAttribute('aria-expanded', 'false');
            // remove class from menu trigger
            Util.removeClass(sheet.selectedTrigger);
            sheet.selectedTrigger = false;
        }
    };

    window.Modal = Modal;

    //initialize the Popover objects
    var modals = document.getElementsByClassName('js-modal');
    // generic focusable elements string selector

    if (modals.length > 0) {
        var modalsArray = [];
        for (var i = 0; i < modals.length; i++) {
            (function (i) {
                modalsArray.push(new Modal(modals[i]));
            })(i);
        }
    }
}());