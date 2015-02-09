Leaflet.CanvasMask
==================

Mask geojson stuff with canvas and stuff

#Installation

```console
bower install leaflet-canvasmask
```

#Usage

```javascript
var bigRectangle = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-116,34],[-116,43],[-81,43],[-81,34],[-116,34]]]}}]};

L.tileLayer.canvasMask({
  maskColor: 'rgba(0, 0, 0, 0.8)',
  maskData: bigRectangle
}).addTo(map);
```

```javascript
var bigRectangle = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-116,34],[-116,43],[-81,43],[-81,34],[-116,34]]]}}]};

var maskLayer = L.tileLayer.canvasMask({
  maskColor: 'rgba(0, 0, 0, 0.8)',
  maskData: bigRectangle
});

maskLayer.addTo(map);

setTimeout(function(){
  maskLayer.setColor('#f00');
  maskLayer.setData(somethingElse);
}, 1000);
```
