/* Wayfarer Tooltip
 * Version 0.9.2
 * Author Abel Mohler
 * URI: http://www.wayfarerweb.com/wtooltip.php
 * Released under MIT License: http://www.wayfarerweb.com/mit.php
 */
(function($) {												//jQuery.noConflict() compliant
$.fn.wTooltip = function(o, callback) {
	o = $.extend({											//defaults, can be overidden
		content: null,										//string content for tooltip
		ajax: null,											//url content for tooltip
		appendTip: "body",									//should probably not need to be overrided
		degrade: false,										//if true, in IE6 tooltip will degrade to a title attribute message
		offsetY: 10,										//offsetY and offsetX properties designate position from the cursor
		offsetX: 1,
		style: {},
		className: null,									//to style the tooltip externally, pass a className or id
		id: null,
		callBefore: function(){},							//called when mouse enters the area
		callAfter: function() {},							//called when mouse leaves the area (same as "callback" option)
		delay: 0											//delay (in milliseconds) before tooltip appears or callBefore executes
	}, o || {});
	
	o.style = $.extend({									//the default style rules of the tooltip (can be overidden)
		border: "1px solid gray",
		background: "#edeef0",
		color: "#000",
		padding: "10px",
		zIndex: "1000",
		maxWidth: "350px",
		textAlign: "left"
	}, o.style || {});
	
	if (typeof callback == "function")
		o.callAfter = callback || o.callAfter;
	
	o.style.display = "none", o.style.position = "fixed";	//permanent defaults, can't be overidden, except IE6 rule below
	
	var timeout,
	tooltip = document.createElement('div'),
	html = document.getElementsByTagName("html")[0],
	ie6 = (typeof document.body.style.maxWidth == "undefined") ? true : false;
	
	if (ie6)												//permanent defaults change for IE6
		o.style.position = "absolute";
	if (o.id)
		tooltip.id = o.id;
	if (o.className)
		tooltip.className = o.className;
		
	o.degrade = (o.degrade && ie6) ? true : false;			//only degrades if also IE6
	
	for (var p in o.style)									//apply styles to tooltip
		tooltip.style[p] = o.style[p];
	
	function fillTooltip(condition) {
		if (condition) {
			if (o.degrade)									//replace html characters for proper degradation to title attribute
				$(tooltip).html(o.content.replace(/<\/?[^>]+>/gi, ''));
			else											//otherwise just fill the tooltip with content
 				$(tooltip).html(o.content);
		}
	}
	
	if (o.ajax) {											//if o.ajax is selected, this will fill and thus override o.content
		$.get(o.ajax, function(data) {
			if (data)
				o.content = data;
			fillTooltip(o.content);
		});
	}
	
	fillTooltip(o.content && !o.ajax);
	
	$(tooltip).appendTo(o.appendTip);
	
	return this.each(function() {							//returns the element chain
		this.onmouseover = function(ev) {
			if (this.title && !o.degrade) {
				o.title = this.title;
				this.title = "";
			}
			if (o.content && o.degrade)
				this.title = tooltip.innerHTML;
			
			timeout = setTimeout(function() {
				if (typeof o.callBefore == "function")
					o.callBefore();
				var e = (ev) ? ev : window.event;
				var display;
				if (o.content) {
					if (!o.degrade)
						display = "block";
				} else if (o.title && !o.degrade) {
					$(tooltip).html(o.title);
					display = "block";
				} else {
					display = "none";
				}
				var optionalY = (ie6) ? html.scrollTop : 0;
				var optionalX = (ie6) ? html.scrollLeft : 0;
				var current = {
					display: display,
					top: e.clientY + optionalY + o.offsetY + 'px',
					left: e.clientX + optionalX + o.offsetX + 'px'
				}
				for (var p in current)
					tooltip.style[p] = current[p];
			}, o.delay);
		}
		
		this.onmouseout = function(ev) {
			clearTimeout(timeout);
			if (typeof o.callAfter == "function")
				o.callAfter();
			var e = (ev) ? ev : window.event;
			if (o.title) {
				this.title = o.title;
				o.title = null;
			}
			var optionalY = (ie6) ? html.scrollTop : 0;
			var optionalX = (ie6) ? html.scrollLeft : 0;
			var current = {
				display: "none",
				top: e.clientY + optionalY + o.offsetY + 'px',
				left: e.clientX + optionalX + o.offsetX + 'px'
			}
			for (var p in current)
				tooltip.style[p] = current[p];
		}
		
		this.onmousemove = function(ev) {
			var e = (ev) ? ev : window.event;
			var optionalY = (ie6) ? html.scrollTop : 0;
			var optionalX = (ie6) ? html.scrollLeft : 0;
			var current = {
				top: e.clientY + optionalY + o.offsetY + 'px',
				left: e.clientX + optionalX + o.offsetX + 'px'
			}
			for (var p in current)
				tooltip.style[p] = current[p];
		}
	});
}
})(jQuery);