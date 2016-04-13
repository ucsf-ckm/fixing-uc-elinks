window_name = "newwin"+((new Date()).getTime());//Math.floor(Math.random()*10000);

//---------------------------------------------------------
function getInternetExplorerVersion()
//---------------------------------------------------------
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
//---------------------------------------------------------
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

//---------------------------------------------------------
function openWindow(obj, form_name, do_report_link) {
//---------------------------------------------------------
// Responds to a user clicking on a target-service
//---------------------------------------------------------
	if(do_report_link != null){
        openWindowReportLinks(obj, form_name);
    } else {
        var options = "toolbar=yes,location=yes,directories=yes,buttons=yes,status=yes";
        options += ",menubar=yes,scrollbars=yes,resizable=yes,width=800,height=600";
        var ip = '';
        // Creating SFX menu basic URL
        ip = location.href;
        ip = ip.substr(0,ip.indexOf('?',0));
        // In case of coming from out source (MetaLib, Primo, etc.)
        if(!ip) { ip = location.href; }

        var isIE = navigator.appName.indexOf("xplorer")>0;
		
        ip = ip + "/img/ajaxtabs/transparentpixel.png";
        //window_name = "newwin"+((new Date()).getTime());//Math.floor(Math.random()*10000);
        try {
	        if ( !isIE || (getInternetExplorerVersion()<8.0 )){
	                var storage = window.sessionStorage;
	                if(storage && storage.setItem){
	                        window_name = storage.getItem('target_name');
	                        if(!window_name){
	                                var tstamp = new Date().getTime();
	                                window_name = "newwin" + tstamp;
	                                storage.setItem('target_name', window_name);
	                        }
	                }
	        }
	    } catch(e) {}
	    
        document.getElementsByName(form_name)[0].target = window_name;
        var newwin = null;
        var ieVer = getInternetExplorerVersion();
        if ( isIE && (ieVer < 9) && window.parent ){
                newwin = window.parent.open(ip,window_name,options);
        } else {
                newwin = window.open(ip,window_name,options);
        }
        if (!isIE) newwin.focus();
        var span_broken_links = document.getElementById(form_name + '-reportlink-thankyou');
        if(span_broken_links != null && span_broken_links.style.display != 'inline'){
                set_element_display_by_id_safe(form_name + '-reportlink', 'inline');
                set_element_display_by_id_safe(form_name + '-reportlink-thankyou', 'none');
        }

        if(form_name != null){
                var gbs_form = document.getElementById('gbs_target_id');
                if(gbs_form && gbs_form.value == form_name){
                        if(bookInfo.volumeInfo) {
                                newwin.location = bookInfo.volumeInfo.infoLink;
                        } else {
                                newwin.location = bookInfo.info_url;
                        }
                } else {
                        document.getElementsByName(form_name)[0].submit();
                }
        }
    }
}

function createAjaxObj(){
	var xmlhttp;
	if (window.XMLHttpRequest)
  	{// code for IE7+, Firefox, Chrome, Opera, Safari
  		xmlhttp=new XMLHttpRequest();
  	}
	else
  	{// code for IE6, IE5
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}
	return xmlhttp;
}

function buildResolverUrlFromForm(obj, form_name, appendParams){
	var initial_form = document.getElementsByName(form_name)[0];
	var form_inputs = initial_form.getElementsByTagName('input');
	if(form_inputs.length == 0){
		// advanced menu
		form_inputs = initial_form.parentNode.getElementsByTagName('input');
	}
	var resolverUrl = '';
	var key_values = '';
	for(var i = 0; i < form_inputs.length; i++){
		key_values = key_values + '&' + form_inputs[i].name + '=' + form_inputs[i].value;
	}
	resolverUrl = initial_form.action + '?' + key_values;
	if(appendParams != null){
		resolverUrl = resolverUrl + appendParams;
	}
	return resolverUrl;
}

