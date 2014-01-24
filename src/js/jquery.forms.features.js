(function ($) {
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

	function detectDateTimeFields(type) {
		var dummyVal = ':(';

		var i = document.createElement('input');
		i.setAttribute('type', type);
		// Credit to Mike Taylor //gist.github.com/miketaylr/310734
		i.value = dummyVal;
		return (i.value !== dummyVal);
	}

	var featureDetects = {
		color: detectFormTypeSupport('color'),
		number: detectFormTypeSupport('number'),
		range: detectFormTypeSupport('range'),
		file: detectFormTypeSupport('file'),
		datetime: detectDateTimeFields('datetime'),
		'datetime-local': detectFormTypeSupport('datetime-local'),
		time: detectFormTypeSupport('time'),
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
} (jQuery));