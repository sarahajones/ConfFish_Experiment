jsPsych.plugins['jspsych-tutorial'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'jspsych-tutorial',
        prettyName: 'Study Tutorial',
        parameters: {
            tutorial_count: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Tutorial count',
                default: undefined,
                description: 'The number of the tutorial slide to be shown.'
            },}
    };

    plugin.trial = function (display_element, trial) {
        // clear display element and apply default page styles
        display_element.innerHTML = '';

        if (trial.tutorial_count === 1) {
            var tutorial_text =
                '<p> During this study, you will play a game where you will be a marine biologist. You will be exploring lakes where invasive species of fish live alongside native species. ' +
                'The invasive species are taking over the lakes - they need to be caught and removed. ' +
                'Your goal is to find fish and check if they are from a native species or an invasive species. </p>' +
                '<p> The native species should be returned to the water, the invasive species should be caught and removed. ' +
                'These species will be slightly different in each lake, you will learn about the species of fish in each lake as you arrive. ' +
                'You will gain points be correctly identifying the fish and responding appropriately.</p>' +
                '<p> You are aiming to catch the invasive fish and return the native fish.</p>';
            var header_text =
                '<h2>The following pages will help guide you through the upcoming study, please read them carefully. </h2>'

        } else if(trial.tutorial_count === 2) {
            var tutorial_text =
                '<p> Throughout the game you must decide whether to "catch" the fish you have found, or to "return" it to the water.  </p>' +
                '<p> The scoring system works as follows: </p>' +
                '<p> 1. If you correctly "catch" an invasive fish, you will earn 3 points. </p>' +
                '<p> 2. If you incorrectly "catch" a native fish, you will lose 3 points. </p>' +
                '<p> 3. If you incorrectly "return" an invasive fish, you will lose 3 points. </p>' +
                '<p> 4. If you correctly "return" a native fish, you will earn 3 points. </p>' +
                '<p> If you have no points to lose your points will stay at zero. ' +
                'Your score will reset at each lake.</p>';
            var header_text =
                '<h1>How does it work?</h1>';

        } else if(trial.tutorial_count === 3)
        {var tutorial_text =
            '<p> Okay, let\'s start check that you have the basics. ' +
            'You will see an image of a fish appear on screen labeled as either "native" or "invasive". </p>' +
            '<p> Press "catch" to catch the fish - press "return" to return it to the water instead. </p>';
            var header_text =
                '<h1>Let\'s get started!</h1>';

        } else if(trial.tutorial_count === 4)
        { var tutorial_text =
            '<p> Well done - please keep in mind what you have learned so far, it will be important soon. </p>' +
            '<p> Now it is time to head to our first lake and get to work. ' +
            'Please watch the next screen closely to see <strong>what each type of fish looks like in this lake</strong>. ' +
            'The types of fish may sometimes look quite similar so watch carefully.' +
            'You will not have to press any buttons, or respond in any way. </p>' +
            '<p> This information, combined with what you have just learned about native and invasive fish, will help you in the upcoming game!</p>';
            var header_text =
                '<h1>Time for the next stage... </h1>'
        }
        else if(trial.tutorial_count === 5)
        { var tutorial_text =
            '<p> Now that you\'ve seen what native and invasive fish look like in <strong>this</strong> lake  - it is time to bring it all together. ' +
            'In the next set of trials, you will see fish appear in view one by one.' +
            'You will have to decide whether to catch or return each fish based on what they look like alone.' +
            'You will receive feedback on your choices at the end of the this round (not after each decision).  </p>' +
            '<p>Remember - you are trying to catch the invasive fish and return the native fish to earn as many points as possible!</p>';
            var header_text =
                '<h2>Read the following instructions to learn more about the next stage of the game.</h2>'

        }

        else if(trial.tutorial_count === 6)
        { var tutorial_text =
            '<p> After each choice you make, you will be asked to rate your confidence on a sliding scale from "totally unsure" to "sure correct". ' +
            'Move the slider to the position that reflects your confidence in the choice that you made in that trial only. </p> ' +
            '<p> When making this rating, think about how sure you are that you made the right decision on that choice. ' +
            'Submit your confidence rating by pressing the confirm button on screen to move onto the next trial. </p>' +
            '<p> Good luck!</p>'
            var header_text =
                '<h2>Read the following instructions to learn more about the next stage of the game.</h2>'
        }


        else if(trial.tutorial_count === 7)
        { var tutorial_text =
            '<p> Let\'s see if you can improve your score this time around! ' +
            'Watch the screen carefully again and then try to beat your last score! ' +
            'Keep an eye on what kind of fish are in the next lake, they may look different this time but the rules remain the same! Good luck!</p>'
            var header_text =
                '<h1>Ready for the next round?</h1>'
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
            tutorial_text
        );

        var instructAcknowledge = createGeneral(
            instructAcknowledge,
            display_element,
            'button',
            'large-button',
            'tutorial-submit',
            '<div>Press to continue</div>'
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