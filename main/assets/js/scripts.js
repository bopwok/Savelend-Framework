// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.getAttribute('class').match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
  else if (!Util.hasClass(el, classList[0])) el.setAttribute('class', el.getAttribute('class') +  " " + classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
    el.setAttribute('class', el.getAttribute('class').replace(reg, ' '));
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
    var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
    if( menuBtns.length > 0 ) {
      for(var i = 0; i < menuBtns.length; i++) {(function(i){
        initMenuBtn(menuBtns[i]);
      })(i);}
  
      function initMenuBtn(btn) {
        btn.addEventListener('click', function(event){	
          event.preventDefault();
          var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
          Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
          // emit custom event
          var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
          btn.dispatchEvent(event);
        });
      };
    }
  }());
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
// File#: _1_hiding-nav
// Usage: codyhouse.co/license
(function() {
    var hidingNav = document.getElementsByClassName('js-hide-nav');
    if(hidingNav.length > 0 && window.requestAnimationFrame) {
      var mainNav = Array.prototype.filter.call(hidingNav, function(element) {
        return Util.hasClass(element, 'js-hide-nav--main');
      }),
      subNav = Array.prototype.filter.call(hidingNav, function(element) {
        return Util.hasClass(element, 'js-hide-nav--sub');
      });
      
      var scrolling = false,
        previousTop = window.scrollY,
        currentTop = window.scrollY,
        scrollDelta = 10,
        scrollOffset = 150, // scrollY needs to be bigger than scrollOffset to hide navigation
        headerHeight = 0; 
  
      var navIsFixed = false; // check if main navigation is fixed
      if(mainNav.length > 0 && Util.hasClass(mainNav[0], 'hide-nav--fixed')) navIsFixed = true;
  
      // store button that triggers navigation on mobile
      var triggerMobile = getTriggerMobileMenu();
      var prevElement = createPrevElement();
      var mainNavTop = 0;
      // list of classes the hide-nav has when it is expanded -> do not hide if it has those classes
      var navOpenClasses = hidingNav[0].getAttribute('data-nav-target-class'),
        navOpenArrayClasses = [];
      if(navOpenClasses) navOpenArrayClasses = navOpenClasses.split(' ');
      getMainNavTop();
      if(mainNavTop > 0) {
        scrollOffset = scrollOffset + mainNavTop;
      }
      
      // init navigation and listen to window scroll event
      getHeaderHeight();
      initSecondaryNav();
      initFixedNav();
      resetHideNav();
      window.addEventListener('scroll', function(event){
        if(scrolling) return;
        scrolling = true;
        window.requestAnimationFrame(resetHideNav);
      });
  
      window.addEventListener('resize', function(event){
        if(scrolling) return;
        scrolling = true;
        window.requestAnimationFrame(function(){
          if(headerHeight > 0) {
            getMainNavTop();
            getHeaderHeight();
            initSecondaryNav();
            initFixedNav();
          }
          // reset both navigation
          hideNavScrollUp();
  
          scrolling = false;
        });
      });
  
      function getHeaderHeight() {
        headerHeight = mainNav[0].offsetHeight;
      };
  
      function initSecondaryNav() { // if there's a secondary nav, set its top equal to the header height
        if(subNav.length < 1 || mainNav.length < 1) return;
        subNav[0].style.top = (headerHeight - 1)+'px';
      };
  
      function initFixedNav() {
        if(!navIsFixed || mainNav.length < 1) return;
        mainNav[0].style.marginBottom = '-'+headerHeight+'px';
      };
  
      function resetHideNav() { // check if navs need to be hidden/revealed
        currentTop = window.scrollY;
        if(currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
          hideNavScrollDown();
        } else if( previousTop - currentTop > scrollDelta || (previousTop - currentTop > 0 && currentTop < scrollOffset) ) {
          hideNavScrollUp();
        } else if( previousTop - currentTop > 0 && subNav.length > 0 && subNav[0].getBoundingClientRect().top > 0) {
          setTranslate(subNav[0], '0%');
        }
        // if primary nav is fixed -> toggle bg class
        if(navIsFixed) {
          var scrollTop = window.scrollY || window.pageYOffset;
          Util.toggleClass(mainNav[0], 'hide-nav--has-bg', (scrollTop > headerHeight + mainNavTop));
        }
        previousTop = currentTop;
        scrolling = false;
      };
  
      function hideNavScrollDown() {
        // if there's a secondary nav -> it has to reach the top before hiding nav
        if( subNav.length  > 0 && subNav[0].getBoundingClientRect().top > headerHeight) return;
        // on mobile -> hide navigation only if dropdown is not open
        if(triggerMobile && triggerMobile.getAttribute('aria-expanded') == "true") return;
        // check if main nav has one of the following classes
        if( mainNav.length > 0 && (!navOpenClasses || !checkNavExpanded())) {
          setTranslate(mainNav[0], '-100%'); 
          mainNav[0].addEventListener('transitionend', addOffCanvasClass);
        }
        if( subNav.length  > 0 ) setTranslate(subNav[0], '-'+headerHeight+'px');
      };
  
      function hideNavScrollUp() {
        if( mainNav.length > 0 ) {setTranslate(mainNav[0], '0%'); Util.removeClass(mainNav[0], 'hide-nav--off-canvas');mainNav[0].removeEventListener('transitionend', addOffCanvasClass);}
        if( subNav.length  > 0 ) setTranslate(subNav[0], '0%');
      };
  
      function addOffCanvasClass() {
        mainNav[0].removeEventListener('transitionend', addOffCanvasClass);
        Util.addClass(mainNav[0], 'hide-nav--off-canvas');
      };
  
      function setTranslate(element, val) {
        element.style.transform = 'translateY('+val+')';
      };
  
      function getTriggerMobileMenu() {
        // store trigger that toggle mobile navigation dropdown
        var triggerMobileClass = hidingNav[0].getAttribute('data-mobile-trigger');
        if(!triggerMobileClass) return false;
        if(triggerMobileClass.indexOf('#') == 0) { // get trigger by ID
          var trigger = document.getElementById(triggerMobileClass.replace('#', ''));
          if(trigger) return trigger;
        } else { // get trigger by class name
          var trigger = hidingNav[0].getElementsByClassName(triggerMobileClass);
          if(trigger.length > 0) return trigger[0];
        }
        
        return false;
      };
  
      function createPrevElement() {
        // create element to be inserted right before the mainNav to get its top value
        if( mainNav.length < 1) return false;
        var newElement = document.createElement("div"); 
        newElement.setAttribute('aria-hidden', 'true');
        mainNav[0].parentElement.insertBefore(newElement, mainNav[0]);
        var prevElement =  mainNav[0].previousElementSibling;
        prevElement.style.opacity = '0';
        return prevElement;
      };
  
      function getMainNavTop() {
        if(!prevElement) return;
        mainNavTop = prevElement.getBoundingClientRect().top + window.scrollY;
      };
  
      function checkNavExpanded() {
        var navIsOpen = false;
        for(var i = 0; i < navOpenArrayClasses.length; i++){
          if(Util.hasClass(mainNav[0], navOpenArrayClasses[i].trim())) {
            navIsOpen = true;
            break;
          }
        }
        return navIsOpen;
      };
      
    } else {
      // if window requestAnimationFrame is not supported -> add bg class to fixed header
      var mainNav = document.getElementsByClassName('js-hide-nav--main');
      if(mainNav.length < 1) return;
      if(Util.hasClass(mainNav[0], 'hide-nav--fixed')) Util.addClass(mainNav[0], 'hide-nav--has-bg');
    }
  }());
