function toggleMoreOptions(){
	var moreOpt = $('moreOptions');
	var lessOpt = $('lessOptions');
	var advCont = $('advancedContainer');
	
	if(moreOpt.style.display != 'none'){
		moreOpt.style.display = 'none';
		lessOpt.style.display = 'inline';
		advCont.style.display = 'block';
	}else{
		moreOpt.style.display = 'inline';
		lessOpt.style.display = 'none';
		advCont.style.display = 'none';
	}
}

//---------------------------------------------------------
function set_menu_language( event ){
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
    var language_drop_down = document.getElementById("language");
    if ( language_drop_down ) {
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
