/*
 * GpxMake
 *
 * Converting GPS json data to GPX file in pure Javascript
 *
 * @author: Feyyaz Akkuş
 *
 */
(function(root, factory) {

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && typeof module.exports) {
			exports = module.exports = factory(root, exports);
		}
	} else if (typeof define === 'function' && define.amd) {
		define(['exports'], function(exports) {
			root.GpxMake = factory(root, exports);
		});
	} else {
		root.GpxMake = factory();
	}

}(this, function() {

	'use strict';

	var elements = {
		'rteType': ['name', 'cmt', 'desc', 'src', 'link', 'number', 'type'],
		'trkType': ['name', 'cmt', 'desc', 'src', 'link', 'number', 'type'],
		'wptType': ['lat', 'lon', 'ele', 'time', 'magvar', 'geoidheight', 'name', 'cmt', 'desc', 'src', 'url', 'urlname', 'sym', 'type', 'fix', 'sat', 'hdop', 'vdop', 'pdop', 'ageofdgpsdata', 'dgpsid']
	}

	var GpxMake = (function() {

		var defaults = {
			version: '1.1',
			creator: 'gpxmake'
		};

		// consructor
		function GpxMake(options) {

			this.metadata = '';
			this.track = '';
			this.route = '';
			this.wayPoints = '';

			if (options.metadata) {
				this.metadata = setMetaData(options.metadata);
			}
			if (options.track) {
				this.track = setTrack(options.track);
			}
			if (options.route) {
				this.route = setRoute(options.route);
			}
		}

		// download file
		GpxMake.prototype.download = function(filename) {

			filename = filename + '.gpx';

			var content = setFileContent(this.metadata, this.track, this.route);

			var blob = new Blob([content], {
				'type': 'application/xml'
			});

			var link = document.createElement('a');
			document.body.appendChild(link);

			// detect browser 
			if (!utils.detectIE()) { // other browsers	    	
				link.href = window.URL.createObjectURL(blob);
				link.download = filename;
				link.click();

			} else { // internet explorer
				window.navigator.msSaveOrOpenBlob(blob, filename);
			}
		}

		function setMetaData(metadata) {

			var meta = '<metadata>\n';

			// name
			if (metadata.name) {
				meta += '<name>' + metadata.name + '</name>\n';
			}
			// desc
			if (metadata.desc) {
				meta += '<desc>' + metadata.desc + '</desc>\n';
			}
			// time
			if (metadata.time) {
				meta += '<time>' + metadata.time + '</time>\n';
			}
			// keywords
			if (metadata.keywords) {
				meta += '<keywords>' + metadata.keywords + '</keywords>\n';
			}
			// author
			var author = metadata.author;
			if (author) {
				meta += '<author>\n';
				if (author.name) {
					meta += '<name>' + author.name + '</name>\n';
				}
				if (author.email) {
					if (author.email.id && author.email.domain) {
						meta += '<email id="'+author.email.id+'" domain="'+author.email.domain+'" />\n';	
					} else {
						console.warn("<email> element should have id and domain information.");
					}
				}
				if (author.link) {
					if (author.link.href) {
						meta += '<link href="'+author.link.href+'">\n';

						if (author.link.text) {
							meta += '<text>' + author.link.text + '</text>\n';
						}
						if (author.link.type) {
							meta += '<type>' + author.link.type + '</type>\n';
						}
						meta += '</link>\n';
					} else {
						console.warn("<link> element should have href information.");
					}
				}
				meta += '</author>\n';
			}

			// copyright
			var copyright = metadata.copyright;
			if (copyright) {
				if (copyright.author) {
					meta += '<copyright author="' + copyright.author + '">\n';
					
					if (copyright.year) {
						meta += '<year>' + copyright.year + '</year>\n';
					}
					if (copyright.licence) {
						meta += '<licence>' + copyright.licence + '</licence>\n';
					}
					meta += '</copyright>\n';
				} else {
					console.warn("<copyright> element should have author information.");
				}
			}

			// link
			var link = metadata.link;
			if (link) {
				if (link.href) {
					meta += '<link href="' + link.href + '">\n';

					if (link.text) {
						meta += '<text>' + link.text + '</text>\n';
					}
					if (link.type) {
						meta += '<type>' + link.type + '</type>\n';
					}
					meta += '</link>';
				} else {
					console.warn("<link> element should have href information.");
				}
			}

			// bounds
			var bounds = metadata.bounds;
			if (bounds) {
				if (bounds.minlat && bounds.minlon && bounds.maxlat && bounds.maxlon) {
					meta += '<bounds minlat="' + bounds.minlat + '" minlon="' + bounds.minlon + '" maxlat="' + bounds.maxlat + '" maxlon="' + bounds.maxlon + '" />\n';
				} else {
					console.warn("<bounds> element should have minlat, minlon, maxlat and maxlon information.");
				}
			}

			meta += '</metadata>\n';
			return meta;
		}

		// set track <trk></trk>
		function setTrack(track) {

			var trk = '<trk>\n';
			// add optinal elements
			for (var key in track) {
				if (typeof(track[key]) == 'string') {
					if (elements.trkType.indexOf(key) != -1) {
						trk += '<' + key + '>' + track[key] + '</' + key + '>\n';
					} else {
						console.warn("'" + key + "' is not a valid gpx file element.");
					}
				} else {
					if (key == 'link') {
						var link = track['link'];
						if (link.href) {
							trk += '<link href="' + link.href + '">';
							if (link.text) {
								trk += '<text>' + link.text + '</text>\n';
							}
							if (link.type) {
								trk += '<type>' + link.type + '</type>\n';
							}
							trk += '</link>'
						}
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
								if (elements.wptType.indexOf(key) != -1) {
									if (key == 'link') {
										var link = trkpts[i]['link'];
										if (link.href) {
											trk += '<link href="' + link.href + '">';
											if (link.text) {
												trk += '<text>' + link.text + '</text>\n';
											}
											if (link.type) {
												trk += '<type>' + link.type + '</type>\n';
											}
											trk += '</link>'
										}
									} else {
										trk += '<' + key + '>' + trkpts[i][key] + '</' + key + '>\n';	
									}
									
								} else {
									console.warn("'" + key + "' is not a valid gpx file element.");
								}
							}
						}

						// close trkpt element
						trk += '</trkpt>\n'

					} else {
						throw('Trackpoints should have lat and lon information. Please reorganize your data.');
					}
				}

			} else {
				console.warn("No track points defined");
			}

			trk += '</trkseg>\n';
			trk += '</trk>\n';

			return trk;
		}


		// set route <rte></rte>
		function setRoute(route) {

			var rte = '<rte>\n';
			// add optinal elements
			for (var key in route) {
				if (typeof(route[key]) == 'string') {
					if (elements.trkType.indexOf(key) != -1) {
						rte += '<' + key + '>' + route[key] + '</' + key + '>\n';
					} else {
						console.warn("'" + key + "' is not a valid gpx file element.");
					}
				} else {
					if (key == 'link') {
						var link = route['link'];
						if (link.href) {
							rte += '<link href="' + link.href + '">';
							if (link.text) {
								rte += '<text>' + link.text + '</text>\n';
							}
							if (link.type) {
								rte += '<type>' + link.type + '</type>\n';
							}
							rte += '</link>'
						}
					}
				}
			}

			var rtepts = route.points;

			if (rtepts) {
				for (var i = 0; i < rtepts.length; i++) {

					var lat = rtepts[i]['lat'];
					var lon = rtepts[i]['lon'];

					if (lat && lon) {
						// add lat, long required elements
						rte += '<rtept lat="' + lat + '" lon="' + lon + '">\n';

						// add optinal elements
						for (var key in rtepts[i]) {
							if (key != 'lat' && key != 'lon') {
								if (elements.wptType.indexOf(key) != -1) {
									if (key == 'link') {
										var link = rtepts[i]['link'];
										if (link.href) {
											rte += '<link href="' + link.href + '">';
											if (link.text) {
												rte += '<text>' + link.text + '</text>\n';
											}
											if (link.type) {
												rte += '<type>' + link.type + '</type>\n';
											}
											rte += '</link>'
										}
									} else {
										rte += '<' + key + '>' + rtepts[i][key] + '</' + key + '>\n'; 
									}
									
								} else {
									console.warn("'" + key + "' is not a valid gpx file element.");
								}
							}
						}

						// close trkpt element
						rte += '</rtept>\n'

					} else {
						throw('Routepoints should have lat and lon information. Please reorganize your data.');
					}
				}

			} else {
				console.warn("No route points defined");
			}

			rte += '</rte>\n';

			return rte;
		}

		// set xml file content
		function setFileContent(metadata, track, route) {
			
			var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
				'<gpx xsi:schemaLocation="http://www.topografix.com/GPX/1/1 ' +
				'http://www.topografix.com/GPX/1/1/gpx.xsd" ' +
				'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
				'version="1.1" creator="gpxmake.js" ' + 
				'xmlns="http://www.topografix.com/GPX/1/1">\n';

			xml += metadata;
			xml += track;
			xml += route;
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

				detectIE: function() {

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
