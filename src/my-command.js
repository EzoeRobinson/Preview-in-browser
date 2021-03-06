export default function(context) {
  var doc = context.document;
  var selections = context.selection;
  var artboard;

  if (selections.count() == 0) {
    doc.showMessage("Please select at least one artboard.");
    return;
  }

  for (var i = 0; i < selections.count(); i++) {
    if (selections[i].class() == "MSArtboardGroup") {
      artboard = selections[i];
    } else {
      artboard = doc.currentPage().currentArtboard();
    }
    var artboardname = artboard.name();
    artboardname = artboardname.replace(/['|'|/|#|.|\\|"|"]/g, "");
    var filename = NSTemporaryDirectory() + artboardname + ".png";
    doc.saveArtboardOrSlice_toFile(scaleArtboard(artboard), filename);
    var htmlContent = NSString.stringWithString_(
      "<html><head><meta charset='UTF-8'></head><body style='overflow-x: hidden; text-align: center; margin: 0; padding: 0; background:" +
        colorToRGBA(artboard.backgroundColor()) +
        ";'><img style='position:absolute; left:50%; margin-left:-" +
        artboard.frame().width() / 2 +
        "px;' width=" +
        artboard.frame().width() +
        " src='./" +
        artboardname +
        ".png' center top no-repeat;'></body></html>"
    );
    var filepath = NSTemporaryDirectory() + artboardname + ".html";
    htmlContent
      .dataUsingEncoding_(NSUTF8StringEncoding)
      .writeToFile_atomically_(filepath, true);
    var file = NSURL.fileURLWithPath(filepath);
    NSWorkspace.sharedWorkspace().openFile(file.path());
  }

  function scaleArtboard(layer) {
    var rect = layer.absoluteInfluenceRect();
    var request = MSExportRequest.new();
    request.rect = rect;
    request.scale = 2;
    return request;
  }

  function colorToRGBA(color) {
    var rgbaValue =
      "rgba(" +
      (color.red() * 255).toFixed(0) +
      "," +
      (color.green() * 255).toFixed(0) +
      "," +
      (color.blue() * 255).toFixed(0) +
      "," +
      color.alpha().toFixed(2) +
      ")";
    return rgbaValue;
  }
}
