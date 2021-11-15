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

            gap_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Gap duration',
                default: null,
                description: 'How long to show a blank screen in between the two stimuli.'
            },

            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: true,
                description: 'If true, then trial will end when user responds.'
            },

            filter_fun: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Filter Function',
                default: undefined,
                description: 'The filter function to pull data for feedback calc'
            },

            attention_check_number: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Attention check number',
                default: null,
                description: 'Which attention check are we on.'
            },

            block: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Block number',
                default: undefined,
                description: 'The block number'
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
            block: trial.block,
            start_time: performance.now(),
            response_time: null,
            end_time: null,
            delta_response_time: null,
            button: null,
            button_label: null,
            last: 0
        };

        if (trial.attention_check_number === 2) {
            const data = JSON.parse(jsPsych.data.get().json()).filter(trial.filter_fun);

            let correctLast = 0;
            let incorrectLast = 0;

            data.forEach((x) => {
                if (x.correct === 1) {
                    correctLast++;
                } else if (x.incorrect === 1)
                    incorrectLast++;
            });

            if (incorrectLast === 0) {
                response.last = 1;
               end_trial()
            } else {showStimulus(trial.stimuli[0], trial.stimulus_duration)
                }
        } else {showStimulus(trial.stimuli[0], trial.stimulus_duration)}

        // Functions
        // SHOW IMAGE:  generalised function for use and reuse
        function displayImage(imgSrc, duration, callback) {
            const img = display_element.appendChild(document.createElement('img'));
            img.src = imgSrc;
            img.className = 'jspsych-quickfire-stimulus';
            img.style = display_element;
            img.style.opacity = `100`;
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
                setTimeout(callback, duration)
        }

        // SHOW STIMULUS (set by procedural code above)

        // SHOW STIMULUS + BUTTON/s
        function showStimulus() {
            displayImage(trial.stimuli[0], trial.stimulus_duration,null);

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

            awaitResponse()
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
            response.button_label = trial.choices[choice];// calculate score

            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            if (response.last === 1){
                response.correct = 1;
                response.incorrect = -1;
            } else {
                if (trial.stimuli[0] === 'images/training_fish_invasive.png') {
                    if (response.button_label === 'Catch') {
                        response.correct = 1;
                        response.incorrect = 0;
                    } else {
                        response.correct = 0;
                        response.incorrect = 1;
                    }
                } else if (trial.stimuli[0] === 'images/training_fish_native.png') {
                    if (response.button_label === 'Return') {
                        response.correct = 1;
                        response.incorrect = 0;
                    } else {
                        response.correct = 0;
                        response.incorrect = 1;
                    }
                }
            }
            showBlankScreen(trial.gap_duration, end_trial)
            //end_trial()

        }



        //END TRIAL
        // function to end trial when it is time
        function end_trial() {
            var checkRect = document.getElementById("curtain");
            if (checkRect !== null)
            {
                checkRect.remove();
            }
            if (response.last === 1){
                response.correct = 1;
                response.incorrect = -1;
            } else {
                if (response.button_label === null) {
                    response.correct = 0;
                    response.incorrect = 1;
                }
            }

            // disable all the buttons after a response
            var btns = document.querySelectorAll('#jspsych-quickfire-button-');
            for (var i = 0; i < btns.length; i++) {
                btns[i].setAttribute('disabled', 'disabled');
            }

            response.end_time = performance.now();
            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // move on to the next trial
            jsPsych.finishTrial(response);
        }

    };

    return plugin;
})();