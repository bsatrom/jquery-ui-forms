(function($) {
	var typeUpgrades = $.forms.types,
    features = $.forms.features,
    vanillaInputRegEx = /button|submit|reset/i;

  $.widget('ui.Form', {

    // default options
    options: {
      alwaysUseWidgets: false,
      mobile: false,
      styleInputs: true
    },

    _create: function() {
      var that = this;

      that._processInputElements(that.element);
      that._processProgressElements(that.element);
    },

    _refresh: function() {},

    _destroy: function() {},

    _setOptions: function() {
      this._superApply( arguments );
      this._refresh();
    },

    _setOption: function(key, value) {
      this._super(key, value);
    },

    _processInputElements: function(form) {
      var that = this;
      var inputs = $(form).find('input, button');

      inputs.each(function(index, el) {
        that._upgradeInputType(that, el);

        if (el.getAttribute('placeholder') &&
          !features.placeholder) {
          that._upgradePlaceholder(el);
        }
      });
    },

    _upgradeInputType: function(that, el) {
      var type = el.getAttribute('type');

      if (!type && el.nodeName === 'BUTTON') {
        type = 'button';
      }

      if(vanillaInputRegEx.test(type) && that.options.styleInputs) {
        typeUpgrades[type](el);
      }

      if (that._shouldUpgradeType(type)) {
        typeUpgrades[type](el);
      }
    },

    _shouldUpgradeType: function(type) {
      var that = this;
      var inputSupported = features[type];

      return (that.options.alwaysUseWidgets ||
        !inputSupported) &&
        type in typeUpgrades && !vanillaInputRegEx.test(type);

    },

    _processProgressElements: function(form) {
      var that = this;
      var progress = $(form).find('progress');

      progress.each(function(index, el) {
        if(that.options.alwaysUseWidgets || !features.progress) {
          typeUpgrades.progress(el);
        }
      });
    },

    _upgradePlaceholder: function(el) {
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
    }
  });
} (jQuery));