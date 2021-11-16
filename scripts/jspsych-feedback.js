jsPsych.plugins['jspsych-feedback'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'jspsych-feedback',
        prettyName: 'Block feedback',
        parameters: {
            trial_type: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'the trial type',
                default: undefined,
                description: 'what feedback trial type is it e.g. first or last'
            },

            filter_fun: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Filter Function',
                default: undefined,
                description: 'The filter function to pull data for feedback calc'
            },
        }
    };

    plugin.trial = function (display_element, trial) {
        // clear display element and apply default page styles
        display_element.innerHTML = '';

        const data = JSON.parse(jsPsych.data.get().json())
            .filter(trial.filter_fun);

        let correct = 0;
        let incorrect = 0;
        let coins = 0;

        data.forEach((x) => {
            if(x.correct === 1){
                correct++;
            } else if(x.incorrect === 1)
                incorrect++;

            coins += x.coins;
        });

        if (coins < 0){
            coins = 0
        }



        let tutorial_text = `
        <p>Well done on completing this round.
            In total you got <strong>${correct}</strong> right and <strong>${incorrect}</strong> wrong.
            You collected <strong>${coins}</strong> points this round! Keep trying to improve your score each round!
        </p>
        <p>Remember, a correct response  is either when you return a native fish or correctly catch an invasive fish. 
        An incorrect response could be a caught native fish or a returned invasive fish. </p>
        `;


        var button_label = '<div>Press to continue</div>';


        if (trial.trial_type === 'first') {
            var header_text =
                '<h1>Round 1 of 4 complete - take a short break. </h1>'
        } else if(trial.trial_type ==='second')
        {var header_text =
                '<h1>Round 2 of 4 complete - take a short break.</h1>'
        }
        else if(trial.trial_type === 'third')
        {var header_text =
                '<h1>Round 3 of 4 complete - take a short break.</h1>'
        }
        else if(trial.trial_type === 'last')
        {var header_text =
            '<h1>Last round finished - well done.</h1>'


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

        var logo = createGeneral(
            logo,
            instructHeader,
            'div',
            'header-logo',
            '',
            ''
        );

        var instructText = createGeneral(
            instructText,
            instructHeader,
            'div',
            'document-text',
            'tutorial-text',
            tutorial_text
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


        // define what happens when people click on the final submit button
        $('#tutorial-submit').on('click', function() {
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

        });


    };

    return plugin;
})();