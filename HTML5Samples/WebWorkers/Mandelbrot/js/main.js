(function () {

	var extents = [500, 500];
	var domain = [-2.5, 1];
	var range = [-2, 1.5];
	var xScale = d3.scale.linear().domain([0, extents[0]]).range(domain);
	var yScale = d3.scale.linear().domain([0, extents[1]]).range(range);
	var maxIter = 1000;
	var color;
	var canvas = document.getElementById('c');
	var ctx = canvas.getContext('2d');
	var zoom = [1, 1];
	var startColor = 'red';
	var midColor = 'yellow';
	var endColor = 'fuchsia';
	var bulbColor = 'black';
	
	ctx.canvas.setAttribute('width', extents[0]);
	ctx.canvas.setAttribute('height', extents[1]);

	var time = function (fn) {
		var start = Date.now();

		fn();

		var end = Date.now();

		console.log(end - start);
	};

	var clear = function () {
		ctx.clearRect(0, 0, extents[0], extents[1]);
	};

	var draw = function(instructions, dirty) {
		dirty && clear();

		_.each(instructions, function (instruction) {
			ctx.fillStyle = instruction.c === maxIter ? bulbColor : color(instruction.c);
			ctx.fillRect(instruction.x, instruction.y, 1, 1);
		});
	};

	var setColorScale = function (start, mid, end) {
		 color = _.memoize(d3.scale.log().domain([1, maxIter]).range([start || startColor, mid || midColor, end || endColor]))
	};

	setColorScale();

	var cores = 16;

	var chunks = function () {
		var result = [];
		var n = Math.sqrt(cores);

		for (var col = 0; col < n; col++) {
			for (var row = 0; row < n; row++) {
				result.push({
					extents: extents,
					domain: domain,
					range: range,
					maxIter: maxIter,
					start: [extents[0] * col / n, extents[1] * row / n],
					end: [extents[0] * (col + 1) / n, extents[1] * (row + 1) / n]
				});
			}
		}

		return result;
	};

	var drawHistory = {};

	var renderTime;

	var main = function (e) {
		var count = cores;
		var start = Date.now();

		_.each(chunks(), function (chunk) {
			var worker = new Worker('js/mandelbrot.js');

			worker.onmessage = function (e) {
				var data = JSON.parse(e.data);

				drawHistory[zoom.toString()] = [].concat(drawHistory[zoom.toString()] || []).concat(data);

				draw(data, count === cores ? true : false);
				count -= 1;

				if (count === 0) {
					renderTime = Date.now() - start;
					renderStats();
				}
			};

			worker.postMessage(JSON.stringify(chunk));
		});

		draw();
	};

	var getSelection = function (a, b, prop) {
		return [a[prop], b[prop]].sort(d3.ascending);
	}

	var getSize = function (selection) {
		return selection[1] - selection[0];
	};

	var drawBox = function (e1, e2) {
		var xSelection = getSelection(e1, e2, 'pageX');
		var ySelection = getSelection(e1, e2, 'pageY');

		var width = getSize(xSelection) - 5;
		var height = getSize(ySelection) - 5;

		$('.box').remove();

		$('body').append('<div class="box" />')
		$('.box').css({
			top: ySelection[0],
			left: xSelection[0],
			height: height,
			width: width
		});
	};

	var removeBox = function () {
		$('.box').remove();
	};

	var toPrecision = function (n, a) {
		return a.toPrecision(n);
	};

	var renderStats = (function () {
		// Init templates and stuff
		var toPrecision3 = _.bind(toPrecision, this, 3);
		var toPrecision5 = _.bind(toPrecision, this, 5);
		var regionTmpl = _.template('(<%= domain[0] %>, <%= range[0] %>i) - (<%= domain[1] %>, <%= range[1] %>i)');

		return function () {
			$('#zoom-level').text(_.map(zoom, toPrecision3).join(' x '));
			$('#region').text(regionTmpl({ domain: _.map(domain, toPrecision5), range: _.map(range, toPrecision5) }));
			$('#elapsed').text(toPrecision3(renderTime / 1000));
		}
	})();

	var zoomOut = function (e) {
		e.preventDefault();

		zoomHistory.pop();

		var bounds = _.last(zoomHistory);

		domain = bounds[0];
		range = bounds[1];
		zoom = bounds[2];

		setScales(domain, range);

		draw(drawHistory[zoom.toString()], true)
		renderStats();
	};

	var setScales = function (d, r) {
		xScale.range(d).domain([0, extents[0]]);
		yScale.range(r).domain([0, extents[1]]);
	}

	var changeMaxIter = function () {
		maxIter = parseInt($(this).val(), 10);
		setColorScale();
		main();
	};

	var changeColors = function () {
		bulbColor = $('#bulb-color').val();
		setColorScale($('#start-color').val(), $('#mid-color').val(), $('#end-color').val());
		draw(drawHistory[zoom.toString()], true);
	};

	var changeWorkers = function () {
		cores = parseInt($(this).val(), 10);
		main();
	};

	var changeSize = function () {
		var size = Math.floor(Math.sqrt(1e6 * +$(this).val()));

		extents = [size, size];

		setScales(domain, range);

		main();
	};

	var toPng = function () {
		window.open(canvas.toDataURL('image/png'), '_blank');
	};

	var zoomHistory = [[domain, range, zoom]];

	if (!(Modernizr.webworkers && Modernizr.canvas)) return; 

	$('#c').mousedown(function (e1) {
		e1.preventDefault();

		$(this).unbind('mouseup').mouseup(function (e2) {
			var xSelection = getSelection(e1, e2, 'offsetX');
			var ySelection = getSelection(e1, e2, 'offsetY');

			zoom = [zoom[0] * extents[0] / getSize(xSelection), zoom[1] * extents[1] / getSize(ySelection)];

			domain = _.map(xSelection, xScale);
			range = _.map(ySelection, yScale);

			zoomHistory.push([domain, range, zoom]);

			main();

			setScales(domain, range);

			$(this).unbind('mousemove');
		});

		$(this).mousemove(_.bind(drawBox, this, e1));
		$(this).mouseup(renderStats);
		$(this).mouseup(removeBox);
	});

	$('#zoom-out').click(zoomOut);
	$('#maximum-iterations').change(changeMaxIter);
	$('.color').change(changeColors);
	$('#workers').change(changeWorkers);
	$('#size').change(changeSize);
	$('#export').click(toPng);

	main();

})();