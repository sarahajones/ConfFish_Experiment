//HELPER FUNCTIONS

///**
// * @function generateColorSamples()
// * @param {int} color_mean
// * @param {int} array_sd
// * @param {int} total_circles - number of items (color circles)
// */

function generateTestLocations(min, max, nTrials) {
    min = Math.ceil(min);
    max = Math.floor(max);

    var list = [],
        i;

    for (i = 0; i < nTrials; i++) {
        list[i] = Math.floor(Math.random() * (max - min + 1) + min);
    }
    return list;
}

function generateTrainingLocations(dist_mean,dist_sd,train_trials) {
    function randomList(n, a, b) {
        // create a list of n numbers between a and b
        var list = [],
            i;
        for (i = 0; i < n; i++) {
            list[i] = Math.random() * (b - a) + a;
        }
        return list;
    }
    // create a list of locations within the confines of the screen (0-800)
    var list = randomList(train_trials, 15, 785);

    function descriptives(list) {
        // compute mean, sd and the interval range: [min, max]
        var mean,
            sd,
            i,
            len = list.length,
            sum,
            a = Infinity,
            b = -a;
        for (sum = i = 0; i < len; i++) {
            sum += list[i];
            a = Math.min(a, list[i]);
            b = Math.max(b, list[i]);
        }
        mean = sum / len;
        for (sum = i = 0; i < len; i++) {
            sum += (list[i] - mean) * (list[i] - mean);
        }
        sd = Math.sqrt(sum / (len - 1));
        return {
            mean: mean,
            sd: sd,
            range: [a, b]
        };
    }

    function forceDescriptives(list, mean, sd) {
        // transfom a list to have an exact mean and sd
        var oldDescriptives = descriptives(list),
            oldMean = oldDescriptives.mean,
            oldSD = oldDescriptives.sd,
            newList = [],
            len = list.length,
            i;
        for (i = 0; i < len; i++) {
            newList[i] = sd * (list[i] - oldMean) / oldSD + mean;
        }
        return newList;
    }

    // transform the list to have an exact mean of 5 and sd of 2
    var newList = forceDescriptives(list, dist_mean, dist_sd);

    // display the transformed list and descriptive statistics (mean and sd)
    console.log(descriptives(newList));

    return newList;
}

///////////////////////////////

/* calculate RT to a certain number of decimal points */
function calculateRT(start, end) {
    start = parseFloat(start);
    end = parseFloat(end);
    var rt = end - start;
    return rt;
}



/* scroll to top of a page when page finishes loading. requires jQuery */
function scrollTop() {
    $(document).ready(function () {
        $(this).scrollTop(0);
    });
}


