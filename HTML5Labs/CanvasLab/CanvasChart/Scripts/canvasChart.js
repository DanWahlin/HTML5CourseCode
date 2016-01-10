var canvasChart = function () {
    var ctx;
    var margin = { top: 40, left: 75, right: 0, bottom: 75 };
    var chartHeight, chartWidth, yMax, xMax, data;
    var maxYValue = 0;
    var ratio = 0;
    var renderType = { lines: 'lines', points: 'points' };

    var render = function(canvasId, dataObj) {
        data = dataObj;
        getMaxDataYValue();
        var canvas = document.getElementById(canvasId);
        chartHeight = canvas.getAttribute('height');
        chartWidth = canvas.getAttribute('width');
        xMax = chartWidth - (margin.left + margin.right);
        yMax = chartHeight - (margin.top + margin.bottom);
        ratio = yMax / maxYValue;
        ctx = canvas.getContext("2d");
        renderChart();
    };

    var renderChart = function () {
        renderBackground();
        renderText();
        renderLinesAndLabels();

        //render data based upon type of renderType(s) that client supplies
        if (data.renderTypes == undefined || data.renderTypes == null) data.renderTypes = [renderType.lines];
        for (var i = 0; i < data.renderTypes.length; i++) {
            renderData(data.renderTypes[i]);
        }
    };

    var getMaxDataYValue = function () {
        for (var i = 0; i < data.dataPoints.length; i++) {
            if (data.dataPoints[i].y > maxYValue) maxYValue = data.dataPoints[i].y;
        }
    };

    var renderBackground = function() {

        
    };

    var renderText = function() {
        var labelFont = (data.labelFont != null) ? data.labelFont : '20pt Arial';
        ctx.font = labelFont;
        ctx.textAlign = "center";

        //Title


        //X-axis text


        //Y-axis text
        

    };

    var renderLinesAndLabels = function () {
        //Vertical guide lines
        var yInc = yMax / data.dataPoints.length;
        var yPos = 0;
        var yLabelInc = (maxYValue * ratio) / data.dataPoints.length;
        var xInc = getXInc();
        var xPos = margin.left;
        for (var i = 0; i < data.dataPoints.length; i++) {
            yPos += (i == 0) ? margin.top : yInc;
            //Draw horizontal lines
            drawLine(margin.left, yPos, xMax, yPos, '#E8E8E8');

            //y axis labels
            ctx.font = (data.dataPointFont != null) ? data.dataPointFont : '10pt Calibri';
            var txt = Math.round(maxYValue - ((i == 0) ? 0 : yPos / ratio));
            var txtSize = ctx.measureText(txt);
            ctx.fillText(txt, margin.left - ((txtSize.width >= 14) ? txtSize.width : 10) - 7, yPos + 4);

            //x axis labels
            txt = data.dataPoints[i].x;
            txtSize = ctx.measureText(txt);
            ctx.fillText(txt, xPos, yMax + (margin.bottom / 3));
            xPos += xInc;
        }

        //Vertical line
        drawLine(margin.left, margin.top, margin.left, yMax, 'black');

        //Horizontal Line
        drawLine(margin.left, yMax, xMax, yMax, 'black');
    };

    var renderData = function(type) {
        var xInc = getXInc();
        var prevX = 0, 
            prevY = 0;

        for (var i = 0; i < data.dataPoints.length; i++) {
            var pt = data.dataPoints[i];
            var ptY = (maxYValue - pt.y) * ratio;
            if (ptY < margin.top) ptY = margin.top;
            var ptX = (i * xInc) + margin.left;

            if (i > 0 && type == renderType.lines) {
                //Draw connecting lines
                drawLine(ptX, ptY, prevX, prevY, 'black', 2);
            }

            if (type == renderType.points) {
                //Add Circles Here

                
                
            }

            prevX = ptX;
            prevY = ptY;
        }
    };

    var getXInc = function() {
        return Math.round(xMax / data.dataPoints.length) - 1;
    };

    var drawLine = function(startX, startY, endX, endY, strokeStyle, lineWidth) {
        if (strokeStyle != null) ctx.strokeStyle = strokeStyle;
        if (lineWidth != null) ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.closePath();
    };

    return {
        renderType: renderType,
        render: render
    };
} ();
