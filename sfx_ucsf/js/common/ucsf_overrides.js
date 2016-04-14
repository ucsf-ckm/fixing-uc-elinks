var toggleDetails = function (event) {
    var selector = $(event.target).parent().parent().parent().parent().parent().parent().parent().find('tr:nth-child(n+2)');
    if (!event.target.detailsVisible) {
        selector.show();
        selector.find('td').css('font-size', '120%');
        if (! event.target.wrapped) {
            selector.find('td').wrapInner('<span class="details-content"></span>');
            event.target.wrapped = true;
        }
        event.target.detailsVisible = true;
        $(event.target).text('Hide Details');
    } else {
        selector.hide();
        event.target.detailsVisible = false;
        $(event.target).text('Details');
    }
}

var resultsState = 'hidden';
var toggleResults = function (event) {
    var selector = $('#service_type_header_getFullTxt form');
    if (resultsState === 'hidden') {
        selector.show();
        resultsState = 'visible';
        $(event.target).text('Hide Additional Results');
    } else {
        selector.not(':first').hide();
        resultsState = 'hidden';
        $(event.target).text('Show More Results');
    }
}

$('#service_type_header_getFullTxt td div div div').append('<td><span class="clickable details">Details</span></td>');
$('#service_type_header_getFullTxt td div div div .clickable').on('click', toggleDetails);
$('#service_type_header_getFullTxt form').first().append('<div class="clickable results">Show More Results</div>');
$('#service_type_header_getFullTxt form').first().find('div.clickable.results').on('click', toggleResults);

// Change link text on the fly.
$('#tr_1_basic3 a').text('Search the UCSF Library');
$('#tr_1_basic4 a').text('Search All UC Libraries');
$('#tr_1_advanced1 a').text('Order a Copy');
$('#tr_1_advanced2 a').text('Get the Citation');


// Get rid of spacer that forces details right. We want them left!
$('#service_type_header_getFullTxt form table tr td:first-child').hide();
$('#service_type_header_getFullTxt table tr:nth-child(n+2) form .search').css('padding-bottom', '0');

// For the prototype only...disable links
$('a').on('click', function () {alert('Sorry! This is a prototype only. Links (other than Details and Show/Hide Results) are disabled.'); return false;});