function reportGoButton(obj, form_name){
	//code before the pause
	setTimeout(function(){
	    //do what you need here
		
		var resolverUrl = buildResolverUrlFromForm(obj, form_name, '&report_go_button=1');
		var xmlhttp = createAjaxObj();

		xmlhttp.onreadystatechange=function()
	  	{
	  		if (xmlhttp.readyState==4)
	    	{
	  			var beaconURL = xmlhttp.responseText;
	  			if(beaconURL != null && beaconURL != "" && beaconURL != "0"){
	  				var nImg = document.createElement('img');
	                nImg.src = beaconURL;
	                nImg.style.display='none';
	                nImg.alt = '';
	                document.body.appendChild(nImg);
	  			}
	    	}
	  	}
	  	xmlhttp.open("GET", resolverUrl,true);
		xmlhttp.send();
	}, 3000);
}

function openWindowReportLinks(obj, form_name) {
	
	var resolverUrl = buildResolverUrlFromForm(obj, form_name, '&report_link=1&new_broken_link=1');
	var xmlhttp = createAjaxObj();
	xmlhttp.onreadystatechange=function()
  	{
  		if (xmlhttp.readyState==4)
    	{
    		var brokenLinkData = JSON.parse(xmlhttp.responseText);
  			var beaconURL = brokenLinkData.beaconUrl;
  			if(beaconURL != null){
  				var nImg = document.createElement('img');
                nImg.src = beaconURL;
                nImg.style.display='none';
                nImg.alt = '';
                document.body.appendChild(nImg);
  			}
 			var allowFeedback = brokenLinkData.feedback;
 			// check if we should show the broken link report for the end-user
 			if ( allowFeedback == 1 ) {
  				showReportBrokenLink ( 	obj, form_name, brokenLinkData.reportingIntro, brokenLinkData.reportingEmail, brokenLinkData.labelEmail, 
  										brokenLinkData.labelNote, brokenLinkData.report, brokenLinkData.closeLbl, brokenLinkData.errorEmailAddress, 
  										brokenLinkData.errorNoteNoEmailAddress, brokenLinkData.language_code, brokenLinkData.instance);
  				var report_broken_link = document.getElementById(form_name + '-reportlink');
  				var changeLink = "javascript:showReportBrokenLink (this, '"+form_name + "');";
  				report_broken_link.href = changeLink;
  			} else {
	  			set_element_display_by_id_safe(form_name + '-reportlink-loading', 'none');
				set_element_display_by_id_safe(form_name + '-reportlink', 'none');
				set_element_display_by_id_safe(form_name + '-reportlink-thankyou', 'inline');
	  		}
    	}
  	}
  	xmlhttp.open("GET", resolverUrl, true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=utf-8;');
	xmlhttp.send();
	set_element_display_by_id_safe(form_name + '-reportlink-loading', 'inline');
}

function set_element_display_by_id_safe(id, display){
	var element = document.getElementById(id);
	if(element != null){
		element.style.display = display;
	}
}
//---------------------------------------------------------
// variable to hold GBS response if any, to use in openWin
  var BooksInformation, bookInfo;
//---------------------------------------------------------
//---------------------------------------------------------
// Function to process GBS info and update the DOM.
  function ProcessNewGBSBookInfo(booksInfo) {
//---------------------------------------------------------
    BooksInformation = booksInfo;
	var threshold_type = "pass";
	var preview_type = "noview", hide_prefix, threshold_fail_used, bookInfo_original;
	var viewability_prec = {'NO_PAGES':0, 'UNKNOWN':0, 'PARTIAL' : 1, 'ALL_PAGES' : 2};
    

    for (items_idx = 0; items_idx < booksInfo.totalItems ; items_idx++)
    {	
        var item = booksInfo.items[items_idx];
        var identifier_type;
        var idType;
        if(!item.volumeInfo || !item.volumeInfo.industryIdentifiers) {
        	continue;
        }
        
        for (identifier_idx = 0; identifier_idx < item.volumeInfo.industryIdentifiers.length; identifier_idx++)
        {
            identifier_type = item.volumeInfo.industryIdentifiers[identifier_idx].type;
            var tmp = identifier_type.substr(0,4);
            if(tmp == "ISBN")
            {
                idType = tmp;
                break;
            }
        }
        
        if(bookInfo) // when bookInfo has value - it's not first iteration
        {
        	if(item.accessInfo && item.accessInfo.viewability ) {
        		if(bookInfo.accessInfo && bookInfo.accessInfo.viewability) {
        			if(viewability_prec[item.accessInfo.viewability] > viewability_prec[bookInfo.accessInfo.viewability])
        			{
        				bookInfo = item;
        				bookInfo_original = item;
        			}
        		}
        		else {
        			bookInfo = item;
    				bookInfo_original = item;
        		}
        	}
        }
        else
        {
            bookInfo = bookInfo_original = item; // save first element (originating isbn)
            // Isbn - type names given to originating identifier - if it's not 
            // so than gbs has no data about original identifier, so skip it
            if(idType && idType != "ISBN")
            {
                bookInfo_original = null;
            }
        }
    }
    
    
    // if there was data from gbs then analyse preview type
    if(bookInfo)
    {
        var show_thumbnail = document.getElementById("gbs_thumbnail");
        
        if(show_thumbnail && bookInfo_original && bookInfo_original.volumeInfo && bookInfo_original.volumeInfo.imageLinks && bookInfo_original.volumeInfo.imageLinks.smallThumbnail != null){
            //show thumbnail
            document.getElementById("thumbnail_div").style.display = bookInfo_original.volumeInfo.imageLinks.smallThumbnail ? 'block' : 'none';
            show_thumbnail.firstChild.src = bookInfo_original.volumeInfo.imageLinks.smallThumbnail;
            if(bookInfo_original.volumeInfo.infoLink)
            {
                show_thumbnail.href = bookInfo_original.volumeInfo.infoLink;
            }
        }		
        
        // show correct wording in getCitedBook
        var item_viewability;  
        if(bookInfo.accessInfo) {
        	item_viewability = bookInfo.accessInfo.viewability;
        }
        var viewability;
        if (item_viewability && ( item_viewability == "NO_PAGES" || item_viewability == "UNKNOWN"))
        {
            preview = "noview";
        }
        else if (item_viewability && item_viewability == "PARTIAL")
        {
            preview = "partial";
        }
        else if (item_viewability && item_viewability == "ALL_PAGES")
        {
            preview = "full";
        }
        else
        {
            preview = "noview";
        }
         
        var wording_to_activate = document.getElementById("wording_"+preview);	
        if(wording_to_activate)
        {
            wording_to_activate.style.display = "block";
        }
	}
    
    var threshold_var = document.getElementById("gbs_threshold_type");
   	if(threshold_var){
   		threshold_type = threshold_var.value;
   	}
 	     	
	hide_prefix = "gbs_";
	if(bookInfo){
	  	hide_prefix = "google_websearch_";
	   	if(threshold_type == "fail" && preview == "noview"){
	   		threshold_fail_used = 1;
	   		hide_prefix = "gbs_";
	   	}
	}
	hide_target(hide_prefix, threshold_fail_used);
}


//---------------------------------------------------------
// Function to process GBS info and update the DOM.
  function ProcessGBSBookInfo(booksInfo) {
//---------------------------------------------------------

    BooksInformation = booksInfo;
	var threshold_type = "pass";
	var preview_type = "noview", hide_prefix, threshold_fail_used, bookInfo_original;
	var viewability_prec = {'noview':0, 'partial' : 1, 'full' : 2};
	for (isbn in booksInfo){
		if(bookInfo){// when bookInfo has value - it's not first iteration
			if(viewability_prec[booksInfo[isbn].preview] > viewability_prec[bookInfo.preview]){
				bookInfo = booksInfo[isbn];
			}
		}else{
			// save first element (originating isbn)
			bookInfo = bookInfo_original = booksInfo[isbn];
			var idType = bookInfo_original.bib_key.substr(0,4);
			// Isbn|Oclc|Lccn - type names given to originating identifier - if it's not so than gbs has no data about original identifier, so skip it
			if(idType && idType != "Isbn" && idType != "Oclc" && idType != "Lccn"){
				bookInfo_original = null;
			}
		}
    }

     // if there was data from gbs then analyse preview type
     if(bookInfo){
	   	var show_thumbnail = document.getElementById("gbs_thumbnail");
	   	
		if(show_thumbnail && bookInfo_original && bookInfo_original.thumbnail_url != null){
	     	//show thumbnail
	  		document.getElementById("thumbnail_div").style.display = bookInfo_original.thumbnail_url?'block':'none';
	     	show_thumbnail.firstChild.src = bookInfo_original.thumbnail_url;
	     	if(bookInfo_original.info_url){show_thumbnail.href = bookInfo_original.info_url;}
		}		
		
		// show correct wording in getCitedBook
		preview = bookInfo.preview?bookInfo.preview:"noview";
		var wording_to_activate = document.getElementById("wording_"+preview);	
		if(wording_to_activate){
			wording_to_activate.style.display = "block";
		}
	}

   	var threshold_var = document.getElementById("gbs_threshold_type");
   	if(threshold_var){
   		threshold_type = threshold_var.value;
   	}
 	     	
	hide_prefix = "gbs_";
	if(bookInfo){
	  	hide_prefix = "google_websearch_";
	   	if(threshold_type == "fail" && preview == "noview"){
	   		threshold_fail_used = 1;
	   		hide_prefix = "gbs_";
	   	}
	}
	hide_target(hide_prefix, threshold_fail_used);
      
 }
 
//---------------------------------------------------------
// Function uses prefix of hidden input id to distinguish which service has to be hidden
//	'gbs_' stays for google book search, 'google_book_search_' - for web search target
//---------------------------------------------------------
 function hide_target(var_prefix, threshold_fail_used){
//---------------------------------------------------------
 	var variable_holding_form_name = document.getElementById(var_prefix+"target_id");
 	// corresponding form doesn't exist already
 	if (variable_holding_form_name == null){
 		return;
 	}
 	
 	// if it was the only service in it's group - hide the group
 	var my_group_name_v = document.getElementById(var_prefix+"group_name");
 	if(my_group_name_v == null){return;}
 	var my_group_name = my_group_name_v.value;
 	
 	var my_group_member_count_v = document.getElementById(var_prefix+"group_member_count");
 	if(my_group_member_count_v == null){return;}
 	var my_group_member_count = my_group_member_count_v.value;
 	
 	if(my_group_member_count == 1){
 		document.getElementById(my_group_name+"_target_list_container").style.display = 'none';
	 	// if it was the only service in advanced group - hide also basic/advanced toggler
 		if(my_group_name == "advanced"){
 			var toggle =document.getElementById("basic_advanced_toggle");
 			if(toggle != null){toggle.style.display = 'none';}
 		}
 	}
 	// test if service is alone of it's service type
   	var form_name_to_hide = variable_holding_form_name.value;
 	var form_to_hide = document.getElementsByName(form_name_to_hide)[0];
 	
 	var parentTable = form_to_hide.parentNode;
 	var menu_type = "advanced";
 	if(parentTable != null && parentTable.tagName.toUpperCase() == "TD"){ //when simplified template
 		parentTable = form_to_hide.parentNode.parentNode.offsetParent;
 		menu_type = "simplified";
 	}
	parentTable = getParentByTagName(form_to_hide, "TABLE");
	if((parentTable.rows.length == 1 && menu_type == "simplified")
			|| (parentTable.rows.length < 4 && menu_type == "advanced")){// for each target getWebSearch target there're 3 TRs: hiddens, target, search
 		var container_id = document.getElementById(var_prefix+"container_id").value;
 		document.getElementById(container_id).style.display = "none";
 	}else{
 		// hide target itself
 		var first_target_line = document.getElementById('tr_1_'+form_name_to_hide);
 		var second_target_line = document.getElementById('tr_2_'+form_name_to_hide);
 		if(first_target_line != null){
 			first_target_line.style.display = "none";
 		}
 		if(second_target_line != null){
 			second_target_line.style.display = "none";
 		}
  	}
 	// toggle advanced section on when there was only 1 service there (getCitedBook) and it was hidden
 	if(my_group_name == 'basic'){
 		var num_of_services_in_basic_var = document.getElementById('basic_target_count');
 		if(num_of_services_in_basic_var != null){
 			var num_of_services_in_basic = num_of_services_in_basic_var.value;
 			if(num_of_services_in_basic == 1 && threshold_fail_used == 1){
 				toggleAdvanced();
 			}
 		}
 				
 	}
 }

function getParentByTagName(me, tagName){
	if(me == null){return null;}
	var parent = me.parentNode;
	if(parent == null || parent.tagName == null){return null;}
	if(parent.tagName.toUpperCase() == tagName.toUpperCase()){
		return parent;
	}
	return getParentByTagName(parent, tagName);
}

// function for showing the broken links report pop-up
function showReportBrokenLink (	obj, form_name, reportingIntro, reportingEmail, labelEmail, labelNote, report, Close, errorEmailAddress, errorNoteNoEmailAddress, lang, instance) {
	  	var reportWindow = document.getElementById('ReportWindow');
	  	set_element_display_by_id_safe(form_name + '-reportlink-loading', 'inline');
		if (reportWindow == null) { 
			var txt = 	'<div id="ReportWindow" ';
						if ( lang == 'heb' ) { txt += ' class="ExlRightBrokenLinkPopUp"> '; } else { txt += ' class="ExlBrokenLinkPopUp"> '; }
				txt += 	'<div class="ExlRightDivBL">' +
						'<a href="javascript:closeReportWindow();" class="ExlCloseBL" > ' +
						'<img src="/'+instance+'/img/express/darken_v-ico_close.gif" width="16" height="16" border="0" alt=' +Close+ ' title=' +Close+ '></a>' +
						'</div>' +
						'<div id="ReportingIntro" tabIndex="0" >'+ reportingIntro + '<br /><br />' + reportingEmail + '<br /><br /></div>' +
						'<div class="ExlInputDivBL" >' +
						'<label for="id_e-mail" ';
						if ( lang == 'heb' ) { txt += ' class="ExlRightLabelBL"> '; } else { txt += ' class="ExlLeftLabelBL"> '; }
				txt += 	labelEmail+ ' </label>' +
						'<input name="e-mail_value" id="id_e-mail" class="ExlInputBL" ></input>' +
						'</div>' +
						'<div class="ExlInputDivBL">' +
						'<label for="id_client_note" ';
						if ( lang == 'heb' ) { txt += ' class="ExlRightLabelBL"> '; } else { txt += ' class="ExlLeftLabelBL"> '; }
				txt += 	labelNote+ ' </label>' + 
						'<input name="note_value" id="id_client_note" class="ExlInputBL" ></input>' +
						'</div>' +
						'<div id="error_div" tabIndex="0" class="ExlErrorDivBL" >' + 
						'<label id="report_error1" class="ExlErrorLabelBL" >' +errorEmailAddress+ '</label>' +
						'<label id="report_error2" class="ExlErrorLabelBL" >' +errorNoteNoEmailAddress+ '</label>' +
						'</div><br />' +
						'<div ';
						if ( lang == 'heb' ) { txt += 'class="ExlLeftReportDiv"> '; } else { txt += 'class="ExlRightReportDiv"> '; }
				txt += 	'<label id="report_label" title=' +report+ '>' +
						'<a href="#" id="reportLink" onclick="clickReportBrokenLink (this, \''+form_name+'\');" class="ExlReportBL" >[' +report+ ']</a>' +
						'</label>' +
						'</div>' +
						'</div>';
		       var body = document.getElementsByTagName('body');
		       document.body.innerHTML += txt;
		}else {
			document.getElementById('reportLink').setAttribute("onclick","clickReportBrokenLink (this, '"+form_name+"')");
			document.getElementById('id_e-mail').value = '';
			document.getElementById('id_client_note').value = '';
			set_element_display_by_id_safe('error_div', 'none');
		}		
		set_element_display_by_id_safe(form_name + '-reportlink-loading', 'none');	
		set_element_display_by_id_safe('ReportWindow', 'inline');
	  	document.getElementById("ReportingIntro").focus();		
}

// click on 'report' in the broken link report pop-up //
function clickReportBrokenLink (obj,form_name) {
	set_element_display_by_id_safe(form_name + '-reportlink-loading', 'inline');
	var email = document.getElementById('id_e-mail').value;
	var note = document.getElementById('id_client_note').value;
	set_element_display_by_id_safe('report_error1', 'none');
	set_element_display_by_id_safe('report_error2', 'none');
	var report_div = document.getElementById('ReportWindow');
	
	if ( email ) {
		var filter = /^\s*([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+\s*$/;
		if (!filter.test(email)) {
			set_element_display_by_id_safe('report_error1', 'inline');
			set_element_display_by_id_safe('error_div', 'inline');
			set_element_display_by_id_safe(form_name + '-reportlink-loading', 'none');
			return;
		}
	}
	else {
		if ( note ) {
			set_element_display_by_id_safe('report_error2', 'inline');
			set_element_display_by_id_safe('error_div', 'inline');
			set_element_display_by_id_safe(form_name + '-reportlink-loading', 'none');
			return;
		}
	}
	closeReportWindow ();
	sendEmailToLibrary(obj, form_name);
	set_element_display_by_id_safe(form_name + '-reportlink-loading', 'none');
	set_element_display_by_id_safe(form_name + '-reportlink', 'none');
	set_element_display_by_id_safe(form_name + '-reportlink-thankyou', 'inline');
}

// close the broken link report pop-up //
function closeReportWindow () {
	set_element_display_by_id_safe('ReportWindow', 'none');
	set_element_display_by_id_safe('report_error1', 'none');
	set_element_display_by_id_safe('report_error2', 'none');
	set_element_display_by_id_safe('error_div', 'none');
}

//send mail's broken link to library with the end-user data // 
function sendEmailToLibrary (obj, form_name) {
	var initial_form = document.getElementsByName(form_name)[0];
	var resolverUrl = initial_form.action;
	var changeCgiUrl = resolverUrl.replace("sfxresolver.cgi","sfxreportlinks.cgi");
	var form_inputs = initial_form.getElementsByTagName('input');
	var key_values = '';
	for(var i = 0; i < form_inputs.length; i++){
		key_values = key_values + '&' + form_inputs[i].name + '=' + form_inputs[i].value;
	}
	var xmlhttp = createAjaxObj();
  	xmlhttp.open("POST", changeCgiUrl, true);
  	var send_data = prepareDataForEmail(form_name);
	xmlhttp.send(send_data);
}

function prepareDataForEmail(form_name) {
	var initial_form = document.getElementsByName(form_name)[0];
	var form_inputs = initial_form.getElementsByTagName('input');
	//IE does not know the formData object
	if (typeof FormData == 'undefined') {	
		var key_values = '';
		for(var i = 0; i < form_inputs.length; i++){
			key_values = key_values + '&' + form_inputs[i].name + '=' + form_inputs[i].value;
		}
		var result = 'email='+document.getElementById('id_e-mail').value;
		var note = escape(document.getElementById('id_client_note').value);
		result = result.concat('&note=' + note);
		if ( key_values ) {
			result = result.concat(key_values);
		}
		result = result.concat('&report_link=1');
		return result;
	} else {
		var data = new FormData();
		data.append('email', document.getElementById('id_e-mail').value);
		data.append('note', document.getElementById('id_client_note').value);
		for(var i = 0; i < form_inputs.length; i++){
			data.append(form_inputs[i].name, form_inputs[i].value);
		}
		data.append('report_link', 1);
		return data;
	} 
}
