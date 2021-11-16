
jsPsych.plugins['jspsych-experimentscreen'] = function () {

    var plugin = {};

    plugin.info = {
        name: 'jspsych-experimentscreen',
        description: '',

        parameters: {

            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: undefined,
                description: 'How long to show the trial.'
            },
            stimulus_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus duration',
                default: undefined,
                description: 'How long the parcel rests on the ground for'
            },

            fish_class: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'type of fish',
                default: undefined,
                description: 'fish as being native or invasive'
            },

            fish_color: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'color of fish',
                default: undefined,
                description: 'color of fish, set per block'
            },

            size: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Fish size',
                default: undefined,
                array: true,
                description: 'The size of the fish (width) stimulus.'
            },

            distribution_info: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'info of distribution from which size was drawn',
                default: undefined,
                description: 'info of the distribution from which fish sizes are drawn'
            },
            distribution_name: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'name of distribution from which size was drawn',
                default: undefined,
                description: 'name of the distribution from which fish sizes are drawn'
            },

            banner_text: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Banner text',
                default: null,
                array: true,
                description: 'if banner text is specified it overrides the buttons to be displayed.'
            },

            confidence_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'confidence trial',
                default: undefined,
                description: 'whether confidence is collected or not'
            },

            block: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Block number',
                default: undefined,
                description: 'The block number'
            },

            choices: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Choices',
                default: undefined,
                array: true,
                description: 'The labels for the buttons.'
            }
        }
    };

    plugin.trial = function (display_element, trial) {

        display_element.innerHTML = '';

        //update the response variables
        const response = {
            stimulus: trial.fish_class,
            trial_type: trial.trial_type,
            distribution_mean: trial.distribution_info.mean,
            distribution_variance: trial.distribution_info.variance,
            distribution_std: trial.distribution_info.standardDeviation,
            distribution_name: trial.distribution_name,
            fish_color: trial.fish_color,
            fish_size: trial.size,
            distance_to_bound: Math.abs(500 - trial.size),
            start_time: performance.now(),
            response_time: null,
            confidence_response_time: null,
            end_time: null,
            delta_response_time: null,
            delta_confidence_response_time: null,
            button: null,
            button_label: trial.choices,
            confidence: null,
            correct: null,
            incorrect: null,
            block: trial.block,
            coins: null
        };

        var experiment_screen = document.createElement("div");
        experiment_screen.id = "jspsych-experimentscreen";
        experiment_screen.classList.add('screen');
        if (trial.confidence_trial == true){
            experiment_screen.style.marginTop = `${2}vh`
        }
        display_element.appendChild(experiment_screen);

        //draw "canvas" to screen
        var canvas = document.createElement("div");
        canvas.id = "jspsych-gameboard";
        canvas.classList.add('gameboard');
        experiment_screen.appendChild(canvas);


        //add fish and fish elements
        var fish = document.createElement("div");
        fish.id = "fish";
        fish.classList.add('fish');
        fish.style.width = `${trial.size}px`; //this is the key experimental variable
        fish.style.backgroundColor = `${trial.fish_color}`;//this is a blockwise color change to make the blocks more distinct.
        fish.style.left = ((trial.canvasSize - trial.size)/2).toString() + 'px';
        fish.style.opacity = `100`;
        canvas.appendChild(fish);

        var eye = document.createElement("div");
        eye.id = "eye";
        eye.classList.add('eye');
        fish.appendChild(eye);

        var fin = document.createElement("div");
        fin.id = "fin";
        fin.classList.add('fin');
        fish.appendChild(fin);

        var tail = document.createElement("div");
        tail.id = "tail";
        tail.classList.add('tail');
        fish.appendChild(tail);


        //SHOW BLANK SCREEN
        function showBlankStimulus(duration, callback) {
            // Blank out the screen
            fish.style.opacity = '0';
            // Callback after delay
            if(typeof callback === 'function')
                setTimeout(callback, duration)
        }

        //draw buttons to screen
        if (trial.banner_text === null) {
            var buttons = document.createElement("div")
            buttons.id = 'jspsych-quickfire-btngroup';

            trial.choices.forEach((c, i) => {
                var button = document.createElement('div');
                button.id = `experiment-btn-${i}`;
                button.classList.add('experiment-btn');
                button.innerHTML = c;
                button.dataset.choice = i;
                buttons.appendChild(button);
                button.addEventListener(
                    'click',
                    (e) => afterResponse(parseInt(i))
                );
            });
            experiment_screen.appendChild(buttons);

            if (trial.trial_duration !== null) {
                jsPsych.pluginAPI.setTimeout(function() {
                    end_trial();
                }, trial.trial_duration);
            }
        }// if fast learning trial display banner underneath screen.
        else {
            var banner = document.createElement("div");
            banner.classList.add('banner');
            banner.id = 'banner';
            banner.innerHTML = trial.banner_text;
            banner.style.opacity = `100`;
            fish.appendChild(banner);

            fish.style.left = ((trial.canvasSize - trial.size)/2).toString() + 'px';


            if (trial.trial_duration !== null) {
                jsPsych.pluginAPI.setTimeout(function() {
                    showBlankStimulus(100, end_trial);
                }, trial.trial_duration);
            }

        }


        function afterResponse(choice) {
            // remove fish from screen
            fish.style.animationName = `vanish`;
            fish.style.opacity = `0`;
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

            // measure response information
            response.response_time = performance.now();
            response.delta_response_time = response.response_time - response.start_time;
            response.button = choice;
            response.button_label = trial.choices[choice];

            //figure out scoring
            if (/NATIVE/i.test(trial.fish_class)){
                if (response.button_label === 'Return'){
                    response.correct = 1;
                    response.incorrect = 0;
                    response.coins = 3;
                } else {
                    response.correct = 0;
                    response.incorrect = 1;
                    response.coins = -3;
                }
            } else if(/INVASIVE/i.test(trial.fish_class)){
                if (response.button_label === 'Catch'){
                    response.correct = 1;
                    response.incorrect = 0;
                    response.coins = 3;

                } else {
                    response.correct = 0;
                    response.incorrect = 1;
                    response.coins = -3;
                }
            }

            // disable all the buttons after a response
            var btns = document.querySelectorAll('jspsych-quickfire-btngroup');
            for (var i = 0; i < btns.length; i++) {
                btns[i].setAttribute('disabled', 'disabled');
            }

            display_element.canvas = ''

            jsPsych.pluginAPI.clearAllTimeouts();

            if (trial.confidence_trial)
                getConfidence();
            else
                end_trial();
        }

        /**
         * display a confidence slider to collect a confidence report on confidence trials
         */
        function getConfidence() {
            let sliderStart = Math.floor(Math.random() * 100) + 1;

            //clear buttons and realign button group to fit confidence question
            buttons.innerHTML = `
<div id = 'confidence'>
<p class='confidenceQuestion' id="confidenceQuestion" fontsize="xx-large">
<strong>How confident are you of your choice?</strong>
</p>

<div class="slider_area">
    <div class="label">Totally <br> UNSURE </div>
    <input type="range" class="slider" id="slider" min=0 max=100 step="1" value = "${sliderStart.valueOf()}" />
    <div class="label"> Sure<br> CORRECT </div>
</div>
<div id="experiment-btn" class="experiment-btn" data-disabled="1">Confirm</div>
</div>
            `;

            //insert a slider for the confidence report
            var confidenceSlider = document.getElementById('slider');
            sliderStart = document.getElementById('slider').value;
            response.sliderStartValue  = sliderStart.valueOf();

            confidenceSlider.requireInteraction = true;
            confidenceSlider.addEventListener("change", ()=>document.getElementById('experiment-btn').dataset.disabled='0')

            var confirm = document.getElementById('experiment-btn');
            confirm.style.backgroundColor= 'rgba(228, 253,225, .7)'
            confidenceSlider.addEventListener('change',()=>document.getElementById('experiment-btn').style.backgroundColor = 'rgba(228, 253,225, 1)')

            confirm.addEventListener('click',(e)=> {
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
                if(e.currentTarget.dataset.disabled === '0')
                    end_trial()
            });

            response.confidence = display_element.querySelector('input.slider').value;

        }

        /**
         * Cleanly end a jsPsych trial
         */
        function end_trial() {
            // record timings
            response.confidence_response_time = performance.now();
            response.delta_confidence_response_time = response.confidence_response_time - response.response_time;

            // record the slider's final value
            const conf = display_element.querySelector('input.slider');
            if(conf) {
                response.confidence = conf.value;

            }
            else {
                response.confidence = null;
            }

            if(response.confidence >= response.sliderStartValue){
                response.sliderMove = response.confidence - response.sliderStartValue;
            }else{
                response.sliderMove = response.sliderStartValue - response.confidence;
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

}();