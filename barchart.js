var fps = 0, now, lastUpdate = (new Date)*1 - 1;

// The higher this value, the less the FPS will be affected by quick changes
// Setting this to 1 will show you the FPS of the last sampled frame only
var fpsFilter = 50;

var scale = 0.3;
var radius = 360;
var clockHandPadding = 10;
var clockRadius = (radius * scale);
var centerX = centerY = clockRadius + clockHandPadding;

var radiansPerDeg = Math.PI / 180;

$('document').ready( function() {
	//drawFrame();	
});

var cnt = 0;

function drawFrame(values, ctx){
	var now = new Date;
	var thisFrameFPS = 1000 / (now - lastUpdate);
	fps += (thisFrameFPS - fps) / fpsFilter;
	lastUpdate = now;
	$('#fps').html(Math.round(fps));

	cnt++;
	if (cnt > 1)
	{
		cnt++;
	}
	clearFrame(ctx);
	
	drawBarChart(values, ctx);
}

function clearFrame(ctx) {
	ctx.fillStyle = '#ffffff';
	ctx.clearRect(0,0,1000,1000);
}

function drawBarChart(values, ctx)
{
	var barWidth = 100;
	var barScale = 10;
	var xPos = 0;
	var margin = 10;

	for(v in values)
	{
		ctx.beginPath();
		ctx.fillStyle = '#8ED6FF';
		ctx.rect(xPos, 20, barWidth, barScale * values[v].val());
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = '#ff0000';
		ctx.font = '18px arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = "#000000"; // text color
		ctx.textBaseline = 'bottom';
		ctx.fillText(values[v].name(), xPos + (barWidth /2), 20);
		ctx.closePath();
		
		xPos += barWidth + margin;
	}
}

function drawFace(ctx){
	// face
	ctx.lineWidth = 1;
	ctx.strokeStyle="#000000";
	ctx.beginPath();
	ctx.arc(centerX, centerY, clockRadius,0,Math.PI*2,true);
	ctx.closePath();
	ctx.stroke();
	
	drawNumbers(ctx);
}

function drawNumbers(ctx)
{
	ctx.font = '18px arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	
	var range = 12;
	var timeTextScale = 0.25;
	var range = 12;
	
	for(var i=1; i<13; i++)
	{	
		var handDeg = i * (radius / range);
		var x = Math.round(radius * Math.sin(handDeg * radiansPerDeg) );
		var y = Math.round(radius * Math.cos(handDeg * radiansPerDeg) );

		// calc new timepoint
		timePoint = [x * timeTextScale + centerX, centerY - y * timeTextScale];
		ctx.fillText(i, timePoint[0], timePoint[1]);
	}
}

function drawHand(ctx, handType, dte){
	var handVal;
	var timePoint;
	var handColor = "#000000";
	var range;

	switch(handType) {
		case 's':
			handVal = dte.getSeconds();
			handColor = "#ff5500";
			handScale = 0.27;
			range = 60;
			handThick = 1;
			break;
		case 'm':
			handVal = dte.getMinutes();
			handColor = "#00bb00";
			handScale = 0.25;
			range = 60;
			handThick = 2;
			break;
		case 'h':
			handVal = dte.getHours();
			handColor = "#0000bb";
			handScale = 0.20;
			handThick = 3;
			range = 12;
			break;
	}
	
	var handDeg = handVal * (radius / range);
	var x = Math.round(radius * Math.sin(handDeg * radiansPerDeg) );
	var y = Math.round(radius * Math.cos(handDeg * radiansPerDeg) );

	// calx new timepoint
	timePoint = [x * handScale + centerX, centerY - y * handScale];

	ctx.beginPath();
	ctx.lineWidth = handThick;
	ctx.strokeStyle = handColor;
	ctx.moveTo(centerX, centerY);
	ctx.lineTo(timePoint[0], timePoint[1]);
	ctx.stroke();
	ctx.closePath();
}