jsPsych.plugins['jspsych-attention'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'jspsych-attention',
        prettyName: 'Attention check ',
        parameters: {
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
            }
        }
    };

    plugin.trial = function (display_element, trial) {
        // clear display element and apply default page styles
        display_element.innerHTML = '';

        const response = {
            repeat_required: false,
            correct: null,
            incorrect: null
        };

        const data = JSON.parse(jsPsych.data.get().json()).filter(trial.filter_fun);
    console.log(data)
        let correct = 0;
        let incorrect = 0;
    console.log(incorrect)
        data.forEach((x) => {
            if (x.correct === 1) {
                correct++;
            } else if (x.incorrect === 1) {
                incorrect++;
            } else if (x.incorrect === -1){
                incorrect = -1;
            }
        });
        console.log(incorrect)
        var header_text =
            '<h1>Let\'s see how you are doing.</h1>'

        if (trial.attention_check_number === 1) {
            if (incorrect === 0) {
                trial.tutorial_text = `<p>Well done - you got all <strong>${correct}</strong> right and you got <strong>${incorrect}</strong> wrong.
                This means you have a good understanding of what you are trying to do in this game! </p> 
                <p>Always remember, a correct response  is when you either catch an invasive fish or return a native fish to the lake.  </p>`;
                var button_label = '<div>Press to continue</div>';

            } else if (incorrect !== 0) {

                trial.tutorial_text = `<p> Oh dear,  you got <strong>${incorrect}</strong> wrong.You need to get this right to continue with the game - let\'s try it again! </p> 
                <p>Remember, a correct response  is either when you catch an invasive fish or return a wild fish to the lake.
                An incorrect response is to return an invasive fish or to catch a native fish. </p>`;
                var button_label = '<div>Press to continue</div>';

            }
        } else if (trial.attention_check_number === 2) {
            if (incorrect === 0) {
                trial.tutorial_text = `<p>Well done - you got all <strong>${correct}</strong> right and you got <strong>${incorrect}</strong> wrong.
                This means you have a good understanding of what you are trying to do in this game! </p> 
                <p>Always remember, a correct response  is when you either catch an invasive fish or return a native fish to the lake.  </p>`;
                var button_label = '<div>Press to continue</div>';

            } else if (incorrect === -1) {

                jsPsych.finishTrial();
            }

            else if (incorrect > 0) {
                header_text = '<h1>Oh dear!</h1>';
                trial.tutorial_text = `<p>You answered  <strong>${incorrect}</strong> of the questions incorrectly.</p> 
    <p>As you have already failed to answer the comprehension questions correctly, you will no longer be able to participate in this experiment.</p>
            <p>Please return your submission in Prolific.</p>`;
                var button_label = '';

            }
        }

        // create page elements
        var intro = createGeneral(
            intro,
            display_element,
            'div',
            'titlepage document-intro',
            'tutorial-intro',
            header_text
        );

        var ethicsForm = createGeneral(
            ethicsForm,
            display_element,
            'div',
            'document-in-document',
            'tutorial-form',
            ''
        );
        var instructHeader = createGeneral(
            instructHeader,
            ethicsForm,
            'div',
            'document-header',
            'tutorial-header',
            ''
        );

        var instructText = createGeneral(
            instructText,
            instructHeader,
            'div',
            'document-text',
            'tutorial-text',
            trial.tutorial_text
        );
        var footer = createGeneral(
            footer,
            ethicsForm,
            'div',
            'document-footer',
            'tutorial-footer',
            ''
        );
        var instructAcknowledge = createGeneral(
            instructAcknowledge,
            display_element,
            'button',
            'large-button',
            'tutorial-submit',
            button_label
        );

        // don't show button if it is the dead end branch
        if (button_label === ``){

            document.getElementById(`tutorial-submit`).style.width = `${0}`;
            document.getElementById(`tutorial-submit`).style.padding = `${0}`;
        }

        // define what happens when people click on the final submit button
        $('#tutorial-submit').on('click', function () {
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


            // save the data to data object
            jsPsych.finishTrial();
            return;
        })
    };

    return plugin;

})();