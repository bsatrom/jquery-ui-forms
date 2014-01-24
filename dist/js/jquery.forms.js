/*
 * jquery-ui-forms v0.0.1 (2014-01-24)
 * Copyright © 2014 Brandon Satrom
 *
 *  Licensed under the MIT License (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
	if(!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g,'');
		};
	}

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
      'use strict';
      var i, len;
      
      for (i = 0, len = this.length; i < len; ++i) {
        if (i in this) {
          fn.call(scope, this[i], i, this);
        }
      }
    };
  }
}());;(function ($) {
  $.forms = $.forms || {};

	function detectFormTypeSupport(type) {
		var input = document.createElement('input');
		
		//Wrap this in a try/catch b/c IE8 doesn't allow one to set
		//the type of input elements with setAttribute
		try {
			input.setAttribute('type', type);
		} catch(e) {
			input.type = type;
		}

		return input.type !== 'text';
	}

	var featureDetects = {
		number: detectFormTypeSupport('number'),
		range: detectFormTypeSupport('range'),
		month: detectFormTypeSupport('month'),
		week: detectFormTypeSupport('week'),
		date: detectFormTypeSupport('date'),
    progress: (function() {
      return document.createElement('progress').max !== undefined;
    }()),
		placeholder: (function() {
			return 'placeholder' in document.createElement('input') &&
				'placeholder' in document.createElement('textarea');
		}())
	};

  $.forms.features = featureDetects;
} (jQuery));;(function ($) {
  $.forms = $.forms || {};

	var typeUpgrades = {
    button: upgradeButton,
    submit: upgradeButton,
    reset: upgradeButton,
    number: function(val) {
      $(val).spinner();
    },
    range: function(val) {
      var input = $(val);
      input.slider({
        value: input.val(),
        min: input.attr('min'),
        max: input.attr('max'),
        step: input.attr('step')
      });
    },
    month: function(val) {
      var input = $(val),
        value = convertMonthPartToDate(input.val()),
        min = convertMonthPartToDate(input.attr('min')),
        max = convertMonthPartToDate(input.attr('max'));

      input.datepicker({
        // If the conversion returned a NaN, use the default values
        defaultDate: isNaN(value) ? null : new Date(value),
        minDate: isNaN(min) ? new Date(1900, 0, 1) : new Date(min),
        maxDate: isNaN(max) ? new Date(2099, 11, 31) : new Date(max),

        changeMonth: true,
        changeYear: true
      });
    },
    week: function(val) {
      var input = $(val),
        value = getDateFromWeekString(input.val()),
        min = getDateFromWeekString(input.attr('min')),
        max = getDateFromWeekString(input.attr('max'));

      input.datepicker({
        defaultDate: value,
        minDate: min === null ? new Date(1900, 0, 1) : min,
        maxDate: max === null ? new Date(2099, 11, 31) : max,

        showWeek: true,
        firstDay: 1
      });
    },
    date: function(val) {
      var input = $(val);
      var defaults = getDateTimeDefaults(input);
      input.datepicker(defaults);
    },
    progress: function(val) {
      var input = $(val);
      input.progressbar();
    }
  };

	function convertMonthPartToDate(val) {
		// Add dummy day of month for valid date parsing
		val = val + '-' + new Date().getDate();

    if (!Date.parse(val)) {
      // Valid ISO Dates may not parse on some browsers (IE7,8)
      // replace dashes with slashes and try another parse.
      return Date.parse(val.replace(/-/g, '/'));
    }

    return Date.parse(val);
	}

	function getDateFromWeekString(weekString) {
    var week, year, dateParts;

    if (!weekString) {
      return null;
    }

    dateParts = weekString.split('-');

		if (dateParts.length < 2) {
			return null;
		}

		year = dateParts[0];
		week = dateParts[1].replace(/w/gi, '');

		if (isNaN(parseInt(week, 10)) || isNaN(parseInt(year, 10))) {
			return null;
		}

		// Jan 1 + 7 days per week
    var day = (1 + (week - 1) * 7);
    return new Date(year, 0, day);
	}

	function getDateTimeDefaults(input) {
		return {
			defaultDate: createDateFromInput(input.val(), null),
			minDate: createDateFromInput(input.attr('min'), new Date(1900, 0, 1)),
			maxDate: createDateFromInput(input.attr('max'), new Date(2099, 11, 31))
		};
	}

  function createDateFromInput(val, defaultDate, prefix) {
    if (!val) {
      return defaultDate;
    }

    if (prefix) {
      val = prefix + val;
    }

    if (!Date.parse(val)) {
      // Valid ISO Dates may not parse on some browsers (IE7,8)
      var altDate = new Date(val.replace(/-/g, '/'));

      if (altDate) {
        // If this alternate value is valid, add a day
        // to account for UA parsing
        return new Date(altDate.setDate(altDate.getDate() + 1));
      }

      return defaultDate;
    }

    return new Date(val);
  }

  function upgradeButton(val) {
    $(val).button();
  }

  $.forms.types = typeUpgrades;
} (jQuery));;(function($) {
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