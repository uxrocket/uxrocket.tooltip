/**
 * UX Rocket
 * jQuery based tooltip and popover
 * @author Bilal Cinarli
 * @author Rames Aliyev
 */

;
(function($) {
    var ux, // local shorthand

        defaults = {
            placement: 'top', // where the tooltip appear relative to element
            position : 'center', // center|start|end centers the container or place it on the corner
            template : '' +
                       '<div {id} class="tooltip-pop {class}">' +
                       '    <div class="tooltip-content">{content}</div>' +
                       '    <div class="tooltip-arrow"></div>' +
                       '</div>',
            cssClass   : '',
            id         : '',
            showAnimate: false,
            type       : 'tooltip', // tooltip | popover,

            onReady  : false,
            onOpen   : false,
            onUpdate : false,
            onClose  : false,
            onRemove : false,
            onDestroy: false
        },
        lastActiveTooltip = null,
        events = {
            click     : 'click.uxTooltip',
            mouseenter: 'mouseenter.uxTooltip',
            mouseleave: 'mouseleave.uxTooltip'
        };

    // constructor method
    var Tooltip = function(el, options) {

        var $el = $(el),
            opts = $.extend({}, defaults, options, $el.data()),
            dims = {},
            title = $(el).attr('title');

        //cached variables
        var instance_opts = {
            el     : $el,
            title  : title,
            timeout: null,
            tmp    : null,
            view   : false,
            dims   : dims,
            ttip   : null,
            opts   : opts
        };

        if(typeof opts.content === 'undefined' || opts.content === null) {
            if(typeof title !== 'undefined' && title !== '') {
                opts.content = title;
            }
            else {
                return;
            }
        }

        $el.data('uxTooltip', instance_opts);
        instance_opts.el.data("tooltip", true);

        $(window).load(function() {
            getPosition($el, dims);
        });

        callback(opts.onReady);

        bindUIActions($el);
    };

    var bindUIActions = function($el) {
        var _instance = $el.data('uxTooltip'),
            opts = _instance.opts,
            $ttip = _instance.$ttip,
            showEvent = (opts.type === "popover" ? events.click : events.mouseenter + ' ' + events.mouseleave);

        $el.on(showEvent, function(e) {
            var active = $el.data("tooltip-active");

            if(!active || !_instance.view) {
                showTooltip(_instance);
            } else {
                hideTooltip(_instance);
            }
        });


        $(document).on('click', function(e) {
            var $target = $(e.target);

            if($target.is('.tooltip-pop, .tooltip-pop *')) {
                return;
            }

            $ttip = _instance.$ttip = $(".tooltip-pop");

            var hasTooltip = $target.data("tooltip");

            if(hasTooltip) {
                lastActiveTooltip.el.data("tooltip-active", false);
            } else if(typeof $ttip !== 'undefined' && $ttip.length > 0) {
                if($ttip.hasClass("tooltip-popover")) {
                    return;
                }

                hideTooltip(_instance);
            }
        });
    };

    var showTooltip = function(options) {
        var opts = options.opts,
            $el = options.el,
            $ttip = options.ttip,
            dims = options.dims;

        lastActiveTooltip = options;
        options.view = true;
        options.el.data("tooltip-active", true);
        options.timeout = setTimeout(function() {
            options.tmp = createTooltip(options);
            options.ttip = $ttip = $(".tooltip-pop");

            getPosition($el, dims);

            positionTooltip($ttip, dims, opts);

            callback(opts.onOpen);

            options.view = true;
        }, 200);
    };

    var hideTooltip = function(options) {
        var opts = options.opts,
            view = options.view,
            $ttip = options.ttip;

        if(view === true && $ttip) {
            $ttip.remove();
            callback(opts.onRemove);
        }

        clearTimeout(options.timeout);
        options.tmp = null;
        options.view = false;
        options.el.data("tooltip-active", false);
    };

    var closeButton = function(options) {
        var opts = options.opts,
            $ttip = options.ttip;

        if(opts.type === 'tooltip') {
            return;
        }

        $ttip.append('<a class="tooltip-close">X</a>');

        $ttip.on('click', '.tooltip-close', function() {
            $ttip.remove();
            callback(opts.onClose);
            callback(opts.onRemove);
            options.view = false;
        });
    };

    var createTooltip = function(options) {
        var opts = options.opts,
            tooltip = '',
            content = '',
            template = opts.template,
            temp_content = opts.content,
            obj_pattern = /^(\.|#)(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/,
            url_pattern = /^(http|https|\/|\.\/|\.\.\/)/,
            function_pattern = /^([^\d\s]([a-zA-Z0-9_]+))\((.*)?\)/g,
            search_for = ['{id}', '{class}', '{content}'],
            replace = $.extend({id: opts.id, cssClass: opts.cssClass, content: opts.content}, $(opts.el).data()),
            replace_with,
            popoverClass = '';

        // After create callback.
        var afterCreate = function() {
            closeButton(options);
        };

        // css id
        if(typeof opts.id !== 'undefined' && opts.id !== null) {
            replace.id = opts.id;
        }

        // css class
        if(typeof opts.cssClass !== 'undefined' && opts.cssClass !== null) {
            replace.cssClass = opts.cssClass;
        }

        // check if content is an element in a page
        if(obj_pattern.test(temp_content)) {
            if($(temp_content).length === 1) {
                replace.content = $(temp_content).html();
            }
        }

        else if(url_pattern.test(temp_content)) {
            replace.cssClass += ' preloading tooltip-ajax-content';
            replace.content = "";

            afterCreate = function(response) {
            };

            $.ajax({
                url    : temp_content,
                async  : true,
                success: function(response) {
                    afterPreloading(response, options);
                }
            });
        }

        else if(function_pattern.test(temp_content)) {
            replace.cssClass += ' preloading';
            replace.content = "";

            var fn = temp_content.replace(function_pattern, "$1|$3").split("|");

            afterCreate = function() {
                content = temp_content;

                if(typeof(window[fn[0]]) != 'undefined') {
                    content = window[fn[0]](fn[1]);
                }

                afterPreloading(content, options);
            };
        }

        if(opts.type === 'popover') {
            popoverClass = ' tooltip-popover';
        }

        replace.cssClass += ' position-' + opts.position + ' placement-' + opts.placement + popoverClass;

        replace_with = [replace.id, replace.cssClass, replace.content];
        tooltip = template.replaceArray(search_for, replace_with);

        $(".tooltip-pop").remove();
        $('body').append(tooltip);

        // Asyc call.
        setTimeout(function() {
            if(typeof afterCreate === "function") {
                afterCreate();
            }
        }, 0);

        return tooltip;
    };

    var afterPreloading = function(content, options) {
        var el = options.el,
            dims = options.dims,
            opts = options.opts;

        var tooltip = options.ttip = $(".tooltip-pop");
        tooltip.removeClass("preloading");
        tooltip.find(".tooltip-content").html(content);

        closeButton(options);
        getPosition(el, dims);
        positionTooltip(tooltip, dims, opts);
    };

    var getPosition = function($el, dims) {
        dims.offset = $el.offset();
        dims.width = $el.outerWidth();
        dims.height = $el.outerHeight();
    };

    var positionTooltip = function($tooltip, dims, options) {

        // Correct width.
        $tooltip.offset({top: -9999, left: -9999});

        var $w = $tooltip.outerWidth(),
            $h = $tooltip.outerHeight(),
            top = dims.offset.top - ($h - dims.height) / 2, // default center
            left = dims.offset.left - ($w - dims.width) / 2, // default center
            arrow = $tooltip.find('.tooltip-arrow').height();

        // get the top position
        switch(options.placement) {
            case 'top':
                // Get proper margin bottom value.
                var marginBottom = $tooltip.css('marginBottom');
                marginBottom = marginBottom === "auto" ? 0 : marginBottom.replace("px", "");

                top = dims.offset.top - $h - marginBottom;
                if(options.position === 'end') {
                    left = dims.offset.left + dims.width - $w;
                }
                else if(options.position === 'start') {
                    left = dims.offset.left;
                }
                break;
            case 'bottom':
                top = dims.offset.top + dims.height + (arrow * 1.5);
                if(options.position === 'end') {
                    left = dims.offset.left + dims.width - $w;
                }
                else if(options.position === 'start') {
                    left = dims.offset.left;
                }
                break;
            case 'right':
                left = dims.offset.left + dims.width;
                if(options.position === 'end') {
                    top = dims.offset.top - $h;
                }
                else if(options.position === 'start') {
                    top = dims.offset.top;
                }
                break;
            case 'left':
                left = dims.offset.left - $w - (dims.width / 2);
                if(options.position === 'end') {
                    top = dims.offset.top + dims.height;
                }
                else if(options.position === 'start') {
                    top = dims.offset.top;
                }
                break;
            case 'center':
                if(options.position === 'end') {
                    top = dims.offset.top + (dims.height / 2);
                    left = dims.offset.left - $w;
                }
                break;
        }

        // Round values.
        top = Math.round(top);
        left = Math.round(left);

        $tooltip.offset({top: top, left: left});
    };

    // global callback
    var callback = function(fn) {
        // if callback string is function call it directly
        if(typeof fn === 'function') {
            fn.apply(this);
        }

        // if callback defined via data-attribute, call it via new Function
        else {
            if(fn !== false) {
                var func = new Function('return ' + fn);
                func();
            }
        }
    };

    String.prototype.replaceArray = function(find, replace) {
        var replaceString = this;
        var regex;
        for(var i = 0; i < find.length; i++) {
            regex = new RegExp(find[i], "g");
            replaceString = replaceString.replace(regex, replace[i]);
        }
        return replaceString;
    };

    // jquery bindings
    ux = $.fn.tooltip = $.uxtooltip = function(options) {
        var selector = this.selector;

        return this.each(function() {
            var $el = $(this),
                uxrocket = $el.data('uxRocket') || {},
                tooltip;

            if($el.hasClass('uxitd-tooltip-ready')) {
                return;
            }

            $el.addClass('uxitd-tooltip-ready');

            uxrocket['uxTooltip'] = {'hasWrapper': false, 'ready': 'uxitd-tooltip-ready', 'selector': selector, 'options': options};

            $el.data('uxRocket', uxrocket);

            tooltip = new Tooltip(this, options);
        });
    };

    // update tooltip instance
    ux.update = function(el) {
        var $el;

        if(el === undefined) {
            $el = $(".uxitd-tooltip-ready");
        }
        else {
            $el = $(el);
        }

        $el.each(function() {
            var _instance = $(this).data('uxTooltip');

            // remove previous instance data
            $(this).removeData('uxTooltip');

            // add new options
            _instance.opts = $.extend({}, _instance.opts, $(this).data());

            // register new instance data
            $(this).data('uxTooltip', _instance);

            $(this).off(events.click + ' ' + events.mouseenter + ' ' + events.mouseleave);

            bindUIActions($(this));

            callback(_instance.opts.onUpdate);
        });
    };

    // remove tooltip binding instance
    ux.remove = function(el) {
        var $el;

        if(el === undefined) {
            $el = $(".uxitd-tooltip-ready");
        }
        else {
            $el = $(el);
        }

        $el.each(function() {
            var _this = $(this),
                _instance = _this.data('uxTooltip'),
                _uxrocket = _this.data('uxRocket');

            // remove plugin data
            _this.removeData('uxTooltip');
            _this.removeData('tooltip');

            // remove uxRocket registry
            delete _uxrocket['uxTooltip'];
            _this.data('uxRocket', _uxrocket);

            // remove ready class
            _this.removeClass('uxitd-tooltip-ready');

            // remove plugin events
            _this.off(events.click + ' ' + events.mouseenter + ' ' + events.mouseleave);

            callback(_instance.opts.onDestroy);
        });
    };

    // Version
    ux.version = "1.3.0";

    // settings
    ux.settings = defaults;
})(jQuery);