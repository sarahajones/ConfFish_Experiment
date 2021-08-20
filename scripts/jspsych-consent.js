
jsPsych.plugins['jspsych-consent'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'jspsych-consent',
        prettyName: 'Participant Consent Form',
        parameters: {}
    };

    plugin.trial = function (display_element, trial) {
        // clear display element and apply default page styles
        display_element.innerHTML = '';
        const response = {
            consent: null,
        };

        // change the consent questions here
        var questions = [
            '(1) I confirm that I have read and understand the Participant Information Sheet (V' + PIS_version + ', dated ' + PIS_date +'). I have had the opportunity to consider the information, ask questions, and have had these answered satisfactorily.',

            '(2) I understand that my participation is voluntary and that I am free to withdraw at any time, without giving any reason, and without any adverse consequences or penalty.',

            '(3) I understand that research data collected during the study may be looked at by authorised people outside the research team. I give permission for these individuals to access my data.',

            '(4) In particular, I understand that anonymised research <b>data from this study will be shared publicly on the internet</b>, and I understand in what form.',

            '(5) I understand that this project has been reviewed by, and received ethics clearance through, the University of Oxford Central University Research Committee (approval code: ' + CUREC_ID + ').',

            '(6) I understand who will have access to personal data provided, how the data will be stored, and what will happen to the data at the end of the project.',

            '(7) I understand how this research will be written up and published.',

            '(8) I understand how to raise a concern or make a complaint.',

            '(9) I certify that I am 18 years of age or over and fluent in English.',

            '(10) I agree to take part in the above study.'
        ];

        // create page elements
        var intro = createGeneral(
            intro,
            display_element,
            'div',
            'titlepage document-intro',
            'consent-intro',
            '<div><h1>Please read and tick all the checkboxes before proceeding.</h1></div>'
        );


        var ethicsForm = createGeneral(
            ethicsForm,
            display_element,
            'div',
            'document-in-document',
            'consent-form',
            ''
        );
        var instructHeader = createGeneral(
            instructHeader,
            ethicsForm,
            'div',
            'document-header',
            'consent-header',
            ''
        );
        var logo = createGeneral(
            logo,
            instructHeader,
            'div',
            'header-logo',
            'Oxford-logo',
            ''
        );
        var labInfo = createGeneral(
            labInfo,
            instructHeader,
            'div',
            'header-info',
            'header-lab-info',
            '<h2>DEPARTMENT OF EXPERIMENTAL PSYCHOLOGY</h2>'
            + '<h4>New Radcliffe House, Radcliffe Observatory Quarter, Oxford OX2 6GG</h4>'
            + '<b>Professor Nicholas Yeung</b>'
            + '<br>'
            + 'Principal Investigator, Attention & Cognitive Control Lab'
            + '<br>'
            + '<i>Email: nicholas.yeung@psy.ox.ac.uk | Tel: +44 (0)1865 271389</i>'
        );
        var title = createGeneral(
            title,
            ethicsForm,
            'div',
            'document-title',
            'consent-title',
            '<h1>ELECTRONIC PARTICIPANT CONSENT FORM</h1>'
            + '<h3>V' + consent_version + ' (revised: ' + consent_date + ')</h3>'
            + '<br>'
            + '<h3> Central University Research Ethics Committee (CUREC) Approval Reference: ' + CUREC_ID + ' </h3>'
            + '<h2>"' + CUREC_studyName + '"</h2>'
            + '<i>Purpose of Study: This study is aimed at studying the mechanisms behind decision-making and confidence. Please refer to the Participant Information Sheet for further details.</i>'
        );
        var instructText = createGeneral(
            instructText,
            ethicsForm,
            'div',
            'document-text',
            'consent-text',
            ''
        );
        for (var row = 0; row < 10; row++) {
            var consentRow = createGeneral(
                consentRow,
                instructText,
                'div',
                'document-form-row',
                'consent-row' + row,
                ''
            );
            var consentAnswer = createGeneral(
                consentAnswer,
                consentRow,
                'div',
                'document-form-answer',
                'consent-answer' + row,
                '<form><div class="custom-checkbox"><input id=consentq' + row + '-answer type="checkbox" name="consent' + row + '"/></div></form>'
            );
            var consentQuestion = createGeneral(
                consentQuestion,
                consentRow,
                'div',
                'document-form-question',
                'consent-question' + row,
                '<p>' + questions[row] + '</p>'
            );
        }
        var footer = createGeneral(
            footer,
            ethicsForm,
            'div',
            'document-footer',
            'consent-footer',
            ''
        );
        var instructAcknowledge = createGeneral(
            instructAcknowledge,
            display_element,
            'button',
            'large-button',
            'consent-submit',
            '<div>I have checked the above <br> & I agree to continue</div>'
        );
        $('#consent-submit').css('visibility', 'hidden');

        // define what happens when people click on the consent checkboxes
        $('#consent-text .custom-checkbox').on('click', function(event) {
            // if checkmark is not checked, render it checked
            if ($(event.currentTarget).children('input').prop('checked') == false) {
                $(event.currentTarget).children('input').prop('checked', true);
                $(event.currentTarget).css('border','3px solid rgb(0,0,0)').css('background-color', 'rgb(0,0,0)');
            } else {
                $(event.currentTarget).children('input').prop('checked', false);
                $(event.currentTarget).css('border', '3px solid rgb(170,170,170)').css('background-color', '');
            }
            // if the number of checked items equals the number of questions, then unhide the submit button
            if ($(':checked').length == questions.length) {
                instructAcknowledge.style.visibility = 'visible';
            } else {
                instructAcknowledge.style.visibility = 'hidden';
            }
        });

        // define what happens when people click on the final submit button
        instructAcknowledge.onclick = function() {
            response.consent = true;
            // save the data to jsPsych data object
            jsPsych.finishTrial(response);
            return;
        };

    };

    return plugin;
})();
