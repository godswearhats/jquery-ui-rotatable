(function( $, undefined ) {

$.widget("ui.rotatable", $.ui.mouse, {
	widgetEventPrefix: "rotate",

    options: {
        handle: false,
        angle: false,
        wheelRotate: true,
        snap: false,
        step: 22.5,

        handle_offset: {
            top: 0,
            left: 0
        },

        rotationCenterX: false,
        rotationCenterY: false,

        // callbacks
        start: null,
        rotate: null,
        stop: null
    },

    rotationCenterX: function(x) {
        if (x === undefined) {
            return this.options.rotationCenterX;
        }
        this.options.rotationCenterX = x;
    },

    rotationCenterY: function(y) {
        if (y === undefined) {
            return this.options.rotationCenterY;
        }
        this.options.rotationCenterY = y;
    },

    handle: function(handle) {
        if (handle === undefined) {
            return this.options.handle;
        }
        this.options.handle = handle;
    },

    angle: function(angle) {
        if (angle === undefined) {
            return this.options.angle;
        }
        this.options.angle = angle;
        this.elementCurrentAngle = angle;
        this.performRotation(this.options.angle);
    },

    _create: function() {
        var handle;
        if (!this.options.handle) {
            handle = $(document.createElement('div'));
            handle.addClass('ui-rotatable-handle');
        }
        else {
            handle = this.options.handle;
        }

        this.listeners = {
            rotateElement: $.proxy(this.rotateElement, this),
            startRotate: $.proxy(this.startRotate, this),
            stopRotate: $.proxy(this.stopRotate, this),
            wheelRotate: $.proxy(this.wheelRotate, this)
        };

        if (this.options.wheelRotate) {
            this.element.bind('wheel', this.listeners.wheelRotate);
        }

        handle.draggable({ helper: 'clone', start: this.dragStart, handle: handle });
        handle.bind('mousedown', this.listeners.startRotate);

        if ( !handle.closest( this.element ).length ) {
            handle.appendTo(this.element);
        }

        if(this.options.angle != false) {
            this.elementCurrentAngle = this.options.angle;
            this.performRotation(this.elementCurrentAngle);
        }
        else {
            this.elementCurrentAngle = 0;
        }
    },

    _destroy: function() {
        this.element.removeClass('ui-rotatable');
        this.element.find('.ui-rotatable-handle').remove();

        if (this.options.wheelRotate) {
            this.element.unbind('wheel', this.listeners.wheelRotate);
        }
    },

    performRotation: function(angle) {
        this.element.css('transform-origin', this.options.rotationCenterX + '% ' + this.options.rotationCenterY + '%');
        this.element.css('-ms-transform-origin', this.options.rotationCenterX + '% ' + this.options.rotationCenterY + '%'); /* IE 9 */
        this.element.css(
          '-webkit-transform-origin',
          this.options.rotationCenterX + '% ' + this.options.rotationCenterY + '%'); /* Chrome, Safari, Opera */

        this.element.css('transform','rotate(' + angle + 'rad)');
        this.element.css('-moz-transform','rotate(' + angle + 'rad)');
        this.element.css('-webkit-transform','rotate(' + angle + 'rad)');
        this.element.css('-o-transform','rotate(' + angle + 'rad)');
    },

    getElementOffset: function() {
        this.performRotation(0);
        var offset = this.element.offset();
        this.performRotation(this.elementCurrentAngle);
        return offset;
    },

    getElementCenter: function() {
      var elementOffset = this.getElementOffset();

      if(this.options.rotationCenterX === false)
      {
        var elementCentreX = elementOffset.left + this.element.width() / 2;
        var elementCentreY = elementOffset.top + this.element.height() / 2;
      }
      else
      {
        var elementCentreX = elementOffset.left + (this.element.width() / 100) * this.options.rotationCenterX;
        var elementCentreY = elementOffset.top + (this.element.height() / 100) * this.options.rotationCenterY;
      }

      return Array(elementCentreX, elementCentreY);
    },

    dragStart: function(event) {
        if (this.element) {
            return false;
        }
    },

    startRotate: function(event) {
        var center = this.getElementCenter();
        var startXFromCenter = event.pageX - this.options.handle_offset.left - center[0];
        var startYFromCenter = event.pageY - this.options.handle_offset.top - center[1];
        this.mouseStartAngle = Math.atan2(startYFromCenter, startXFromCenter);
        this.elementStartAngle = this.elementCurrentAngle;
        this.hasRotated = false;

        this._propagate("start", event);

        $(document).bind('mousemove', this.listeners.rotateElement);
        $(document).bind('mouseup', this.listeners.stopRotate);

        return false;
    },

    rotateElement: function(event) {
        if (!this.element || this.element.disabled) {
            return false;
        }

        var rotateAngle = this.getRotateAngle(event);

        var previousRotateAngle = this.elementCurrentAngle;
        this.elementCurrentAngle = rotateAngle;

        // Plugins callbacks need to be called first.
        this._propagate("rotate", event);

        if (this._propagate("rotate", event) === false ) {
            this.elementCurrentAngle = previousRotateAngle;
            return false;
        }
        var ui = this.ui();
        if (this._trigger("rotate", event, ui ) === false) {
            this.elementCurrentAngle = previousRotateAngle;
            return false;
        } else if (ui.angle.current != rotateAngle) {
            rotateAngle = ui.angle.current;
            this.elementCurrentAngle = rotateAngle;
        }

        this.performRotation(rotateAngle);

        if (previousRotateAngle != rotateAngle) {
            this.hasRotated = true;
        }

        return false;
    },

    stopRotate: function(event) {
        if (!this.element || this.element.disabled) {
            return;
        }

        $(document).unbind('mousemove', this.listeners.rotateElement);
        $(document).unbind('mouseup', this.listeners.stopRotate);

        this.elementStopAngle = this.elementCurrentAngle;

        this._propagate("stop", event);

        setTimeout( function() { this.element = false; }, 10 );
        return false;
    },

    getRotateAngle: function(event){
        var center = this.getElementCenter();

        var xFromCenter = event.pageX - this.options.handle_offset.left - center[0];
        var yFromCenter = event.pageY - this.options.handle_offset.top - center[1];
        var mouseAngle = Math.atan2(yFromCenter, xFromCenter);
        var rotateAngle = mouseAngle - this.mouseStartAngle + this.elementStartAngle;

        if (this.options.snap || event.shiftKey) {
          rotateAngle = this._calculateSnap(rotateAngle);
        }

        return rotateAngle;
    },

    wheelRotate: function(event) {
        var angle = Math.round(event.originalEvent.deltaY/10) * Math.PI/180;
        if (this.options.snap || event.shiftKey) {
          angle = this._calculateSnap(angle);
        }
        angle = this.elementCurrentAngle + angle;
        this.angle(angle);
        this._trigger("rotate", event, this.ui());
    },

    _calculateSnap: function(rotateAngle) {
      var rotateDegrees = ((rotateAngle / Math.PI) * 180);
      rotateDegrees = Math.round(rotateDegrees / this.options.step) * this.options.step;
      return (rotateDegrees * Math.PI) / 180;
    },

    _propagate: function(n, event) {
        $.ui.plugin.call(this, n, [event, this.ui()]);
        (n !== "rotate" && this._trigger(n, event, this.ui()));
    },

    plugins: {},

    ui: function() {
        return {
            api:this,
            element: this.element,
            angle: {
                start: this.elementStartAngle,
                current: this.elementCurrentAngle,
                stop: this.elementStopAngle
            }
        };
    }

});

})(jQuery);
