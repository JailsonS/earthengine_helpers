/*
|
| require auxiliars functions to get collections and vegetations index
| the code below is runnable accessing this link 
| -> https://code.earthengine.google.com/2dea6f38c490523a16a1cac32b40b98d
*/

var r = require ('users/engsoaresfilho/code:helpers.js');
var palettes = require ('users/gena/packages:palettes');

/*
| define your region to perform analisys
*/

var roi = geometry; // import geometries
var time_start = '2016-01-01';
var time_end = '2016-01-01';
var cloudcover = 5;

/*
| ------------------------------------------------------------------------------------------------
*/

var s2_collection = r.getSr.filterCollectionS2(roi, time_start,time_end, cloudcover)
    .map(r.indexSr.addNdvi)
    .select('ndvi'); 

print(s2_collection);

/*
|
| displays the images on screen
|
*/

Map.centerObject(s2_collection, 11);

Map.addLayer(s2_collection, {
  min:0.01,
  max:0.7,
  palette:palettes.colorbrewer.RdYlGn[11]
});





