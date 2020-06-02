/*
|
| require auxiliars functions to get collections and vegetations index
|
*/

var r = require ('users/engsoaresfilho/code:helpers.js');
var palettes = require ('users/gena/packages:palettes');

/*
| define your region to perform analisys
*/

var roi = geometry; // import geometries

/*
| ------------------------------------------------------------------------------------------------
*/

var s2_collection = r.getSr.filterCollectionS2(geometry, '2016-01-01','2020-06-01', 5)
    .map(r.indexSr.addNdvi)
    .select('ndvi'); 

print(s2_collection);

/*
|
| displays the images on screen
|
*/

Map.addLayer(s2_collection, {
  min:0.01,
  max:0.7,
  palette:palettes.colorbrewer.RdYlGn[11]
});





