//this relies on css animation

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
            choices: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Choices',
                default: undefined,
                array: true,
                description: 'The labels for the buttons.'
            },
            location: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'position of the dropped parcel',
                default: undefined,
                description: 'horizontal position of the dropped parcel'
            },
            spaceship_class: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'color of spaceship',
                default: undefined,
                description: 'color of spaceship that links to d'
            },

            trial_type: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'type of trial',
                default: undefined,
                description: 'trial type, clear-training or cloudy-testing'
            },
            distribution_name: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'distribution from which location was drawn',
                default: undefined,
                description: 'names the distribution from which drop locations are drawn'
            },
            distribution_info: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'info of distribution from which location was drawn',
                default: undefined,
                description: 'info of the distribution from which drop locations are drawn'
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

            boundary: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Midline boundary',
                default: undefined,
                description: 'The midline boundary between the two distributions'
            },
        }
    };


    plugin.trial = function (display_element, trial) {
        display_element.innerHTML = '';

        const response = {
            stimulus: trial.spaceship_class,
            trial_type: trial.trial_type,
            distribution_mean: trial.distribution_info.mean,
            distribution_variance: trial.distribution_info.variance,
            distribution_std: trial.distribution_info.standardDeviation,
            distribution_name: trial.distribution_name,
            spaceship_class: trial.spaceship_class,
            drop_location: trial.location,
            boundary: trial.boundary,
            distance_to_bound: null,
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



        //draw "canvas" to screen
        var canvasDiv = document.createElement("div");
        canvasDiv.id = "jspsych-experimentscreen";
        canvasDiv.classList.add('gameboard');
        display_element.appendChild(canvasDiv);

        var grassbank = document.createElement("div");
        grassbank.id = "grassbank";
        grassbank.classList.add('grassbank');
        canvasDiv.appendChild(grassbank)

        if (trial.trial_type !== 'clear') {
            var cloudbank = document.createElement('div');
            cloudbank.classList.add('cloudbank');
            display_element.appendChild(cloudbank);
        }

        //package
        var package = document.createElement("div");
        package.classList.add('package');
        package.style.left = `${trial.location}px`;
        canvasDiv.appendChild(package);
        //drop package

        //spaceship
        var spaceship = document.createElement("div");
        spaceship.classList.add('spaceship', trial.spaceship_class);
        spaceship.style.left = `${trial.location}px`;
        canvasDiv.appendChild(spaceship);
        //drop spaceship at specific x position
        //overlay with image of spaceship

        //draw buttons to screen
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

        display_element.appendChild(buttons);

        // if fast learning trial display banner underneath screen.
        if (trial.banner_text !== null) {
            var banner = document.createElement("div");
            banner.classList.add('banner')
            banner.innerHTML = trial.banner_text;
            buttons.appendChild(banner);
        }
        // timeout: end trial if time limit is set
        if (trial.trial_duration !== null) {
            response.coins = 0;
            response.correct = 0;
            response.incorrect = 1;

            jsPsych.pluginAPI.setTimeout(function () {
                end_trial();
            }, trial.trial_duration);
        }

        /**
         * do stuff after button press
         * @param choice {int} tells us which button was pressed
         */
        function afterResponse(choice) {
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
            if (/blue/i.test(trial.spaceship_class)){
                if (response.button_label === 'Zap'){
                    response.correct = 1;
                    response.incorrect = 0;
                    response.coins = 0;
                } else {
                    response.correct = 0;
                    response.incorrect = 1;
                    response.coins = -3;
                }
            } else if(/orange/i.test(trial.spaceship_class)){
                if (response.button_label === 'Zap'){
                    response.correct = 0;
                    response.incorrect = 1;
                    response.coins = 0;

                } else {
                    response.correct = 1;
                    response.incorrect = 0;
                    response.coins = 3;
                }
            }

            // disable all the buttons after a response
            var btns = document.querySelectorAll('jspsych-quickfire-btngroup');
            for (var i = 0; i < btns.length; i++) {
                btns[i].setAttribute('disabled', 'disabled');
            }

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
            confirm.style.backgroundColor= 'rgba(155, 242, 236, .7)'
            confidenceSlider.addEventListener('change',()=>document.getElementById('experiment-btn').style.backgroundColor = 'rgba(155, 242, 236, 1)')

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