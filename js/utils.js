/*global window: false */

if (!Array.prototype.last) {
  Array.prototype.last = function () { 
    return this[this.length - 1]; 
  };
}

if (!Array.prototype.cycle) {
  Array.prototype.cycle = function () {
    var retval;
    retval = this.shift();
    this.push(retval);
    return retval;
  };
}

if(!domExt) {
  var domExt = {};
}

if (!domExt.classArray) {
  domExt.classArray = function (el) {
    return el.className.split(" ");
  };
}

if (!domExt.hasClass) {
  domExt.hasClass = function (el, klass) {
    if (domExt.classArray(el).indexOf(klass) === -1) {
      return false;
    } else {
      return true;
    }
  };
}

if (!domExt.addClass) {
  domExt.addClass = function (el, klass) {
    if (domExt.hasClass(el, klass)) {
      return;
    }
    el.className = el.className + " " + klass;
  };
}

if (!domExt.removeClass) {
  domExt.removeClass = function (el, klass) {
    if (!domExt.hasClass(el, klass)) {
      return;
    }
    var classList;
    classList = domExt.classArray(el).filter(function (member, i, a) {
      if (member !== klass) {
        return member;
      }
    });
    el.className = classList.join(" ");
  };
}

if (!Object.merge) {
  Object.merge = function () {
    "use strict";
    var retval = arguments[0];
    for (var i = 1; i <= arguments.length; i++) {
      if (arguments[i] !== undefined) {
        for(var ele in arguments[i]) {
          if(!retval[ele]) {
            retval[ele] = arguments[i][ele];
          }
        }
      }
    }
    return retval;
  }
}
