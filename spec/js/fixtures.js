describe('jQuery UI Forms Widget Test Suite', function() {
  describe('Form initialization tests', function() {
		var fixtures = jasmine.getFixtures(),
			env = 'headless';

		if (document.location.pathname === '/context.html') {
			// Karma is running the test, so change the base
			fixtures.fixturesPath = 'base/spec/javascripts/fixtures';
			env = 'karma';
		} else if (document.location.pathname.indexOf('runner.html') > 0) {
			// We're running jasmine in the browser
			fixtures.fixturesPath = '../spec/javascripts/fixtures';
			env = 'browser';
		}

		describe('Form Widget initialization', function() {
			it('should exist in the $ namespace', function() {
				expect($.ui.Form).toBeDefined();
			});

			it('should be able to perform imperative initialization with JavaScript',
				function() {
				expect($('#imperative-form').Form).toBeDefined();
			});
		});

		describe('Number type support', function() {
			if (!$.forms.features.number) {
				it('should create a jQuery UI Spinner from the number input' +
					' type', function() {
					fixtures.load('number-type.html');

					$('#number-form').Form();
					expect($('#numeric').attr('role')).toEqual('spinbutton');
				});
			} else {
				it('should NOT create a kendoNumericTextBox if the number type' +
					' is already supported by the browser', function() {
					fixtures.load('number-type.html');

					$('#number-form').Form();
					expect($('#numeric').attr('role')).not.toBeDefined();
				});

				it('should create a colorpicker on ALL browsers if the' +
					' alwaysUseWidgets option is passed-in', function() {
					fixtures.load('number-type.html');

					$('#number-form').Form({ alwaysUseWidgets: true });
					expect($('#numeric').attr('role')).toEqual('spinbutton');
				});
			}

			it('should expose number type attributes as values in the' +
				' spinner widget', function() {
				fixtures.load('number-type.html');

				$('#number-form').Form({ alwaysUseWidgets: true });

				var numericInput = $('#numeric');
				var ntbObject = numericInput.data('uiSpinner');

				// Test each value we set via attribute and make sure the value was 
				// preserved in the NumericTextBox
				expect(ntbObject.value().toString()).toEqual(numericInput.val());
				expect(ntbObject.option('min').toString())
          .toEqual(numericInput.attr('min'));
				expect(ntbObject.option('max').toString())
          .toEqual(numericInput.attr('max'));
				expect(ntbObject.option('step').toString())
          .toEqual(numericInput.attr('step'));
			});
		});

		describe('Range type support', function() {
			if (!$.forms.features.range) {
				it('should create a slider from the range input type', function() {
					fixtures.load('range-type.html');

					$('#range-form').Form();
					expect($('#slider').hasClass('ui-slider')).toBeTruthy();
				});
			} else {
				it('should NOT create a slider if the range type is already' +
					' supported by the browser', function() {
					fixtures.load('range-type.html');

					$('#range-form').Form();
					expect($('#slider').hasClass('ui-slider')).not.toBeTruthy();
				});

				it('should create a slider on ALL browsers if the alwaysUseWidgets' +
					' option is passed-in', function() {
					fixtures.load('range-type.html');

					$('#range-form').Form({ alwaysUseWidgets: true });
					expect($('#slider').hasClass('ui-slider')).toBeTruthy();
				});
			}

			it('should expose range type attributes as values in the slider' +
				' widget', function() {
				fixtures.load('range-type.html');

				$('#range-form').Form({ alwaysUseWidgets: true });

				var rangeInput = $('#slider');
				var sliderObject = rangeInput.data('uiSlider');

				// Test each value we set via attribute and make sure the value was 
				// preserved in the Slider. Only value is public, 
				// though the others can be tested via some trickery.
				expect(sliderObject.value().toString()).toEqual(rangeInput.val());
				expect(sliderObject.option('min').toString())
          .toEqual(rangeInput.attr('min'));
				expect(sliderObject.option('max').toString())
          .toEqual(rangeInput.attr('max'));
				expect(sliderObject.option('step').toString())
          .toEqual(rangeInput.attr('step'));
			});
		});

		describe('Month type support', function() {
			if(!$.forms.features.month) {
				it('should create a DatePicker from the month input type',
					function() {
					fixtures.load('month-type.html');

					$('#month-form').Form();
					expect($('#month').hasClass('hasDatepicker')).toBeTruthy();
				});
			} else {
				it('should NOT create a kendoDatePicker if the time type is' +
					' already supported by the browser', function() {
					fixtures.load('month-type.html');

					$('#month-form').Form();
					expect($('#month').hasClass('hasDatepicker')).not.toBeTruthy();
				});

				it('should create a kendoDatePicker on ALL browsers if the' +
					' alwaysUseWidgets option is passed-in', function() {
					fixtures.load('month-type.html');

					$('#month-form').Form({ alwaysUseWidgets: true });
					expect($('#month').hasClass('hasDatepicker')).toBeTruthy();
				});
			}

			if (env !== 'headless') {
				it('should apply the month attributes (val, min, max, step)' +
					' to the widget', function() {
					fixtures.load('month-type.html');
					$('#month-form').Form({ alwaysUseWidgets: true });

					var dateInput = $('#month');
					var dateObject = dateInput.data('datepicker');
					var dateRegex = /\/|-| /g;
					var valParts = dateInput.val().split(dateRegex);
					var minParts = dateInput.attr('min').split(dateRegex);
					var maxParts = dateInput.attr('max').split(dateRegex);

					expect(dateObject.settings.defaultDate).not.toBeNull();
					expect(dateObject.settings.defaultDate.getMonth()+1).toEqual(
						parseInt(valParts[1], 10));
					expect(dateObject.settings.minDate.getMonth()+1).toEqual(
						parseInt(minParts[1], 10));
					expect(dateObject.settings.maxDate.getMonth()+1).toEqual(
						parseInt(maxParts[1], 10));
				});
			}
		});

		describe('Week type support', function() {
			if(!$.forms.features.week) {
				it('should create a Datepicker from the week input type',
					function() {
					fixtures.load('week-type.html');

					$('#week-form').Form();
					expect($('#week').hasClass('hasDatepicker')).toBeTruthy();
				});
			} else {
				it('should NOT create a Datepicker if the time type is' +
					' already supported by the browser', function() {
					fixtures.load('week-type.html');

					$('#week-form').Form();
					expect($('#week').hasClass('hasDatepicker')).not.toBeTruthy();
				});

				it('should create a Datepicker on ALL browsers if' +
					' the alwaysUseWidgets option is passed-in', function() {
					fixtures.load('week-type.html');

					$('#week-form').Form({ alwaysUseWidgets: true });
					expect($('#week').hasClass('hasDatepicker')).toBeTruthy();
				});
			}

			if (env !== 'headless') {
				it('should apply the week attributes (val, min, max, step)' +
					' to the widget', function() {
					fixtures.load('week-type.html');
					$('#week-form').Form({ alwaysUseWidgets: true });

					var dateInput = $('#week');
					var dateObject = dateInput.data('datepicker');
					var dateRegex = /\/|-| /g;
					var valParts = dateInput.val().split(dateRegex);
					var minParts = dateInput.attr('min').split(dateRegex);
					var maxParts = dateInput.attr('max').split(dateRegex);

					expect(dateObject.settings.defaultDate).not.toBeNull();
					expect(dateObject.settings.defaultDate.getFullYear()).toEqual(
						parseInt(valParts[0], 10));
					expect(dateObject.settings.minDate.getFullYear()).toEqual(
						parseInt(minParts[0], 10));
					expect(dateObject.settings.maxDate.getFullYear()).toEqual(
						parseInt(maxParts[0], 10));
				});
			}
		});

		describe('Date type support', function() {
			if(!$.forms.features.date) {
				it('should create a Datepicker from the date input type',
					function() {
					fixtures.load('date-type.html');

					$('#date-form').Form();
					expect($('#date').hasClass('hasDatepicker')).toBeTruthy();
				});
			} else {
				it('should NOT create a Datepicker if the time type is' +
					' already supported by the browser', function() {
					fixtures.load('date-type.html');

					$('#date-form').Form();
					expect($('#date').hasClass('hasDatepicker')).not.toBeTruthy();
				});

				it('should create a Datepicker on ALL browsers if the' +
					' alwaysUseWidgets option is passed-in', function() {
					fixtures.load('date-type.html');

					$('#date-form').Form({ alwaysUseWidgets: true });
					expect($('#date').hasClass('hasDatepicker')).toBeTruthy();
				});
			}

			if (env !== 'headless') {
				it('should apply the date attributes (val, min, max, step) to' +
					' the widget', function() {
					fixtures.load('date-type.html');
					$('#date-form').Form({ alwaysUseWidgets: true });

					var dateInput = $('#date');
					var dateObject = dateInput.data('datepicker');
					var dateRegex = /\/|-| /g;
					var valParts = dateInput.val().split(dateRegex);
					var minParts = dateInput.attr('min').split(dateRegex);
					var maxParts = dateInput.attr('max').split(dateRegex);

					expect(dateObject.settings.defaultDate).not.toBeNull();
					expect(dateObject.settings.defaultDate.getMonth()+1).toEqual(
						parseInt(valParts[1], 10));
					expect(dateObject.settings.minDate.getMonth()+1).toEqual(
						parseInt(minParts[1], 10));
					expect(dateObject.settings.maxDate.getMonth()+1).toEqual(
						parseInt(maxParts[1], 10));
				});
			}
		});

    describe('Button support', function() {
      it('should create Buttons from buttons and submit/reset inputs',
        function() {
        fixtures.load('button.html');
        $('#button-form').Form();

        $('button,input[type=submit],input[type=reset]')
          .each(function(index, element) {
          expect($(element).hasClass('ui-button')).toBe(true);
          expect($(element).attr('role')).toBe('button');
        });
      });
    });

    describe('Progress element support', function() {
      it('should provide a feature text for progress support', function() {
        expect($.forms.features.progress).toBeDefined();
      });

      if(!$.forms.features.progress) {
        it('should create a Progressbar from the progress type',
          function() {
            fixtures.load('progress.html');

            $('#progress-form').Form();
            expect($('#completionPct').attr('role')).toEqual('progressbar');
          });
      } else {
        it('should NOT create a kendoProgressBar if progress is' +
          ' already supported by the browser', function() {
          fixtures.load('progress.html');

          $('#progress-form').Form();
          expect($('#completionPct').attr('role')).not.toBeDefined();
        });

        it('should create a kendoProgressBar on ALL browsers if the' +
          ' alwaysUseWidgets option is passed-in', function() {
          fixtures.load('progress.html');

          $('#progress-form').Form({ alwaysUseWidgets: true });
          expect($('#completionPct').attr('role')).toEqual('progressbar');
        });
      }
    });

		describe('Placeholder support', function() {
			it('should provide a feature test for placeholder support', function() {
				expect($.forms.features.placeholder).toBeDefined();
			});

			if(!$.forms.features.placeholder) {
				it('should add a placeholder class to elements with the' +
					' placeholder attribute', function() {
					fixtures.load('placeholder.html');
					$('#placeholder-form').Form();

					var placeholder = $('#placeholder');
					expect(placeholder.hasClass('placeholder')).toBe(true);
				});

				it('should add a label element to serve as the pseudo placeholder',
					function() {
					fixtures.load('placeholder.html');
					$('#placeholder-form').Form();

					var placeholder = $('label.placeholder');
					expect(placeholder.length >= 1).toBe(true);
				});

				it('should hide the label when input text is entered', function() {
					fixtures.load('placeholder.html');
					$('#placeholder-form').Form();

					var placeholder = $('label.placeholder');
					var input = $('#placeholder');

					input.val('foo');
					input.blur();
					expect(input[0].previousSibling.nodeValue).toEqual('');
				});

        it('should remove CR and LF chars from the placeholder value',
        function() {
          fixtures.load('placeholder.html');
          $('#placeholder-form').Form();

          var placeholder = $('label.placeholder');
          var input = $('#break-placeholder');

          expect(input[0].previousSibling.nodeValue).toEqual('Text me!');
        });
      }
		});

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

		fixtures.cleanUp();
		fixtures.clearCache();
	});
});