(function ($) {
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
} (jQuery));