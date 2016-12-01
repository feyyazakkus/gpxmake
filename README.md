# gpxmake
Converting GPS json data to GPX file in pure Javascript

### What It Does
This library convert GPS json data to GPX file. You can set tracks, route and waypoints. It supports all elements in GPX 1.1 Schema.

You can see full documentation from here: [GPX 1.1 Schema Documentation](http://www.topografix.com/gpx/1/1/)


### Example 

```js
$.getJSON("data.json", function(data) {

    var gpxmake = new Gpxmake({
        creator: "Your application name here..",
        name: 'Example GPX file',
        desc: 'This is an example gpx file',
        author: {
            name: 'Feyyaz Akkuş',
            email: {
                id: 'feyyazakkus',
                domain: 'gmail.com'
            },
            link: {
                href: 'https://github.com/feyyazakkus/',
                text: 'Github',
                type: 'web page'
            }
        },
        copyright: {
            author: 'Feyyaz Akkuş',
            year: '2016',
            license: 'license link..'
        },
        time: new Date().toISOString(),
        keywords: 'keyword1, keyword2',
        bounds: { minlat: '54.0', minlon: '9.0', maxlat: '55.0', maxlon: '10.0' }
    });
    
    gpxmake.addTrack(data.track);
    gpxmake.addRoute(data.route);
    gpxmake.addWaypoints(data.waypoints);
    gpxmake.download('my-gpx-file');
});

```