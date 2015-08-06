(function( $, undefined ) {

$.widget("ui.rotatable", $.ui.mouse, {

    options: {
        handle: false,
        angle: false,
        wheelRotate: true,
        snap: false,
        step: 22.5,

        
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
        handle.appendTo(this.element);
        
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
        var startXFromCenter = event.pageX - center[0];
        var startYFromCenter = event.pageY - center[1];
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

        this.performRotation(rotateAngle);
        var previousRotateAngle = this.elementCurrentAngle;
        this.elementCurrentAngle = rotateAngle;

        // Plugins callbacks need to be called first.
        this._propagate("rotate", event);

        if (previousRotateAngle != rotateAngle) {
            this._trigger("rotate", event, this.ui());
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
        if (this.hasRotated) {
            this._propagate("stop", event);
        }

        setTimeout( function() { this.element = false; }, 10 );
        return false;
    },

    getRotateAngle: function(event){
        var center = this.getElementCenter();
        
        var xFromCenter = event.pageX - center[0];
        var yFromCenter = event.pageY - center[1];
        var mouseAngle = Math.atan2(yFromCenter, xFromCenter);
        var rotateAngle = mouseAngle - this.mouseStartAngle + this.elementStartAngle;

        if (this.options.snap || event.shiftKey) {
            //convert radians to degrees
            var rotateDegrees = ( ( rotateAngle / Math.PI ) * 180 );

            //round to nearest step
            rotateDegrees = Math.round( rotateDegrees / this.options.step ) * this.options.step;

            //convert it back to radians
            rotateAngle = ( rotateDegrees * Math.PI ) / 180;
        }

        return rotateAngle;
    },
    
    wheelRotate: function(event) {
        var angle = Math.round(event.originalEvent.deltaY/10) * Math.PI/180;
        angle = this.elementCurrentAngle + angle;
        this.angle(angle);
        this._trigger("rotate", event, this.ui());
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
