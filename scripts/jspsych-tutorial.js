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
                'The invasive species are taking over the lakes - they need to be caught and removed.' +
                'Your goal is to find fish and check if they are from a native species or an invasive species. </p>' +
                '<p> The native species should be returned to the water, the invasive species should be caught and removed. ' +
                'These species will be slightly different in each lake, you will learn about the species of fish in each lake as you arrive.' +
                'You will gain points be correctly identifying the fish and responding appropriately</p>' +
                '<p>You are aiming to catch the invasive fish and return the native fish.</p>';
            var header_text =
                '<h2>The following pages will help guide you through the upcoming study, please read them carefully. </h2>'

        } else if(trial.tutorial_count === 2) {
            var tutorial_text =
                '<p> Throughout the game you must decide whether to "catch" the fish you have found, or to "return" it to the water.  </p>' +
                '<p> The scoring system works as follows: </p>' +
                '<p> 1. If you correctly "return" a native fish, you will earn 3 points. </p>' +
                '<p> 2. If you incorrectly "catch" a native fish, you will not get those points.</p>' +
                '<p> 3. If you correctly "catch" an invasive fish you points will not change.</p>' +
                '<p> 4. If you incorrectly "return" an invasive fish you will lose 3 points.  </p>' +
                '<p> If you have no points to lose your points will stay at zero. ' +
                'Your score will reset at each lake.</p>';
            var header_text =
                '<h1>How does it work?</h1>';

        } else if(trial.tutorial_count === 3)
        {var tutorial_text =
            '<p> Okay, let\'s start check that you have the basics. ' +
            'You will see an image of a fish pop on screen labeled as either . ' +
            'Press "retrieve" to collect the package -  "zap" the package to destroy the package. Remember, packages could contain coins or may hold bombs. </p>' +
            '<p> In this round you will get feedback on what the package held after each selection to help you learn what packages you should "retrieve" and what packages you should "zap". You are trying to collect coins and avoid bombs - good luck!</p>';
            var header_text =
                '<h1>Let\'s get started!</h1>';



        } else if(trial.tutorial_count === 4)
        { var tutorial_text =
            '<p> Well done - please keep in mind what you have learned about the spaceships so far, it will be important soon. ' +
            'Now it is time to see the two spaceships you have just been learning about in action. ' +
            'Please watch the next screen closely to see <strong>where</strong>, each spaceship is dropping their packages to earth. ' +
            'You will not have to press any buttons, or respond in any way. </p>' +
            '<p>This information, combined with what you have just learned about each spaceship and their packages, will help you in the upcoming game!</p>';
            var header_text =
                '<h1>Time for the next stage... </h1>'
        }
        else if(trial.tutorial_count === 5)
        { var tutorial_text =
            '<p> Now that you\'ve seen the spaceships dropping their packages to earth - it is time bring together everything you have learned so far. ' +
            'In the next rounds you will see the packages dropping from a cloudy sky, the spaceships themselves will be hidden from view. ' +
            'You will have to decide whether to retrieve the packages or not based on their drop location alone.' +
            'You will now only receive feedback on your choices at the end of the this round (not after each decision).  </p>' +
            '<p>Remember - you are trying to retrieve coins and zap the bombs to earn as many coins as possible!</p>';
            var header_text =
                '<h2>Read the following instructions to learn more about the next stage of the game.</h2>'

        }

        else if(trial.tutorial_count === 6)
        { var tutorial_text =
            '<p> After each choice you make, you will be asked to rate your confidence on a sliding scale from "totally unsure" to "sure correct". ' +
            'Move the slider to the position that reflects your confidence in the choice that you made in that trial only. </p> ' +
            '<p>When making this rating, think about how sure you are that you made the right decision on that choice. ' +
            'Submit your confidence rating by pressing the confirm button on screen to move onto the next trial. </p>' +
            '<p>Good luck!</p>'
            var header_text =
                '<h2>Read the following instructions to learn more about the next stage of the game.</h2>'
        }

        else if(trial.tutorial_count === 7)
        { var tutorial_text =
            '<p> Let\'s see if you can improve your score this time around! ' +
            'Watch the screen carefully again and then try to beat your last score! ' +
            'Keep an eye on where the spaceships are dropping their parcels, the spaceships may have moved about but the parcels they drop will remain the same! Good luck!</p>'
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