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
            var params = {
                // Callback fired on rotation start.
                start: function(event, ui) {
                },
                // Callback fired during rotation.
                rotate: function(event, ui) {
                },
                // Callback fired on rotation end.
                stop: function(event, ui) {
                },
            };
            $('#target').rotatable(params);
        });
    </script>
    
    <div id="target">Rotate me!</div>

The start, rotate and stop callbacks provide the following in the ui argument of the callback:
* element: The jQuery element being rotated.
* angle: An object containing information about the rotation angle, with the following keys:
    * start: The angle at the begining of the rotation.
    * current: The current angle of the rotation.
    * stop: The angle at the end of the rotation.

Note that you should probably define a height and width for anything that you make rotatable, as the rotation happens around the center point of the element, and when you don't define these things, it could look and feel a little a strange.

You can also combine this plugin with the built-in `resizable()` and `draggable()`, although the latter works best when applied to a container with the rotatable inside it. See the Demo page for some examples.

You can disable/enable the rotation using `$('#target').rotatable('enable');` and `$('#target').rotatable('disable');`.

### Demo

A simple demo is in the source code, but can be visited [here](http://godswearhats.com/jquery-ui-rotatable/demo.html).

### Thanks

Many thanks to those of you who have reported issues and helped me diagnose and fix them!

### License

Released under the [MIT license](http://jquery.org/license), like jQuery. 
