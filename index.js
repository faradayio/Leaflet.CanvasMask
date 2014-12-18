L.tileLayer.CanvasMask = L.TileLayer.Canvas.extend({
  addTo: function(map){
    map.addLayer(this);
    L.DomUtil.addClass(this._container, 'canvas-layer');
    return this;
  },
  setColor: function(color){
    this.options.maskColor = color;
    this.redraw();
  },
  setData: function(data){
    this.options.maskData = data;
    this.dataBounds = false;
    this.redraw();
  },
  getDataBounds: function(){
    if (!this.dataBounds) {
      var path = d3.geo.path()
        .projection(d3.geo.transform({
          point: function(lng, lat) {
            var point = L.CRS.EPSG3857.project({lat: lat, lng: lng});
            this.stream.point(point.x, point.y);
          }
        }));

      this.dataBounds = path.bounds(this.options.maskData);
    }

    return this.dataBounds;
  },
  drawTile: function(canvas, tilePoint, zoom) {
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, width, height);

    if (!this.options.maskData) return;

    tilePoint = {x: tilePoint.x, y: tilePoint.y, z: zoom};

    var tilesLong = Math.pow(2, tilePoint.z);
    var sideLength = 40075016.68557849;
    var pixelsPerTile = sideLength / tilesLong;

    tilePoint.x %= tilesLong;
    tilePoint.y %= tilesLong;

    var tilePosition = {
      top: (sideLength/2) - ((tilePoint.y) / tilesLong * sideLength),
      left: -(sideLength/2) + (tilePoint.x / tilesLong * sideLength)
    };
    tilePosition.bottom = tilePosition.top-pixelsPerTile;
    tilePosition.right = tilePosition.left+pixelsPerTile;

    var tileBounds = L.bounds([tilePosition.left, tilePosition.top], [tilePosition.right, tilePosition.bottom]);

    var dataBounds = this.getDataBounds();

    dataBounds = L.bounds([dataBounds[0][0], dataBounds[1][1]], [dataBounds[1][0], dataBounds[0][1]]);

    var intersects = tileBounds.intersects(dataBounds);

    var width = canvas.width, height = canvas.height;

    context.fillStyle = this.options.maskColor;
    context.globalCompositeOperation = "source-over";
    context.fillRect(0, 0, width, height);

    if (!intersects) return;

    var projection = d3.geo.transform({
      point: function(lng, lat) {
        var point = L.CRS.EPSG3857.project({lat: lat, lng: lng});

        point.x -= tilePosition.left;
        point.x /= pixelsPerTile;
        point.x *= width;
        
        point.y = -point.y;
        point.y -= -tilePosition.top;
        point.y /= pixelsPerTile;
        point.y *= height;

        this.stream.point(point.x, point.y);
      }
    });

    var path = d3.geo.path()
      .projection(projection)
      .context(context);

    context.clearRect(0, 0, width, height);

    if (!this.options.maskData) return;

    context.fillStyle = this.options.maskColor;
    context.globalCompositeOperation = "source-over";
    context.fillRect(0, 0, width, height);

    context.globalCompositeOperation = "destination-out";

    context.beginPath();
    path(this.options.maskData);
    context.closePath();
    context.fillStyle = "black";
    context.fill();
  }
});

L.tileLayer.canvasMask = function(opts){
  return new L.tileLayer.CanvasMask(opts);
};