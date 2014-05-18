# L.TileGridLayer

A Leaflet layer that simply displays the boundaries and tile coordinates of
viewable tiles according to the Spherical Mercator tiling scheme.

[View an example map](https://rclark.github.io/L.TileGridLayer/example)

## Usage

You must include the [spherical-mercator](http://github.com/mapbox/node-sphericalmercator)
script in order to use this layer. Once you've included that and `L.TileGridLayer.js`,
simply

```
L.tileGridLayer(options).addTo(map);
```

Accepts all [GeoJSON options](http://leafletjs.com/reference.html#geojson-options)
defined by Leaflet.

### Optional

You may wish to include a little CSS to improve the visibility of the tile labels.

```css
.tile-grid-label {
  font-weight: bold;
  text-shadow:
    -1px  1px #fff,
    -1px -1px #fff,
     1px -1px #fff,
     1px  1px #fff;
}
```
