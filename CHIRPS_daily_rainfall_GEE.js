// Define a point of interest
var point = ee.Geometry.Point([-40.30, -9.23]);

// Load the CHIRPS precipitation dataset
var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY");

// Filter the dataset to the date range of interest
var date_start = '2010-01-01';
var date_end = '2015-12-31';
var filtered_chirps = chirps.filterDate(date_start, date_end);

// Extract the precipitation values at the point of interest
var precip_values = filtered_chirps.map(function(image) {
  var precip = image.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: point,
    scale: 5000
  });
  return ee.Feature(null, precip).set({'system:time_start': image.date().millis()});
});

// Group the features into a single collection
var precip_group = precip_values.map(function(f) {
  return ee.FeatureCollection([f]);
});

// Convert the precipitation values to a table and print it
var precip_table = precip_group.flatten();
print(precip_table);

// Display the point on the map
Map.addLayer(point, {color: 'red'});
Map.centerObject(point, 10);

// Create a chart object
var chart = ui.Chart.feature.byFeature(precip_table, 'system:time_start', ['precipitation']);

// Specify chart options
chart.setOptions({
  title: 'Daily precipitation values',
  hAxis: {title: 'Date'},
  vAxis: {title: 'Precipitation (mm)'},
  lineWidth: 1,
  pointSize: 4,
  series: {
    0: {color: 'blue'}
  }
});

// Display the chart
print(chart);