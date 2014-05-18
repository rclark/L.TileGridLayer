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
            tileBounds, x, y, icon, label;

        this._layer.clearLayers();
        this._markers.forEach(function(marker) {
            map.removeLayer(marker);
        });
        this._markers = [];

        for (x = coords.minX; x <= coords.maxX; x++) {
            for (y = coords.minY; y <= coords.maxY; y++) {
                tileBounds = this._sm.bbox(x, y, z);
                label = [z,x,y].join('/');

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

                icon = L.divIcon({className: 'tile-grid-label', html: label});
                this._markers.push(
                    L.marker(
                        [
                            tileBounds[1] + (tileBounds[3] - tileBounds[1]) / 2,
                            tileBounds[0] + (tileBounds[2] - tileBounds[0]) / 2
                        ],
                        { icon: icon }
                    ).addTo(map)
                );
            }
        }
    }
});

L.tileGridLayer = function(options) {
    return new L.TileGridLayer(options);
};
