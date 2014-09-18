L.TileGridLayer = L.Class.extend({
    initialize: function(options) {
        this._layer = L.geoJson(null, options);
        this._sm = new SphericalMercator({size: 256});
        this._markers = [];
    },

    onAdd: function(map) {
        this._layer.addTo(map);
        map.on('moveend', this.updateTiles, this);
        try { this.updateTiles({target: map}); }
        catch(err) {}
    },

    addTo: function(map) {
        this.onAdd(map);
    },

    onRemove: function(map) {
        map.removeLayer(this._layer);
        map.off('moveend', this.updateTiles, this);
    },

    removeFrom: function(map) {
        this.onRemove(map);
    },

    updateTiles: function(moveEvent) {
        var map = moveEvent.target,
            bbox = map.getBounds().toBBoxString().split(','),
            z = map.getZoom(),
            coords = this._sm.xyz(bbox, z),
            tileBounds, pxBounds, pxCenter, center, x, y, icon, label;

        this._layer.clearLayers();
        this._markers.forEach(function(marker) {
            map.removeLayer(marker);
        });
        this._markers = [];

        for (x = coords.minX; x <= coords.maxX; x++) {
            for (y = coords.minY; y <= coords.maxY; y++) {
                tileBounds = this._sm.bbox(x, y, z);
                console.log(tileBounds);

                pxBounds = [
                    this._sm.px([tileBounds[0], tileBounds[1]], z)[0],
                    this._sm.px([tileBounds[0], tileBounds[1]], z)[1],
                    this._sm.px([tileBounds[2], tileBounds[3]], z)[0],
                    this._sm.px([tileBounds[2], tileBounds[3]], z)[1]
                ];
                console.log(pxBounds);

                pxCenter = [
                    pxBounds[0] + (pxBounds[2] - pxBounds[0]) / 2,
                    pxBounds[1] + (pxBounds[3] - pxBounds[1]) / 2
                ];
                console.log(pxCenter);

                center = this._sm.ll(pxCenter, z);
                console.log(center);

                label = [z,x,y].join('/');

                var index = '';
                for (var zoom = z; zoom > 0; zoom--) {
                    var b = 0;
                    var mask = 1 << (zoom - 1);
                    if ((x & mask) !== 0) b++;
                    if ((y & mask) !== 0) b += 2;
                    index += b.toString();
                }

                label += '<br/>' + index; 

                this._layer.addData({
                    type: 'Feature',
                    properties: {
                        label: label
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [ [
                            [ tileBounds[0], tileBounds[1] ],
                            [ tileBounds[2], tileBounds[1] ],
                            [ tileBounds[2], tileBounds[3] ],
                            [ tileBounds[0], tileBounds[3] ],
                            [ tileBounds[0], tileBounds[1] ]
                        ] ]
                    }
                });

                icon = L.divIcon({
                    className: 'tile-grid-label',
                    html: '<div class="tile-grid-label-container"><div class="tile-grid-label-inner">' + label + '</div></div>'
                });
                this._markers.push(
                    L.marker([center[1], center[0]], { icon: icon }).addTo(map)
                );
            }
        }
    }
});

L.tileGridLayer = function(options) {
    return new L.TileGridLayer(options);
};
