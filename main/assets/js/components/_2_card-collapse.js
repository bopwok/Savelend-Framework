(function () {
    var CardCollapsable = function (elem) {
        this.element = elem;
        this.elementId = this.element.getAttribute('id');
        this.trigger = document.querySelectorAll('[aria-controls="' + this.elementId + '"]');
        this.cardCollapsedClass = 'card--collapsed';

        this.selectedTrigger = false;
        this.collapsed = false;

        initCard(this);
        initCardEvents(this);
    }

    function initCard(card) {
        // init aria-labels
        for (var i = 0; i < card.trigger.length; i++) {
            Util.setAttributes(card.trigger[i], {
                'aria-collapsed': 'false'
            });
        }
    };

    function initCardEvents(card) {
        for (var i = 0; i < card.trigger.length; i++) {
            (function (i) {
                card.trigger[i].addEventListener('click', function (event) {
                    event.preventDefault();
                    card.selectedTrigger = card.trigger[i];
                    toggleCard(card, !Util.hasClass(card.element, card.cardCollapsedClass));
                });
            })(i);
        }
    };

    function toggleCard(card, bool) {
        // toggle popover visibility
        Util.toggleClass(card.element, card.cardCollapsedClass, bool);
        card.collapsed = bool;
        body = document.getElementsByTagName('body');
        if (bool) {
            card.selectedTrigger.setAttribute('aria-expanded', 'true');
            Util.addClass(card.selectedTrigger);
        } else {
            card.selectedTrigger.setAttribute('aria-expanded', 'false');

            Util.removeClass(card.selectedTrigger);
            card.selectedTrigger = false;
        }
    };

    window.CardCollapsable = CardCollapsable;

    //initialize the Popover objects
    var cards = document.getElementsByClassName('card-collapsable');
    // generic focusable elements string selector

    if (cards.length > 0) {
        var cardCollapsableArray = [];
        for (var i = 0; i < cards.length; i++) {
            (function (i) {
                cardCollapsableArray.push(new CardCollapsable(cards[i]));
            })(i);
        }
    }
}());