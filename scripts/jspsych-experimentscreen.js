
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

        const response = {
        };

        //draw "canvas" to screen
        var canvas = document.createElement("div");
        canvas.id = "jspsych-experimentscreen";
        canvas.classList.add('gameboard');
        display_element.appendChild(canvas);

        var fish = document.createElement("div");
        fish.id = "fish";
        fish.classList.add('fish');
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