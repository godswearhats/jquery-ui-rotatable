test( "Initialization", function() {
    $('#target').rotatable();
    equal($('#target').data("angle"), 0, "Initial angle should be zero");
    equal($('#target').rotatable("handle"), false, "Should have no handle");
});

// https://github.com/godswearhats/jquery-ui-rotatable/issues/4
test( "Test for issue #4", function() {
    $('#target').rotatable({ angle: 0});
    equal($('#target').data("angle"), 0, "Angle should be zero when specified as such.");
});