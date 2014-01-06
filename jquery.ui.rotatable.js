(function( $, undefined ) {
		
$.widget("ui.rotatable", $.ui.mouse, {
	
	options: {
		handle: false,
        angle: false
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
        performRotation(this.element, this.options.angle);
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
		handle.draggable({ helper: 'clone', start: dragStart });
		handle.on('mousedown', startRotate);
		handle.appendTo(this.element);
        if(this.options.angle != false)
        {
            this.element.data('angle', this.options.angle);
            performRotation(this.element, this.options.angle);
        }
	},

    _destroy: function() {
        this.element.removeClass('ui-rotatable');
        this.element.find('.ui-rotatable-handle').remove();
    }
});

var elementBeingRotated, mouseStartAngle, elementStartAngle;
$(document).on('mouseup', stopRotate);

function getElementCenter(el) {
	var elementOffset = getElementOffset(el);
	var elementCentreX = elementOffset.left + el.width() / 2;
	var elementCentreY = elementOffset.top + el.height() / 2;
	return Array(elementCentreX, elementCentreY);
};

function getElementOffset(el) {
	performRotation(el, 0);
	var offset = el.offset();
	performRotation(el, el.data('angle'));
	return offset;
};

function performRotation(el, angle) {
	el.css('transform','rotate(' + angle + 'rad)');
	el.css('-moz-transform','rotate(' + angle + 'rad)');
	el.css('-webkit-transform','rotate(' + angle + 'rad)');
	el.css('-o-transform','rotate(' + angle + 'rad)');
};

function dragStart(event) {
	if (elementBeingRotated) return false;
};

function rotateElement(event) {
	if (!elementBeingRotated) return false;

	var center = getElementCenter(elementBeingRotated);
	var xFromCenter = event.pageX - center[0];
	var yFromCenter = event.pageY - center[1];
	var mouseAngle = Math.atan2(yFromCenter, xFromCenter);
	var rotateAngle = mouseAngle - mouseStartAngle + elementStartAngle;
	
	performRotation(elementBeingRotated, rotateAngle);
	elementBeingRotated.data('angle', rotateAngle);
	
	return false;
};

function startRotate(event) {
	elementBeingRotated = $(this).parent(); 
	var center = getElementCenter(elementBeingRotated);
	var startXFromCenter = event.pageX - center[0];
	var startYFromCenter = event.pageY - center[1];
	mouseStartAngle = Math.atan2(startYFromCenter, startXFromCenter);
	elementStartAngle = elementBeingRotated.data('angle');

	$(document).on('mousemove', rotateElement);
	
	return false;
};

function stopRotate(event) {
	if (!elementBeingRotated) return;
	$(document).unbind('mousemove');
	setTimeout( function() { elementBeingRotated = false; }, 10 );
	return false;
};

})(jQuery);