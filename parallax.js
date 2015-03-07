/*!
 * parallax.js v1.1 (https://github.com/OlexandrI/JParalax)
 * @copyright 2015 OlexandrI, SRGMarketing
 * @license MIT (https://github.com/OlexandrI/JParalax/blob/master/LICENSE)
 */

;(function($, window, document){
 var JParallax;

 // Constructor
 JParallax = function(element, options){
	 if(typeof options == 'object')
		 JParallax.SetUp.call(this, options);
	
	 if((this.disOnMobile || this.hideOnMobile) && navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)){
		 if(this.hideOnMobile) $(element).css("background", "transparent");
		 return this;
		}
	
	 this.Q = $(element);
	 this.path = JParallax.GetDOMPatch(element);
	 this.parallax = [];
	 JParallax.elements.push(this);
	 JParallax.Init();
	 JParallax.TickId(JParallax.elements.length-1);
	};
// For each instance
 $.extend(JParallax.prototype, {
	 speed:			0.5,		// Just multipler
	 disOnMobile:	true,		// Disable on mobile
	 hideOnMobile:	false,		// Hide this background on mobile
	 axisX:			false,		// Allow parallax on X-axis
	 axisY:			true,		// Allow parallax on Y-axis
	 startPosX:		0,			// Init parallax position on X-axis (need to set manual!)
	 rawPosX:		"",			// Raw position on X-axis 
	 startPosY:		0,			// Init parallax position on Y-axis (need to set manual!)
	 rawPosY:		"",			// Raw position on Y-axis 
	 units:			"px",		// Position units
	 debug:			false,
	 
	// Native function per change
	// function(currentX, currentY, deltaX, deltaY)
	 Tick: function(X, Y, chX, chY){
		 this.parallax[0] = this.startPosX + X * this.speed;
		 this.parallax[1] = this.startPosY + Y * this.speed;
		 var res = "";
		 if(this.axisX) res+= this.parallax[0] + this.units + " ";
			else{
			 if(this.rawPosX!="")
				 res+= this.rawPosX + " ";
				else
				 res+= this.startPosX + this.units + " ";
			}
		 if(this.axisY) res+= this.parallax[1] + this.units;
			else{
			 if(this.rawPosY!="")
				 res+= this.rawPosY + " ";
				else
				 res+= this.startPosY + this.units;
			}
		 this.Q.css("backgroundPosition", res);
		},
	// Native function after change
	// function(currentX, currentY, deltaX, deltaY)
	 afterTick: function(X, Y, chX, chY){
		 if(this.debug && console) console.log("JParallax:: " + this.path + " calc to X:" + this.parallax[0] + " Y:" +this.parallax[1]);
		}
	});
// Basic functions
 $.extend(JParallax, {
	 elements:		[],
	 curScroll:		[],
	 chScroll:		[],
	 bWorking:		false,
	 bInited:		false,
	 bNeedUpdate:	false,
	 
	 GetScrollX: function(){
		 if(window.pageXOffset !== undefined){ // All browsers, except IE9 and earlier
			 return window.pageXOffset;
			}else{ // IE9 and earlier
			 return document.documentElement.scrollLeft;
			}
		},
	 GetScrollY: function(){
		 if(window.pageXOffset !== undefined){ // All browsers, except IE9 and earlier
			 return window.pageYOffset;
			}else{ // IE9 and earlier
			 return document.documentElement.scrollLeft;
			}
		},
	 GetDOMPatch: function(element){
		 var path = '';
		 for (; element && element.nodeType == 1; element = element.parentNode){
			 var inner = $(element).children().length == 0 ? $(element).text() : '';
			 var eleSelector = element.tagName.toLowerCase() + 
				((inner.length > 0) ? ':contains(\'' + inner + '\')' : '');
			 path = ' ' + eleSelector + path;
			}
		 return path;
		},
	
	 Init: function(){
		 if(!this.bInited){
			 var copyScroll = [0,0];
			 $(window).on('load.jole.JParallax', function(){
				 JParallax.curScroll[0] = JParallax.GetScrollX();
				 JParallax.curScroll[1] = JParallax.GetScrollY();
				 copyScroll[0] = JParallax.curScroll[0];
				 copyScroll[1] = JParallax.curScroll[1];
				 JParallax.bNeedUpdate = true;
				 JParallax.UpdateFX();
				}).on('scroll.jole.JParallax', function(){
				 copyScroll[0] = JParallax.curScroll[0];
				 copyScroll[1] = JParallax.curScroll[1];
				 JParallax.curScroll[0] = JParallax.GetScrollX();
				 JParallax.curScroll[1] = JParallax.GetScrollY();
				 JParallax.chScroll[0] = copyScroll[0] - JParallax.curScroll[0];
				 JParallax.chScroll[1] = copyScroll[1] - JParallax.curScroll[1];
				 JParallax.bNeedUpdate = true;
				 JParallax.UpdateFX();
				});
			 this.bInited = true;
			}
		},
	
	 SetUp: function(options){
		 if(typeof options == 'object'){
			 var el = this;
			 $.each(options, function(key, candidate){
				 switch(key){
					// Numbers
					 case 'speed': case 'startPosX': case 'startPosY':
						 if(typeof candidate=="function") candidate = candidate(el);
						 candidate = parseFloat(candidate);
						 if(isNaN(candidate)) return;
						break;
					// Booleans
					 case 'disOnMobile': case 'hideOnMobile': case 'axisX': case 'axisY': case 'debug':
						 if(typeof candidate=="function") candidate = candidate(el);
						 candidate = Boolean(candidate);
						break;
					// User string
					 case 'rawPosX': case 'rawPosY':
						 if(typeof candidate=="function") candidate = candidate(el);
						 candidate = candidate.toString();
						break;
					// User functions
					 case 'Tick': case 'afterTick':
						 if(typeof candidate!="function") return;
						break;
					// List
					 case 'units':
						 if(typeof candidate=="function") candidate = candidate(el);
						 candidate = String(candidate).toLowerCase();
						 switch(candidate){
							 case "em": case "ex": case "%": case "px": case "cm": case "mm": case "in": case "pt": case "pc":
								break;
							 default:
								return;
							}
						break;
					// Trash - cleanup
					 default:
						 return;
					}
				 el[key] = candidate;
				});
			}
		},
	
	 Tick: function(){
		 for(var i=0, a=JParallax.elements.length; i<a; ++i){
			 JParallax.TickId(i);
			}
		},
	 TickId: function(id){
		// ~ unsafe function
		 JParallax.elements[id].Tick.call(JParallax.elements[id], JParallax.curScroll[0], JParallax.curScroll[1], JParallax.chScroll[0], JParallax.chScroll[1]);
		 JParallax.elements[id].afterTick.call(JParallax.elements[id], JParallax.curScroll[0], JParallax.curScroll[1], JParallax.chScroll[0], JParallax.chScroll[1]);
		},
	
	 UpdateFX: function(){
		 if(!JParallax.bWorking && JParallax.bNeedUpdate){
			 JParallax.bWorking = true;
			 JParallax.Tick();
			 JParallax.bWorking = false;
			}
		}
    });


// JParallax Plugin Definition
 function Plugin(option){
     return this.each(function(){
		 var el = $(this);
		 var options = typeof option == 'object' && option;

		 if(this == window || this == document || el.is('body')){
			 JParallax.SetUp.call(JParallax.prototype, options);
			}else if(!el.data('jole.JParallax')){
			 options = $.extend({}, el.data(), options);
			 el.data('jole.JParallax', new JParallax(this, options));
			}
		 if(typeof option == 'string' && JParallax.hasOwnKey(option) && typeof JParallax[option]=="function"){
			 JParallax[option]();
			}
		});
	};

 var old = $.fn.JParallax;
 $.fn.JParallax             = Plugin;
 $.fn.JParallax.Constructor = JParallax;
// JParallax No Conflict
 $.fn.JParallax.noConflict = function(){
	 $.fn.JParallax = old;
	 return this;
	};

// JParallax Data-API
 $(document).on('ready.jole.JParallax.auto', function(){
	 $('[data-parallax="scroll"]').JParallax();
	});

}(jQuery, window, document));
