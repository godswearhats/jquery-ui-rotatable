jquery-ui-rotatable is a plugin for jQuery UI that works in a similar way to Draggable and Resizable, without being as full-featured (please fork and send me pull requests!). By default, it puts a small rotation icon in the bottom left of whatever element you want to make rotatable. I chose that area because it was originally being used in [Herald](https://github.com/godswearhats/herald) and the elements in that project were also resizable and I didn't want to interfere with the bottom/right controls for that.

### Usage

Somewhere in your HTML ...

	<!-- prerequisites -->
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css">
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	
	<script src="jquery.ui.rotatable.js"></script>
	<!-- this is small and will allow you to override look/feel of handle -->
	<link rel="stylesheet" href="jquery.ui.rotatable.css">
	
	<script type="text/javascript">
		$(document).ready(function() {
			$('#target').rotatable();
		});
	</script>
	
	<div id="target">Rotate me!</div>
	
Note that you should probably define a height and width for anything that you make rotatable, as the rotation happens around the center point of the element, and when you don't define these things, it could look and feel a little a strange.

### Demo

A simple demo is in the source code, but can be visited [here](http://godswearhats.com/jquery-ui-rotatable/demo.html).

### Shortcomings

This has not been well tested or well documented. My hope is that other people will use it and then either submit patches or ask for fixes. Maybe I'll have enough time to try to get it merged with the actual jQuery UI, but I'm not sure I'd have the bandwidth to do this on my own.

### License

Released under the [MIT license](http://jquery.org/license), like jQuery. 