/* remove hash from URL without reloading the page */
function removeHash() {
    var scrollV, scrollH, loc = window.location;
    if ("pushState" in history) {
        history.pushState("", document.title, loc.pathname + loc.search);
    } else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

/* remove the query string */
function removeQueryString() {
    var url = window.location.href;
    if (url.indexOf("?") > 0) {
        var updatedUri = url.substring(0, url.indexOf("?"));
        window.history.replaceState({}, document.title, updatedUri);
    }
}

//GENERAL HELPERS
//sum an array

function sum(input){

    if (toString.call(input) !== "[object Array]")
        return false;

    var total =  0;
    for(var i=0;i<input.length;i++)
    {
        if(isNaN(input[i])){
            continue;
        }
        total += Number(input[i]);
    }
    return total;
}


/* https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
* @param array {[]}
* @return {[]}*/
function shuffle(array) {
    let counter = array.length;

    if(counter === 2)
        return Math.random() < .5? array : array.reverse();

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

/*
 * Return a single array containing deckCount copies of deck shuffled together
 */
function shuffle_shoe(deck, deckCount=1) {
    let shoe = [];
    for (let d = 0; d < deck.length; d++) {
        let item = deck[d];
        for (let i = 0; i < deckCount; i++) {
            shoe.push(item);
        }
    }
    return shuffle(shoe);

}


//DISPLAY HELPERS
//create a doc/form on screen to fill
function createGeneral(name, parent, type, classNames, idName, innerHTML) {
    var name = parent.appendChild(document.createElement(type));
    if (classNames !== undefined) {
        name.setAttribute('class', classNames);
    }
    if (idName !== undefined) {
        name.setAttribute('id', idName);
    }
    name.innerHTML = innerHTML;
    return name;
}

// SHOW IMAGE:  generalised function for use and reuse
function displayImage(imgSrc, duration, callback) {
    const img = display_element.appendChild(document.createElement('img'));
    img.src = imgSrc;
    img.className = 'jspsych-quickfire-stimulus';
    img.style = display_element;
    setTimeout(callback, duration);
}

//SHOW BLANK SCREEN
function showBlankScreen(duration, callback) {
    // Blank out the screen
    display_element.innerHTML = '';
    // Callback after delay
    setTimeout(callback, duration);
}

/***********************
 * COMPOSITE FUNCTIONS
 ************************/

/* jQuery-powered -- create a survey matrix with the number of questions as the number of rows and the number of options as the number of columns. num is just a numerical index to identify this specific element in case others of this type exist in the page. requires createGeneral() and jQuery */
function createSurveyMatrix(parent, id, questionnaireName, questions, options) {

    for (var row = 0; row < questions.length; row++) {
        // create a row of SurveyMatrix
        var surveyMatrix_row = createGeneral(
            surveyMatrix_row,
            parent,
            'div',
            'surveyMatrix-row',
            id + '-surveyMatrix-row' + row,
            ''
        );
        // create the question area for that row
        var surveyMatrix_question = createGeneral(
            surveyMatrix_question,
            surveyMatrix_row,
            'div',
            'surveyMatrix-question',
            id + '-surveyMatrix-row' + row + '-question',
            questions[row]
        );
        // create the option area for that row
        var surveyMatrix_optionArea = createGeneral(
            surveyMatrix_optionArea,
            surveyMatrix_row,
            'div',
            'surveyMatrix-optionArea',
            id + '-surveyMatrix-row' + row + '-optionArea',
            ''
        );
        // for each row in SurveyMatrix:
        for (var column = 0; column < options.length; column++) {
            // create an option in its own column
            var surveyMatrix_option = createGeneral(
                surveyMatrix_question,
                surveyMatrix_optionArea,
                'div',
                'surveyMatrix-option',
                id + '-surveyMatrix-row' + row + '-option' + column,
                ''
            );
            // create a default radio input
            var surveyMatrix_defaultRadio = createGeneral(
                surveyMatrix_defaultRadio,
                surveyMatrix_option,
                'input',
                'surveyMatrix-defaultRadio',
                id + '-surveyMatrix-row' + row + '-defaultRadio' + column,
                ''
            );
            surveyMatrix_defaultRadio.setAttribute('type', 'radio');
            surveyMatrix_defaultRadio.setAttribute('name', questionnaireName + '_' + id + '-' + row);
            surveyMatrix_defaultRadio.setAttribute('value', options[column]);
            // create a custom radio input for overlay
            var surveyMatrix_customRadio = createGeneral(
                surveyMatrix_customRadio,
                surveyMatrix_option,
                'div',
                'surveyMatrix-customRadio',
                id + '-surveyMatrix-row' + row + '-customRadio' + column,
                ''
            );
            var surveyMatrix_optionLabel = createGeneral(
                surveyMatrix_optionLabel,
                surveyMatrix_option,
                'label',
                'surveyMatrix-optionLabel',
                id + '-surveyMatrix-row' + row + '-optionLabel' + column,
                options[column],
                ''
            );
            surveyMatrix_optionLabel.setAttribute('for', questionnaireName + '_' + id + '-' + row);
        }
    }
    // use jQuery to make sure that the custom radio causes the default radio value to change
    $('.surveyMatrix-option').bind('click', function (event) {
        // when clicking on an option area, if contained radio button is not checked, render it checked
        if ($(event.currentTarget).children('input').prop('checked') == false) {
            $(event.currentTarget).children('input').prop('checked', 'true');
        }
    });
}


//END OF HELPER FUNCTIONS