// File#: _1_popover
// Usage: codyhouse.co/license
(function() {
  var Popover = function(element) {
    this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
    this.popoverVisibleClass = 'popover--is-visible';
    this.selectedTriggerClass = 'popover-control--active';
    this.popoverIsOpen = false;
    // focusable elements
    this.firstFocusable = false;
		this.lastFocusable = false;
		// position target - position tooltip relative to a specified element
		this.positionTarget = getPositionTarget(this);
		// gap between element and viewport - if there's max-height 
		this.viewportGap = parseInt(getComputedStyle(this.element).getPropertyValue('--popover-viewport-gap')) || 20;
		initPopover(this);
		initPopoverEvents(this);
  };

  // public methods
  Popover.prototype.togglePopover = function(bool, moveFocus) {
    togglePopover(this, bool, moveFocus);
  };

  Popover.prototype.checkPopoverClick = function(target) {
    checkPopoverClick(this, target);
  };

  Popover.prototype.checkPopoverFocus = function() {
    checkPopoverFocus(this);
  };

	// private methods
	function getPositionTarget(popover) {
		// position tooltip relative to a specified element - if provided
		var positionTargetSelector = popover.element.getAttribute('data-position-target');
		if(!positionTargetSelector) return false;
		var positionTarget = document.querySelector(positionTargetSelector);
		return positionTarget;
	};

  function initPopover(popover) {
		// init aria-labels
		for(var i = 0; i < popover.trigger.length; i++) {
			Util.setAttributes(popover.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
		}
  };
  
  function initPopoverEvents(popover) {
		for(var i = 0; i < popover.trigger.length; i++) {(function(i){
			popover.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the popover had been previously opened by another trigger element -> close it first and reopen in the right position
				if(Util.hasClass(popover.element, popover.popoverVisibleClass) && popover.selectedTrigger !=  popover.trigger[i]) {
					togglePopover(popover, false, false); // close menu
				}
				// toggle popover
				popover.selectedTrigger = popover.trigger[i];
				togglePopover(popover, !Util.hasClass(popover.element, popover.popoverVisibleClass), true);
			});
    })(i);}
    
    // trap focus
    popover.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside popover
        trapFocus(popover, event);
      }
    });
  };
  
  function togglePopover(popover, bool, moveFocus) {
		// toggle popover visibility
		Util.toggleClass(popover.element, popover.popoverVisibleClass, bool);
		popover.popoverIsOpen = bool;
		if(bool) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'true');
      getFocusableElements(popover);
      // move focus
      focusPopover(popover);
			popover.element.addEventListener("transitionend", function(event) {focusPopover(popover);}, {once: true});
			// position the popover element
			positionPopover(popover);
			// add class to popover trigger
			Util.addClass(popover.selectedTrigger, popover.selectedTriggerClass);
		} else if(popover.selectedTrigger) {
			popover.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(popover.selectedTrigger);
			// remove class from menu trigger
			Util.removeClass(popover.selectedTrigger, popover.selectedTriggerClass);
			popover.selectedTrigger = false;
		}
	};
	
	function focusPopover(popover) {
		if(popover.firstFocusable) {
			popover.firstFocusable.focus();
		} else {
			Util.moveFocus(popover.element);
		}
	};

  function positionPopover(popover) {
		// reset popover position
		resetPopoverStyle(popover);
		var selectedTriggerPosition = (popover.positionTarget) ? popover.positionTarget.getBoundingClientRect() : popover.selectedTrigger.getBoundingClientRect();
		
		var menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + popover.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + popover.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - popover.element.offsetWidth)/2)+'px;';
		// check if popover needs a max-height (user will scroll inside the popover)
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - popover.viewportGap : window.innerHeight - selectedTriggerPosition.bottom - popover.viewportGap;

		var initialStyle = popover.element.getAttribute('style');
		if(!initialStyle) initialStyle = '';
		popover.element.setAttribute('style', initialStyle + horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};
	
	function resetPopoverStyle(popover) {
		// remove popover inline style before appling new style
		popover.element.style.maxHeight = '';
		popover.element.style.top = '';
		popover.element.style.bottom = '';
		popover.element.style.left = '';
		popover.element.style.right = '';
	};

  function checkPopoverClick(popover, target) {
    // close popover when clicking outside it
    if(!popover.popoverIsOpen) return;
    if(!popover.element.contains(target) && !target.closest('[aria-controls="'+popover.elementId+'"]')) togglePopover(popover, false);
  };

  function checkPopoverFocus(popover) {
    // on Esc key -> close popover if open and move focus (if focus was inside popover)
    if(!popover.popoverIsOpen) return;
    var popoverParent = document.activeElement.closest('.js-popover');
    togglePopover(popover, false, popoverParent);
  };
  
  function getFocusableElements(popover) {
    //get all focusable elements inside the popover
		var allFocusable = popover.element.querySelectorAll(focusableElString);
		getFirstVisible(popover, allFocusable);
		getLastVisible(popover, allFocusable);
  };

  function getFirstVisible(popover, elements) {
		//get first visible focusable element inside the popover
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				popover.firstFocusable = elements[i];
				break;
			}
		}
	};

  function getLastVisible(popover, elements) {
		//get last visible focusable element inside the popover
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				popover.lastFocusable = elements[i];
				break;
			}
		}
  };

  function trapFocus(popover, event) {
    if( popover.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of popover
			event.preventDefault();
			popover.lastFocusable.focus();
		}
		if( popover.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of popover
			event.preventDefault();
			popover.firstFocusable.focus();
		}
  };
  
  function isVisible(element) {
		// check if element is visible
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

  window.Popover = Popover;

  //initialize the Popover objects
  var popovers = document.getElementsByClassName('js-popover');
  // generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	
	if( popovers.length > 0 ) {
		var popoversArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < popovers.length; i++) {
			(function(i){
				popoversArray.push(new Popover(popovers[i]));
				var scrollableElement = popovers[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close popover on 'Esc'
				popoversArray.forEach(function(element){
					element.checkPopoverFocus();
				});
			} 
		});
		// close popover when clicking outside it
		window.addEventListener('click', function(event){
			popoversArray.forEach(function(element){
				element.checkPopoverClick(event.target);
			});
		});
		// on resize -> close all popover elements
		window.addEventListener('resize', function(event){
			popoversArray.forEach(function(element){
				element.togglePopover(false, false);
			});
		});
		// on scroll -> close all popover elements
		window.addEventListener('scroll', function(event){
			popoversArray.forEach(function(element){
				if(element.popoverIsOpen) element.togglePopover(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					popoversArray.forEach(function(element){
						if(element.popoverIsOpen) element.togglePopover(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_slider
// Usage: codyhouse.co/license
(function() {
	var Slider = function(element) {
		this.element = element;
		this.rangeWrapper = this.element.getElementsByClassName('slider__range');
		this.rangeInput = this.element.getElementsByClassName('slider__input');
		this.value = this.element.getElementsByClassName('js-slider__value'); 
		this.floatingValue = this.element.getElementsByClassName('js-slider__value--floating'); 
		this.rangeMin = this.rangeInput[0].getAttribute('min');
		this.rangeMax = this.rangeInput[0].getAttribute('max');
		this.sliderWidth = window.getComputedStyle(this.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
		this.thumbWidth = getComputedStyle(this.element).getPropertyValue('--slide-thumb-size');
		this.isInputVar = (this.value[0].tagName.toLowerCase() == 'input');
		this.isFloatingVar = this.floatingValue.length > 0;
		if(this.isFloatingVar) {
			this.floatingValueLeft = window.getComputedStyle(this.floatingValue[0]).getPropertyValue('left');
		}
		initSlider(this);
	};

	function initSlider(slider) {
		updateLabelValues(slider);// update label/input value so that it is the same as the input range
		updateLabelPosition(slider, false); // update label position if floating variation
		updateRangeColor(slider, false); // update range bg color
		checkRangeSupported(slider); // hide label/input value if input range is not supported
		
		// listen to change in the input range
		for(var i = 0; i < slider.rangeInput.length; i++) {
			(function(i){
				slider.rangeInput[i].addEventListener('input', function(event){
					updateSlider(slider, i);
				});
				slider.rangeInput[i].addEventListener('change', function(event){ // fix issue on IE where input event is not emitted
					updateSlider(slider, i);
				});
			})(i);
		}

		// if there's an input text, listen for changes in value, validate it and then update slider
		if(slider.isInputVar) {
			for(var i = 0; i < slider.value.length; i++) {
				(function(i){
					slider.value[i].addEventListener('change', function(event){
						updateRange(slider, i);
					});
				})(i);
			}
		}

		// native <input> element has been updated (e.g., form reset) -> update custom appearance
		slider.element.addEventListener('slider-updated', function(event){
			for(var i = 0; i < slider.value.length; i++) {updateSlider(slider, i);}
		});

		// custom events - emitted if slider has allows for multi-values
		slider.element.addEventListener('inputRangeLimit', function(event){
			updateLabelValues(slider);
			updateLabelPosition(slider, event.detail);
		});
	};

	function updateSlider(slider, index) {
        slider.sliderWidth = window.getComputedStyle(slider.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
		updateLabelValues(slider);
		updateLabelPosition(slider, index);
		updateRangeColor(slider, index);
	};

	function updateLabelValues(slider) {
		for(var i = 0; i < slider.rangeInput.length; i++) {
			slider.isInputVar ? slider.value[i].value = slider.rangeInput[i].value : slider.value[i].textContent = slider.rangeInput[i].value;
		}
	};

	function updateLabelPosition(slider, index) {
		if(!slider.isFloatingVar) return;
		var i = index ? index : 0,
			j = index ? index + 1: slider.rangeInput.length;
		for(var k = i; k < j; k++) {
			var percentage = (slider.rangeInput[k].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin);
			slider.floatingValue[k].style.left = 'calc(0.5 * '+slider.floatingValueLeft+' + '+percentage+' * ( '+slider.sliderWidth+' - '+slider.floatingValueLeft+' ))';
		}
	};

	function updateRangeColor(slider, index) {
		if(slider.rangeInput.length > 1) {slider.element.dispatchEvent(new CustomEvent('updateRange', {detail: index}));return;}
		var percentage = parseInt((slider.rangeInput[0].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100),
			fill = 'calc('+percentage+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)',
			empty = 'calc('+slider.sliderWidth+' - '+percentage+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)';

		slider.rangeWrapper[0].style.setProperty('--slider-fill-value', fill);
		slider.rangeWrapper[0].style.setProperty('--slider-empty-value', empty);
	};

	function updateRange(slider, index) {
		var newValue = parseFloat(slider.value[index].value);
		if(isNaN(newValue)) {
			slider.value[index].value = slider.rangeInput[index].value;
			return;
		} else {
			if(newValue < slider.rangeMin) newValue = slider.rangeMin;
			if(newValue > slider.rangeMax) newValue = slider.rangeMax;
			slider.rangeInput[index].value = newValue;
			var inputEvent = new Event('change');
			slider.rangeInput[index].dispatchEvent(inputEvent);
		}
	};

	function checkRangeSupported(slider) {
		var input = document.createElement("input");
		input.setAttribute("type", "range");
		Util.toggleClass(slider.element, 'slider--range-not-supported', input.type !== "range");
	};

	//initialize the Slider objects
	var sliders = document.getElementsByClassName('js-slider');
	if( sliders.length > 0 ) {
		for( var i = 0; i < sliders.length; i++) {
			(function(i){new Slider(sliders[i]);})(i);
		}
	}
}());
// File#: _1_swipe-content
(function() {
	var SwipeContent = function(element) {
		this.element = element;
		this.delta = [false, false];
		this.dragging = false;
		this.intervalId = false;
		initSwipeContent(this);
	};

	function initSwipeContent(content) {
		content.element.addEventListener('mousedown', handleEvent.bind(content));
		content.element.addEventListener('touchstart', handleEvent.bind(content));
	};

	function initDragging(content) {
		//add event listeners
		content.element.addEventListener('mousemove', handleEvent.bind(content));
		content.element.addEventListener('touchmove', handleEvent.bind(content));
		content.element.addEventListener('mouseup', handleEvent.bind(content));
		content.element.addEventListener('mouseleave', handleEvent.bind(content));
		content.element.addEventListener('touchend', handleEvent.bind(content));
	};

	function cancelDragging(content) {
		//remove event listeners
		if(content.intervalId) {
			(!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
			content.intervalId = false;
		}
		content.element.removeEventListener('mousemove', handleEvent.bind(content));
		content.element.removeEventListener('touchmove', handleEvent.bind(content));
		content.element.removeEventListener('mouseup', handleEvent.bind(content));
		content.element.removeEventListener('mouseleave', handleEvent.bind(content));
		content.element.removeEventListener('touchend', handleEvent.bind(content));
	};

	function handleEvent(event) {
		switch(event.type) {
			case 'mousedown':
			case 'touchstart':
				startDrag(this, event);
				break;
			case 'mousemove':
			case 'touchmove':
				drag(this, event);
				break;
			case 'mouseup':
			case 'mouseleave':
			case 'touchend':
				endDrag(this, event);
				break;
		}
	};

	function startDrag(content, event) {
		content.dragging = true;
		// listen to drag movements
		initDragging(content);
		content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
		// emit drag start event
		emitSwipeEvents(content, 'dragStart', content.delta, event.target);
	};

	function endDrag(content, event) {
		cancelDragging(content);
		// credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
		var dx = parseInt(unify(event).clientX), 
	    dy = parseInt(unify(event).clientY);
	  
	  // check if there was a left/right swipe
		if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
	    var s = getSign(dx - content.delta[0]);
			
			if(Math.abs(dx - content.delta[0]) > 30) {
				(s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
			}
	    
	    content.delta[0] = false;
	  }
		// check if there was a top/bottom swipe
	  if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
	  	var y = getSign(dy - content.delta[1]);

	  	if(Math.abs(dy - content.delta[1]) > 30) {
	    	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
	    }

	    content.delta[1] = false;
	  }
		// emit drag end event
	  emitSwipeEvents(content, 'dragEnd', [dx, dy]);
	  content.dragging = false;
	};

	function drag(content, event) {
		if(!content.dragging) return;
		// emit dragging event with coordinates
		(!window.requestAnimationFrame) 
			? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
			: content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
	};

	function emitDrag(event) {
		emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
	};

	function unify(event) { 
		// unify mouse and touch events
		return event.changedTouches ? event.changedTouches[0] : event; 
	};

	function emitSwipeEvents(content, eventName, detail, el) {
		var trigger = false;
		if(el) trigger = el;
		// emit event with coordinates
		var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
		content.element.dispatchEvent(event);
	};

	function getSign(x) {
		if(!Math.sign) {
			return ((x > 0) - (x < 0)) || +x;
		} else {
			return Math.sign(x);
		}
	};

	window.SwipeContent = SwipeContent;
	
	//initialize the SwipeContent objects
	var swipe = document.getElementsByClassName('js-swipe-content');
	if( swipe.length > 0 ) {
		for( var i = 0; i < swipe.length; i++) {
			(function(i){new SwipeContent(swipe[i]);})(i);
		}
	}
}());
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
// File#: _2_chart
// Usage: codyhouse.co/license
(function() {
    var Chart = function(opts) {
      this.options = Util.extend(Chart.defaults , opts);
      this.element = this.options.element.getElementsByClassName('js-chart__area')[0];
      this.svgPadding = this.options.padding;
      this.topDelta = this.svgPadding;
      this.bottomDelta = 0;
      this.leftDelta = 0;
      this.rightDelta = 0;
      this.legendHeight = 0;
      this.yChartMaxWidth = 0;
      this.yAxisHeight = 0;
      this.xAxisWidth = 0;
      this.yAxisInterval = []; // used to store min and max value on y axis
      this.xAxisInterval = []; // used to store min and max value on x axis
      this.datasetScaled = []; // used to store set data converted to chart coordinates
      this.datasetScaledFlat = []; // used to store set data converted to chart coordinates for animation
      this.datasetAreaScaled = []; // used to store set data (area part) converted to chart coordinates
      this.datasetAreaScaledFlat = []; // used to store set data (area part)  converted to chart coordinates for animation
      // columns chart - store if x axis label where rotated
      this.xAxisLabelRotation = false;
      // tooltip
      this.interLine = false;
      this.markers = false;
      this.tooltipOn = this.options.tooltip && this.options.tooltip.enabled;
      this.tooltipClasses = (this.tooltipOn && this.options.tooltip.classes) ? this.options.tooltip.classes : '';
      this.tooltipPosition = (this.tooltipOn && this.options.tooltip.position) ? this.options.tooltip.position : false;
      this.tooltipDelta = 10;
      this.selectedMarker = false;
      this.selectedMarkerClass = 'chart__marker--selected';
      this.selectedBarClass = 'chart__data-bar--selected';
      this.hoverId = false;
      this.hovering = false;
      // events id
      this.eventIds = []; // will use to store event ids
      // accessibility
      this.categories = this.options.element.getElementsByClassName('js-chart__category');
      this.loaded = false;
      // init chart
      initChartInfo(this);
      initChart(this);
      // if externalDate == true
      initExternalData(this);
    };
  
    function initChartInfo(chart) {
      // we may need to store store some initial config details before setting up the chart
      if(chart.options.type == 'column') {
        setChartColumnSize(chart);
      }
    };
  
    function initChart(chart) {
      if(chart.options.datasets.length == 0) return; // no data where provided
      if(!intObservSupported) chart.options.animate = false; // do not animate if intersectionObserver is not supported
      // init event ids variables
      intEventIds(chart);
      setChartSize(chart);
      createChartSvg(chart);
      createSrTables(chart); // chart accessibility
      animateChart(chart); // if animate option is true
      resizeChart(chart);
      chart.loaded = true;
    };
  
    function intEventIds(chart) {
      chart.eventIds['resize'] = false;
    };
  
    function setChartSize(chart) {
      chart.height = chart.element.clientHeight;
      chart.width = chart.element.clientWidth;
    };
  
    function createChartSvg(chart) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="'+chart.width+'" height="'+chart.height+'" class="chart__svg js-chart__svg"></svg>';
      chart.element.innerHTML = svg;
      chart.svg = chart.element.getElementsByClassName('js-chart__svg')[0];
  
      // create chart content
      switch (chart.options.type) {
        case 'pie':
          getPieSvgCode(chart);
          break;
        case 'doughnut':
          getDoughnutSvgCode(chart);
          break;
        case 'column':
          getColumnSvgCode(chart);
          break;
        default:
          getLinearSvgCode(chart);
      }
    };
  
    function getLinearSvgCode(chart) { // svg for linear + area charts
      setYAxis(chart);
      setXAxis(chart);
      updateChartWidth(chart);
      placexAxisLabels(chart);
      placeyAxisLabels(chart);
      setChartDatasets(chart);
      initTooltips(chart);
    };
  
    function getColumnSvgCode(chart) { // svg for column charts
      setYAxis(chart);
      setXAxis(chart);
      updateChartWidth(chart);
      placexAxisLabels(chart);
      placeyAxisLabels(chart);
      resetColumnChart(chart);
      setColumnChartDatasets(chart);
      initTooltips(chart);
    };
  
    function setXAxis(chart) {
      // set legend of axis if available
      if( chart.options.xAxis && chart.options.xAxis.legend) {
        var textLegend = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textLegend.textContent = chart.options.xAxis.legend;
        Util.setAttributes(textLegend, {class: 'chart__axis-legend chart__axis-legend--x js-chart__axis-legend--x'});
        chart.svg.appendChild(textLegend);
  
        var xLegend = chart.element.getElementsByClassName('js-chart__axis-legend--x')[0];
  
        if(isVisible(xLegend)) {
          var size = xLegend.getBBox(),
            xPosition = chart.width/2 - size.width/2,
            yPosition = chart.height - chart.bottomDelta;
  
          Util.setAttributes(xLegend, {x: xPosition, y: yPosition});
          chart.bottomDelta = chart.bottomDelta + size.height +chart.svgPadding;
        }
      }
  
      // get interval and create scale
      var xLabels;
      if(chart.options.xAxis && chart.options.xAxis.labels && chart.options.xAxis.labels.length > 1) {
        xLabels = chart.options.xAxis.labels;
        chart.xAxisInterval = [0, chart.options.xAxis.labels.length - 1];
      } else {
        xLabels = getChartXLabels(chart); // this function is used to set chart.xAxisInterval as well
      }
      // modify axis labels
      if(chart.options.xAxis && chart.options.xAxis.labelModifier) {
        xLabels = modifyAxisLabel(xLabels, chart.options.xAxis.labelModifier);
      } 
  
      var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      Util.setAttributes(gEl, {class: 'chart__axis-labels chart__axis-labels--x js-chart__axis-labels--x'});
  
      for(var i = 0; i < xLabels.length; i++) {
        var textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        var labelClasses = (chart.options.xAxis && chart.options.xAxis.labels) ? 'chart__axis-label chart__axis-label--x js-chart__axis-label' : 'is-hidden js-chart__axis-label';
        Util.setAttributes(textEl, {class: labelClasses, 'alignment-baseline': 'middle'});
        textEl.textContent = xLabels[i];
        gEl.appendChild(textEl);
      }
      
      if(chart.options.xAxis && chart.options.xAxis.line) {
        var lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        Util.setAttributes(lineEl, {class: 'chart__axis chart__axis--x js-chart__axis--x', 'stroke-linecap': 'square'});
        gEl.appendChild(lineEl);
      }
  
      var ticksLength = xLabels.length;
      if(chart.options.type == 'column') ticksLength = ticksLength + 1;
      
      for(var i = 0; i < ticksLength; i++) {
        var tickEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        var classTicks = (chart.options.xAxis && chart.options.xAxis.ticks) ? 'chart__tick chart__tick-x js-chart__tick-x' : 'js-chart__tick-x';
        Util.setAttributes(tickEl, {class: classTicks, 'stroke-linecap': 'square'});
        gEl.appendChild(tickEl);
      }
  
      chart.svg.appendChild(gEl);
    };
  
    function setYAxis(chart) {
      // set legend of axis if available
      if( chart.options.yAxis && chart.options.yAxis.legend) {
        var textLegend = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textLegend.textContent = chart.options.yAxis.legend;
        textLegend.setAttribute('class', 'chart__axis-legend chart__axis-legend--y js-chart__axis-legend--y');
        chart.svg.appendChild(textLegend);
  
        var yLegend = chart.element.getElementsByClassName('js-chart__axis-legend--y')[0];
        if(isVisible(yLegend)) {
          var height = yLegend.getBBox().height,
            xPosition = chart.leftDelta + height/2,
            yPosition = chart.topDelta;
      
          Util.setAttributes(yLegend, {x: xPosition, y: yPosition});
          chart.leftDelta = chart.leftDelta + height + chart.svgPadding;
        }
      }
      // get interval and create scale
      var yLabels;
      if(chart.options.yAxis && chart.options.yAxis.labels && chart.options.yAxis.labels.length > 1) {
        yLabels = chart.options.yAxis.labels;
        chart.yAxisInterval = [0, chart.options.yAxis.labels.length - 1];
      } else {
        yLabels = getChartYLabels(chart); // this function is used to set chart.yAxisInterval as well
      }
  
      // modify axis labels
      if(chart.options.yAxis && chart.options.yAxis.labelModifier) {
        yLabels = modifyAxisLabel(yLabels, chart.options.yAxis.labelModifier);
      } 
  
      var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      Util.setAttributes(gEl, {class: 'chart__axis-labels chart__axis-labels--y js-chart__axis-labels--y'});
  
      for(var i = yLabels.length - 1; i >= 0; i--) {
        var textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        var labelClasses = (chart.options.yAxis && chart.options.yAxis.labels) ? 'chart__axis-label chart__axis-label--y js-chart__axis-label' : 'is-hidden js-chart__axis-label';
        Util.setAttributes(textEl, {class: labelClasses, 'alignment-baseline': 'middle'});
        textEl.textContent = yLabels[i];
        gEl.appendChild(textEl);
      }
  
      if(chart.options.yAxis && chart.options.yAxis.line) {
        var lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        Util.setAttributes(lineEl, {class: 'chart__axis chart__axis--y js-chart__axis--y', 'stroke-linecap': 'square'});
        gEl.appendChild(lineEl);
      }
  
      var hideGuides = chart.options.xAxis && chart.options.xAxis.hasOwnProperty('guides') && !chart.options.xAxis.guides;
      for(var i = 1; i < yLabels.length; i++ ) {
        var rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        Util.setAttributes(rectEl, {class: 'chart__guides js-chart__guides'});
        if(hideGuides) {
          Util.setAttributes(rectEl, {class: 'chart__guides js-chart__guides opacity-0'});
        }
        gEl.appendChild(rectEl);
      }
      chart.svg.appendChild(gEl);
    };
  
    function updateChartWidth(chart) {
      var labels = chart.element.getElementsByClassName('js-chart__axis-labels--y')[0].querySelectorAll('.js-chart__axis-label');
  
      if(isVisible(labels[0])) {
        chart.yChartMaxWidth = getLabelMaxSize(labels, 'width');
        chart.leftDelta = chart.leftDelta + chart.svgPadding + chart.yChartMaxWidth + chart.svgPadding;
      } else {
        chart.leftDelta = chart.leftDelta + chart.svgPadding;
      }
  
      var xLabels = chart.element.getElementsByClassName('js-chart__axis-labels--x')[0].querySelectorAll('.js-chart__axis-label');
      if(isVisible(xLabels[0]) && !isVisible(labels[0])) {
        chart.leftDelta = chart.leftDelta + xLabels[0].getBBox().width*0.5;
      }
    };
  
    function placeyAxisLabels(chart) {
      var labels = chart.element.getElementsByClassName('js-chart__axis-labels--y')[0].querySelectorAll('.js-chart__axis-label');
  
      var labelsVisible = isVisible(labels[0]);
      var height = 0;
      if(labelsVisible) height = labels[0].getBBox().height*0.5;
      
      // update topDelta and set chart height
      chart.topDelta = chart.topDelta + height + chart.svgPadding;
      chart.yAxisHeight = chart.height - chart.topDelta - chart.bottomDelta;
  
      var yDelta = chart.yAxisHeight/(labels.length - 1);
  
      var gridRect = chart.element.getElementsByClassName('js-chart__guides'),
        dasharray = ""+chart.xAxisWidth+" "+(2*(chart.xAxisWidth + yDelta))+"";
  
      for(var i = 0; i < labels.length; i++) {
        var labelWidth = 0;
        if(labelsVisible) labelWidth = labels[i].getBBox().width;
        // chart.leftDelta has already been updated in updateChartWidth() function
        Util.setAttributes(labels[i], {x: chart.leftDelta - labelWidth - 2*chart.svgPadding, y: chart.topDelta + yDelta*i });
        // place grid rectangles
        if(gridRect[i]) Util.setAttributes(gridRect[i], {x: chart.leftDelta, y: chart.topDelta + yDelta*i, height: yDelta, width: chart.xAxisWidth, 'stroke-dasharray': dasharray});
      }
  
      // place the y axis
      var yAxis = chart.element.getElementsByClassName('js-chart__axis--y');
      if(yAxis.length > 0) {
        Util.setAttributes(yAxis[0], {x1: chart.leftDelta, x2: chart.leftDelta, y1: chart.topDelta, y2: chart.topDelta + chart.yAxisHeight})
      }
      // center y axis label
      var yLegend = chart.element.getElementsByClassName('js-chart__axis-legend--y');
      if(yLegend.length > 0 && isVisible(yLegend[0]) ) {
        var position = yLegend[0].getBBox(),
          height = position.height,
          yPosition = position.y + 0.5*(chart.yAxisHeight + position.width),
          xPosition = position.x + height/4;
        
        Util.setAttributes(yLegend[0], {y: yPosition, x: xPosition, transform: 'rotate(-90 '+(position.x + height)+' '+(yPosition + height/2)+')'});
      }
    };
  
    function placexAxisLabels(chart) {
      var labels = chart.element.getElementsByClassName('js-chart__axis-labels--x')[0].querySelectorAll('.js-chart__axis-label');
      var ticks = chart.element.getElementsByClassName('js-chart__tick-x');
  
      // increase rightDelta value
      var labelWidth = 0,
        labelsVisible = isVisible(labels[labels.length - 1]);
      if(labelsVisible) labelWidth = labels[labels.length - 1].getBBox().width;
      if(chart.options.type != 'column') {
        chart.rightDelta = chart.rightDelta + labelWidth*0.5 + chart.svgPadding;
      } else {
        chart.rightDelta = chart.rightDelta + 4;
      }
      chart.xAxisWidth = chart.width - chart.leftDelta - chart.rightDelta;
      
  
      var maxHeight = getLabelMaxSize(labels, 'height'),
        maxWidth = getLabelMaxSize(labels, 'width'),
        xDelta = chart.xAxisWidth/(labels.length - 1);
  
      if(chart.options.type == 'column') xDelta = chart.xAxisWidth/labels.length;
  
      var totWidth = 0,
        height = 0;
      if(labelsVisible)  height = labels[0].getBBox().height;
  
      for(var i = 0; i < labels.length; i++) {
        var width = 0;
        if(labelsVisible) width = labels[i].getBBox().width;
        // label
        Util.setAttributes(labels[i], {y: chart.height - chart.bottomDelta - height/2, x: chart.leftDelta + xDelta*i - width/2});
        // tick
        Util.setAttributes(ticks[i], {y1: chart.height - chart.bottomDelta - maxHeight - chart.svgPadding, y2: chart.height - chart.bottomDelta - maxHeight - chart.svgPadding + 5, x1: chart.leftDelta + xDelta*i, x2: chart.leftDelta + xDelta*i});
        totWidth = totWidth + width + 4;
      }
      // for columns chart -> there's an additional tick element
      if(chart.options.type == 'column' && ticks[labels.length]) {
        Util.setAttributes(ticks[labels.length], {y1: chart.height - chart.bottomDelta - maxHeight - chart.svgPadding, y2: chart.height - chart.bottomDelta - maxHeight - chart.svgPadding + 5, x1: chart.leftDelta + xDelta*labels.length, x2: chart.leftDelta + xDelta*labels.length});
      }
      //check if we need to rotate chart label -> not enough space
      if(totWidth >= chart.xAxisWidth) {
        chart.xAxisLabelRotation = true;
        rotatexAxisLabels(chart, labels, ticks, maxWidth - maxHeight);
        maxHeight = maxWidth;
      } else {
        chart.xAxisLabelRotation = false;
      }
  
      chart.bottomDelta = chart.bottomDelta + chart.svgPadding + maxHeight;
  
      // place the x axis
      var xAxis = chart.element.getElementsByClassName('js-chart__axis--x');
      if(xAxis.length > 0) {
        Util.setAttributes(xAxis[0], {x1: chart.leftDelta, x2: chart.width - chart.rightDelta, y1: chart.height - chart.bottomDelta, y2: chart.height - chart.bottomDelta})
      }
  
      // center x-axis label
      var xLegend = chart.element.getElementsByClassName('js-chart__axis-legend--x');
      if(xLegend.length > 0 && isVisible(xLegend[0])) {
        xLegend[0].setAttribute('x', chart.leftDelta + 0.5*(chart.xAxisWidth - xLegend[0].getBBox().width));
      }
    };
  
    function rotatexAxisLabels(chart, labels, ticks, delta) {
      // there's not enough horiziontal space -> we need to rotate the x axis labels
      for(var i = 0; i < labels.length; i++) {
        var dimensions = labels[i].getBBox(),
          xCenter = parseFloat(labels[i].getAttribute('x')) + dimensions.width/2,
          yCenter = parseFloat(labels[i].getAttribute('y'))  - delta;
  
        Util.setAttributes(labels[i], {y: parseFloat(labels[i].getAttribute('y')) - delta, transform: 'rotate(-45 '+xCenter+' '+yCenter+')'});
  
        ticks[i].setAttribute('transform', 'translate(0 -'+delta+')');
      }
      if(ticks[labels.length]) ticks[labels.length].setAttribute('transform', 'translate(0 -'+delta+')');
    };
  
    function setChartDatasets(chart) {
      var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gEl.setAttribute('class', 'chart__dataset js-chart__dataset');
      chart.datasetScaled = [];
      for(var i = 0; i < chart.options.datasets.length; i++) {
        var gSet = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gSet.setAttribute('class', 'chart__set chart__set--'+(i+1)+' js-chart__set');
        chart.datasetScaled[i] = JSON.parse(JSON.stringify(chart.options.datasets[i].data));
        chart.datasetScaled[i] = getChartData(chart, chart.datasetScaled[i]);
        chart.datasetScaledFlat[i] = JSON.parse(JSON.stringify(chart.datasetScaled[i]));
        if(chart.options.type == 'area') {
          chart.datasetAreaScaled[i] = getAreaPointsFromLine(chart, chart.datasetScaled[i]);
          chart.datasetAreaScaledFlat[i] = JSON.parse(JSON.stringify(chart.datasetAreaScaled[i]));
        }
        if(!chart.loaded && chart.options.animate) {
          flatDatasets(chart, i);
        }
        gSet.appendChild(getPath(chart, chart.datasetScaledFlat[i], chart.datasetAreaScaledFlat[i], i));
        gSet.appendChild(getMarkers(chart, chart.datasetScaled[i], i));
        gEl.appendChild(gSet);
      }
      
      chart.svg.appendChild(gEl);
    };
  
    function getChartData(chart, data) {
      var multiSet = data[0].length > 1;
      var points = multiSet ? data : addXData(data); // addXData is used for one-dimension dataset; e.g. [2, 4, 6] rather than [[2, 4], [4, 7]]
      
      // xOffsetChart used for column chart type onlymodified
      var xOffsetChart = chart.xAxisWidth/(points.length-1) - chart.xAxisWidth/points.length;
      // now modify the points to coordinate relative to the svg 
      for(var i = 0; i < points.length; i++) {
        var xNewCoordinate = chart.leftDelta + chart.xAxisWidth*(points[i][0] - chart.xAxisInterval[0])/(chart.xAxisInterval[1] - chart.xAxisInterval[0]),
          yNewCoordinate = chart.height - chart.bottomDelta - chart.yAxisHeight*(points[i][1] - chart.yAxisInterval[0])/(chart.yAxisInterval[1] - chart.yAxisInterval[0]);
        if(chart.options.type == 'column') {
          xNewCoordinate = xNewCoordinate - i*xOffsetChart;
        }
        points[i] = [xNewCoordinate, yNewCoordinate];
      }
      return points;
    };
  
    function getPath(chart, points, areaPoints, index) {
      var pathCode = chart.options.smooth ? getSmoothLine(points, false) : getStraightLine(points);
      
      var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
        pathL = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
      Util.setAttributes(pathL, {d: pathCode, class: 'chart__data-line chart__data-line--'+(index+1)+' js-chart__data-line--'+(index+1)});
  
      if(chart.options.type == 'area') {
        var areaCode = chart.options.smooth ? getSmoothLine(areaPoints, true) : getStraightLine(areaPoints);
        var pathA = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        Util.setAttributes(pathA, {d: areaCode, class: 'chart__data-fill chart__data-fill--'+(index+1)+' js-chart__data-fill--'+(index+1)});
        gEl.appendChild(pathA);
      }
     
      gEl.appendChild(pathL);
      return gEl;
    };
  
    function getStraightLine(points) {
      var dCode = '';
      for(var i = 0; i < points.length; i++) {
        dCode = (i == 0) ? 'M '+points[0][0]+','+points[0][1] : dCode+ ' L '+points[i][0]+','+points[i][1];
      }
      return dCode;
    };
  
    function flatDatasets(chart, index) {
      var bottomY = getBottomFlatDatasets(chart);
      for(var i = 0; i < chart.datasetScaledFlat[index].length; i++) {
        chart.datasetScaledFlat[index][i] = [chart.datasetScaled[index][i][0], bottomY];
      }
      if(chart.options.type == 'area') {
        chart.datasetAreaScaledFlat[index] = getAreaPointsFromLine(chart, chart.datasetScaledFlat[index]);
      }
    };
  
    // https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
    function getSmoothLine(points, bool) {
      var dCode = '';
      var maxVal = points.length;
      var pointsLoop = JSON.parse(JSON.stringify(points));
      if(bool) {
        maxVal = maxVal - 3;
        pointsLoop.splice(-3, 3);
      }
      for(var i = 0; i < maxVal; i++) {
        if(i == 0) dCode = 'M '+points[0][0]+','+points[0][1];
        else dCode = dCode + ' '+bezierCommand(points[i], i, pointsLoop);
      }
      if(bool) {
        for(var j = maxVal; j < points.length; j++) {
          dCode = dCode + ' L '+points[j][0]+','+points[j][1];
        }
      }
      return dCode;
    };  
    
    function pathLine(pointA, pointB) {
      var lengthX = pointB[0] - pointA[0];
      var lengthY = pointB[1] - pointA[1];
  
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
      };
    };
  
    function pathControlPoint(current, previous, next, reverse) {
      var p = previous || current;
      var n = next || current;
      var smoothing = 0.2;
      var o = pathLine(p, n);
  
      var angle = o.angle + (reverse ? Math.PI : 0);
      var length = o.length * smoothing;
  
      var x = current[0] + Math.cos(angle) * length;
      var y = current[1] + Math.sin(angle) * length;
      return [x, y];
    };
  
    function bezierCommand(point, i, a) {
      var cps =  pathControlPoint(a[i - 1], a[i - 2], point);
      var cpe = pathControlPoint(point, a[i - 1], a[i + 1], true);
      return "C "+cps[0]+','+cps[1]+' '+cpe[0]+','+cpe[1]+' '+point[0]+','+point[1];
    };
  
    function getAreaPointsFromLine(chart, array) {
      var points = JSON.parse(JSON.stringify(array)),
        firstPoint = points[0],
        lastPoint = points[points.length -1];
  
      var boottomY = getBottomFlatDatasets(chart); 
      points.push([lastPoint[0], boottomY]);
      points.push([chart.leftDelta, boottomY]);
      points.push([chart.leftDelta, firstPoint[1]]);
      return points;
    };
  
    function getBottomFlatDatasets(chart) {
      var bottom = chart.height - chart.bottomDelta;
      if(chart.options.fillOrigin ) {
        bottom = chart.height - chart.bottomDelta - chart.yAxisHeight*(0 - chart.yAxisInterval[0])/(chart.yAxisInterval[1] - chart.yAxisInterval[0]);
      }
      if(chart.options.type && chart.options.type == 'column') {
        bottom = chart.yZero; 
      }
      return bottom;
    };
  
    function getMarkers(chart, points, index) {
      // see if we need to show tooltips 
      var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      var xOffset = 0;
      if(chart.options.type == 'column') {
        xOffset = 0.5*chart.xAxisWidth/points.length;
      }
      for(var i = 0; i < points.length; i++) {
        var marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        Util.setAttributes(marker, {class: 'chart__marker js-chart__marker chart__marker--'+(index+1), cx: points[i][0] + xOffset, cy: points[i][1], r: 2, 'data-set': index, 'data-index': i});
        gEl.appendChild(marker);
      }
      return gEl;
    };
  
    function addXData(data) {
      var multiData = [];
      for(var i = 0; i < data.length; i++) {
        multiData.push([i, data[i]]);
      }
      return multiData;
    };
  
    function createSrTables(chart) {
      // create a table element for accessibility reasons
      var table = '<div class="chart__sr-table sr-only">';
      for(var i = 0; i < chart.options.datasets.length; i++) {
        table = table + createDataTable(chart, i);
      }
      table = table + '</div>';
      chart.element.insertAdjacentHTML('afterend', table);
    };
  
    function createDataTable(chart, index) {
      var tableTitle = (chart.categories.length > index ) ? 'aria-label="'+chart.categories.length[index].textContent+'"': '';
      var table = '<table '+tableTitle+'><thead><tr>';
      table = (chart.options.xAxis && chart.options.xAxis.legend) 
        ? table + '<th scope="col">'+chart.options.xAxis.legend+'</th>'
        : table + '<th scope="col"></th>';
        
      table = (chart.options.yAxis && chart.options.yAxis.legend) 
        ? table + '<th scope="col">'+chart.options.yAxis.legend+'</th>'
        : table + '<th scope="col"></th>';
  
      table = table + '</thead><tbody>';
      var multiset = chart.options.datasets[index].data[0].length > 1,
        xAxisLabels = chart.options.xAxis && chart.options.xAxis.labels && chart.options.xAxis.labels.length > 1;
      for(var i = 0; i < chart.options.datasets[index].data.length; i++) {
        table = table + '<tr>';
        if(multiset) {
          table = table + '<td role="cell">'+chart.options.datasets[index].data[i][0]+'</td><td role="cell">'+chart.options.datasets[index].data[i][1]+'</td>';
        } else {
          var xValue = xAxisLabels ? chart.options.xAxis.labels[i]: (i + 1);
          table = table + '<td role="cell">'+xValue+'</td><td role="cell">'+chart.options.datasets[index].data[i]+'</td>';
        }
        table = table + '</tr>';
      }
      table = table + '</tbody></table>';
      return table;
    }
  
    function getChartYLabels(chart) {
      var labels = [],
        intervals = 0;
      if(chart.options.yAxis && chart.options.yAxis.range && chart.options.yAxis.step) {
        intervals = Math.ceil((chart.options.yAxis.range[1] - chart.options.yAxis.range[0])/chart.options.yAxis.step);
        for(var i = 0; i <= intervals; i++) {
          labels.push(chart.options.yAxis.range[0] + chart.options.yAxis.step*i);
        }
        chart.yAxisInterval = [chart.options.yAxis.range[0], chart.options.yAxis.range[1]];
      } else {
        var columnChartStacked = (chart.options.type && chart.options.type == 'column' && chart.options.stacked);
        if(columnChartStacked) setDatasetsSum(chart);
        var min = columnChartStacked ? getColStackedMinDataValue(chart) : getMinDataValue(chart, true);
        var max = columnChartStacked ? getColStackedMaxDataValue(chart) : getMaxDataValue(chart, true);
        var niceScale = new NiceScale(min, max, 5);
        var intervals = Math.ceil((niceScale.getNiceUpperBound() - niceScale.getNiceLowerBound()) /niceScale.getTickSpacing());
  
        for(var i = 0; i <= intervals; i++) {
          labels.push(niceScale.getNiceLowerBound() + niceScale.getTickSpacing()*i);
        }
        chart.yAxisInterval = [niceScale.getNiceLowerBound(), niceScale.getNiceUpperBound()];
      }
      return labels;
    };
  
    function getChartXLabels(chart) {
      var labels = [],
        intervals = 0;
      if(chart.options.xAxis && chart.options.xAxis.range && chart.options.xAxis.step) {
        intervals = Math.ceil((chart.options.xAxis.range[1] - chart.options.xAxis.range[0])/chart.options.xAxis.step);
        for(var i = 0; i <= intervals; i++) {
          labels.push(chart.options.xAxis.range[0] + chart.options.xAxis.step*i);
        }
        chart.xAxisInterval = [chart.options.xAxis.range[0], chart.options.xAxis.range[1]];
      } else if(!chart.options.datasets[0].data[0].length || chart.options.datasets[0].data[0].length < 2) {
        // data sets are passed with a single value (y axis only)
        chart.xAxisInterval = [0, chart.options.datasets[0].data.length - 1];
        for(var i = 0; i < chart.options.datasets[0].data.length; i++) {
          labels.push(i);
        }
      } else {
        var min = getMinDataValue(chart, false);
        var max = getMaxDataValue(chart, false);
        var niceScale = new NiceScale(min, max, 5);
        var intervals = Math.ceil((niceScale.getNiceUpperBound() - niceScale.getNiceLowerBound()) /niceScale.getTickSpacing());
  
        for(var i = 0; i <= intervals; i++) {
          labels.push(niceScale.getNiceLowerBound() + niceScale.getTickSpacing()*i);
        }
        chart.xAxisInterval = [niceScale.getNiceLowerBound(), niceScale.getNiceUpperBound()];
      }
      return labels;
    };
  
    function modifyAxisLabel(labels, fnModifier) {
      for(var i = 0; i < labels.length; i++) {
        labels[i] = fnModifier(labels[i]);
      }
  
      return labels;
    };
  
    function getLabelMaxSize(labels, dimesion) {
      if(!isVisible(labels[0])) return 0;
      var size = 0;
      for(var i = 0; i < labels.length; i++) {
        var labelSize = labels[i].getBBox()[dimesion];
        if(labelSize > size) size = labelSize;
      };  
      return size;
    };
  
    function getMinDataValue(chart, bool) { // bool = true for y axis
      var minArray = [];
      for(var i = 0; i < chart.options.datasets.length; i++) {
        minArray.push(getMin(chart.options.datasets[i].data, bool));
      }
      return Math.min.apply(null, minArray);
    };
  
    function getMaxDataValue(chart, bool) { // bool = true for y axis
      var maxArray = [];
      for(var i = 0; i < chart.options.datasets.length; i++) {
        maxArray.push(getMax(chart.options.datasets[i].data, bool));
      }
      return Math.max.apply(null, maxArray);
    };
  
    function setDatasetsSum(chart) {
      // sum all datasets -> this is used for column and bar charts
      chart.datasetsSum = [];
      for(var i = 0; i < chart.options.datasets.length; i++) {
        for(var j = 0; j < chart.options.datasets[i].data.length; j++) {
          chart.datasetsSum[j] = (i == 0) ? chart.options.datasets[i].data[j] : chart.datasetsSum[j] + chart.options.datasets[i].data[j];
        }
      } 
    };
  
    function getColStackedMinDataValue(chart) {
      var min = Math.min.apply(null, chart.datasetsSum);
      if(min > 0) min = 0;
      return min;
    };
  
    function getColStackedMaxDataValue(chart) {
      var max = Math.max.apply(null, chart.datasetsSum);
      if(max < 0) max = 0;
      return max;
    };
  
    function getMin(array, bool) {
      var min;
      var multiSet = array[0].length > 1;
      for(var i = 0; i < array.length; i++) {
        var value;
        if(multiSet) {
          value = bool ? array[i][1] : array[i][0];
        } else {
          value = array[i];
        }
        if(i == 0) {min = value;}
        else if(value < min) {min = value;}
      }
      return min;
    };
  
    function getMax(array, bool) {
      var max;
      var multiSet = array[0].length > 1;
      for(var i = 0; i < array.length; i++) {
        var value;
        if(multiSet) {
          value = bool ? array[i][1] : array[i][0];
        } else {
          value = array[i];
        }
        if(i == 0) {max = value;}
        else if(value > max) {max = value;}
      }
      return max;
    };
  
    // https://gist.github.com/igodorogea/4f42a95ea31414c3a755a8b202676dfd
    function NiceScale (lowerBound, upperBound, _maxTicks) {
      var maxTicks = _maxTicks || 10;
      var tickSpacing;
      var range;
      var niceLowerBound;
      var niceUpperBound;
    
      calculate();
    
      this.setMaxTicks = function (_maxTicks) {
        maxTicks = _maxTicks;
        calculate();
      };
    
      this.getNiceUpperBound = function() {
        return niceUpperBound;
      };
    
      this.getNiceLowerBound = function() {
        return niceLowerBound;
      };
    
      this.getTickSpacing = function() {
        return tickSpacing;
      };
    
      function setMinMaxPoints (min, max) {
        lowerBound = min;
        upperBound = max;
        calculate();
      }
    
      function calculate () {
        range = niceNum(upperBound - lowerBound, false);
        tickSpacing = niceNum(range / (maxTicks - 1), true);
        niceLowerBound = Math.floor(lowerBound / tickSpacing) * tickSpacing;
        niceUpperBound = Math.ceil(upperBound / tickSpacing) * tickSpacing;
      }
    
      function niceNum (range, round) {
        // var exponent = Math.floor(Math.log10(range));
        var exponent = Math.floor(Math.log(range) * Math.LOG10E);
        var fraction = range / Math.pow(10, exponent);
        var niceFraction;
    
        if (round) {
          if (fraction < 1.5) niceFraction = 1;
          else if (fraction < 3) niceFraction = 2;
          else if (fraction < 7) niceFraction = 5;
          else niceFraction = 10;
        } else {
          if (fraction <= 1) niceFraction = 1;
          else if (fraction <= 2) niceFraction = 2;
          else if (fraction <= 5) niceFraction = 5;
          else niceFraction = 10;
        }
    
        return niceFraction * Math.pow(10, exponent);
      }
    };
  
    function initTooltips(chart) {
      if(!intObservSupported) return;
  
      chart.markers = [];
      chart.bars = []; // this is for column/bar charts only
      var chartSets = chart.element.getElementsByClassName('js-chart__set');
      for(var i = 0; i < chartSets.length; i++) {
        chart.markers[i] = chartSets[i].querySelectorAll('.js-chart__marker');
        if(chart.options.type && chart.options.type == 'column') {
          chart.bars[i] = chartSets[i].querySelectorAll('.js-chart__data-bar');
        }
      }
      
      // create tooltip line
      if(chart.options.yIndicator) {
        var tooltipLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        Util.setAttributes(tooltipLine, {x1: 0, y1: chart.topDelta, x2: 0, y2: chart.topDelta + chart.yAxisHeight, transform: 'translate('+chart.leftDelta+' '+chart.topDelta+')', class: 'chart__y-indicator js-chart__y-indicator is-hidden'});
        chart.svg.insertBefore(tooltipLine, chart.element.getElementsByClassName('js-chart__dataset')[0]);
        chart.interLine = chart.element.getElementsByClassName('js-chart__y-indicator')[0];
      }
      
      // create tooltip
      if(chart.tooltipOn) {
        var tooltip = document.createElement('div');
        tooltip.setAttribute('class', 'chart__tooltip js-chart__tooltip is-hidden '+chart.tooltipClasses);
        chart.element.appendChild(tooltip);
        chart.tooltip = chart.element.getElementsByClassName('js-chart__tooltip')[0];
      }
      initChartHover(chart);
    };
  
    function initChartHover(chart) {
      if(!chart.options.yIndicator && !chart.tooltipOn) return;
      // init hover effect
      chart.chartArea = chart.element.getElementsByClassName('js-chart__axis-labels--y')[0];
      chart.eventIds['hover'] = handleEvent.bind(chart);
      chart.chartArea.addEventListener('mouseenter', chart.eventIds['hover']);
      chart.chartArea.addEventListener('mousemove', chart.eventIds['hover']);
      chart.chartArea.addEventListener('mouseleave', chart.eventIds['hover']);
      if(!SwipeContent) return;
      new SwipeContent(chart.element);
      chart.element.addEventListener('dragStart', chart.eventIds['hover']);
      chart.element.addEventListener('dragging', chart.eventIds['hover']);
      chart.element.addEventListener('dragEnd', chart.eventIds['hover']);
    };
  
    function hoverChart(chart, event) {
      if(chart.hovering) return;
      if(!chart.options.yIndicator && !chart.tooltipOn) return;
      chart.hovering = true;
      var selectedMarker = getSelectedMarker(chart, event);
      if(selectedMarker === false) return;
      if(selectedMarker !== chart.selectedMarker) {
        resetMarkers(chart, false);
        resetBars(chart, false);
  
        chart.selectedMarker = selectedMarker;
        resetMarkers(chart, true);
        resetBars(chart, true);
        var markerSize = chart.markers[0][chart.selectedMarker].getBBox();
        
        if(chart.options.yIndicator) {
          Util.removeClass(chart.interLine, 'is-hidden');
          chart.interLine.setAttribute('transform', 'translate('+(markerSize.x + markerSize.width/2)+' 0)');
        }
        
        if(chart.tooltipOn) {
          Util.removeClass(chart.tooltip, 'is-hidden');
          setTooltipHTML(chart);
          placeTooltip(chart);
        }
      }
      updateExternalData(chart);
      chart.hovering = false;
    };
  
    function getSelectedMarker(chart, event) {
      if(chart.markers[0].length < 1) return false;
      var clientX = event.detail.x ? event.detail.x : event.clientX;
      var xposition =  clientX - chart.svg.getBoundingClientRect().left;
      var marker = 0,
        deltaX = Math.abs(chart.markers[0][0].getBBox().x - xposition);
      for(var i = 1; i < chart.markers[0].length; i++) {
        var newDeltaX = Math.abs(chart.markers[0][i].getBBox().x - xposition);
        if(newDeltaX < deltaX) {
          deltaX = newDeltaX;
          marker = i;
        }
      }
      return marker;
    };
  
    function resetTooltip(chart) {
      if(chart.hoverId) {
        (window.requestAnimationFrame) ? window.cancelAnimationFrame(chart.hoverId) : clearTimeout(chart.hoverId);
        chart.hoverId = false;
      }
      if(chart.tooltipOn) Util.addClass(chart.tooltip, 'is-hidden');
      if(chart.options.yIndicator)Util.addClass(chart.interLine, 'is-hidden');
      resetMarkers(chart, false);
      resetBars(chart, false);
      chart.selectedMarker = false;
      resetExternalData(chart);
      chart.hovering = false;
    };
  
    function resetMarkers(chart, bool) {
      for(var i = 0; i < chart.markers.length; i++) {
        if(chart.markers[i] && chart.markers[i][chart.selectedMarker]) Util.toggleClass(chart.markers[i][chart.selectedMarker], chart.selectedMarkerClass, bool);
      }
    };
  
    function resetBars(chart, bool) {
      // for column/bar chart -> change opacity on hover
      if(!chart.options.type || chart.options.type != 'column') return;
      for(var i = 0; i < chart.bars.length; i++) {
        if(chart.bars[i] && chart.bars[i][chart.selectedMarker]) Util.toggleClass(chart.bars[i][chart.selectedMarker], chart.selectedBarClass, bool);
      }
    };
  
    function setTooltipHTML(chart) {
      var selectedMarker = chart.markers[0][chart.selectedMarker];
      chart.tooltip.innerHTML = getTooltipHTML(chart, selectedMarker.getAttribute('data-index'), selectedMarker.getAttribute('data-set'));
    };
  
    function getTooltipHTML(chart, index, setIndex) {
      var htmlContent = '';
      if(chart.options.tooltip.customHTML) {
        htmlContent = chart.options.tooltip.customHTML(index, chart.options, setIndex);
      } else {
        var multiVal = chart.options.datasets[setIndex].data[index].length > 1;
        if(chart.options.xAxis && chart.options.xAxis.labels && chart.options.xAxis.labels.length > 1) {
          htmlContent = chart.options.xAxis.labels[index] +' - ';
        } else if(multiVal) {
          htmlContent = chart.options.datasets[setIndex].data[index][0] +' - ';
        }
        htmlContent = (multiVal) 
          ? htmlContent + chart.options.datasets[setIndex].data[index][1] 
          : htmlContent + chart.options.datasets[setIndex].data[index];
      }   
      return htmlContent;
    };
  
    function placeTooltip(chart) {
      var selectedMarker = chart.markers[0][chart.selectedMarker];
      var markerPosition = selectedMarker.getBoundingClientRect();
      var markerPositionSVG = selectedMarker.getBBox();
      var svgPosition = chart.svg.getBoundingClientRect();
  
      if(chart.options.type == 'column') {
        tooltipPositionColumnChart(chart, selectedMarker, markerPosition, markerPositionSVG);
      } else {
        tooltipPositionChart(chart, markerPosition, markerPositionSVG, svgPosition.left, svgPosition.width);
      }
    };
  
    function tooltipPositionChart(chart, markerPosition, markerPositionSVG, svgPositionLeft, svgPositionWidth) {
      // set top/left/transform of the tooltip for line/area charts
      // horizontal position
      if(markerPosition.left - svgPositionLeft <= svgPositionWidth/2) {
        chart.tooltip.style.left = (markerPositionSVG.x + markerPositionSVG.width + 2)+'px';
        chart.tooltip.style.right = 'auto';
        chart.tooltip.style.transform = 'translateY(-100%)';
      } else {
        chart.tooltip.style.left = 'auto';
        chart.tooltip.style.right = (svgPositionWidth - markerPositionSVG.x + 2)+'px';
        chart.tooltip.style.transform = 'translateY(-100%)'; 
      }
      // vertical position
      if(!chart.tooltipPosition) {
        chart.tooltip.style.top = markerPositionSVG.y +'px';
      } else if(chart.tooltipPosition == 'top') {
        chart.tooltip.style.top = (chart.topDelta + chart.tooltip.getBoundingClientRect().height + 5) +'px';
        chart.tooltip.style.bottom = 'auto';
      } else {
        chart.tooltip.style.top = 'auto';
        chart.tooltip.style.bottom = (chart.bottomDelta + 5)+'px';
        chart.tooltip.style.transform = ''; 
      }
    };
  
    function tooltipPositionColumnChart(chart, marker, markerPosition, markerPositionSVG) {
      // set top/left/transform of the tooltip for column charts
      chart.tooltip.style.left = (markerPositionSVG.x + markerPosition.width/2)+'px';
      chart.tooltip.style.right = 'auto';
      chart.tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
      if(!chart.tooltipPosition) {
        if(parseInt(marker.getAttribute('cy')) > chart.yZero) {
          // negative value -> move tooltip below the bar
          chart.tooltip.style.top = (markerPositionSVG.y + markerPositionSVG.height + 6) +'px';
          chart.tooltip.style.transform = 'translateX(-50%)';
        } else {
          chart.tooltip.style.top = (markerPositionSVG.y - 6) +'px';
        }
      } else if(chart.tooltipPosition == 'top') {
        chart.tooltip.style.top = (chart.topDelta + chart.tooltip.getBoundingClientRect().height + 5) +'px';
        chart.tooltip.style.bottom = 'auto';
      } else {
        chart.tooltip.style.bottom = (chart.bottomDelta + 5)+'px';
        chart.tooltip.style.top = 'auto';
        chart.tooltip.style.transform = 'translateX(-50%)';
      }
    };
  
    function animateChart(chart) {
      if(!chart.options.animate) return;
      var observer = new IntersectionObserver(chartObserve.bind(chart), {rootMargin: "0px 0px -200px 0px"});
      observer.observe(chart.element);
    };
  
    function chartObserve(entries, observer) { // observe chart position -> start animation when inside viewport
      if(entries[0].isIntersecting) {
        triggerChartAnimation(this);
        observer.unobserve(this.element);
      }
    };
  
    function triggerChartAnimation(chart) {
      if(chart.options.type == 'line' || chart.options.type == 'area') {
        animatePath(chart, 'line');
        if(chart.options.type == 'area') animatePath(chart, 'fill');
      } else if(chart.options.type == 'column') {
        animateRectPath(chart, 'column');
      }
    };
  
    function animatePath(chart, type) {
      var currentTime = null,
        duration = 600;
  
      var startArray = chart.datasetScaledFlat,
        finalArray = chart.datasetScaled;
  
      if(type == 'fill') {
        startArray = chart.datasetAreaScaledFlat;
        finalArray = chart.datasetAreaScaled;
      }
          
      var animateSinglePath = function(timestamp){
        if (!currentTime) currentTime = timestamp;        
        var progress = timestamp - currentTime;
        if(progress > duration) progress = duration;
        for(var i = 0; i < finalArray.length; i++) {
          var points = [];
          var path = chart.element.getElementsByClassName('js-chart__data-'+type+'--'+(i+1))[0];
          for(var j = 0; j < finalArray[i].length; j++) {
            var val = Math.easeOutQuart(progress, startArray[i][j][1], finalArray[i][j][1]-startArray[i][j][1], duration);
            points[j] = [finalArray[i][j][0], val];
          }
          // get path and animate
          var pathCode = chart.options.smooth ? getSmoothLine(points, type == 'fill') : getStraightLine(points);
          path.setAttribute('d', pathCode);
        }
        if(progress < duration) {
          window.requestAnimationFrame(animateSinglePath);
        }
      };
  
      window.requestAnimationFrame(animateSinglePath);
    };
  
    function resizeChart(chart) {
      window.addEventListener('resize', function() {
        clearTimeout(chart.eventIds['resize']);
        chart.eventIds['resize'] = setTimeout(doneResizing, 300);
      });
  
      function doneResizing() {
        resetChartResize(chart);
        initChart(chart);
      };
    };
  
    function resetChartResize(chart) {
      chart.topDelta = 0;
      chart.bottomDelta = 0;
      chart.leftDelta = 0;
      chart.rightDelta = 0;
      chart.dragging = false;
      // reset event listeners
      if( chart.eventIds && chart.eventIds['hover']) {
        chart.chartArea.removeEventListener('mouseenter', chart.eventIds['hover']);
        chart.chartArea.removeEventListener('mousemove', chart.eventIds['hover']);
        chart.chartArea.removeEventListener('mouseleave', chart.eventIds['hover']);
        chart.element.removeEventListener('dragStart', chart.eventIds['hover']);
        chart.element.removeEventListener('dragging', chart.eventIds['hover']);
        chart.element.removeEventListener('dragEnd', chart.eventIds['hover']);
      }
    };
  
    function handleEvent(event) {
          switch(event.type) {
              case 'mouseenter':
                  hoverChart(this, event);
          break;
              case 'mousemove':
        case 'dragging':   
          var self = this;
                  self.hoverId  = window.requestAnimationFrame 
            ? window.requestAnimationFrame(function(){hoverChart(self, event)})
            : setTimeout(function(){hoverChart(self, event);});
          break;
              case 'mouseleave':
        case 'dragEnd':
                  resetTooltip(this);
          break;
          }
    };
  
    function isVisible(item) {
      return (item && item.getClientRects().length > 0);
    };
  
    function initExternalData(chart) {
      if(!chart.options.externalData) return;
      var chartId = chart.options.element.getAttribute('id');
      if(!chartId) return;
      chart.extDataX = [];
      chart.extDataXInit = [];
      chart.extDataY = [];
      chart.extDataYInit = [];
      if(chart.options.datasets.length > 1) {
        for(var i = 0; i < chart.options.datasets.length; i++) {
          chart.extDataX[i] = document.querySelectorAll('.js-ext-chart-data-x--'+(i+1)+'[data-chart="'+chartId+'"]');
          chart.extDataY[i] = document.querySelectorAll('.js-ext-chart-data-y--'+(i+1)+'[data-chart="'+chartId+'"]');
        }
      } else {
        chart.extDataX[0] = document.querySelectorAll('.js-ext-chart-data-x[data-chart="'+chartId+'"]');
        chart.extDataY[0] = document.querySelectorAll('.js-ext-chart-data-y[data-chart="'+chartId+'"]');
      }
      // store initial HTML contentent
      storeExternalDataContent(chart, chart.extDataX, chart.extDataXInit);
      storeExternalDataContent(chart, chart.extDataY, chart.extDataYInit);
    };
  
    function storeExternalDataContent(chart, elements, array) {
      for(var i = 0; i < elements.length; i++) {
        array[i] = [];
        if(elements[i][0]) array[i][0] = elements[i][0].innerHTML;
      }
    };
  
    function updateExternalData(chart) {
      if(!chart.extDataX || !chart.extDataY) return;
      var marker = chart.markers[0][chart.selectedMarker];
      if(!marker) return;
      var dataIndex = marker.getAttribute('data-index');
      var multiVal = chart.options.datasets[0].data[0].length > 1;
      for(var i = 0; i < chart.options.datasets.length; i++) {
        updateExternalDataX(chart, dataIndex, i, multiVal);
        updateExternalDataY(chart, dataIndex, i, multiVal);
      }
    };
  
    function updateExternalDataX(chart, dataIndex, setIndex, multiVal) {
      if( !chart.extDataX[setIndex] || !chart.extDataX[setIndex][0]) return;
      var value = '';
      if(chart.options.externalData.customXHTML) {
        value = chart.options.externalData.customXHTML(dataIndex, chart.options, setIndex);
      } else {
        if(chart.options.xAxis && chart.options.xAxis.labels && chart.options.xAxis.labels.length > 1) {
          value = chart.options.xAxis.labels[dataIndex];
        } else if(multiVal) {
          htmlContent = chart.options.datasets[setIndex].data[dataIndex][0];
        }
      }
      chart.extDataX[setIndex][0].innerHTML = value;
    };
  
    function updateExternalDataY(chart, dataIndex, setIndex, multiVal) {
      if( !chart.extDataY[setIndex] || !chart.extDataY[setIndex][0]) return;
      var value = '';
      if(chart.options.externalData.customYHTML) {
        value = chart.options.externalData.customYHTML(dataIndex, chart.options, setIndex);
      } else {
        if(multiVal) {
          value = chart.options.datasets[setIndex].data[dataIndex][1];
        } else {
          value = chart.options.datasets[setIndex].data[dataIndex];
        }
      }
      chart.extDataY[setIndex][0].innerHTML = value;
    };
  
    function resetExternalData(chart) {
      if(!chart.options.externalData) return;
      for(var i = 0; i < chart.options.datasets.length; i++) {
        if(chart.extDataX[i][0]) chart.extDataX[i][0].innerHTML = chart.extDataXInit[i][0];
        if(chart.extDataY[i][0]) chart.extDataY[i][0].innerHTML = chart.extDataYInit[i][0];
      }
    };
  
    function setChartColumnSize(chart) {
      chart.columnWidthPerc = 100;
      chart.columnGap = 0;
      if(chart.options.column && chart.options.column.width) {
        chart.columnWidthPerc = parseInt(chart.options.column.width);
      }
      if(chart.options.column && chart.options.column.gap) {
        chart.columnGap = parseInt(chart.options.column.gap);
      } 
    };
  
    function resetColumnChart(chart) {
      var labels = chart.element.getElementsByClassName('js-chart__axis-labels--x')[0].querySelectorAll('.js-chart__axis-label'),
        labelsVisible = isVisible(labels[labels.length - 1]),
        xDelta = chart.xAxisWidth/labels.length;
      
      // translate x axis labels
      if(labelsVisible) {
        moveXAxisLabels(chart, labels, 0.5*xDelta);
      }
      // set column width + separation gap between columns
      var columnsSpace = xDelta*chart.columnWidthPerc/100;
      if(chart.options.stacked) {
        chart.columnWidth = columnsSpace;
      } else {
        chart.columnWidth = (columnsSpace - chart.columnGap*(chart.options.datasets.length - 1) )/chart.options.datasets.length;
      }
  
      chart.columnDelta = (xDelta - columnsSpace)/2;
    };
  
    function moveXAxisLabels(chart, labels, delta) { 
      // this applies to column charts only
      // translate the xlabels to center them 
      if(chart.xAxisLabelRotation) return; // labels were rotated - no need to translate
      for(var i = 0; i < labels.length; i++) {
        Util.setAttributes(labels[i], {x: labels[i].getBBox().x + delta});
      }
    };
  
    function setColumnChartDatasets(chart) {
      var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gEl.setAttribute('class', 'chart__dataset js-chart__dataset');
      chart.datasetScaled = [];
  
      setColumnChartYZero(chart);
      
      for(var i = 0; i < chart.options.datasets.length; i++) {
        var gSet = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gSet.setAttribute('class', 'chart__set chart__set--'+(i+1)+' js-chart__set');
        chart.datasetScaled[i] = JSON.parse(JSON.stringify(chart.options.datasets[i].data));
        chart.datasetScaled[i] = getChartData(chart, chart.datasetScaled[i]);
        chart.datasetScaledFlat[i] = JSON.parse(JSON.stringify(chart.datasetScaled[i]));
        if(!chart.loaded && chart.options.animate) {
          flatDatasets(chart, i);
        }
        gSet.appendChild(getSvgColumns(chart, chart.datasetScaledFlat[i], i));
        gEl.appendChild(gSet);
        gSet.appendChild(getMarkers(chart, chart.datasetScaled[i], i));
      }
      
      chart.svg.appendChild(gEl);
    };
  
    function setColumnChartYZero(chart) {
      // if there are negative values -> make sre columns start from zero
      chart.yZero = chart.height - chart.bottomDelta;
      if(chart.yAxisInterval[0] < 0) {
        chart.yZero = chart.height - chart.bottomDelta + chart.yAxisHeight*(chart.yAxisInterval[0])/(chart.yAxisInterval[1] - chart.yAxisInterval[0]);
      }
    };
  
    function getSvgColumns(chart, dataset, index) {
      var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
      for(var i = 0; i < dataset.length; i++) {
        var pathL = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var points = getColumnPoints(chart, dataset[i], index, i, chart.datasetScaledFlat);
        var lineType =  chart.options.column && chart.options.column.radius ? 'round' : 'square';
        if(lineType == 'round' && chart.options.stacked && index < chart.options.datasets.length - 1) lineType = 'square';
        var dPath = (lineType == 'round') ? getRoundedColumnRect(chart, points) : getStraightLine(points);
        Util.setAttributes(pathL, {d: dPath, class: 'chart__data-bar chart__data-bar--'+(index+1)+' js-chart__data-bar js-chart__data-bar--'+(index+1)});
        gEl.appendChild(pathL);
      }
      return gEl;
    };
  
    function getColumnPoints(chart, point, index, pointIndex, dataSetsAll) {
      var xOffset = chart.columnDelta + index*(chart.columnWidth + chart.columnGap),
        yOffset = 0;
  
      if(chart.options.stacked) {
        xOffset = chart.columnDelta;
        yOffset = getyOffsetColChart(chart, dataSetsAll, index, pointIndex);
      }
  
      return [ 
        [point[0] + xOffset, chart.yZero - yOffset],
        [point[0] + xOffset, point[1] - yOffset], 
        [point[0] + xOffset + chart.columnWidth, point[1] - yOffset],
        [point[0] + xOffset + chart.columnWidth, chart.yZero - yOffset]
      ];
    };
  
    function getyOffsetColChart(chart, dataSetsAll, index, pointIndex) {
      var offset = 0;
      for(var i = 0; i < index; i++) {
        if(dataSetsAll[i] && dataSetsAll[i][pointIndex]) offset = offset + (chart.height - chart.bottomDelta - dataSetsAll[i][pointIndex][1]);
      }
      return offset;
    };
  
    function getRoundedColumnRect(chart, points) {
      var radius = parseInt(chart.options.column.radius);
      var arcType = '0,0,1',
        deltaArc1 = '-',
        deltaArc2 = ',',
        rectHeight = points[1][1] + radius;
      if(chart.yAxisInterval[0] < 0 && points[1][1] > chart.yZero) {
        arcType = '0,0,0';
        deltaArc1 = ',';
        deltaArc2 = '-';
        rectHeight = points[1][1] - radius;
      }
      var dpath = 'M '+points[0][0]+' '+points[0][1];
      dpath = dpath + ' V '+rectHeight;
      dpath = dpath + ' a '+radius+','+radius+','+arcType+','+radius+deltaArc1+radius;
      dpath = dpath + ' H '+(points[2][0] - radius);
      dpath = dpath + ' a '+radius+','+radius+','+arcType+','+radius+deltaArc2+radius;
      dpath = dpath + ' V '+points[3][1];
      return dpath;
    };
  
    function animateRectPath(chart, type) {
      var currentTime = null,
        duration = 600;
  
      var startArray = chart.datasetScaledFlat,
        finalArray = chart.datasetScaled;
          
      var animateSingleRectPath = function(timestamp){
        if (!currentTime) currentTime = timestamp;        
        var progress = timestamp - currentTime;
        if(progress > duration) progress = duration;
        var multiSetPoint = [];
        for(var i = 0; i < finalArray.length; i++) {
          // multi sets
          var points = [];
          var paths = chart.element.getElementsByClassName('js-chart__data-bar--'+(i+1));
          var rectLine = chart.options.column && chart.options.column.radius ? 'round' : 'square';
          if(chart.options.stacked && rectLine == 'round' && i < finalArray.length - 1) rectLine = 'square'; 
          for(var j = 0; j < finalArray[i].length; j++) {
            var val = Math.easeOutQuart(progress, startArray[i][j][1], finalArray[i][j][1]-startArray[i][j][1], duration);
            points[j] = [finalArray[i][j][0], val];
            // get path and animate
            var rectPoints = getColumnPoints(chart, points[j], i, j, multiSetPoint);
            var dPath = (rectLine == 'round') ? getRoundedColumnRect(chart, rectPoints) : getStraightLine(rectPoints);
            paths[j].setAttribute('d', dPath);
          }
  
          multiSetPoint[i] = points;
        }
        if(progress < duration) {
          window.requestAnimationFrame(animateSingleRectPath);
        }
      };
  
      window.requestAnimationFrame(animateSingleRectPath);
    };
  
    function getPieSvgCode(chart) {
  
    };
  
    function getDoughnutSvgCode(chart) {
  
    };
  
    Chart.defaults = {
      element : '',
      type: 'line', // can be line, area, bar
      xAxis: {},
      yAxis: {},
      datasets: [],
      tooltip: {
        enabled: false,
        classes: false,
        customHTM: false
      },
      yIndicator: true,
      padding: 10
    };
  
    window.Chart = Chart;
  
    var intObservSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
  }());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
    var flexHeader = document.getElementsByClassName('js-f-header');
    if(flexHeader.length > 0) {
      var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
        firstFocusableElement = getMenuFirstFocusable();
  
      // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
      var focusMenu = false;
  
      resetFlexHeaderOffset();
  
      menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){
        toggleMenuNavigation(event.detail);
      });
  
      // listen for key events
      window.addEventListener('keyup', function(event){
        // listen for esc key
        if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
          // close navigation on mobile if open
          if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
            focusMenu = menuTrigger; // move focus to menu trigger when menu is close
            menuTrigger.click();
          }
        }
        // listen for tab key
        if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
          // close navigation on mobile if open when nav loses focus
          if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
        }
      });
  
      // listen for resize
      var resizingId = false;
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });
  
      function getMenuFirstFocusable() {
        var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
          firstFocusable = false;
        for(var i = 0; i < focusableEle.length; i++) {
          if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
            firstFocusable = focusableEle[i];
            break;
          }
        }
  
        return firstFocusable;
      };
      
      function isVisible(element) {
        return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
      };
  
      function doneResizing() {
        if( !isVisible(menuTrigger) && Util.hasClass(flexHeader[0], 'f-header--expanded')) {
          menuTrigger.click();
        }
        resetFlexHeaderOffset();
      };
      
      function toggleMenuNavigation(bool) { // toggle menu visibility on small devices
        Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', bool);
        Util.toggleClass(flexHeader[0], 'f-header--expanded', bool);
        menuTrigger.setAttribute('aria-expanded', bool);
        if(bool) firstFocusableElement.focus(); // move focus to first focusable element
        else if(focusMenu) {
          focusMenu.focus();
          focusMenu = false;
        }
      };
  
      function resetFlexHeaderOffset() {
        // on mobile -> update max height of the flexi header based on its offset value (e.g., if there's a fixed pre-header element)
        document.documentElement.style.setProperty('--f-header-offset', flexHeader[0].getBoundingClientRect().top+'px');
      };
    }
  }());
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
(function () {
    var Bottomsheet = function (elem) {
        this.element = elem;
        this.elementId = this.element.getAttribute('id');
        this.trigger = document.querySelectorAll('[aria-controls="' + this.elementId + '"]');
        this.bottomsheetVisibleClass = 'bottom-sheet--is-visible';
        this.selectedTriggerClass = 'control--active';

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
                    //if (Util.hasClass(sheet.element, sheet.bottomsheetVisibleClass) && sheet.selectedTrigger != sheet.trigger[i]) {
                      // toggleSheet(sheet, false, false); // close menu
                    //}
                    // toggle popover
                    sheet.selectedTrigger = sheet.trigger[i];
                    toggleSheet(sheet, !Util.hasClass(sheet.element, sheet.bottomsheetVisibleClass));
                });
            })(i);
        }
    };

    function toggleSheet(sheet, bool) {
        // toggle popover visibility
        Util.toggleClass(sheet.element, sheet.bottomsheetVisibleClass, bool);
        sheet.sheetIsOpen = bool;
        body = document.getElementsByTagName('body');
        if (bool) {
            sheet.selectedTrigger.setAttribute('aria-expanded', 'true');
            Util.addClass(body[0], 'no-scroll');
            // move focus
            // add class to popover trigger
            Util.addClass(sheet.selectedTrigger, sheet.selectedTriggerClass);
        } else {
            Util.removeClass(body[0], 'no-scroll');
            sheet.selectedTrigger.setAttribute('aria-expanded', 'false');
            // remove class from menu trigger
            Util.removeClass(sheet.selectedTrigger, sheet.selectedTriggerClass);
            sheet.selectedTrigger = false;
        }
    };

    window.Bottomsheet = Bottomsheet;

    //initialize the Popover objects
    var bottomsheets = document.getElementsByClassName('js-bottomsheet');
    // generic focusable elements string selector

    if (bottomsheets.length > 0) {
        var bottomsheetsArray = [];
        for (var i = 0; i < bottomsheets.length; i++) {
            (function (i) {
                bottomsheetsArray.push(new Bottomsheet(bottomsheets[i]));
            })(i);
        }
    }
}());
// File#: _3_drop-menu
// Usage: codyhouse.co/license
(function() {
  var DropMenu = function(element) {
    this.element = element;
    this.innerElement = this.element.getElementsByClassName('js-drop-menu__inner');
    this.trigger = document.querySelector('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.autocompleteInput = false;
    this.autocompleteList = false;
    this.animationDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--drop-menu-transition-duration')) || 0.3;
    // store some basic classes
    this.menuIsVisibleClass = 'drop-menu--is-visible';
    this.menuLevelClass = 'js-drop-menu__list';
    this.menuBtnInClass = 'js-drop-menu__btn--sublist-control';
    this.menuBtnOutClass = 'js-drop-menu__btn--back';
    this.levelInClass = 'drop-menu__list--in';
    this.levelOutClass = 'drop-menu__list--out';
    // store the max height of the element
    this.maxHeight = false;
    // store drop menu layout 
    this.layout = 'mobile';
    // vertical gap - desktop layout
    this.verticalGap = parseInt(getComputedStyle(this.element).getPropertyValue('--drop-menu-gap-y')) || 4;
    // store autocomplete search results
    this.searchResults = [];
    // focusable elements
    this.focusableElements = [];
    initDropMenu(this);
  };

  function initDropMenu(menu) {
    // trigger drop menu opening/closing
    toggleDropMenu(menu);
    // toggle sublevels
    menu.element.addEventListener('click', function(event){
      // check if we need to show a new sublevel
      var menuBtnIn = event.target.closest('.'+menu.menuBtnInClass);
      if(menuBtnIn) showSubLevel(menu, menuBtnIn);
      // check if we need to go back to a previous level
      var menuBtnOut = event.target.closest('.'+menu.menuBtnOutClass);
      if(menuBtnOut) hideSubLevel(menu, menuBtnOut);
    });
    // init automplete search
    initAutocomplete(menu);
    // close drop menu on focus out
    initFocusOut(menu);
  };

  function toggleDropMenu(menu) { // toggle drop menu
    if(!menu.trigger) return;
    // actions to be performed when closing the drop menu
    menu.dropMenuClosed = function(event) {
      if(event.propertyName != 'visibility') return;
      if(getComputedStyle(menu.element).getPropertyValue('visibility') != 'hidden') return;
      menu.element.removeEventListener('transitionend', menu.dropMenuClosed);
      menu.element.removeAttribute('style');
      resetAllLevels(menu); // go back to main list
      resetAutocomplete(menu); // if autocomplte is enabled -> reset input fields
    };

    // on mobile - close drop menu when clicking on close btn
    menu.element.addEventListener('click', function(event){
      var target = event.target.closest('.js-drop-menu__close-btn');
      if(!target || !dropMenuVisible(menu)) return;
      menu.trigger.click();
    });

    // click on trigger
    menu.trigger.addEventListener('click', function(event){
      menu.element.removeEventListener('transitionend', menu.dropMenuClosed);
      var isVisible = dropMenuVisible(menu);
      Util.toggleClass(menu.element, menu.menuIsVisibleClass, !isVisible);
      isVisible ? menu.trigger.removeAttribute('aria-expanded') : menu.trigger.setAttribute('aria-expanded', true);
      if(isVisible) {
        menu.element.addEventListener('transitionend', menu.dropMenuClosed);
      } else {
        menu.element.addEventListener('transitionend', function cb(){
          menu.element.removeEventListener('transitionend', cb);
          focusFirstElement(menu, menu.element);
        });
        getLayoutValue(menu);
        setDropMenuMaxHeight(menu); // set max-height
        placeDropMenu(menu); // desktop only
      }
    });
  };

  function dropMenuVisible(menu) {
    return Util.hasClass(menu.element, menu.menuIsVisibleClass);
  };

  function showSubLevel(menu, menuBtn) {
    var mainLevel = menuBtn.closest('.'+menu.menuLevelClass),
      subLevel = Util.getChildrenByClassName(menuBtn.parentNode, menu.menuLevelClass);
    if(!mainLevel || subLevel.length == 0 ) return;
    // trigger classes
    Util.addClass(subLevel[0], menu.levelInClass);
    Util.addClass(mainLevel, menu.levelOutClass);
    Util.removeClass(mainLevel, menu.levelInClass);
    // animate height of main element
    animateDropMenu(menu, mainLevel.offsetHeight, subLevel[0].offsetHeight, function(){
      focusFirstElement(menu, subLevel[0]);
    });
  };

  function hideSubLevel(menu, menuBtn) {
    var subLevel = menuBtn.closest('.'+menu.menuLevelClass),
      mainLevel = subLevel.parentNode.closest('.'+menu.menuLevelClass);
    if(!mainLevel || !subLevel) return;
    // trigger classes
    Util.removeClass(subLevel, menu.levelInClass);
    Util.addClass(mainLevel, menu.levelInClass);
    Util.removeClass(mainLevel, menu.levelOutClass);
    // animate height of main element
    animateDropMenu(menu, subLevel.offsetHeight, mainLevel.offsetHeight, function(){
      var menuBtnIn = Util.getChildrenByClassName(subLevel.parentNode, menu.menuBtnInClass);
      if(menuBtnIn.length > 0) menuBtnIn[0].focus();
      // if primary level -> reset height of element + inner element
      if(Util.hasClass(mainLevel, 'js-drop-menu__list--main') && menu.layout == 'desktop') {
        menu.element.style.height = '';
        if(menu.innerElement.length > 0) menu.innerElement[0].style.height = '';
      }
    });
  };

  function animateDropMenu(menu, initHeight, finalHeight, cb) {
    if(menu.innerElement.length < 1 || menu.layout == 'mobile') {
      if(cb) setTimeout(function(){cb();}, menu.animationDuration*1000);
      return;
    }
    var resetHeight = false;
    // make sure init and final height are smaller than max height
    if(initHeight > menu.maxHeight) initHeight = menu.maxHeight;
    if(finalHeight > menu.maxHeight) {
      resetHeight = finalHeight;
      finalHeight = menu.maxHeight;
    }
    var change = finalHeight - initHeight,
      currentTime = null,
      duration = menu.animationDuration*1000;

    var animateHeight = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      var val = Math.easeOutQuart(progress, initHeight, change, duration);
      menu.element.style.height = val+"px";
      if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
      } else {
        menu.innerElement[0].style.height = resetHeight ? resetHeight+'px' : '';
        if(cb) cb();
      }
    };
    
    //set the height of the element before starting animation -> fix bug on Safari
    menu.element.style.height = initHeight+"px";
    window.requestAnimationFrame(animateHeight);
  };

  function resetAllLevels(menu) {
    var openLevels = menu.element.getElementsByClassName(menu.levelInClass),
      closeLevels = menu.element.getElementsByClassName(menu.levelOutClass);
    while(openLevels[0]) {
      Util.removeClass(openLevels[0], menu.levelInClass);
    }
    while(closeLevels[0]) {
      Util.removeClass(closeLevels[0], menu.levelOutClass);
    }
  };

  function focusFirstElement(menu, level) {
    var element = getFirstFocusable(level);
    element.focus();
  };

  function getFirstFocusable(element) {
    var elements = element.querySelectorAll(focusableElString);
    for(var i = 0; i < elements.length; i++) {
			if(elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) {
				return elements[i];
			}
		}
  };

  function getFocusableElements(menu) { // all visible focusable elements
    var elements = menu.element.querySelectorAll(focusableElString);
    menu.focusableElements = [];
    for(var i = 0; i < elements.length; i++) {
			if( isVisible(menu, elements[i]) ) menu.focusableElements.push(elements[i]);
		}
  };

  function isVisible(menu, element) {
    var elementVisible = false;
    if( (element.offsetWidth || element.offsetHeight || element.getClientRects().length) && getComputedStyle(element).getPropertyValue('visibility') == 'visible') {
      elementVisible = true;
      if(menu.element.contains(element) && element.parentNode) elementVisible = isVisible(menu, element.parentNode);
    }
    return elementVisible;
  };

  function initAutocomplete(menu) {
    if(!Util.hasClass(menu.element, 'js-autocomplete')) return;
    // get list of search results
    getSearchResults(menu);
    var autocompleteCharacters = 1;
    menu.autocompleteInput = menu.element.getElementsByClassName('js-autocomplete__input');
    menu.autocompleteList = menu.element.getElementsByClassName('js-autocomplete__results');
    new Autocomplete({
      element: menu.element,
      characters: autocompleteCharacters,
      searchData: function(query, cb) {
        var data = [];
        if(query.length >= autocompleteCharacters) {
          data = menu.searchResults.filter(function(item){
            return item['label'].toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }
        cb(data);
      }
    });
  };

  function resetAutocomplete(menu) {
    if(menu.autocompleteInput && menu.autocompleteInput.length > 0) {
      menu.autocompleteInput[0].value = '';
    }
  };

  function getSearchResults(menu) {
    var anchors = menu.element.getElementsByClassName('drop-menu__link');
    for(var i = 0; i < anchors.length; i++) {
      menu.searchResults.push({label: anchors[i].textContent, url: anchors[i].getAttribute('href')});
    }
  };

  function setDropMenuMaxHeight(menu) {
    if(!menu.trigger) return;
    if(menu.layout == 'mobile') {
      menu.maxHeight = '100%';
      menu.element.style.maxHeight = menu.maxHeight;
      if(menu.autocompleteList.length > 0) menu.autocompleteList[0].style.maxHeight = 'calc(100% - '+menu.autocompleteInput[0].offsetHeight+'px)';
    } else {
      menu.maxHeight = window.innerHeight - menu.trigger.getBoundingClientRect().bottom - menu.verticalGap - 15;
      menu.element.style.maxHeight = menu.maxHeight + 'px';
      if(menu.autocompleteList.length > 0) menu.autocompleteList[0].style.maxHeight = (menu.maxHeight - menu.autocompleteInput[0].offsetHeight) + 'px';
    }
  };

  function getLayoutValue(menu) {
    menu.layout = getComputedStyle(menu.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
  };

  function placeDropMenu(menu) {
    if(menu.layout == 'mobile') {
      menu.element.style.top = menu.element.style.left = menu.element.style.right = '';
    } else {
      var selectedTriggerPosition = menu.trigger.getBoundingClientRect();
			
      var left = selectedTriggerPosition.left,
        right = (window.innerWidth - selectedTriggerPosition.right),
        isRight = (window.innerWidth < selectedTriggerPosition.left + menu.element.offsetWidth);

      var rightVal = 'auto', leftVal = 'auto';
      if(isRight) {
        rightVal = right+'px';
      } else {
        leftVal = left+'px';
      }

      var topVal = (selectedTriggerPosition.bottom+menu.verticalGap)+'px';
      if( isRight && (right + menu.element.offsetWidth) > window.innerWidth) {
        rightVal = 'auto';
        leftVal = parseInt((window.innerWidth - menu.element.offsetWidth)/2)+'px';
      }
      menu.element.style.top = topVal;
      menu.element.style.left = leftVal;
      menu.element.style.right = rightVal;
    }
  };

  function closeOnResize(menu) {
    getLayoutValue(menu);
    if(menu.layout == 'mobile' || !dropMenuVisible(menu)) return;
    menu.trigger.click();
  };

  function closeOnClick(menu, target) {
    if(menu.layout == 'mobile' || !dropMenuVisible(menu)) return;
    if(menu.element.contains(target) || menu.trigger.contains(target)) return;
    menu.trigger.click();
  };

  function initFocusOut(menu) {
    menu.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        getFocusableElements(menu);
        if( (menu.focusableElements[0] == document.activeElement && event.shiftKey) || (menu.focusableElements[menu.focusableElements.length - 1] == document.activeElement && !event.shiftKey)) {
          menu.trigger.click();
        }
      } else if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' && dropMenuVisible(menu)) {
        menu.trigger.click();
			}
    });
  };

  // init DropMenu objects
  var dropMenus = document.getElementsByClassName('js-drop-menu');
  var focusableElString = '[href], input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable], summary';
  if( dropMenus.length > 0 ) {
    var dropMenusArray = [];
    for( var i = 0; i < dropMenus.length; i++) {(function(i){
      dropMenusArray.push(new DropMenu(dropMenus[i]));
    })(i);}

    // on resize -> close all drop menu elements
		window.addEventListener('resize', function(event){
			dropMenusArray.forEach(function(element){
				closeOnResize(element);
			});
    });
    
    // close drop menu when clicking outside it
		window.addEventListener('click', function(event){
      dropMenusArray.forEach(function(element){
				closeOnClick(element, event.target);
			});
		});
  }
}());