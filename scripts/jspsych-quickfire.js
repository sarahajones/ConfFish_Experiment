jsPsych.plugins['jspsych-quickfire'] = (function () {

    var plugin = {};

    /*------ Define plugin information ----- */
    plugin.info = {
        name: 'jspsych-quickfire',
        description: '',
        parameters: {

            stimuli: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: 'Stimuli',
                default: undefined,
                array: true,
                description: 'The images to be displayed.'
            },

            trial_number: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Trial Number',
                default: undefined,
                array: true,
                description: 'Number of trials to be looped.'
            },

            choices: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Choices',
                default: undefined,
                array: true,
                description: 'The labels for the buttons.'
            },

            button_html: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Button HTML',
                default: '<button class="small-button">%choice%</button>',
                array: true,
                description: 'The html of the button.'
            },

            stimulus_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus1 duration',
                default: null,
                description: 'How long to hide the stimulus.'
            },

            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'How long to show the trial.'
            },

            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: true,
                description: 'If true, then trial will end when user responds.'
            },



        }
    };

    /* ----- Start trial then showing stimulus  -----*/
    plugin.trial = function (display_element, trial) {

        display_element.innerHTML = '';

        const response = {
            stimulus: trial.stimuli,
            label: trial.banner_text,
            number: trial.trial_number,
            start_time: performance.now(),
            response_time: null,
            end_time: null,
            delta_response_time: null,
            button: null,
            button_label: trial.choices,
        };

        showStimulus(trial.stimuli[0], trial.stimulus_duration);

        // Functions

        // SHOW IMAGE:  generalised function for use and reuse
        function displayImage(imgSrc, duration, callback) {
            const img = display_element.appendChild(document.createElement('img'));
            img.src = imgSrc;
            img.className = 'jspsych-quickfire-stimulus';
            img.style = display_element;
            if(typeof callback === 'function')
                setTimeout(callback, duration);

            if (trial.banner_text !== null) {
                var banner = document.createElement("div");
                banner.classList.add('banner')
                banner.innerHTML = trial.banner_text;
                img.appendChild(banner);
            }
        }

        //SHOW BLANK SCREEN
        function showBlankScreen(duration, callback) {
            // Blank out the screen
            display_element.innerHTML = '';
            // Callback after delay
            if(typeof callback === 'function')
                setTimeout(callback, duration);
        }

        // SHOW STIMULUS (set by procedural code below)

        // SHOW STIMULUS + BUTTON/s
        function showStimulus() {
            displayImage(trial.stimuli[0], trial.stimulus_duration, null);

            //display buttons
            var buttons = [];
            if (Array.isArray(trial.button_html)) {
                if (trial.button_html.length === trial.choices.length) {
                    buttons = trial.button_html;
                } else {
                    console.error('Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array');
                }
            } else {
                for (var i = 0; i < trial.choices.length; i++) {
                    buttons.push(trial.button_html);
                }
            }
            display_element.innerHTML += '<div id="jspsych-quickfire-btngroup">';

            for (var i = 0; i < trial.choices.length; i++) {
                var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
                display_element.innerHTML += '<div class="jspsych-quickfire-button-" style= "display: inline-block; margin:' + trial.margin_vertical + ' ' + trial.margin_horizontal + '" id="jspsych-quickfire-button-' + i + '" data-choice="' + i + '">' + str + '</div>';
            }
            display_element.innerHTML += '</div>';

            awaitResponse();
        }

        function awaitResponse() {
            for (var i = 0; i < trial.choices.length; i++) {
                display_element.querySelector('#jspsych-quickfire-button-' + i).addEventListener('click', function (e) {
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

                    var choice = e.currentTarget.getAttribute('data-choice');
                    afterResponse(choice);
                });

            }
            // end trial if time limit is set
            if (trial.trial_duration !== null) {
                jsPsych.pluginAPI.setTimeout(function() {
                    end_trial();
                }, trial.trial_duration);
            }
        }


        // BUTTON RESPONSE
        // function to handle responses by the subject
        function afterResponse(choice) {
            // measure response information
            response.response_time = performance.now();
            response.delta_response_time = response.response_time - response.start_time;
            response.button = choice;
            response.button_label = trial.choices[choice];

            // disable all the buttons after a response
            var btns = document.querySelectorAll('#jspsych-quickfire-button-');
            for (var i = 0; i < btns.length; i++) {
                btns[i].setAttribute('disabled', 'disabled');
            }
            jsPsych.pluginAPI.clearAllTimeouts();

            // calculate score
            console.log(trial.stimuli[0])
            if (trial.stimuli[0] === 'images/training_fish_invasive.png') {
                if (response.button_label == 'Catch') {
                    response.correct = 1;
                    response.incorrect = 0;
                } else {
                    response.correct = 0;
                    response.incorrect = 1;
                }
            }  else if (trial.stimuli[0] === 'images/training_fish_native') {
                if (response.button_label === 'Return') {
                    response.correct = 1;
                    response.incorrect = 0;
                } else {
                    response.correct = 0;
                    response.incorrect = 1;
                }
            }
                // end trial if time limit is set
                if (trial.trial_duration !== null) {
                    jsPsych.pluginAPI.setTimeout(function () {
                        end_trial();
                    }, trial.trial_duration);
                }

            end_trial();
        }


        //END TRIAL
        // function to end trial when it is time
        function end_trial() {
            // disable all the buttons after a response
            var btns = document.querySelectorAll('#jspsych-quickfire-button-');
            for (var i = 0; i < btns.length; i++) {
                btns[i].setAttribute('disabled', 'disabled');
            }

            // clear the display
            display_element.innerHTML = '';
            response.end_time = performance.now();

            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // move on to the next trial
            jsPsych.finishTrial(response);
        }


    };

    return plugin;
})();