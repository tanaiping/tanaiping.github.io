(function($) {
    $.circulate = function(el, options) {
        var base = this,
            origWidth, origHeight, newWidth, origLeft, origTop;   
              
        base.$el = $(el);
        base.$el.data("circulate", base);
        
        base.stopAnimation = function() {
            base.options.keepGoing = false;
        }
        base.runAnimation = function() {
            if (base.options.keepGoing) {
                origWidth = 32+"px";
                origHeight = 32+"px";
                
                origLeft = base.$el.position().left;
                origTop = base.$el.position().top;
                
                if (base.$el.css("position") != "absolute") {
                    base.$el.css("position", "relative");
                }
                base.$el.css("z-index", base.options.zIndexValues[0]); 
                
                // Would be nice to only start animations if currently unanimated. Like this:
                // base.$el.filter(':not(:animated)').animate({
                // But this is screwing up loops (returns empty set on second go-around)

                base.$el.animate({
                    top: ["+=" + (base.options.height / -3) + "px", 'easeInQuad'],
                    left: ["+=" + (base.options.width / 4) + "px", 'easeOutQuad'],
                    width: [origWidth, 'linear'],
                    height: [origHeight, 'linear'],
                    opacity: 1
                }, base.options.speed, function() { base.$el.css("z-index", base.options.zIndexValues[1]); })
                .animate({
                    top: ["+=" + (base.options.height / 3) + "px", 'easeOutQuad'],
                    left: ["-=" + (base.options.width / 4) + "px", 'easeInQuad'],
                     width: [origWidth, 'linear'],
                    height: [origHeight, 'linear'],
                }, base.options.speed, function() { base.$el.css("z-index", base.options.zIndexValues[2]); })
                .animate({
                    top: ["-=" + (base.options.height / 3) + "px", 'easeInQuad'],
                    left: ["-=" + (base.options.width / 4) + "px", 'easeOutQuad'],
                    width: [origWidth, 'linear'],
                    height: [origHeight, 'linear'],
                }, base.options.speed, function() { base.$el.css("z-index", base.options.zIndexValues[3]); })
                .animate({
                    top: ["-=" + (base.options.height / -3) + "px", 'easeOutQuad'],
                    left: ["+=" + (base.options.width / 4) + "px", 'easeInQuad'],
                    width: [origWidth, 'linear'],
                    height: [origHeight, 'linear'],
                }, base.options.speed, function() {
                
                        base.$el.css("z-index", base.options.zIndexValues[0]);
                                                                
                        if (base.options.loop === true) {
                            base.runAnimation();
                        }
                    
                    });
            }

        };
        
        base.init = function() {
            base.options = $.extend({},$.circulate.defaultOptions, options);
            base.runAnimation();
        };
        base.init();
    };
    
    $.circulate.defaultOptions = {
        speed: 400,
        height: 32,
        width: 32,
        sizeAdjustment: 100,  // percentage
        loop: false,          // recurrsive?
        zIndexValues: [1, 1, 1, 1],
        keepGoing: true       // internal only
    };
    
    $.fn.circulate = function(options) {
        if (typeof(options) === "string") {
			return this.each(function() { 
			    var safeGuard = $(this).data('circulate');
			    if (safeGuard) { safeGuard.stopAnimation(); }
			});
        } else { 
            return this.each(function() {
                (new $.circulate(this, options));
            });
        } 
    };
    
})(jQuery);