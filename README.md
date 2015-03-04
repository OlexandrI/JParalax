# Installation

Download and include parallax.js in your document after including jQuery.

`<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>`

`<script src="/path/to/parallax.js"></script>`

# Useage
## Via data attributes

To easily add a parallax effect behind an element, add data-parallax="scroll" to the element you want to use, and specify an background in style.

`<div data-parallax="scroll" style="background: url(path/to/yourimage.jpg) repeat scroll 0% 0% transparent;"></div>`

## Via JavaScript

To call the parallax plugin manually, simply select your target element with jQuery and do the following:

`$('.parallax-window').JParallax();`

# Options

Options can be passed in via data attributes of JavaScript. For data attributes, append the option name to data-, as in data-image-src="".

> Note that when specifying these options as html data-attributes, you should convert “camelCased” variable names into “dash-separated” lower-case names (e.g. disOnMobile would be data-dis-on-mobile="true").

All options with default value:

	 speed:			0.5,		// Just multipler
	 disOnMobile:	true,		// Disable on mobile
	 axisX:			false,		// Allow parallax on X-axis
	 axisY:			true,		// Allow parallax on Y-axis
	 startPosX:		0,			// Init parallax position on X-axis (need to set manual!)
	 startPosY:		0,			// Init parallax position on Y-axis (need to set manual!)
	 units:			"px",		// Position units
	 debug:			false		// Log to console

