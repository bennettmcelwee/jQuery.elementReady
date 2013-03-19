/* jQuery elementReady plugin
 * Version 0.6+
 * Copyright (C) 2007-13 Bennett McElwee.
 * Licensed under a Creative Commons Attribution-Share Alike 3.0 Unported License (http://creativecommons.org/licenses/by-sa/3.0/)
 * Permissions beyond the scope of this license may be available at http://www.thunderguy.com/semicolon/.
 */

/*
	IMPLEMENTATION NOTES
	There may be race conditions. The most likely could occur if check() is
	called while a previous invocation of check() is still running. This could
	cause a callback to be called more than once, or not at all. Less likely is
	for elementReady() to be called concurrently with check() (with similar
	effects) or with itself (which could cause an interval to run forever).
	None of these are likely to occur. In fact I don't think they are possible
	at all except on IE. -- Bennett McElwee, August 2007
*/
(function($) {

/**
 * While a page is loading, call a given callback function as soon as any elements
 * matching a specific selector are loaded into the DOM, even before the full DOM
 * has been loaded. Executes the function within the context of each element. This
 * means that when the passed-in function is executed, the 'this' keyword points
 * to the specific DOM element.
 *
 * The function returns 'this', so you can chain multiple calls to
 * elementReady(). (This is probably not particularly useful though.)
 *
 * One argument is passed to the callback: a reference to the jQuery object.
 * You can name this argument $ and therefore use the $ alias even in
 * noConflict mode.
 *
 * If no matching element has been found by the time the DOM is fully loaded, then
 * the function will not be called.
 *
 * The function works by polling the DOM at short intervals. By default it polls
 * every 23 milliseconds, but you can change this by setting
 * $.elementReady.defaultIntervalMs before calling $.elementReady().
 * Alternatively you can pass something like {intervalMs: 100} as the third argument
 * the first time you call $.elementReady().
 * Don't bother changing this unless you really know what you're doing.
 *
 * @example
 * $.elementReady('#powerpic', function() {
 *     this.src = 'powered-by-jquery.png';
 * });
 * @desc Change the source of the image with id="powerpic" as soon as it is loaded into the
 * DOM (before the whole DOM is loaded).
 *
 * @example
 * $.elementReady('header', function() {
 *     $(this).addClass('fancy');
 * });
 * @desc Add the class "fancy" to the HTML5 header element as soon as it is loaded.
 * Use $(this) to access the element as a jQuery object.
 *
 * @example
 * $.elementReady('#first',  function() { $(this).fancify(); })
 *  .elementReady('#second', function() { $(this).fancify(); });
 * @desc Chain multiple calls to $.elementReady().
 *
 * @example
 * jQuery.noConflict();
 * jQuery.elementReady('header', function($) {
 *     $(this).addClass('fancy');
 * });
 * @desc Use the '$' alias within your callback, even in noConflict mode.
 *
 * @example
 * $.elementReady.defaultIntervalMs = 100;
 * jQuery.elementReady('header', function($) {
 *     $(this).addClass('fancy');
 * });
 * @desc Poll every 100ms instead of the default.
 *
 * @example
 * jQuery.elementReady('header', function($) {
 *     $(this).addClass('fancy');
 * }, {intervalMs: 100});
 * @desc Another way to poll every 100ms instead of the default.
 *
 * @name   $.elementReady
 * @type   jQuery
 * @param  String   selector  string selector of the element to wait for
 * @param  Function fn  function to call when the element is ready
 * @param  object   options  options for the call
 * @return jQuery
 * @cat    Plugins/Event
 * @author Bennett McElwee
 */
var interval = null;
var checklist = [];

$.elementReady = function(selector, fn, options) {
	var options = $.extend({'intervalMs': $.elementReady.defaultIntervalMs}, options);
	checklist.push({selector: selector, fn: fn});
	if (!interval) {
		interval = setInterval(function() {
			var isLastCheck = $.isReady; // check doc ready first; thus ensure that check is made at least once _after_ doc is ready
			for (var i = checklist.length - 1; 0 <= i; --i) {
				var elements = $(checklist[i].selector);
				if (elements.length) {
					// Remove this from the checklist
					var fn = checklist[i].fn;
					checklist[i] = checklist[checklist.length - 1];
					checklist.pop();
					if (0 == checklist.length) {
						isLastCheck = true;
					}
					// Call the function
					elements.each(function() {
						fn.apply(this, [$]);
					});
				}
			}
			if (isLastCheck) {
				clearInterval(interval);
				interval = null;
			}
		}, options.intervalMs);
	}
	return this;
};

// Plugin settings
$.elementReady.defaultIntervalMs = 23; // polling interval in ms

})(jQuery);
