(function($) {
	$("#activatePolyfill").on("click", function() {
    $("#sampleForm").Form();
  });
  
  $("#useWidgets").on("click", function() {
    $("#sampleForm").Form({ alwaysUseWidgets: true });
  });
}(jQuery));