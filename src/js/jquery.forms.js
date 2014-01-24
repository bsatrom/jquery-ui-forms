(function($) {
	var typeUpgrades = $.forms.types,
    features = $.forms.features,
    vanillaInputRegEx = /text|button|submit|reset/i;

  $.widget('ui.Form', {

    // default options
    options: {
      alwaysUseWidgets: false,
      mobile: false,
      styleInputs: true
    },

    _create: function() {},

    _refresh: function() {},

    _destroy: function() {},

    _setOptions: function() {
      this._superApply( arguments );
      this._refresh();
    },

    _setOption: function(key, value) {
      this._super(key, value);
    }

  });


	/*var Form = Widget.extend({
		init: function(element, options) {
			var that = this;
			Widget.fn.init.call(this, element, options);

      that.processInputElements(element);
      that.processProgressElements(element);
		},
    processInputElements: function(form) {
      var that = this;
      var inputs = $(form).find('input, button');

      inputs.each(function(index, el) {
        that.upgradeInputType(that, el);

        if (el.getAttribute('placeholder') &&
          !kendo.forms.features.placeholder) {
          that.upgradePlaceholder(el);
        }
      });
    },
    processProgressElements: function(form) {
      var that = this;
      var progress = $(form).find('progress');

      progress.each(function(index, el) {
        if(that.options.alwaysUseWidgets || !kendo.forms.features.progress) {
          typeUpgrades.progress(el);
        }
      });
    },
    shouldUpgradeType: function(type) {
      var that = this;
      var inputSupported = features[type];

      // don't upgrade mobile inputs if they are supported
      // and the user has requested they always be used
      if (that.options.mobile && kendo.support.mobileOS && inputSupported) {
        return false;
      }
      
      return (that.options.alwaysUseWidgets ||
             !inputSupported) &&
             type in typeUpgrades && !vanillaInputRegEx.test(type);
             
    },
    upgradeInputType: function(that, el) {
      var type = el.getAttribute('type');

      if (!type && el.nodeName === 'BUTTON') {
        type = 'button';
      }

      if(vanillaInputRegEx.test(type) && that.options.styleInputs) {
        typeUpgrades[type](el);
      }

      if (that.shouldUpgradeType(type)) {
        typeUpgrades[type](el);
      }

    },
    upgradePlaceholder: function(el) {
      el = $(el);
      // Strip CR and LF from attribute vales, as specified in
      // www.w3.org/TR/html5/forms.html#the-placeholder-attribute
      var placeholderText = el.attr('placeholder')
        .replace(/(\\r\\n|\\n|\\r)/gm,'');

      // When the field loses focus, clear out the placeholder if
      // the input contains a value.
      el.on('blur', function() {
        var $el = $(this);
        var labelNode = this.previousSibling;
        if (this.value) {
          labelNode.nodeValue = '';
          $el.addClass('relPlaceholder');
        } else if (labelNode.nodeValue !== placeholderText) {
          labelNode.nodeValue = placeholderText;
          $el.removeClass('relPlaceholder');
        }
      });
      el.wrap('<label class="placeholder">' + placeholderText + '</label>');
      el.addClass('placeholder');
    },
	});*/
} (jQuery));