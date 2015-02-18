function setCookie(c_name, value, exdays) {

	c_name = c_name.toLowerCase();

	var exdate = new Date();

	exdate.setDate(exdate.getDate() + exdays);

	var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());

	document.cookie = c_name + "=" + c_value;

}

function getCookie(c_name) {

	c_name = c_name.toLowerCase();

	var i, x, y, ARRcookies = document.cookie.split(";");

	for (i = 0; i < ARRcookies.length; i++) {

		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));

		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);

		x = x.replace(/^\s+|\s+$/g, "");

		if (x == c_name) {

			//alert("x = " + x);
			return unescape(y);

		}

	}

}

function getQuerystring(key, default_) {
 
	key = key.toLowerCase();

	//alert("key : " + key);
	//alert("default_ : " + default_);

	if (default_ == null) default_ = "";

	key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

	var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");

	var qs = regex.exec(window.location.href.toLowerCase());

	if (qs == null) {

		//alert("default_ : " + default_);
		return default_;

	} else {

		//alert("qs[1] : " + qs[1]);
		return qs[1];

	}

}

function detectMobileAndRedirect(a,b){

	// alert(location.href);

	if(/android|webOS|avantgo|blackberry|blazer|elaine|hiptop|ip(hone|od)|kindle|midp|mmp|mobile|o2|opera mini|palm( os)?|pda|plucker|pocket|psp|smartphone|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce; (iemobile|ppc)|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-)|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))){

		if(/ipad/i.test(a)){

			return false;

		}

		location.href=b;
 
	}
 
}

function removeQueryString(url) {

	return url.split("?")[0];

}

var FullSiteCookie = getCookie("viewFullSite");

var viewFullSite = getQuerystring("viewFullSite");

var renderFullSite = new Boolean();

renderFullSite = false;

if (FullSiteCookie != null && FullSiteCookie != "") {

	if (FullSiteCookie.toLowerCase() == "true") {

		if (viewFullSite.toLowerCase() == "false") {

			setCookie("viewFullSite", false, 1);

		} else {

			renderFullSite = true;
			//alert("Set 11");

		}

	} else {

		if (viewFullSite != null && viewFullSite != "") {

			if (viewFullSite.toLowerCase() == "true") {

				renderFullSite = true;

				//alert("Set 2");
				setCookie("viewFullSite", true, 1);

			} else {

				if (viewFullSite.toLowerCase() == "false") {

					setCookie("viewFullSite", false, 1);

				}

				renderFullSite = false;
				//alert("Set 3");

			}

		} else {

			renderFullSite = false;
			//alert("Set 4");

		}

	}

} else {

	viewFullSite = getQuerystring("viewFullSite");
	//alert("viewFullSite 1 : " + viewFullSite);

	if (viewFullSite != null && viewFullSite != "") {

		if (viewFullSite.toLowerCase() == "true") {

			renderFullSite = true;

			//alert("Set 5");

			setCookie("viewFullSite", true, 1);

		} else {

			renderFullSite = false;
			//alert("Set 6");

		}

	} else {

		renderFullSite = false;
		//alert("Set 7");

	}

}

//alert("renderFullSite : " + renderFullSite);

if (!renderFullSite) {

	//alert("location href before: " + location.href);

	var mobilesite = "{mobile_url}";

	var locationhref = removeQueryString(location.href);

	//alert("location href after: " + locationhref);

	if (locationhref == "{site_url}index.php/") {

		mobilesite = "{mobile_url}";

	}

	detectMobileAndRedirect(navigator.userAgent || navigator.vendor || window.opera, mobilesite);

}

function BookMark() {

	$('#BookmarkImg').animate({ "top": "-81px" }, 1000);

	baseCookieName = "rwbookmark";

	var exdate = new Date();

	var expiredays = "1";

	exdate.setDate(exdate.getDate() + expiredays);

	//use of arbritary stop point so no endless loop occurs

	for (var i = 0; i < 10000; i++) {

		var curName = baseCookieName + i;

		if (document.cookie.indexOf(curName) < 0) {

			document.cookie = curName + "=" + escape(window.location.href) + "[#]contentid=" + document.getElementById("inputContentID").value + "[#]title=" + GetPageTitle() + ";expires=" + exdate.toGMTString() + ";path=/;domain=haroldsphoto.com;";

			break;

		}

	}

	var link = document.getElementById('BookmarkLink');

	link.onclick = null;

	link.style.cursor = "default";

}

function GetPageTitle() {

	var titlefromdom = "";

	var titlefromdomarray = "";

	$(document).ready(function() {

		titlefromdom = document.title;

	});

	titlefromdomarray = titlefromdom.split("|");

	if (titlefromdomarray.length > 0) {

		titlefromdom = titlefromdomarray;

	}

	return titlefromdom;

}