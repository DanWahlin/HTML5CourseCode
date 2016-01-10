importScripts('underscore.js', 'd3.custom.js');

(function () {
	var xScale;
	var yScale;
	var maxIter;
	var xP;
	var yP;

	var instructions = [];

	var canEscape = function (x, y) {
		var q = (x - 0.25) * (x - 0.25) + y * y;

		return (q * (q + (x - 0.25)) < 0.25 * y * y) || ((x + 1) * (x + 1) + y * y < 1 / 16);
	};

	var mandelbrot = function (pixel) {
		var x0 = xScale(pixel.x);
		var y0 = yScale(pixel.y);
		var x = 0;
		var y = 0;
		var iteration = 0;
		var xTemp;

		if (canEscape(x0, y0)) {
			return maxIter;
		}

		while (x * x + y * y < 4 && iteration < maxIter) {
			xTemp = x * x - y * y + x0;
			y = 2 * x * y + y0;

			x = xTemp;

			iteration += 1;
		}

		return iteration;
	};

	var main = (function () {
		self.onmessage = function (e) {
			var d = JSON.parse(e.data);
			var domain = d.domain;
			var range = d.range;
			var extents = d.extents;
			var start = d.start;
			var end = d.end;

			maxIter = d.maxIter;
			
			xP = start[0];

			xScale = _.memoize(d3.scale.linear().domain([0, extents[0]]).range(domain));
			yScale = _.memoize(d3.scale.linear().domain([0, extents[1]]).range(range));

			while (xP < end[0]) {
				yP = start[1];

				while (yP < end[1]) {
					instructions.push({
						x: xP, 
						y: yP,
						c: mandelbrot({
							x: xP,
							y: yP
						})
					});

					yP += 1;
				}

				xP += 1;
			}

			self.postMessage(JSON.stringify(instructions));
		}
	
	})();
})();