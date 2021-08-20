/*
 * Example plugin template
 */

jsPsych.plugins["PLUGIN-NAME"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "PLUGIN-NAME",
    parameters: {
      parameter_name: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // data saving
    var trial_data = {
      parameter_name: 'parameter value'
    };

    // end trial
    jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
