//---------------------------------------------------------
function openWin(obj) {
//---------------------------------------------------------
// Responds to a user clicking on a target-service
//---------------------------------------------------------
    var options = "toolbar=yes,location=yes,directories=yes,buttons=yes,status=yes";
        options += ",menubar=yes,scrollbars=yes,resizable=yes,width=800,height=600";
    var ip = '';
   	// Creating SFX menu basic URL
    ip = location.href;
    ip = ip.substr(0,ip.indexOf('?',0));
    // In case of coming from out source (MetaLib, Primo, etc.)
    if(!ip) { ip = location.href; }
    ip = ip + "/img/ajaxtabs/transparentpixel.png";
    var window_name = "newwin";
    var storage = window.sessionStorage;
    try {
	    if(storage && storage.setItem) {
	    	window_name = storage.getItem('target_name');
	    	if(!window_name) {
	    		var tstamp = new Date().getTime();
	    		window_name = "newwin" + tstamp;
	    		storage.setItem('target_name', window_name);
	    	}
	    }
    } catch(e) {}
    
    var isIE = navigator.appName.indexOf("xplorer")>0;
    var newwin = null;

    var ieVer = getInternetExplorerVersion();
    if ( isIE && (ieVer < 9) && window.parent ){
        newwin = window.parent.open(ip,window_name,options);
    }
    else {
        newwin = window.open(ip,window_name,options);
    }
    if (!isIE) newwin.focus();
}

//---------------------------------------------------------
function openWin_location(obj, recommendation_number, identification_class, win_name) {
//---------------------------------------------------------
// Responds to a user clicking on a target-service
//---------------------------------------------------------
    var options = "toolbar=yes,location=yes,directories=yes,buttons=yes,status=yes";
        options += ",menubar=yes,scrollbars=yes,resizable=yes,width=800,height=600";
	var win_location = '';

	if(recommendation_number){
	   win_location = document.getElementById(identification_class+"-"+recommendation_number).name;
	}
    if (win_name) {
        var newwin = window.open(win_location,win_name,options);
    } else {
        var newwin = window.open(win_location,"newwin",options);
    }
    if (navigator.appName.indexOf("xplorer")<0) newwin.focus();
}
//---------------------------------------------------------
function set_user_profile( event ){
//---------------------------------------------------------
// Responds to a user selecting a language
//---------------------------------------------------------
    var lng = window.document.lng_form.language.value;
    
    if ( event ) {
    	if ( event.keyCode != 13 ) {
			// Only enter key is valid
        	return;
    	}
    }
    
    // Get the previous language of the page
    var language_drop_down = document.getElementById("languageMenu");
    if ( language_drop_down ) {
    	// If user did not implemented accessibility notes, he cannot use this feature 
	    var language_options = language_drop_down.options;
	    var previous_selected_language;
	    for ( var i=0; i < language_drop_down.options.length; i++ ) {
	    	if ( language_drop_down.options[i].defaultSelected ) {
	    		previous_selected_language = language_drop_down.options[i].value;
	    		break;
	    	}
	    }
	    
	    if ( previous_selected_language == lng ) {
	    	// No change in language, return
	    	return;
	    }
    }

    var nextyear=new Date();
    nextyear.setFullYear(nextyear.getFullYear()+1);
    var cookie_name = 'user-Profile';

    // default if there is no cookie already set
    var new_cookie = cookie_name + "=+++" + lng + ";path=/;expires=" + nextyear.toGMTString();

    // check if we need to modify an existing cookie
    var start = document.cookie.indexOf(cookie_name + '=');
    if (start != -1) {
        //ignore 'name=' portion
        start += cookie_name.length + 1;
        // find end of value
        var end = document.cookie.indexOf(';', start);
        if (end == -1) end = document.cookie.length;
        var cookie_val = unescape(document.cookie.substring(start, end));
        // change language portion
        var values = cookie_val.split('+');
        values[3] = lng;
        // set new cookie value
        new_cookie = cookie_name + "=" + values.join('+') + ";path=/;expires=" + nextyear.toGMTString();
    }

    document.cookie = new_cookie;
    // might cause problems with POST (warning popup)
    window.location.reload();
}

