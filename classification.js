/*
| -----------------------------------------------------------------------------------------------
| this script aims to classify the land cover using machine learning (supervised classification)
| -----------------------------------------------------------------------------------------------
|
| require auxiliars functions to get collections and vegetations index
| @param string - the directory name of helper functions
*/

var r = require ('users/engsoaresfilho/code:helpers.js');

/*
|
| import the color scheme for index
|
*/

var palettes = require ('users/gena/packages:palettes');

/*
|
| define your standard params
| @params feateareCollection, string, string, int
|
*/

var ROI = geometry;
var T0 = '2019-06-01';
var T1 = '2019-11-30';
var CLOUD_COVER = 5;

/*
| -------------------------------------------------------------------------------------------------------------
| implements methods to get ImageCollections e vegetation index
| -------------------------------------------------------------------------------------------------------------
| see helpers.js file to get more info
*/

var bands = ['red','green','blue', 'nir', 'ndvi', 'redEdge1', 'redEdge2'];

var collection = r.getSr.filterCollectionS2(ROI, T0, T1, CLOUD_COVER)
      // apply method .map( callback function ) and set a function as param
      .map(r.indexSr.addNdvi); 

// converts an ImageCollection into an Image applying the median method
var image = collection.median().select(bands);

/*
| -------------------------------------------------------------------------------------------------------------
| collecting samples
| -------------------------------------------------------------------------------------------------------------
*/

var samples = ee.FeatureCollection([
  ee.Feature(forest, {'id':1}),
  ee.Feature(pasture, {'id':2}),
  ee.Feature(soil, {'id':3}),
  ee.Feature(dirty, {'id':4})
]);

var sample_region = image.sampleRegions({
  collection: samples,
  properties: ['id'],
  scale:10
});

var classifier = ee.Classifier.smileRandomForest(50).train(sample_region, 'id');
var classified = image.classify(classifier);

/*
| -------------------------------------------------------------------------------------------------------------
| spatial filters
| -------------------------------------------------------------------------------------------------------------
*/

var connected_px = 100; // min connected pixels
var min_area = 1; // min area - 1 ha
var obj_size = ee.Image.pixelArea();

var px_noise = classified.connectedPixelCount(connected_px + 1, false); // get connected pixels
    px_noise = px_noise.mask(px_noise.lt(connected_px)); // masks the filtered pixels
    px_noise = px_noise.multiply(obj_size).divide(ee.Image(10000)); // get pixel area
    px_noise = px_noise.mask(px_noise.lte(min_area)); // masks according the min area (1ha)

var kernel = ee.Kernel.circle({radius: 1}); // creates a circle kernel
var opened = classified
             .focal_min({kernel: kernel, iterations: 5})
             .focal_max({kernel: kernel, iterations: 5});

var classified_filtered = classified.where(px_noise, opened); // replace the noise pixel

/*
| -------------------------------------------------------------------------------------------------------------
| display results
| -------------------------------------------------------------------------------------------------------------
*/

Map.addLayer(image, {
  bands:['red','green','blue'],
  min:400,
  max:1587
}, 'Image RGB');

Map.addLayer(classified.randomVisualizer(), null, 'Classification');

Map.addLayer(classified_filtered.randomVisualizer(), null, 'Filtered Classification')


// after creating an account on Google Earth Engine, access the code below to visualize the results
// https://code.earthengine.google.com/b7e5603ee65bbbb2e46d3b682dfe59b8