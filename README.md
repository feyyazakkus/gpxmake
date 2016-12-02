# gpxmake
Converting GPS json data to GPX file in pure Javascript

### What It Does
This library convert GPS json data to GPX file. You can set tracks, routes and waypoints. It supports all elements in GPX 1.1 Schema. You can see full documentation from here: [GPX 1.1 Schema Documentation](http://www.topografix.com/gpx/1/1/)

### Example 

```js
var track = {
  name: "Example track",
  points: [{
    lat: "54.9328621088893",
    lon: "9.860624216140083"
  }, {
    lat: "54.93293237320851",
    lon: "9.86092208681491"
  }, {
    lat: "54.93327743521187",
    lon: "9.86187816543752"
  }, {
    lat: "54.93342326167919",
    lon: "9.862439849679859"
  }]
};

var route = {
  name: "Feyyaz's Route",
  desc: "This is an example route..",
  link: {
    href: "https://example-route.com",
    text: "example link associated with route",
    type: "web page"
  },
  points: [{
    name: "Route Point 1",
    lat: "54.9328621088893",
    lon: "9.860624216140083"
  }, {
    name: "Route Point 2",
    lat: "54.93293237320851",
    lon: "9.86092208681491"
  }, {
    name: "Route Point 3",
    lat: "54.93327743521187",
    lon: "9.86187816543752"
  }, {
    name: "Route Point 4",
    lat: "54.93342326167919",
    lon: "9.862439849679859"
  }]
};

var waypoints = [{
  name: "Waypoint 1",
  lat: "54.9328621088893",
  lon: "9.860624216140083"
}, {
  name: "Waypoint 2",
  lat: "54.93293237320851",
  lon: "9.86092208681491"
}, {
  name: "Waypoint 3",
  lat: "54.93327743521187",
  lon: "9.86187816543752"
}, {
  name: "Waypoint 4",
  lat: "54.93342326167919",
  lon: "9.862439849679859"
}]

var gpxmake = new Gpxmake({
  creator: 'Your application name here..',
  name: 'Example GPX file',
  desc: 'This is an example gpx file',
  author: {
    name: 'Feyyaz Akkuş'
  },
  time: new Date().toISOString(),
  keywords: 'keyword1, keyword2',
  bounds: {
    minlat: '54.0',
    minlon: '9.0',
    maxlat: '55.0',
    maxlon: '10.0'
  }
});

gpxmake.addTrack(track);
gpxmake.addRoute(route);
gpxmake.addWaypoints(waypoints);
gpxmake.download('my-gpx-file');


```