function toggleBasic() {
    var basicBodyStyle = getStyleObject("basicBody");
    var basicDownArrowStyle = getStyleObject("basicDownArrow");
    var basicUpArrowStyle = getStyleObject("basicUpArrow");
    if ((basicBodyStyle.visibility == "hidden") || (basicBodyStyle.display == "none")) {
        basicBodyStyle.visibility == "";
        basicBodyStyle.display = "";
        basicDownArrowStyle.visibility = "hidden";
        basicDownArrowStyle.display = "none";
        basicUpArrowStyle.visibility = "";
        basicUpArrowStyle.display = "";
    }
    else {
        basicBodyStyle.visibility == "hidden";
        basicBodyStyle.display = "none";
        basicDownArrowStyle.visibility = "";
        basicDownArrowStyle.display = "";
        basicUpArrowStyle.visibility = "hidden";
        basicUpArrowStyle.display = "none";
    }
}

function toggleAdvanced() {
    var advancedBodyStyle = getStyleObject("advancedBody");
    var advancedDownArrowStyle = getStyleObject("advancedDownArrow");
    var advancedUpArrowStyle = getStyleObject("advancedUpArrow");
    if ((advancedBodyStyle.visibility == "hidden") || (advancedBodyStyle.display == "none")) {
        advancedBodyStyle.visibility == "";
        advancedBodyStyle.display = "";
        advancedDownArrowStyle.visibility = "hidden";
        advancedDownArrowStyle.display = "none";
        advancedUpArrowStyle.visibility = "";
        advancedUpArrowStyle.display = "";
    }
    else {
        advancedBodyStyle.visibility == "hidden";
        advancedBodyStyle.display = "none";
        advancedDownArrowStyle.visibility = "";
        advancedDownArrowStyle.display = "";
        advancedUpArrowStyle.visibility = "hidden";
        advancedUpArrowStyle.display = "none";
    }
}


//---------------------------------------------------------
function getStyleObject(objectId) {
//---------------------------------------------------------
// Gets an object's style object by its id.
//---------------------------------------------------------
    if(document.getElementById && document.getElementById(objectId)) {
        return document.getElementById(objectId).style;
    }
    else if (document.all && document.all(objectId)) {
        return document.all(objectId).style;
    }
    else if (document.layers && document.layers[objectId]) {
        return document.layers[objectId];
    }
    else {
        return false;
    }
}

//---------------------------------------------------------
function changeObjectVisibility(objectId, newVisibility) {
//---------------------------------------------------------
// Changes an object's visibility by its id.
//---------------------------------------------------------
    var styleObject = getStyleObject(objectId);
    if(styleObject) {
      styleObject.visibility = newVisibility;
      return true;
    }
    else {
      return false;
    }
}

//---------------------------------------------------------
function moveObject(objectId, newXCoordinate, newYCoordinate) {
//---------------------------------------------------------
// Changes an object's position given its id and the new
// coordinates.
//---------------------------------------------------------
    // get a reference to the cross-browser style object and make sure the object exists
    var styleObject = getStyleObject(objectId);
    if(styleObject) {
    styleObject.left = newXCoordinate;
    styleObject.top = newYCoordinate;
    return true;
    } else {
    // we couldn't find the object, so we can't very well move it
    return false;
    }
} // moveObject


//---------------------------------------------------------
function toggleMoreRecommendations(){
//---------------------------------------------------------
// Show/Hide extra recommendations.
//---------------------------------------------------------
    var ext_rec = getStyleObject("extended_recommendations");

    if(ext_rec.display != 'block'){
        ext_rec.display = 'block';
        var morelinks = document.getElementById("morelink");
        morelinks.style.visibility = "hidden";
    }
        return false;
}

//---------------------------------------------------------
function isChecked() {
//---------------------------------------------------------
// Check if any recommendation was selected
//---------------------------------------------------------

    var list = document.pushkin;
    var len = list.elements.length;

    var total = 0;

    for( var i = 0 ; i < len ; i++ ) {
        var e = list.elements[i];
        if (e.checked) {
            total++;
	    var options = "toolbar=yes,location=yes,directories=yes,buttons=yes,status=yes";
		options += ",menubar=yes,scrollbars=yes,resizable=yes,width=800,height=600";
	    var newwin = window.open('',"RefWorksMain",options);
	    if (navigator.appName.indexOf("xplorer")<0) newwin.focus();
            document.pushkin.submit();
        }
    }

    if ( ! total ) {
        alert("You must select at least one recommendation");
        return;
    }

}
