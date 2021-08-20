/*
 * Example plugin template
 */

jsPsych.plugins['jspsych-demographics'] = (function () {

  var plugin = {};

  plugin.info = {
    name: 'jspsych-demographics',
    parameters: {
      intro: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Introductory Statement',
        default: '',
        description: 'Space for a questionnaire title / leading question.'
      },
      questions: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Questions',
        default: {
          age: 'Please drag slider to indicate your age: ',
          gender: 'Please select your gender: ',
          handedness: 'Please select your handedness (dominant hand): '
        },
        description: 'Questionnaire questions.'
      }
    }
  };

  plugin.trial = function (display_element, trial) {
    // clear display element and apply page default styles
    display_element.innerHTML = '';

    const response = {
      participantAge: null,
      participantGender: null,
      participantHandedness: null,
      startTime: null,
      ageRT: null,
      genderRT: null,
      handednessRT: null
    };


    // make sure the page starts at the top each time
    removeHash();
    removeQueryString();

    // empty response object to store responses at the end
    var responses = {};

    // create page elements
    var section1 = createGeneral(
        section1,
        display_element,
        'section',
        'section',
        'demographics-section1',
        ''
    );
    var ageQuestion = createGeneral(
        ageQuestion,
        section1,
        'div',
        'question demographics-question',
        'demographics-question1',
        '<h2>' + trial.questions.age + '</h2>'
        + '<input id="age" name="age" class="slider" type="range" min="17" max="70" value="17">'
        + '<label for="age">17 years old </label>'
    );
    var button1 = createGeneral(
        button1,
        section1,
        'button',
        'large-button',
        'demographics-proceed1',
        'CONFIRM'
    );
    var section2 = createGeneral(
        section2,
        display_element,
        'section',
        'section',
        'demographics-section2',
        ''
    );
    var genderQuestion = createGeneral(
        genderQuestion,
        section2,
        'div',
        'question demographics-question',
        'demographics-question2',
        '<h2>' + trial.questions.gender + '</h2>'
        + '<select id="gender" name="gender">'
        + '<option disabled selected value> - select an option - </option>'
        + '<option value="male">Male</option>'
        + '<option value="female">Female</option>'
        + '<option value="non-binary">Non-binary</option>'
        + '<option value="other">Other</option>'
        + '<option value="prefer not to say">Prefer Not To Say</option>'
        + '</select>'
    );
    var button2 = createGeneral(
        button2,
        section2,
        'button',
        'large-button',
        'demographics-proceed2',
        'CONFIRM'
    );
    var section3 = createGeneral(
        section3,
        display_element,
        'section',
        'section',
        'demographics-section3',
        ''
    );
    var handednessQuestion = createGeneral(
        handednessQuestion,
        section3,
        'div',
        'question demographics-question',
        'demographics-question3',
        '<h2>' + trial.questions.handedness + '</h2>'
        + '<select id="handedness" name="handedness">'
        + '<option disabled selected value> - select an option - </option>'
        + '<option value="left">Left</option>'
        + '<option value="right">Right</option>'
        + '<option value="ambidextrous">Ambidextrous</option>'
        + '</select>'
    );
    var button3 = createGeneral(
        button3,
        section3,
        'button',
        'large-button',
        'demographics-proceed3',
        'SUBMIT'
    );
    button3.setAttribute('type', 'submit');

    // hide following sections and next buttons at start
    $('#demographics-section2, #demographics-section3').css('visibility', 'hidden');
    $('.small-button').css('display', 'none');

    // start the timers
    response.startTime = Date.now();
    var ageRT;
    var genderRT;
    var handednessRT;

    // Section 1 event listeners
    $('#age').on('change input', function () {
      $('#age').siblings('label').html(document.getElementById('age').value + ' years old');
    });
    $('#age').on('change', function() {
      $('#demographics-proceed1').fadeIn().css('display', 'flex');
      $('#demographics-section2').css('visibility', 'visible');
    });

    $('#demographics-proceed1').on('click', function() {
      ageRT = calculateRT(response.startTime, Date.now());
      $('html, body').animate({
        scrollTop: $('#demographics-section2').offset().top
      }, 1000);
      startQuestion = Date.now();
    });

    // Section 2 event listeners
    $('#gender').on('change', function() {
      $('#demographics-proceed2').fadeIn().css('display', 'flex');
      $('#demographics-section3').css('visibility', 'visible');
    });

    $('#demographics-proceed2').on('click', function() {
      genderRT = calculateRT(startQuestion, Date.now());
      $('html, body').animate({
        scrollTop: $('#demographics-section3').offset().top
      }, 1000);
      startQuestion = Date.now();
    });

    // Section 3 event listeners
    $('#handedness').on('change', function() {
      $('#demographics-proceed3').fadeIn().css('display', 'flex');
    });

    $('#demographics-proceed3').on('click', function() {
      handednessRT = calculateRT(startQuestion, Date.now());

      response.totalRT = calculateRT(response.startTime, Date.now());
      response.participantAge = parseInt(document.getElementById('age').value, 10);
      response.participantGender = document.getElementById('gender').value;
      response.participantHandedness = document.getElementById('handedness').value;
      response.ageRT = ageRT;
      response.genderRT = genderRT;
      response.handednessRT = handednessRT;
      //console.log(response);

      var element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      // finish
      jsPsych.finishTrial(response);
      return;
    });
    scrollTop();
  }; // close plugin.trial

  return plugin; // close plugin
})();
