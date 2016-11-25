/*
 * GpxMake
 *
 * Converting GPS json data to GPX file in pure Javascript
 *
 * @author: Feyyaz Akkuş
 *
 */
(function (root, factory) {

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && typeof module.exports) {
            exports = module.exports = factory(root, exports);
        }
    }
    else if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            root.GpxMake = factory(root, exports);
        });
    }
    else {
        root.GpxMake = factory(root);
    }

}(this, function () {

 	'use strict';

    var elements = {
      'gpx': ['name', 'desc', 'author', 'url', 'urlname', 'time', 'keywords', 'bounds'],
      'rte': ['name', 'cmt', 'desc', 'src', 'url', 'urlname', 'number'],
      'trk': ['name', 'cmt', 'desc', 'src', 'url', 'urlname', 'number'],
      'points': ['lat', 'lon', 'ele', 'time', 'magvar', 'geoidheight', 'name', 'cmt', 'desc', 'src', 'url', 'urlname', 'sym', 'type', 'fix', 'sat', 'hdop', 'vdop', 'pdop', 'ageofdgpsdata', 'dgpsid']
    }

	var GpxMake = (function () {
		
		var defaults = {
			version: '1.1',
			creator: 'gpxmake'
		};

        var fileOptions = {};

		// consructor
		function GpxMake(options) {

			this.track = '';
			this.route = '';

			fileOptions = utils.extend(defaults, options);

			if (fileOptions.track) {
				this.track = setTrack(fileOptions.track);
			}
		}
		
     	// download file
		GpxMake.prototype.download = function (filename) {

            filename = filename + '.gpx';

            var content = setFileContent(fileOptions, this.track);

			var blob = new Blob([content], {'type': 'application/xml'});

			var link = document.createElement('a');
			document.body.appendChild(link); // for firefox it's necessary

		    // detect browser 
		    if (!utils.detectIE()) { // other browsers	    	
		    	link.href = window.URL.createObjectURL(blob);
		    	link.download = filename;
		    	link.click();

		    } else { // internet explorer
		    	window.navigator.msSaveOrOpenBlob(blob, filename);
		    }
		}

		// set track <trk></trk>
		function setTrack(track) {

            var trk = '<trk>\n';
            // add optinal elements
		    for (var key in track) {
		      if (typeof(track[key]) == 'string') {
		        if (elements.trk.indexOf(key) != -1) {
		          trk += '<' + key + '>' + track[key] + '</' + key + '>\n';
		        } else {
		          console.warn("'" + key + "' is not a valid gpx file element.");
		        }
		      }
		    }

            trk += '<trkseg>\n';

            var trkpts = track.points;

            if (trkpts) {
                for (var i = 0; i < trkpts.length; i++) {

				  var lat = trkpts[i]['lat'];
				  var lon = trkpts[i]['lon'];

				  if (lat && lon) {
				    // add lat, long required elements
				    trk += '<trkpt lat="' + lat + '" lon="' + lon + '">\n';

				    // add optinal elements
				    for (var key in trkpts[i]) {
				      if (key != 'lat' && key != 'lon') {
				        if (elements.points.indexOf(key) != -1) {
				          trk += '<' + key + '>' + trkpts[i][key] + '</' + key + '>\n';
				        } else {
				          console.warn("'" + key + "' is not a valid gpx file element.");
				        }
				      }
				    }

				    // close trkpt element
				    trk += '</trkpt>\n'

				  } else {
				    throw "Trackpoints should have lat and lon information. Please reorganize your data.";
				  }

				}
            } else {
                console.warn("No track points defined");
            }

            trk += '</trkseg>\n';
            trk += '</trk>\n';

            return trk;
        }

        // set xml file content
		function setFileContent(options, track) {

			var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    			'<gpx xsi:schemaLocation="http://www.topografix.com/GPX/1/1 ' + 
    			'http://www.topografix.com/GPX/1/1/gpx.xsd" ' + 
    			'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 
    			'version="' + fileOptions.version + '" ' +
                'creator="' + fileOptions.creator + '" ' + 
    			'xmlns="http://www.topografix.com/GPX/1/1">\n';

    		// add optional file informations
               
            xml += track;
			xml += '</gpx>';

			return xml;
		}

		// helpers
		var utils = (function() {

			return {

				extend: function() {
					for (var i = 1; i < arguments.length; i++) {
						for (var key in arguments[i]) {
							if (arguments[i].hasOwnProperty(key)) {
								arguments[0][key] = arguments[i][key];
							}
						}
					}
					return arguments[0];
				},

				detectIE: function () {
				    
				    var ua = window.navigator.userAgent;
				    var msie = ua.indexOf('MSIE ');
				    var trident = ua.indexOf('Trident/');
				    var edge = ua.indexOf('Edge/');

				    // internet explorer
				    if (msie > 0 || trident > 0 || edge > 0) {
				    	return true;
				    }
				    // other browser
				    return false;
				}
			}
		}());

		return GpxMake;
	})();

    return GpxMake;
}));
