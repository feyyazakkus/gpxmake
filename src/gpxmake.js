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
		
		var defaults = {
			extension: '.gpx',
			contentType: 'application/xml',
			version: '1.1',
			creator: 'gpxmake'
		};

        var fileOptions = {};

		// consructor
		var GpxMake = function (options) {			
			fileOptions = utils.extend(defaults, options);
			this.track = setTrack(fileOptions.track);
		}
		
     	// download file
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

		// set track <trk></trk>
		function setTrack(track) {

            var trk = '<trk>\n';
            trk += track.name ? '<name>' + track.name + '</name>\n' : '';
            trk += track.cmt ? '<cmt>' + track.cmt + '</cmt>\n' : '';
            trk += track.desc ? '<desc>' + track.desc + '</desc>\n' : '';
            trk += track.src ? '<src>' + track.src + '</src>\n' : '';
            trk += track.url ? '<url>' + track.url + '</url>\n' : '';
            trk += track.urlname ? '<urlname>' + track.urlname + '</urlname>\n' : '';
            trk += track.number ? '<number>' + track.number + '</number>\n' : '';

            trk += '<trkseg>\n';

            var trkpts = track.trackPoints;

            if (trkpts) {
                for (var i = 0; i < trkpts.length; i++) {
                    trk += '<trkpt lat="' + trkpts[i]['latitude'] + '" lon="' + trkpts[i]['longitude'] + '" />\n';
                };
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
	}

	if (typeof(window.GpxMake) === 'undefined') {
		window.GpxMake = _GpxMake();
	}

})(window);
