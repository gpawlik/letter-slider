// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "defaultPluginName",
			defaults = {
				propertyName: "value"
			};

		// The actual plugin constructor
		function LetterSlider ( element, options ) {
			this.element = element;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( LetterSlider.prototype, {
			init: function() {

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				this.showKeyboard();                
                this.eventHandlers();              
			},
            
			showKeyboard: function() {                
				var alphabet = this.createAlphabet();
				$(this.element).html(alphabet);
			},
            
            createAlphabet: function () {
                var letters,
                    template;
                    
                //Create an array with the letters
                letters = _.map(_.range(
                    'a'.charCodeAt(0),
                    'z'.charCodeAt(0) + 1
                ), 
                function(value) { 
                    return String.fromCharCode(value); 
                });                                
                    
                template = '<ul>';      
                for(var i = 0; i < letters.length; i++) {
                    template += '<li data-id="' + i + '">' + letters[i] + '</li>';
                }      
                template += '</ul>';                                

                return template; 
            },
            
            rotate: function (direction) {
                var allItemsLength = $(this.element).find('li').length,
                    currentItem = $(this.element).find('li.active').data('id') || 0,
                    nextItem;                                        
                    
                if (direction === 'right') {
                    nextItem = ((currentItem + 1) > allItemsLength) ? 0 : currentItem + 1;                    
                } 
                else if (direction === 'left') {
                    nextItem = ((currentItem - 1) < 0) ? allItemsLength - 1 : currentItem - 1;                    
                }
                $(this.element).find('li').removeClass('active');
                $(this.element).find('li[data-id="' + nextItem + '"]').addClass('active');                                
                
            },
            
            writeText: function () {
                var $input = $('input[name="test"]'),
                    currentValue = $input.val(),
                    currentChar = $(this.element).find('li.active').text().toLowerCase();                                        
                    
                $input.val(currentValue + currentChar);               
            }, 
            
            removeText: function () {
                var $input = $('input[name="test"]'),
                    currentValue = $input.val();
                     
                $input.val(currentValue.slice(0, -1));
            },           
            
            eventHandlers: function () {
                $('body').on('keydown', _.bind(this.getKeyEvent, this));
                $(window).on('gamepadconnected', _.bind(this.gamepadConnected, this));
                $(window).on('gamepaddisconnected', _.bind(this.gamepadDisconnected, this));
            },
            
            gamepadConnected: function (e) {   
                // https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API 
                // http://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345                                
                console.log("Gamepad connected.");
                var repGP = window.setInterval(_.bind(this.checkGamepad, this),200);                
            },
            
            gamepadDisonnected: function (e) {                
                console.log("Gamepad disconnected!");
            },
            
            checkGamepad() {
                var gp = navigator.getGamepads()[0];
                
                if(gp.buttons[0].pressed) {                    
                }
                if(gp.buttons[1].pressed) {                    
                    this.rotate('right');
                }
                if(gp.buttons[2].pressed) {                    
                    this.rotate('left');
                }
                if(gp.buttons[3].pressed) {                    
                }                
                if(gp.buttons[4].pressed) {                    
                    this.removeText();
                }
                if(gp.buttons[5].pressed) {                    
                    this.writeText();
                }
            },
            
            getKeyEvent: function (e) {                
                var direction;                
                switch (e.keyCode) {
                    case 39:                        
                        this.rotate('right');
                        break;
                    case 37:                        
                        this.rotate('left');
                        break;
                    case 38:
                        direction = 'up';
                        break;
                    case 40:
                        direction = 'down';
                        break;
                    case 13:
                        this.writeText();
                }
                
            }
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new LetterSlider( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
