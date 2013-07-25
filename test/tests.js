test( "Initialization", function() {
	$('#target').rotatable();
	equal($('#target').data("angle"), 0, "Initial angle should be zero");
	equal($('#target').rotatable("handle").css('width'), '16px', "Should have a 10px handle");
	ok($('#target').rotatable("handle").is(":visible"), "Handle should be attached to target");
});