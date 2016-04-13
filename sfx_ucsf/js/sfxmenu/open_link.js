//---------------------------------------------------------
// Contains logic to be done when clicking on a link:
//	* Broken links logic
//	* Google book search logic
//---------------------------------------------------------
function openSFXMenuLink(obj, form_name, do_report_link, link_target_attribute) {
	if(do_report_link != null){
		openWindowReportLinks(obj, form_name);
	} else {
		var span_broken_links = document.getElementById(form_name + '-reportlink-thankyou');
		if(span_broken_links != null && span_broken_links.style.display != 'inline'){
			set_element_display_by_id_safe(form_name + '-reportlink', 'inline');
			set_element_display_by_id_safe(form_name + '-reportlink-thankyou', 'none');
		}
		
		if(form_name != null){
			if(typeof reportGoButton == "function"){
				reportGoButton(obj, form_name);
			}
			var gbs_form = document.getElementById('gbs_target_id');
			if(gbs_form && gbs_form.value == form_name){
				var url;
				if(bookInfo.volumeInfo) {
					url = bookInfo.volumeInfo.infoLink;
				} else {
					url = bookInfo.info_url;
				}
				window.open( url, link_target_attribute );
			} else {
				document.getElementsByName(form_name)[0].submit();
			}
		}
	}
}
