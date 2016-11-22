/*
 * GpxMake
 *
 * Converting GPS json data to GPX file in pure Javascript
 *
 * @author: Feyyaz Akkuş
 *
 */
 (function (window) {

 	'use strict';

	function _GpxMake() {
		
		var defaultOptions = {
			extension: '.gpx',
			contentType: 'application/xml',
			version: '1.1',
			creator: 'gpxmake'
		}

        var fileOptions = {}

		// consructor
		var GpxMake = function (options) {			
			fileOptions = utils.extend(defaultOptions, options);
            this.track = '';
            this.route = '';
            this.waypoints = '';
		}
		
        // library api functions
        GpxMake.prototype.setTrack = function (track) {

            this.track = '<trk>\n';
            this.track += track.name ? '<name>' + track.name + '</name>\n' : '';
            this.track += track.cmt ? '<cmt>' + track.cmt + '</cmt>\n' : '';
            this.track += track.desc ? '<desc>' + track.desc + '</desc>\n' : '';
            this.track += track.src ? '<src>' + track.src + '</src>\n' : '';
            this.track += track.url ? '<url>' + track.url + '</url>\n' : '';
            this.track += track.urlname ? '<urlname>' + track.urlname + '</urlname>\n' : '';
            this.track += track.number ? '<number>' + track.number + '</number>\n' : '';

            this.track += '<trkseg>\n';

            var trkpts = track.trackPoints;

            if (trkpts) {
                for (var i = 0; i < trkpts.length; i++) {
                    this.track += '<trkpt lat="' + trkpts[i]['latitude'] + '" lon="' + trkpts[i]['longitude'] + '" />\n';
                };
            } else {
                console.warn("No track points defined");
            }

            this.track += '</trkseg>\n';
            this.track += '</trk>\n';
        }
        

		GpxMake.prototype.download = function (filename) {

            filename = filename + fileOptions.extension;

            var content = setFileContent(fileOptions, this.track);

			var blob = new Blob([content], {'type': fileOptions.contentType});

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

		function setFileContent(options, track) {

			var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    			'<gpx xsi:schemaLocation="http://www.topografix.com/GPX/1/1 ' + 
    			'http://www.topografix.com/GPX/1/1/gpx.xsd" ' + 
    			'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 
    			'version="' + fileOptions.version + '" ' +
                'creator="' + fileOptions.creator + '" ' + 
    			'xmlns="http://www.topografix.com/GPX/1/1">\n';

            xml += track;
			xml += '</gpx>';

			return xml;
		}

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

				    if (msie > 0) {
				        // IE 10 or older => return version number
				        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
				    }

				    var trident = ua.indexOf('Trident/');
				    if (trident > 0) {
				        // IE 11 => return version number
				        var rv = ua.indexOf('rv:');
				        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
				    }

				    var edge = ua.indexOf('Edge/');
				    if (edge > 0) {
				        // IE 12 (aka Edge) => return version number
				        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
				    }

				    // other browser
				    return false;
				}
			}
		}());

		return GpxMake;
	}

	if (typeof(window.GpxMake) === 'undefined') {
		window.GpxMake = _GpxMake();
	}

})(window);
