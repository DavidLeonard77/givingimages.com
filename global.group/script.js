// JavaScript Document ---------------------------------------------------------------------------------------- //
// Developed by David Leonard
// Copyright Lakeside Camera Photoworks, LLC

// TOOLBOX ---------------------------------------------------------------------------------------------------- //
function Assets (details) {

	this.docked = details.docked;
	this.scrollDirection = details.scrollDirection;
	this.viewportSize = details.viewportSize;
	this.oldBrowser = details.oldBrowser;
}

	Assets.prototype.ismobilesafari = function (mobile,full) {

		var agent = navigator.userAgent.match(/(iPod|iPhone|iPad)/);

		if (agent == null) { full(); }
		else { mobile(); }
	}

	Assets.prototype.browserCheck = function (oldSchool,newSchool) {

		if (this.oldBrowser) {

			oldSchool();

		} else {

			newSchool();

		}
	}

	Assets.prototype.viewportCheck = function (width,success,fail) {

		var viewport = $(window).width();

		if (viewport > width) {

			success(viewport);

		} else {

			fail(viewport);

		}
	}

	Assets.prototype.classModifier = function (el,className) {

		document.getElementById(el).className += ' ' + className;
	}

	Assets.prototype.classReplacer = function (el,className) {

		document.getElementById(el).className = className;
	}

	Assets.prototype.backgroundSwap = function (el,imgURL) {

		document.getElementById(el).style.backgroundImage = imgURL;
	}

	Assets.prototype.docLoc = function (url) {

		document.location = url;
	}

	Assets.prototype.topLoc = function (url) {

		top.location = url;
	}

	Assets.prototype.getParam = function (pram,error,success) {

		var thisId = $.url().param(pram);

		if (thisId == undefined) { error(); }
		else { success(thisId); }
	}

	Assets.prototype.scrollTop = function () {

		var body = $('html, body');
		body.animate({scrollTop:0}, '500', 'swing', function() {
			// Do nothing
		});
	}

	Assets.prototype.checkSegment = function (seg,no,yes) {

		if (seg == '') { no(); }
		else { yes(); }
	}

	Assets.prototype.quietAlert = function (msg) {

		toolbox.browserCheck(function(){

			alert(msg);

		},function(){

			console.log(msg);

		});
	}

	Assets.prototype.confirmAlert = function (msg,canceled,confirmed) {

		var response = confirm(msg);
		
		if (response == false) { canceled(); }
		else { confirmed(); }
	}

	Assets.prototype.freeFacebook = function () {

		// Get Facebook App id from snippet
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = '//connect.facebook.net/en_US/all.js#xfbml=1&appId={facebook_app_id}';
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}

	Assets.prototype.preciseRound = function (value, decPlaces){

		var val = value * Math.pow(10, decPlaces);
		var fraction = (Math.round((val-parseInt(val))*10)/10);

		// this line is for consistency with .NET Decimal.Round behavior
		// -342.055 => -342.06
		if(fraction == -0.5) fraction = -0.6;

		val = Math.round(parseInt(val) + fraction) / Math.pow(10, decPlaces);
		return val;
	}

	Assets.prototype.floatPrice = function (price) {

		// Initialize primary price
		var str = '' + price;
		var subtotal = str.replace('$','');
		subtotal = subtotal.replace('%','');
		subtotal = subtotal.replace(',','');
		subtotal = parseFloat(subtotal);

		return subtotal;
	}

	Assets.prototype.scrubHTML = function (str) {

		return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
	}

var toolbox = new Assets({

	docked: true,
	scrollDirection: '',
	viewportSize: {
		small: 320,
		medium: 764,
		large: 1084
	},
	oldBrowser: (function ($) {

					'use strict';

					// Detecting IE
					if ($('html').is('.ie6, .ie7, .ie8, .ie9')) { return true }
					else { return false }

				}(jQuery))
});


// SLIDESHOW -------------------------------------------------------------------------------------------------- //
function Slider (details) {

	this.pause = details.pause;
	this.activeSlide = details.activeSlide;
	this.totalCount = details.totalCount;
	this.banner = details.banner;
	this.timer = details.timer;
}

	// Show next slide
	Slider.prototype.next = function () {

		// Set the active slide count
		if (slideshow.activeSlide == slideshow.totalCount) { slideshow.activeSlide = 1; }
		else { slideshow.activeSlide += 1; }

		slideshow.showStatic(slideshow.activeSlide);
	}

	// Show previous slide
	Slider.prototype.prev = function () {

		// Set the active slide count
		if (slideshow.activeSlide == 1) { slideshow.activeSlide = slideshow.totalCount; }
		else { slideshow.activeSlide -= 1; }

		slideshow.showStatic(slideshow.activeSlide);
	}

	// Hide slide
	Slider.prototype.hide = function (el,slide) {

		document.getElementById(slide).style.opacity = '0';
		setTimeout(function(){ document.getElementById(slide).style.visibility = 'hidden'; }, 500);
		if (!slideshow.pause) { toolbox.classReplacer('slideDot' + slideshow.activeSlide,'dim'); }
	}

	// Show slide
	Slider.prototype.show = function (el,slide) {

		if (!slideshow.pause) {

			// Set the active slide dot
			if (slideshow.activeSlide == slideshow.totalCount) { var thisSlide = 1;
			} else { var thisSlide = slideshow.activeSlide + 1; }

			document.getElementById(slide).style.visibility = 'visible';
			setTimeout(function(){ document.getElementById(slide).style.opacity = '1'; }, 500);

			toolbox.classReplacer('slideDot' + thisSlide,'opaque');

		}
	}

	Slider.prototype.resizeBanner = function () {

		var viewWidth = $(window).width();
		var newHeight = 335;

		if (viewWidth >= 1004) { newHeight = viewWidth / 3; }

		if (viewWidth >= 811) {

			$('#slideContainer').height(newHeight);
			$('.slide').height(newHeight);
			$('.dots').css('margin-top',newHeight-50);
			$('.bigDot-bg-left').css('margin-top',newHeight/2-20);
			$('.bigDot-bg-right').css('margin-top',newHeight/2-20);
			$('.bigDot-bg-right').css('margin-left',viewWidth-100);

		} else {

			$('#slideContainer').height(0);

		}
	}

	// Create banner html
	Slider.prototype.createBanner = function (x,visibility) {

		function checkLink () {

			if (slideshow.banner[x].banner_link != '') {
				var link = ' onclick="javascript: toolbox.docLoc(\'' + slideshow.banner[x].banner_link + '\');"';
				return link;
			} else {
				return '';
			}
		}

		var html = '<div id="slide' + x + '" class="slide" style="' + visibility + ' background-image: url(\'' + slideshow.banner[x].image_src + '\');"' + checkLink() + '></div>';
		return html;
	}

	// Create nav dot
	Slider.prototype.createDot = function (x,opacity) {

		var html = '<div class="slideDotSpacer"><div id="slideDot' + x + '" class="' + opacity + '" onclick="javascript: slideshow.showStatic(' + x + ');"></div></div>';
		return html;
	}

	// Create a html slide for each banner entry
	Slider.prototype.createSlides = function () {

		// Show the first one
		var visibility = 'opacity: 1; visibility: visible;';
		var opacity = 'opaque';

		// All others are hidden
		for (var x in slideshow.banner) {

			var banner = slideshow.createBanner(x,visibility);
			visibility = 'opacity: 0; visibility: hidden;';

			var dot = slideshow.createDot(x,opacity);
			opacity = 'dim';

			$('#theShow').append(banner);
			$('#slideDots').append(dot);

		}

		// Start the show
		slideshow.rollIt();
	}

	// Start the slideshow
	Slider.prototype.rollIt = function () {

		// Hide the current slide and show the next
		function showNext (el,thisCount) {

			var delay = thisCount * 10000;
			var thisSlide = el + thisCount;
			var nextSlide = el + (thisCount + 1);

			// Reset the show
			if (thisCount == slideshow.totalCount){ nextSlide = el + 1; }

			setTimeout(function(){

				slideshow.hide(el,thisSlide);
				slideshow.show(el,nextSlide);

				// Set the active slide count
				if (slideshow.activeSlide == slideshow.totalCount) { slideshow.activeSlide = 1; }
				else { if (!slideshow.pause) { slideshow.activeSlide += 1; } }

			}, delay);
		}

		// Cycle through all the slides
		for (var i=1, len=slideshow.totalCount+1; i < len; i++) {

			showNext('slide',i);

		}

		// Repeat
		var totalTime = (slideshow.totalCount * 10000) + 1000;
		slideshow.timer = setTimeout('slideshow.rollIt()',totalTime);
	}

	// Hide the show and show clicked slide
	Slider.prototype.showStatic = function (x) {

		// Stop the current loop
		clearTimeout(slideshow.timer);
		slideshow.pause = true;
		slideshow.activeSlide = x;

		// Dim all the dots and rolling slides
		for (var y in slideshow.banner) {

			toolbox.classReplacer('slideDot' + y,'dim');
			document.getElementById('slide' + y).style.opacity = '0';

		}

		// Hide current static slide
		document.getElementById('showStatic').style.opacity = '0';

		// Show the active dot
		toolbox.classReplacer('slideDot' + x,'opaque');

		// Show new slide
		setTimeout(function(){

			var html = slideshow.createBanner(x,'opacity: 1; visibility: visible;');
			$('#showStatic').html(html);

			slideshow.resizeBanner();
			document.getElementById('showStatic').style.opacity = '1';

		}, 500);
	}


var slideshow = new Slider({

	pause: false,
	activeSlide: 1,
	totalCount: 0,
	banner: {}
});


// HOMEPAGE BLOCKS -------------------------------------------------------------------------------------------- //
function Blocks (details) {

	this.totalCount = details.totalCount;
	this.block = details.block;
}

	Blocks.prototype.createBlocks = function () {

		var cells = '';

		for (var x in featured.block) {

			cells += '<div class="block-spacer">'
				  + 	'<div class="block-bg" style="background-image: url(' + featured.block[x].image_src + ');" onclick="javascript: toolbox.docLoc(\'' + featured.block[x].block_link + '\');"></div>'
				  + 	'<div class="block-button majorButton" onclick="javascript: toolbox.docLoc(\'' + featured.block[x].block_link + '\');">' + featured.block[x].title + '</div>'
				  +  '</div>';

		}

		$('#blocks').html(cells);
	}

var featured = new Blocks({

	totalCount: 0,
	block: {}
});


// MAINMENU --------------------------------------------------------------------------------------------------- //
function Navigation (details) {

	this.section = details.section;
	this.menuVisibility = details.menuVisibility;
}

	Navigation.prototype.checkVisibility = function () {

		if (this.menuVisibility) {
			toolbox.classReplacer('menuBox','full inactive zero');
			this.menuVisibility = false;
		} else {
			toolbox.classReplacer('menuBox','full active auto');
			this.menuVisibility = true;
		}

	}

	Navigation.prototype.dotChange = function (op) {
		var d = 1;
		while (d < 7) {
			toolbox.classReplacer('menuDot0' + d,op); d+=1;
		}
	}

	Navigation.prototype.makeSticky = function (el) {
		toolbox.classReplacer(el + 'Ani','menuRolloverAni opaque');
		toolbox.classReplacer(el,'active auto');

		this.dotChange('opaque');
	}

	Navigation.prototype.makeSlick = function (el) {
		toolbox.classReplacer(el + 'Ani','menuRolloverAni transparent');
		toolbox.classReplacer(el,'inactive zero');

		this.dotChange('transparent');
	}

	Navigation.prototype.createTopMenu = function () {

		function tabItems (id) {

			var html = '';
			for (var y in mainmenu.section[id].item) {

				html += '<div class="menuRolloverItemSpacer"><div><a href="' + mainmenu.section[id].item[y].url + '">' + mainmenu.section[id].item[y].title + '</a></div></div>';

			}

			return html;
		}

		var container = '';
		for (var x in mainmenu.section) {

			container += '<div id="menuRolloverTab0' + mainmenu.section[x].id + '" onmouseover="javascript: mainmenu.makeSticky(\'menuRollover0' + mainmenu.section[x].id + '\');" onmouseout="javascript: mainmenu.makeSlick(\'menuRollover0' + mainmenu.section[x].id + '\');">'

					  +		'<div class="menuTabSpacer">'
					  +			'<div class="visibilityLarge menuDotSpacer"><div class="transparent" id="menuDot0' + mainmenu.section[x].id + '"></div></div>'
					  +			'<div class="menuItemsSpacer">' + mainmenu.section[x].title
					  +				'<div id="menuRollover0' + mainmenu.section[x].id + '" class="inactive zero">'
					  +					'<div class="menuRolloverBackground">'
					  +						'<div id="menuRollover0' + mainmenu.section[x].id + 'Ani" class="menuRolloverAni transparent">' + tabItems(x) + '</div>'
					  +					'</div>'
					  +				'</div>'
					  +			'</div>'
					  +		'</div>'
					  +	'</div>';

		}

		$('#menuBoxSpacer').html('<div id="menuBox" class="menuBox full"><div class="menuBoxContainer">' + container + '</div></div>');
		$('#remove').remove();
	}

	Navigation.prototype.createSiteMap = function () {

		for (var x in mainmenu.section) {

			var mapSection = '<div class="siteMapSection" align="left">'
						   + 	'<div class="menuDotSpacer"><div id="menuDot0' + mainmenu.section[x].id + '"></div></div>'
						   + 	'<div>'
						   +		'<div><a href="{site_url}index.php/categories/' + mainmenu.section[x].id + '">' + mainmenu.section[x].title + '</a></div>'
						   + 		'<div id="siteMapSection0' + mainmenu.section[x].id + '"></div>'
						   + 	'</div>'
						   + '</div>';

			$('#siteMap').append(mapSection);

			for (var y in mainmenu.section[x].item) {

				var link = '<div class="siteMapItem"><a href="' + mainmenu.section[x].item[y].url + '">' + mainmenu.section[x].item[y].title + '</a></div>';
				$('#siteMapSection0' + mainmenu.section[x].id).append(link);
			}
		}
	}

var mainmenu = new Navigation({

	menuVisibility: false,
	section: {}
});


// ZOOM ------------------------------------------------------------------------------------------------------- //
function Preview (details) {

	this.isLoaded = details.isLoaded;
}

	Preview.prototype.show = function (el) {

		toolbox.classReplacer('detailMiniDimmer','overlayDimmer overlayAni semi active full');
		$('#detailMiniContent').load('{site_url}index.php/products/mini_detail/' + el);
	}

	Preview.prototype.loaded = function () {

		this.isLoaded = true;
		setTimeout(function(){ toolbox.classReplacer('detailMini','overlayContainer-mini overlayAni opaque active'); }, 200);
	}

	Preview.prototype.hide = function () {

		if (this.isLoaded) {
			this.isLoaded = false;

			toolbox.classReplacer('detailMini','overlayContainer-mini overlayAni transparent active');

			setTimeout(function(){
				toolbox.classReplacer('detailMiniDimmer','overlayDimmer overlayAni transparent active');
				toolbox.classReplacer('detailMini','overlayContainer-mini overlayAni transparent inactive');
			}, 200);

			setTimeout(function(){
				toolbox.classReplacer('detailMiniDimmer','overlayDimmer overlayAni transparent inactive');
				toolbox.classReplacer('detailMini','overlayContainer-mini overlayAni transparent inactive zero');
			}, 400);
		}
	}

	// Create the DOM attributes
	Preview.prototype.previewOptions = function (id) {

		var spacer = '';

		for (var x in cart.row[id].field) {

			if (cart.row[id].field[x].icon != '') {

				spacer += '<div class="mini-attributeSpacer" id="attribute_container_' + x + '">'
					   + 	'<div class="detailAttribute-bg" style="background-image: url(\'' + cart.row[id].field[x].icon + '\');"></div>'
					   + 	'<div class="detailAttribute-title">' + cart.row[id].field[x].title + '</div>'
					   +  '</div>';

			}

		}

		$('#previewAttributes').append(spacer);
	}

var zoom = new Preview({

	isLoaded: false
});


// VIDEO ------------------------------------------------------------------------------------------------------ //
function Player (details) {

	this.isLoaded = details.isLoaded;
}

	Player.prototype.show = function (id) {

		toolbox.classReplacer('videoPlayerDimmer','overlayDimmer overlayAni semi active');
		$('#videoPlayerContent').load('{site_url}index.php/global/video_content/' + id);
	}

	Player.prototype.loaded = function () {

		this.isLoaded = true;
		setTimeout(function(){ toolbox.classReplacer('videoPlayer','overlayContainer-video overlayAni opaque active'); }, 200);
	}
			
	Player.prototype.hide = function () {

		if (this.isLoaded) {
			this.isLoaded = false;
			
			toolbox.classReplacer('videoPlayer','overlayContainer-video overlayAni transparent active');
			
			setTimeout(function(){
				toolbox.classReplacer('videoPlayerDimmer','overlayDimmer overlayAni transparent active');
				$('#videoPlayerContent').load('{site_url}index.php/global/');
				toolbox.classReplacer('videoPlayer','overlayContainer-video overlayAni transparent inactive');
			}, 200);
			
			setTimeout(function(){ toolbox.classReplacer('videoPlayerDimmer','overlayDimmer overlayAni transparent inactive'); }, 400);

		}
	}

var video = new Player({

	isLoaded: false
});


// RELATED ---------------------------------------------------------------------------------------------------- //
function Related (details) {

	this.suggestedItems = details.suggestedItems;
	this.isLoaded = details.isLoaded;
}

	Related.prototype.show = function (el) {

		if (suggest.suggestedItems != '') {
		
			toolbox.classReplacer('suggestRelatedDimmer','overlayDimmer overlayAni active semi');
			suggest.suggestThese(el,'{site_url}index.php/store/related/');

		}

	}

	Related.prototype.loaded = function () {

		this.isLoaded = true;
		setTimeout(function(){ toolbox.classReplacer('suggestRelated','overlayContainer-suggest overlayAni active opaque'); }, 200);
	}

	Related.prototype.hide = function () {

		if (this.isLoaded) {
			this.isLoaded = false;

			toolbox.classReplacer('suggestRelated','overlayContainer-suggest overlayAni active transparent');

			setTimeout(function(){
				toolbox.classReplacer('suggestRelatedDimmer','overlayDimmer overlayAni active transparent');
				toolbox.classReplacer('suggestRelated','overlayContainer-suggest overlayAni inactive transparent');
			}, 200);

			setTimeout(function(){ toolbox.classReplacer('suggestRelatedDimmer','overlayDimmer overlayAni inactive transparent'); }, 400);
		}
	}

	Related.prototype.suggestThese = function (thisItem,loadUrl) {

		suggest.suggestedItems = projects.scrubString(suggest.suggestedItems);
		suggest.suggestedItems = projects.removeItem(thisItem,suggest.suggestedItems);

		if (suggest.suggestedItems != '') {

			$('#suggested').load(loadUrl + suggest.suggestedItems);

		}

	}

var suggest = new Related({

	suggestedItems: '',
	isLoaded: false
});


// SHARE ------------------------------------------------------------------------------------------------------ //
function Project (details) {

	this.isLoaded = details.isLoaded;
}

	Project.prototype.show = function (bookId,share) {

		toolbox.classReplacer('shareProjectDimmer','overlayDimmer overlayAni semi active');
		$('#shareProjectContent').load('{site_url}index.php/account/share_detail/' + bookId + '/' + share);

		// Viewport greater than ..
		toolbox.viewportCheck(1084,function(){

		// Viewport less than ..
		},function(){

			// Scroll to top
			$("html, body").animate({ scrollTop: $('#shareProject').offset().top }, 1000);

		});
	}

	// Move share link from pre-loaded links
	Project.prototype.loadShare = function (share) {

		var bookShareLink = $('#bookShare_' + share).html();
		$('#bookShareLink_' + share).append(bookShareLink);
	}

	Project.prototype.loaded = function () {

		this.isLoaded = true;
		setTimeout(function(){ toolbox.classReplacer('shareProject','overlayContainer-share overlayAni opaque active'); }, 200);
	}

	Project.prototype.hide = function () {

		if (this.isLoaded) {
			this.isLoaded = false;
			
			toolbox.classReplacer('shareProject','overlayContainer-share overlayAni transparent active');
			
			setTimeout(function(){
				toolbox.classReplacer('shareProjectDimmer','overlayDimmer overlayAni transparent active');
				toolbox.classReplacer('shareProject','overlayContainer-share overlayAni transparent inactive');
			}, 200);

			$('#shareProjectContent').html('');

			setTimeout(function(){ toolbox.classReplacer('shareProjectDimmer','overlayDimmer overlayAni transparent inactive'); }, 400);
		}
	}

var share = new Project({

	isLoaded: false
});


// ISCROLL ---------------------------------------------------------------------------------------------------- //
function Page (details) {

	this.pageCount = details.pageCount;
	this.dataPresent = details.dataPresent;
}

	Page.prototype.loadPage = function (url,height) {

		$('#content_0').load('{site_url}index.php/' + url + '/0');

		$(window).scroll(function(){

			if ($('#content_' + iscroll.pageCount).offset().top < $(this).height() + $(this).scrollTop() + height && iscroll.dataPresent) {

				iscroll.pageCount += 12;

				$('#pages').append('<div id="content_' + iscroll.pageCount + '" style="min-height: ' + height + 'px;"><div class="col-1-1" align="center"><img src="{site_url}graphics/graphics/loading.gif" width="32" height="32"></div></div>');
				$('#content_' + iscroll.pageCount).load('{site_url}index.php/' + url + '/' + iscroll.pageCount);
			}

		});

	}

	Page.prototype.resetHeight = function (el) {

		$(el).css({ 'min-height' : '0px' });
	}

var iscroll = new Page({

	pageCount: 0,
	dataPresent: true
});


// DRILLDOWN ---------------------------------------------------------------------------------------------------- //
function Filter (details) {

	this.first = details.first;
	this.defaultFenceTop = details.defaultFenceTop;
	this.group = details.group;
}

	Filter.prototype.totalResults = function (c) {

		var count = c;
		if (c >= 100) { count = c + '+' }

		$('#totalResults').html(count);
	}

	Filter.prototype.getResults = function (str) {

		var string = projects.scrubString(str);
		var c = 0;

		projects.getStringCount(string,function(count){

			c = count;

		});

		return c;
	}

	Filter.prototype.checkActive = function (x,y) {

		if (x == y) { return true }
		else { return false }
	}

	Filter.prototype.createFilter = function () {

		function checkStyle (item,str) {

			if (item) { return str }
			else { return '' }
		}

		var container = '';
		for (var x in drilldown.group) {

			var items = '';
			for (var y in drilldown.group[x].item) {

				items += '<div id="drillDownItem_' + y + '" class="drillDownItem drillDownList' + checkStyle(drilldown.group[x].item[y].active,'Active') + '" onclick="javascript: toolbox.docLoc(\'' + drilldown.group[x].item[y].url + '\');">' + drilldown.group[x].item[y].title + '</div>';

			}

			container += '<div id="drillDownGroup_' + x + '" class="drillDownBox">'
					   + 	'<div>' + drilldown.group[x].title + '</div>'
					   + 	items
					   + '</div>';

		}

		$('#drillDown').html(container);
		$('#remove').remove();

		drilldown.checkScroll();
	}

	Filter.prototype.getViewport = function () {

		var t = $(window).scrollTop();
		var h = $(window).height();

		var v = {

			top: t,
			bottom: t + h,
			height: h

		};

		return v;
	}

	Filter.prototype.getDrillDown = function () {

		var t = $('#drillDown').offset().top;
		var h = $('#drillDown').height();

		var v = {

			top: t,
			bottom: t + h,
			height: h

		};

		return v;
	}

	Filter.prototype.getOverflow = function (d,v) {

		return v - d;
	}

	Filter.prototype.floatDrill = function (margin) {

		toolbox.docked = false;

		toolbox.classReplacer('drillDownFloatContainer','opaque active');

		var html = $('#drillDownDock').html();
		$('#drillDownFloat').css('margin-top',margin + 'px');
		$('#drillDownFloat').html(html);
		$('#drillDownDock').html('<div class="drillDownBlank"></div>');
	}

	Filter.prototype.dockDrill = function (margin) {

		toolbox.docked = true;

		var html = $('#drillDownFloat').html();
		$('#drillDownDock').css('margin-top',margin + 'px');
		$('#drillDownDock').html(html);
		$('#drillDownFloat').html('');

		toolbox.classReplacer('drillDownFloatContainer','transparent inactive');
	}

	Filter.prototype.checkUpScroll = function () {

		// Re-initialize
			var drill = this.getDrillDown();
			var viewport = this.getViewport();

		// Calculate new paramenters
			var overflow = this.getOverflow(drill.height,viewport.height);
			if (toolbox.scrollDirection == '') { toolbox.scrollDirection = 'up'; }
			var fence = drilldown.defaultFenceTop + $('#pages').height();

		// Check the top fence
		if (viewport.top <= drilldown.defaultFenceTop) {

			// Check if we are floating
			if (!toolbox.docked) {

				// Stick it to the top fence
				this.dockDrill(0);

			}

		// Within the fence
		} else {

			// WE ARE DOCKED
			if (toolbox.docked) {

				// No overflow
				if (overflow > 159) {

					// Check if we are not on the fence
					if (viewport.top < fence - drill.height - 119) {

						// Float it
						this.floatDrill(0);

					}

				// Overflow
				} else {

					// Check if we are not on the fence
					if (viewport.bottom - drill.height - drilldown.defaultFenceTop < fence && drill.top - 40 > viewport.top) {

						// Float it
						this.floatDrill(0);

					}

				}

			// WE ARE FLOATING
			} else if (toolbox.scrollDirection == 'down') {

				// No overflow
				if (overflow <= 159) {

					// Dock it
					this.dockDrill(viewport.top - drilldown.defaultFenceTop + overflow - 159);

				}

			}

		}

		toolbox.scrollDirection = 'up';
	}

	Filter.prototype.checkDownScroll = function () {

		// Re-initialize
			var drill = this.getDrillDown();
			var viewport = this.getViewport();

		// Calculate new paramenters
			var overflow = this.getOverflow(drill.height,viewport.height);
			if (toolbox.scrollDirection == '') { toolbox.scrollDirection = 'down'; }
			var fence = drilldown.defaultFenceTop + $('#pages').height();

		// Check the bottom fence
		if (drill.bottom + 80 >= fence) {

			// Check if we are floating
			if (!toolbox.docked) {

				// Stick it to the bottom fence
				this.dockDrill(fence - drill.height - drilldown.defaultFenceTop - 60);

			}

		// Within the fence
		} else {

			// WE ARE DOCKED
			if (toolbox.docked) {

				// No overflow
				if (overflow > 159) {

					// Check if we need to float it
					if (drill.top - 40 < viewport.top) {

						// Float it
						this.floatDrill(0);

					}

				// Overflow
				} else {

					// Check if we need to float it
					if (drill.bottom + 100 < viewport.bottom) {

						// Float it
						this.floatDrill(overflow - 159);

					}

				}

			// WE ARE FLOATING
			} else if (toolbox.scrollDirection == 'up') {

				// No overflow
				if (overflow <= 159) {

					// Dock it
					this.dockDrill(viewport.top - drilldown.defaultFenceTop);

				}

			}

		}

		toolbox.scrollDirection = 'down';
	}

	// Checks scroll direction
	Filter.prototype.checkScroll = function () {

		var lastScrollTop = 0;
		$(window).scroll(function(event){

			toolbox.viewportCheck(toolbox.viewportSize.large,function(){

				var st = $(this).scrollTop();

				// Downscroll
				if (st > lastScrollTop){

					drilldown.checkDownScroll();

				// Upscroll
				} else {

					drilldown.checkUpScroll();

				}

				lastScrollTop = st;

			},function(){

			});

		});
	}

var drilldown = new Filter({

	first: true,
	defaultFenceTop: 270,
	group: {}
});


// KEYCHAIN --------------------------------------------------------------------------------------------------- //
function Account (details) {

	this.userId = details.userId;
	this.userCoupons = details.userCoupons;
	this.login = details.login;
}

	// AJAX REQUEST WRAPPERS
	// - e.g. paramters 
	//   - url: "users/######/books.json"
	//   - data: { name: val }
	//   - callback: function(data){}
	//   - errorHandler: function(data){}
	//   - method: "post"
	Account.prototype.pf_wrapper = function (url,data,errorHandler,callback,method) {
		$.ajax({
			url: '{pixfizz_url}/v1/' + url,
			type: method,
			data: data,
			success: callback,
			error: errorHandler,
			xhrFields: { withCredentials: true }
		});
	}

	// CHECK FOR PIXFIZZ USER SESSION MATCH
	// If EE is logged in make sure Pixfizz session exists 
	Account.prototype.checkPixfizzLogin = function (userId,returnUrl,success) {

		toolbox.browserCheck(function(){

			// Do Nothing - IE 8+9
			success();

		},function(){

			// Save user id
			keychain.userId = userId;

			var url = 'users/' + userId + '/books.json';
			var data = { page: '1' };

			// Ajax GET
			keychain.pf_wrapper(url,null,function(xhr){

				// Error - user doesn't match
				keychain.showLogin({

					return_url: returnUrl,
					abort_url: '{pixfizz_url}/site/logout',
					forced: 'true'

				});

			},function(){

				// Success
				success();

			},'get');

		});
	}

	// LOGIN / REGISTRATION PAGE ----------------------------------------- //

		Account.prototype.showLogin = function (obj) {

			keychain.login = obj;

			// Load the login form
			$('#loginSubmitContent').load('{site_url}index.php/login/' + obj.return_url);

			// Show overlay
			keychain.showOverlay('loginSubmit');

			// Viewport greater than ..
			toolbox.viewportCheck(1084,function(){

			// Viewport less than ..
			},function(){

				// Scroll to top
				$("html, body").animate({ scrollTop: $('#loginSubmit').offset().top }, 1000);

			});
		}

		Account.prototype.loadLogin = function (obj) {

			keychain.login = obj;

			// Load the login form
			$('#loginSubmitContent').load('{site_url}index.php/login/form/' + obj.return_url);
		}

		// Close the login screen
		Account.prototype.closeLogin = function () {

			// No alert
			this.checkAbortAlert(function(){

				// Relaxed
				keychain.checkForced(function(){

					// Hide overlay
					keychain.hideOverlay('loginSubmit');

				// Forced
				},function(){

					// Redirect to abort url
					toolbox.docLoc(keychain.login.abort_url);

				});

			// With alert
			},function(){

				// Canceled exit
				toolbox.confirmAlert(keychain.login.forced_alert,function(){

					// Do nothing

				// Confirmed exit
				},function(){

					// Return the user to the abort url
					toolbox.docLoc(keychain.login.abort_url);

				});

			});
		}

		Account.prototype.showRegistration = function () {

			$('#panelLogin').attr({ 'class' : 'optionItemBox inactive zero' });
			$('#panelRegister').attr({ 'class' : 'optionItemBox active auto' });
		}

		Account.prototype.hideRegistration = function () {

			$('#panelLogin').attr({ 'class' : 'optionItemBox active auto' });
			$('#panelRegister').attr({ 'class' : 'optionItemBox inactive zero' });
		}

		// Assemble send password url
		Account.prototype.gotoSendPassword = function () {

			toolbox.docLoc('{pixfizz_url}/site/send_password?return=' + keychain.login.return_url
														 + '&abort=' + keychain.login.abort_url
														 + '&forced=' + keychain.login.forced
														 + '&alert=' + keychain.login.forced_alert);
		}

		// Return to login
		Account.prototype.closeSendPassword = function () {

			toolbox.docLoc('{site_url}index.php/' + keychain.login.return_url);
		}

		// Hide the login screen
		Account.prototype.hideLogin = function () {

			// Relaxed
			this.checkForced(function(){

				// Hide it
				keychain.hideOverlay('loginSubmit');

			// Forced
			},function(){

				// Do nothing

			});
		}

		// Checks if there is an alert for forced logins
		Account.prototype.checkAbortAlert = function (relaxed,forced) {

			if ((this.login.forced_alert == undefined) || (this.login.forced_alert == 'undefined')) {

				// No alert
				relaxed();

			} else {

				// Alert exists
				forced();

			}
		}

		// Checks if the login is forced
		Account.prototype.checkForced = function (relaxed,forced) {

			if (keychain.login.forced != 'true') {

				// No alert
				relaxed();

			} else {

				// Alert exists
				forced();

			}
		}

		// Show Overlay
		Account.prototype.showOverlay = function (el) {

			toolbox.classReplacer('overlayDimmer','overlayDimmer overlayAni active semi');
			setTimeout(function(){

				toolbox.classReplacer(el,'overlayContainer-login overlayAni active opaque');

			}, 200);
		}

		// Hide Overlay
		Account.prototype.hideOverlay = function (el) {

			toolbox.classReplacer(el,'overlayContainer-login overlayAni transparent active');

			setTimeout(function(){

				toolbox.classReplacer('overlayDimmer','overlayDimmer overlayAni transparent');
				toolbox.classReplacer(el,'overlayContainer-login overlayAni transparent inactive');

			}, 200);

			setTimeout(function(){

				toolbox.classReplacer('overlayDimmer','overlayDimmer overlayAni transparent inactive');

			}, 400);

			setTimeout(function(){

				$('#' + el + 'Content').html('');

			}, 600);
		}

	// LOGIN / REGISTRATION FORMS ------------------------------------ //

		// Checks if there's a value for the field
		Account.prototype.checkVal = function (el) {

			if ($(el).val().length == 0) { return true }
			else { return false }
		}

		// Checks length of field
		Account.prototype.checkLength = function (el,len) { if ($(el).val().length < len) { return true } }

		// Checks for a match
		Account.prototype.checkMatch = function (el1,el2) {
			if ($(el1).val() == $(el2).val()) { return false }
			else { return true }
		}

		// Checks a specific field for an error
		Account.prototype.checkFieldError = function (success) {

			var fieldError = this.checkRequiredFields();
			if (fieldError) { alert(fieldError); return false }
			else { success(); }
		 }

		// Checks all fields
		Account.prototype.checkRequiredFields = function() {

			if (this.checkVal('#member_first_name')) { return "First Name can't be blank" }
			else if (this.checkVal('#member_last_name')) { return "Last Name can't be blank" }
			else if (this.checkVal('#registerEmail')) { return "Email can't be blank" }
			else if (this.checkVal('#confirmEmail')) { return "Confirm Email can't be blank" }
			else if (this.checkMatch('#registerEmail','#confirmEmail')) { return "Your Email Addresses don't match" }
			else if (this.checkVal('#registerPassword')) { return "Password can't be blank" }
			else if (this.checkLength('#registerPassword',5)) { return "Your Password must be at least 5 characters long" }
			else if (this.checkVal('#confirmPassword')) { return "Confirm Password can't be blank" }
			else if (this.checkMatch('#registerPassword','#confirmPassword')) { return "Your Passwords don't match" }

			else { return false }
		}

		// Login errors
		Account.prototype.loginErrorHandler = function (xhr, status, error) {

			switch (xhr.status) {

				case 401:

					if (xhr.responseText == 'invalid user') {

							//Invalid User error handling.
							alert('You have entered an ' + xhr.responseText);

						break;

					}

				default:

					//Log all errors
					alert('There is a problem with your login:' + xhr.error);

					break;

			}
		}

		// Registration errors
		Account.prototype.registrationErrorHandler = function (xhr, status, error) {

			switch (xhr.status) {

				case 422:

					var errorThrown = JSON.parse(xhr.responseText);

					if (errorThrown.email == "can't be blank") {

						alert('Email ' + errorThrown.email);

						break;

					} else if (errorThrown.password == "can't be blank") {
						
						alert('Password ' + errorThrown.password);

						break;

					}

				default:

					alert('There is a problem with your registration: ' + status);

					break;

			}
		}

		// Login form submit
		Account.prototype.loginSubmit = function (success) {

			// Set the URL and data to POST the pixfizz login.
			var pfURL = 'session';
			var pfData = {
				email: $('#loginUsername').val(),
				password: $('#loginPassword').val()
			}

			// POST to Pixfizz and callback the EE form submit
			this.pf_wrapper(pfURL, pfData, this.loginErrorHandler, success, 'post');
		}

		// Registration form submit
		Account.prototype.registrationSubmit = function (success) {
			
			// Set the URL and data to POST the pixfizz registration.
			var pfURL = 'users';
			var pfData = {
				user: {
					email: $('#registerEmail').val(),
					password: $('#registerPassword').val(),
					first_name: $('#member_first_name').val(),
					last_name: $('#member_last_name').val()
				}
			}

			this.checkFieldError(function () { 

				// POST to Pixfizz and callback the EE form submit
				keychain.pf_wrapper(pfURL, pfData, keychain.registrationErrorHandler, function (data) {

					// Assign the returned user_id to a hidden input in the EE registration form
					$('#pixfizz_user_id').val(data.id);

					// Set the URL and data to POST the pixfizz login.
					var pfURL = 'session';
					var pfData = {
						email: $('#registerEmail').val(),
						password: $('#registerPassword').val()
					}

					// POST to Pixfizz and callback the EE form submit
					keychain.pf_wrapper(pfURL, pfData, keychain.registrationErrorHandler, success, 'post');

				}, 'post');

			});
		}

	// SAME ORIGIN POLICY -------------------------------------------- //

		Account.prototype.showOverlaySOP = function (el) {

			this.login = {

				return_url: $.url().param('return'),
				abort_url: $.url().param('abort'),
				forced: $.url().param('forced'),
				forced_alert: $.url().param('alert')

			}

			setTimeout(function(){

				toolbox.classReplacer(el,'overlayContainer-login overlayAni active opaque');

			}, 200);
		}

var keychain = new Account({

	userId: undefined,
	userCoupons: '',
	login: {}
});


// SEARCH ----------------------------------------------------------------------------------------------------- //
function Search (details) {

	this.searchItems = details.searchItems;
}

var results = new Search({

	searchItems: ''
});


// PROJECTS --------------------------------------------------------------------------------------------------- //
function Books (details) {

	this.category = details.category;
	this.thisType = details.thisType;

	this.projectItems = details.projectItems;
	this.orderedItems = details.orderedItems;
	this.deletedItems = details.deletedItems;

	this.booksData = details.booksData;
}

	// GETS THE COUNT AND RETURNS TO THE HEADER
	Books.prototype.getProjectsHeader = function (projectStr,orderedStr) {

		var count = 0;

		this.splitString(projectStr,'|',function(){

			// No projects

		},function(projects){

			count += projects.length;

		});

		projects.splitString(orderedStr,'|',function(){

			// No ordered items

		},function(ordered){

			count += ordered.length;

		});

		if (count > 0) { $('#projectCount').append('<div>' + count + '</div>'); }
	}

	// PAGINATE USER BOOK IDS AND RETURN LAST ONE
	Books.prototype.getNewestBook = function (userId,error,success) { 

		function getMaxId () {

			var bookMax = 0;
			for (var x in projects.booksData) {

				if (parseInt(projects.booksData[x].id) > bookMax) { bookMax = projects.booksData[x].id; }

			}

			return bookMax;
		}

		var url = 'users/' + userId + '/books.json';

		var pageCount = 1;
		var lastBookId;

		function paginate (currentPage) {  

			var data = { page : currentPage }

			keychain.pf_wrapper(url,data,function(xhr){

				error(xhr.status);

			}, function(books){

				if (books.length > 0) {

					// Get the book data
					for (var z in books) {

						projects.booksData[books[z].id] = books[z];

					}

					// Add to the page count
					pageCount += 1;

					// Break physics
					paginate(pageCount);

				// No (more) books found
				} else {
					
					if (pageCount == 1) {

						error('No projects exist for user ' + userId);

					} else {

						// Return last book id
						success(getMaxId());

					}

					return

				}

			}, 'get');
		}

		// Paginate through the users books
		paginate(pageCount);
	}

	// RETURN LATEST BOOK ID
	Books.prototype.getLastBook = function (userId,error,success) {

		var url = 'users/' + userId + '/books.json';
		var data = { page : 1 }

		keychain.pf_wrapper(url,data,function(xhr){

			error(xhr.status);

		}, function(books){

			// Books exist
			if (books.length > 0) {

				// Get the book_id
				success(books[0].id);

			// No books found
			} else {

				error('No projects exist for user ' + userId);

			}

		}, 'get');
	}

	// OPEN A NEW PROJECT ------------- //
	// Uses start.js v.0.3
	Books.prototype.newProject = function (bookId) {

		var save_url = '{site_url}index.php/account/add_project';
		var cart_url = '{site_url}index.php/store/add_book/{{book_id}}/' + this.booksData[bookId].entry_id;
		var exit_url = '{site_url}index.php/' + this.booksData[bookId].return_url;

		Pixfizz.createBook(this.booksData[bookId].theme_id + ':' + this.booksData[bookId].product_id,{

			target: save_url,
			cart_target: cart_url,
			exit_target: exit_url,

			custom: {

				entry_id: this.booksData[bookId].entry_id,
				product_id: this.booksData[bookId].product_id,
				product_code: this.booksData[bookId].product_code,
				product_type: this.booksData[bookId].product_type

			}

		});
	}

	// OPEN EXISTING PROJECT ---------- //
	// Uses start.js v.0.3
	Books.prototype.openProject = function (bookId) {

		var cart_url = '{site_url}index.php/store/add_book/' + bookId + '/' + this.booksData[bookId].entry_id;
		var exit_url = '{site_url}index.php/account/projects';

		Pixfizz.openBook(bookId,{

			target: exit_url,
			cart_target: cart_url

		});
	}

	// EDIT CART PROJECT -------------- //
	// Uses start.js v.0.3
	Books.prototype.editProject = function (bookId) {

		var cart_url = '{site_url}index.php/store';
		var exit_url = '{site_url}index.php/' + this.booksData[bookId].return_url;

		Pixfizz.openBook(bookId,{

			target: exit_url,
			cart_target: cart_url

		});
	}

	// COPY EXISTING PROJECT ---------- //
	// Uses start.js v.0.3
	Books.prototype.copyProject = function (bookId,entryId) {

		var save_url = '{site_url}index.php/account/add_project/' + bookId;
		var cart_url = '{site_url}index.php/store/add_book/' + bookId + '/' + entryId;
		var exit_url = '{site_url}index.php/account/projects';

		Pixfizz.openBook(bookId,{

			target: save_url,
			cart_target: cart_url,
			exit_target: exit_url

		});
	}

	// PIXFIZZ ACCOUNT REQUEST MANAGEMENT -------------------------- //
	// Handles getLastBook requests at /site/account
	// Used for adding new projects to the users account
	Books.prototype.copyHandler = function () {

		var eeUrl = '{site_url}index.php/account/';

		// Check if there's a userId

		// No userId was passed
		toolbox.getParam('userid',function(){

			// Must be coming from a preview
			toolbox.docLoc(eeUrl + 'copy');

		// We have a userId - Must be SOP
		},function(userId){

			// Get the last book from user's Pixfizz account

			// Error - No bookId was returned
			projects.getNewestBook(userId,function(error){

				// Go back to projects
				toolbox.quietAlert('There was an error ' + error + ' finding the project ' + bookId);
				toolbox.docLoc(eeUrl + 'projects');

			// Success - We have a bookId
			},function(bookId){

				// Check if we have an entryId

				// No entryId was returned
				toolbox.getParam('entry',function(){

					// Must be v.0.3 - Go get book data

					// No book data returned
					var bookUrl = 'books/' + bookId + '.json';
					keychain.pf_wrapper(bookUrl, null, function(xhr){

						// Alert and return
						toolbox.quietAlert('There was an error ' + xhr.status + ' finding the book ' + bookId);
						toolbox.docLoc(eeUrl + 'projects');

					// We have book data
					},function(book){

						// Check the project version

						// v.0.1
						projects.projectVersionCheck(book.options.entry_id,function(){

							// Must be first time SOP - Go get the entry_id
							toolbox.docLoc(eeUrl + 'depreciated_copy/' + book.theme_id + '/' + bookId);

						// v.0.3
						},function(){

							// Open the book copy
							projects.copyProject(bookId,book.options.entry_id);
							
						});

					});

				// We have an entryId - Must be v.0.1
				},function(entry){

					// Open the book copy
					projects.copyProject(bookId,entry);

				});

			});

		});
	}

	// A userId was needed from account/user_id
	Books.prototype.openCopy = function(userId) {

		var pxUrl = '{pixfizz_url}/site/copy';
		var eeUrl = '{site_url}index.php/account/';

		// Error - No bookId was returned
		projects.getNewestBook(userId,function(error){

			// Go back to projects
			toolbox.quietAlert('There was an error ' + error + ' finding the project ' + bookId);
			toolbox.docLoc(eeUrl + 'projects');

		// Success - We have a bookId
		},function(bookId){

			// No book data returned
			var bookUrl = 'books/' + bookId + '.json';
			keychain.pf_wrapper(bookUrl, null, function(xhr){

				// Alert and return
				toolbox.quietAlert('There was an error ' + xhr.status + ' finding the book ' + bookId);
				toolbox.docLoc(eeUrl + 'projects');

			// We have book data
			},function(book){

				// Check the project version

				// v.0.1
				projects.projectVersionCheck(book.options.entry_id,function(){

					// Use depreciated_copy to open
					toolbox.docLoc(eeUrl + 'depreciated_copy/' + book.theme_id + '/' + bookId );

				// v.0.3
				},function(){

					// Open the book copy
					projects.copyProject(bookId,book.options.entry_id);

				});

			});

		});
	}


	// PROJECT MANAGEMENT ------------------------------------------ //

	// Removes any duplicates
	Books.prototype.scrubString = function (str) {

		var returnStr = '';

		returnStr += str;
		this.splitString(returnStr,'|',function(){

			// Empty string

		},function(items){

			var unique = [];
			$.each(items, function(i, el){

				if ($.inArray(el, unique) === -1) {

					unique.push(el);

				}

			});

			var scrubedStr = '';
			for (var i=0, len=unique.length; i < len; i++) {

				scrubedStr = projects.addItem(unique[i],scrubedStr);

			}

			returnStr = projects.reverseString(scrubedStr);

		});

		return returnStr;
	}

	// Rearanges the order
	Books.prototype.reverseString = function (str) {

		var returnStr = '';

		this.splitString(str,'|',function(){

			// Empty string

		},function(items){

			returnStr = items[0];

			for (var i=1, len=items.length; i < len; i++) {

				returnStr = items[i] + '|' + returnStr;

			}

		});

		return returnStr;
	}

	// Replaces "+" with " "
	Books.prototype.formatString = function (str,success) {

		var string = '';

		// Parse the string
		this.splitString(str,'+',function(){

			success(string);

		},function(parts){

			string = parts[0];

			// Put it all back together
			for (var i=1, len=parts.length; i < len; i++) {

				string += ' ' + parts[i];

			}

			success(string);

		});
	}

	// Combines 2 strings
	Books.prototype.addString = function (strA,strB) {

		if ((strA == '') && (strB == '')) { var strReturn = ''; }
		else if (strA == '') { var strReturn = strB; }
		else if (strB == '') { var strReturn = strA; }
		else { var strReturn = strA + '|' + strB; }

		return strReturn;
	}

	// Parse items
	Books.prototype.splitString = function (str,div,noResults,returnParts) {

		var parts = str.split(div);

		if ((parts[0] == '') && (parts.length == 1)) {

			noResults();

		} else {

			returnParts(parts);

		}
	}

	Books.prototype.getStringCount = function (str,returnCount) {

		this.splitString(str,'|',function(){

			returnCount(0);

		},function(parts){

			returnCount(parts.length);

		})
	}

	// Adds a book to the string
	Books.prototype.addItem = function (item,str) {

		if (str == '') {

			var itemsReturn = item;

		} else {

			var itemsReturn = item + '|' + str;

		}

		return itemsReturn;
	}

	// Removes a book from the string
	Books.prototype.removeItem = function (item,str) {

		var itemsReturn = '';

		this.splitString(str,'|',function(){

			// Nothing to split

		},function(parts){

			for (var i=0, len=parts.length; i < len; i++) {

				// Reassemble the list excluding the item to remove
				if (parts[i] != item) {

					if (itemsReturn == '') { itemsReturn = parts[i]; }
					else { itemsReturn = itemsReturn + '|' + parts[i]; }

				}

			}

		});

		return itemsReturn;
	}

	// Move book from one string to another
	Books.prototype.moveProjects = function (str,fromStr,toStr,fromEl,toEl) {

		var from = fromStr;
		var to = toStr;

		this.splitString(str,'|',function(){

			// Nothing to move

		},function(parts){

			// move each book
			for (var i=0, len=parts.length; i < len; i++) {

				to = projects.addItem(parts[i], to);
				from = projects.removeItem(parts[i], from);

			}

		});

		$(fromEl).val(from);
		$(toEl).val(to);

		$('#moveFromProjects').submit();
	}

	// Saves the project
	Books.prototype.saveProject = function (item,str) {

		var finalStr = this.addItem(item,str);

		$('#projects').val(finalStr);

		$('#addToProjects').submit();
	}

	// No books message
	Books.prototype.noBooks = function (success) {

		var noBooks = '<div class="projects-none">you have no saved projects</div>';

		success(noBooks);
	}

	// Check if this book is in the list
	Books.prototype.itemCheck = function (item,str,no,yes) {

		// Parse the cart string
		this.splitString(str,'|',function(){

			// Nothing to split
			no();

		},function(strItems){

			var match = false;

			// Check this book against the cart string
			for (var i=0, len=strItems.length; i < len; i++) {

				if (strItems[i] == item) {

					match = true;

				}

			}

			if (match) { yes(); } else { no(); }

		});
	}

	// Check if this book is a cart item
	Books.prototype.cartItemCheck = function (bookId,cartItem,projectItem) {

		if (this.booksData[bookId].cart_item) {

			// Item is in the cart
			cartItem();

		} else {

			// Item is not in the cart
			projectItem();

		}
	}

	// Check if this book is an ordered item
	Books.prototype.orderedItemCheck = function (bookId,orderItem,projectItem) {

		if (this.booksData[bookId].order_item) {

			// Item is an ordered item
			orderItem();

		} else {

			// Item is not an ordered item
			projectItem();

		}
	}

	// Checks if project is v.0.1 or v.0.3
	Books.prototype.projectVersionCheck = function (val,oldProject,newProject) {

		if ((val == '') || (val == undefined)) {

			// Old project - v.0.1
			oldProject();

		} else {

			// New project - v.0.3
			newProject();

		}
	}


	// HTML ASSEMBLY ----------------------------------------------- //

	// Fetch book data and output to the thumbnails CORS - Cross Origin
	Books.prototype.fetchBooks = function (booksStr,sel){

		// Parse the books string
		this.splitString(booksStr,'|',function(){

			// No books saved
			projects.noBooks(function(msg){

				$(sel).append(msg);

			});

		},function(books){

			function populate (bookId) {

				function loadNext () {

					// Set next array count
					i++;

					// Keep going to next book
					if (i < len) {

						// Break physics
						populate(books[i]);

					} else {

						toolbox.freeFacebook();

					}
				}

				// Prep thumb HTML with this book id
				projects.prepThumb(bookId,function(html){

					var thumbSelector = 'thumbSpacer_' + bookId;
					var thumbSpacer = '<div id="' + thumbSelector + '" class="block-spacer projects-spacer"></div>';

					$(sel).append(thumbSpacer);
					$('#' + thumbSelector).prepend(html);

				});

				// Get book data and populate the thumb
				projects.fetchBookData(bookId,function(error){

					toolbox.quietAlert('There was an error ' + error + ' finding the saved project ' + bookId);

					// Remove the error project thumb
					var div = document.getElementById('thumbSpacer_' + bookId);
					div.parentNode.removeChild(div);

					loadNext();

				},function(book){

					// Populate thumb HTML with this book data
					projects.populateBookData(book,function(){

						loadNext();

					});

				});
			}

			// Start the show
			var i = 0;
			var len = books.length;
			populate(books[i]);

		});
	}

	// Get the flag image
	Books.prototype.getFlag = function (flag,success) {

		var html = '<div class="thumb-bg-flag-' + flag + '"></div>';

		success(html);
	}

	// Prep thumb HTML
	Books.prototype.prepThumb = function (bookId,success) {

		var bookThumb  = '<div class="thumb">'
							+ '<div id="bookPreview_' + bookId + '" class="projects-previewSpacer"></div>'
							+ '<div id="bookInfo_' + bookId + '" class="thumbTxt projects-title">'
								+ '<div id="bookName_' + bookId + '"></div>'
								+ '<div id="bookEdit_' + bookId + '"></div>'
							+ '</div>'
						+ '</div>';

		success(bookThumb);
	}

	// Create facebook share Link HTML
	Books.prototype.prepShareLink = function (share) {

		var button = '<div id="bookShare_' + share + '"><div class="fb-share-button" data-href="{site_url}index.php/account/share_login/' + share + '" data-width="57" data-type="box_count"></div></div>';
		return button;
	}

	// Place link
	Books.prototype.saveShareLink = function (sel,share) {

		var shareLink = this.prepShareLink(share);
		$(sel).append(shareLink);
	}

	// Get the book data from Pixfizz
	Books.prototype.fetchBookData = function (bookId,error,success) {

		// Get Pixfizz Book Data
		var bookUrl = 'books/' + bookId + '.json';
		keychain.pf_wrapper(bookUrl, null, function(xhr){

			error(xhr.status);

		},function(book){

			// Check if it's a cart or ordered item
			var cartValue = false;
			var orderValue = false;

			projects.itemCheck(book.id,cart.cartItems,function(){

				// Status quo

			},function(){

				cartValue = true;

			});

			projects.itemCheck(book.id,projects.orderedItems,function(){

				// Status quo

			},function(){

				orderValue = true;

			});

			// SUCCESS - Save book data to the object
			projects.booksData[book.id] = {

				book_id: book.id,
				theme_id: book.theme_id,
				entry_id: book.options.entry_id,
				product_id: book.options.product_id,
				product_code: book.options.product_code,
				product_type: book.options.product_type,
				preview: '/v1/books/' + book.id + '/preview.jpg',
				share_code: book.share_code,
				return_url: 'account/projects',

				cart_item: cartValue,
				order_item: orderValue

			}

			success(book.id);

		}, 'get');
	}

	// Populate HTML with book data
	Books.prototype.populateBookData = function (bookId,success) {

		// Prep button HTML
			function smallButtonPrep (name,action) {

				var button = '<div class="smallButton" onclick="javascript: ' + action + ';">' + name + '</div>';
				return button;
			}

		// Prep button HTML
			function smallButtonDisabled (name) {

				var button = '<div class="smallButton smallButtonDisabled">' + name + '</div>';
				return button;
			}

		// Get Flags
			function getFlags () {

				projects.cartItemCheck(bookId,function(){

					projects.getFlag('cart',function(html){

						$('#bookInfo_' + bookId).prepend(html);

					});

				},function(){

					projects.orderedItemCheck(bookId,function(){

						projects.getFlag('ordered',function(html){

							$('#bookInfo_' + bookId).prepend(html);

						})

					},function(){

						projects.getFlag('started',function(html){

							$('#bookInfo_' + bookId).prepend(html);

						})

					});

				});
			}

		// Format the product_type and product_code strings
			function formatTitle () {

				projects.projectVersionCheck(book.product_id,function(){

					// v.0.1
					book.product_type = '';
					book.product_code = '';

				},function(){

					// v.0.3 - Format product_type
					projects.formatString(book.product_type,function(formatted){

						book.product_type = formatted;

					});

					// v.0.3 - Format product_code
					projects.formatString(book.product_code,function(formatted){

						book.product_code = formatted;

					});

				});

				var title = '<div class="strong">' + book.product_type + '</div>'
						  + book.product_code;

				return title;
			}

		// PREVIEW IMAGE
			function previewImage () {

				// Ordered Item
				projects.orderedItemCheck(bookId,function(){

					preview.compiled = '<div class="projects-bg-preview" style="background-image: url(' + preview.path.preview + ');"></div>';

				// Not an ordered item
				},function(){

					// Cart item
					projects.cartItemCheck(bookId,function(){

						preview.path.compiled = base.ee + preview.path.depreciated.edit + book.theme_id + '/' + bookId;
						preview.onclick = 'toolbox.topLoc(\'' + preview.path.compiled + '\')';

						projects.projectVersionCheck(book.entry_id,function(){

						// v.0.3
						},function(){

							// return url set by button functions
							preview.onclick = 'projects.editProject(\'' + bookId + '\')';

						});

					// Not a cart item
					},function(){

						preview.path.compiled = base.ee + preview.path.depreciated.open + book.theme_id + '/' + bookId;
						preview.onclick = 'toolbox.topLoc(\'' + preview.path.compiled + '\')';

						projects.projectVersionCheck(book.entry_id,function(){

						// v.0.3
						},function(){

							// return url set by button functions
							preview.onclick = 'projects.openProject(\'' + bookId + '\')';

						});

					});

				preview.compiled = '<div class="projects-bg-preview" style="background-image: url(' + preview.path.preview + ');" onclick="javascript: ' + preview.onclick + ';">';

				});
			}

		// REMOVE BUTTON ---------------------------------------------------------------------------------------------- //
			function buttonRemove () {

				// Cart item
				projects.cartItemCheck(bookId,function(){

					// No button
					button.remove.compiled = smallButtonDisabled('remove');

				// Not a cart item
				},function(){

					// Ordered Item
					projects.orderedItemCheck(bookId,function(){

						// REMOVE FROM ORDERED WITH ALERT
						button.remove.path.compiled = base.ee + button.remove.path.order + bookId;
						button.remove.compiled = smallButtonPrep('remove','toolbox.confirmAlert(\'' + button.remove.alert.order + '\',function(){},function(){ toolbox.topLoc(\'' + button.remove.path.compiled + '\'); })');

					// Started Item
					},function(){

						// REMOVE FROM PROJECTS WITH ALERT
						button.remove.path.compiled = base.ee + button.remove.path.project + bookId;
						button.remove.compiled = smallButtonPrep('remove','toolbox.confirmAlert(\'' + button.remove.alert.project + '\',function(){},function(){ toolbox.topLoc(\'' + button.remove.path.compiled + '\'); })');

					});

				});
			}

		// COPY BUTTON ------------------------------------------------------------------------------------------------ //
			function buttonCopy () {

				button.copy.path.compiled = base.px + button.copy.path.v3 + book.share_code + '&target=site%2Fcopy';
				button.copy.compiled = smallButtonPrep('copy','toolbox.topLoc(\'' + button.copy.path.compiled + '\')');
			}

		// SHARE BUTTON ----------------------------------------------------------------------------------------------- //
			function buttonShare () {

				button.share.onclick = 'share.show(\'' + bookId + '\',\'' + book.share_code + '\')';
				button.share.compiled = smallButtonPrep('share',button.share.onclick);
			}

		// START NEW BUTTON ------------------------------------------------------------------------------------------- //
			function buttonNew () {

				// v.0.1
				projects.projectVersionCheck(book.entry_id,function(){

					button.start_new.path.compiled = base.ee + button.start_new.path.depreciated + book.theme_id + '/' + bookId;
					button.start_new.compiled = smallButtonPrep('start new','toolbox.topLoc(\'' + button.start_new.path.compiled + '\')');

				// v.0.3
				},function(){

					button.start_new.onclick = 'projects.newProject(\'' + bookId + '\')';
					button.start_new.compiled = smallButtonPrep('start new',button.start_new.onclick);

				});
			}

		// ORDER BUTTON ----------------------------------------------------------------------------------------------- //
			function buttonOrder () {

				// Cart item
				projects.cartItemCheck(bookId,function(){

					button.order.txt = 'view cart';

				// Not a cart item
				},function(){

					// Ordered item
					projects.orderedItemCheck(bookId,function(){

						button.order.txt = 're-order';

					// New project
					},function(){

						button.order.txt = 'order';

					});

				});

				// Cart item
				projects.cartItemCheck(bookId,function(){

					button.order.path.compiled = base.ee + button.order.path.cart;
					button.order.compiled = smallButtonPrep(button.order.txt,'toolbox.topLoc(\'' + button.order.path.compiled + '\')');

				// Not a cart item
				},function(){
				
					// v.0.1
					projects.projectVersionCheck(book.entry_id,function(){

						button.order.path.compiled = base.ee + button.order.path.depreciated + book.theme_id + '/' + bookId;
						button.order.compiled = smallButtonPrep(button.order.txt,'toolbox.topLoc(\'' + button.order.path.compiled + '\')');

					// v.0.3
					},function(){

						button.order.path.compiled = base.ee + button.order.path.order + bookId + '/' + book.entry_id ;
						button.order.compiled = smallButtonPrep(button.order.txt,'toolbox.topLoc(\'' + button.order.path.compiled + '\')');

					});

				});
			}

		// EDIT BUTTON ------------------------------------------------------------------------------------------------ //
			// 1. Check if its an ordered item
			// 2. Check if it's a cart item
			// 3. Check the project version
			// 4. Check browser version

			function buttonEdit () {

				// Ordered Item
				projects.orderedItemCheck(bookId,function(){

					// No button
					button.edit.compiled = smallButtonDisabled('edit');

				// Not an Ordered item
				},function(){

					// Cart item
					projects.cartItemCheck(bookId,function(){

						button.edit.path.compiled = base.ee + button.edit.path.depreciated.edit + book.theme_id + '/' + bookId;
						button.edit.onclick = 'toolbox.topLoc(\'' + button.edit.path.compiled + '\')';

						projects.projectVersionCheck(book.entry_id,function(){
						
						// v.0.3
						},function(){

							button.edit.onclick = 'projects.editProject(\'' + bookId + '\')';
							preview.onclick = button.edit.onclick;

						});

					// Not a cart item
					},function(){

						button.edit.path.compiled = base.ee + button.edit.path.depreciated.open + book.theme_id + '/' + bookId;
						button.edit.onclick = 'toolbox.topLoc(\'' + button.edit.path.compiled + '\')';

						projects.projectVersionCheck(book.entry_id,function(){

						// v.0.3
						},function(){

							button.edit.onclick = 'projects.openProject(\'' + bookId + '\')';

						});

					});

					button.edit.compiled = smallButtonPrep('edit',button.edit.onclick);

				});
			}

		// Initialize book data
			var book = {

				entry_id: this.booksData[bookId].entry_id,
				theme_id: this.booksData[bookId].theme_id,
				product_id: this.booksData[bookId].product_id,
				product_type: this.booksData[bookId].product_type,
				product_code: this.booksData[bookId].product_code,
				share_code: this.booksData[bookId].share_code,
				preview: this.booksData[bookId].preview

			}

		// Initialize the selectors
			var selector = {

				preview: $('#bookPreview_' + bookId),
				preview_name: $('#bookName_' + bookId),
				edit: $('#bookEdit_' + bookId),
				share: $('#shareLinks')

			}

		// Initialize base urls
			var base = {

				px: '{pixfizz_url}',
				ee: '{site_url}'

			}

		// Initialize Image
			var preview = {

				compiled: '',
				onclick: '',
				path: {

					preview: base.px + book.preview + '?width=292px',
					compiled: '',
		
					depreciated: {

						open: 'index.php/account/depreciated_open/',
						edit: 'index.php/account/depreciated_edit/'

					}

				} 

			}

		// Initialize Buttons
			var button = {

				compiled: '',
				disabled: '<div class="projects-button"></div>',

				remove: {

					compiled: '',
					path: {

						compiled: '',
						project: 'index.php/account/remove_project/',
						order: 'index.php/account/remove_order/'

					},

					alert: {

						project: 'Are you sure you want to remove this project?',
						order: 'Are you sure? You will not be able to re-order this project.'

					}

				},

				copy: {

					compiled: '',
					path: { 

						compiled: '',
						v3: '/site/copy?preview=',
						depreciated: 'index.php/account/depreciated_copy/'

					}

				},

				edit: {

					compiled: '',
					onclick: '',
					path: {

						compiled: '',
						depreciated: {

							open: 'index.php/account/depreciated_open/',
							edit: 'index.php/account/depreciated_edit/'

						}

					}

				},

				share: {

					compiled: '',
					onclick: '',
					path: {

						compiled: '',
						share: 'index.php/account/projects/'

					}

				},
				
				start_new: {

					compiled: '',
					onclick: '',
					path: {

						compiled: '',
						depreciated: 'index.php/account/depreciated_new/'

					}

				},

				order: {

					compiled: '',
					txt: '',
					path: {

						order: 'index.php/store/add_book/',
						cart: 'index.php/store/',
						depreciated: 'index.php/account/depreciated_order/'

					}

				}

			}

		// Create the elements

			var title = formatTitle();

			getFlags();
			previewImage();

			buttonRemove();
			buttonCopy();
			buttonShare();
			buttonNew();
			buttonOrder();
			buttonEdit();

			button.compiled = '<div class="projects-buttonSpacer">' + button.remove.compiled + button.copy.compiled + button.edit.compiled + button.share.compiled + button.start_new.compiled + button.order.compiled + '</div>';

			selector.preview.append(preview.compiled);
			selector.preview_name.append(title);
			selector.edit.append(button.compiled);

			projects.saveShareLink(selector.share,book.share_code);

			success();
	}


	// FAVORITES --------------------------------------------------- //
	Books.prototype.loadLightbox = function (items,list,txt) { $('#pinnedFooter_' + list).load('{site_url}index.php/account/list/' + list + '/' + txt + '/' + items); }

var projects = new Books({

	category: '',
	thisType: '',
	projectItems: '',
	orderedItems: '',
	deletedItems: '',

	booksData: {}
});


// CART ------------------------------------------------------------------------------------------------------- //
function Items (details) {

	this.ciObject = details.ciObject;
	this.cartItems = details.cartItems;
	this.cartRows = details.cartRows;
	this.scrub = details.scrub;

	this.subtotals = details.subtotals;
	this.coupon = details.coupon;

	this.thisType = details.thisType;
	this.thisOrderValue = details.thisOrderValue;

	this.row = details.row;
}

	// Fetch the data for each cart item
	Items.prototype.fetchItems = function (){

		for (var x in this.row) {

			this.cartRows = projects.addItem(x,this.cartRows);

		}

		// Parse the books string
		projects.splitString(this.cartRows,'|',function(){

			// No cart items

		},function(rows){

			function doItAgain() {

				// Set next array count
				i++;

				// Keep going to next book
				if (i < len) {

					// Break physics
					// For each row - Pass row id and book id
					populate(rows[i],cart.row[rows[i]].book_id);

				} else {

					// Last call
					// Remove duplicates
					cart.scrubCart();

				}

			}

			function populate(rowId,bookId) {

				// We will remove this one
				cart.fetchItemData(rowId,bookId,function(){

					doItAgain();

				// Item is good
				},function(rowId,bookId){

					cart.populateItemData(rowId,bookId,function(){

						doItAgain();

					});

				});
			}

			// Start the show
			var i = 0;
			var len = rows.length;

			// For each row - Pass row id and book id
			populate(rows[i],cart.row[rows[i]].book_id);

		});
	}

	// GETS THE COUNT AND RETURNS TO THE HEADER
	Items.prototype.getCartHeader = function (count) {

		if (count > 0) {

			$('#cartCount').append('<div>' + count + '</div>');

		}
	}

	// Checks if it's a Pixfizz product or EE product
	Items.prototype.productCheck = function (item,eeProduct,pxProduct) {

		if ((item == 'CLASS') || (item == 'MISC')) { eeProduct(); }
		else { pxProduct(); }
	}

	// Get the book data from Pixfizz
	Items.prototype.fetchItemData = function (rowId,bookId,error,success) {

		// ee product
		this.productCheck(bookId,function(){

			projects.booksData[bookId] = {

				row_id: rowId,

				entry_id: cart.row[rowId].entry_id,
				product_code: cart.row[rowId].product_code,
				ee_preview_url: cart.row[rowId].ee_preview_url

			}

			success(rowId,bookId);

		// px product
		},function(){

			// Get Pixfizz Book Data
			var bookUrl = 'books/' + bookId + '.json';
			keychain.pf_wrapper(bookUrl, null, function(xhr){

				// ERROR
				toolbox.quietAlert('There was an error ' + xhr.status + ' finding the saved project ' + bookId);

				// Set checked to true
				var sel = '#delete_this_' + rowId;
				$(sel).attr('checked',true);
				cart.scrub = true;

				// keep going anyway
				error(rowId,bookId);

			}, function(book){

				// Check if it's an ordered item
				var orderValue = false;
				projects.itemCheck(bookId,projects.orderedItems,function(){

					// Status quo

				},function(){

					orderValue = true;

				});

				// SUCCESS - Save book data to the object
				projects.booksData[bookId] = {

					row_id: rowId,

					theme_id: cart.row[rowId].theme_id,
					entry_id: cart.row[rowId].entry_id,
					product_id: book.options.product_id,
					product_type: book.options.product_type,
					product_code: cart.row[rowId].product_code,
					share_code: book.share_code,
					preview: '/v1/books/' + bookId + '/preview.jpg',
					ee_preview_url: cart.row[rowId].ee_preview_url,
					return_url: cart.row[rowId].return_url,

					order_item: orderValue

				}

				success(rowId,bookId);

			}, 'get');

		});
	}

	// Populate HTML with book data
	Items.prototype.populateItemData = function (rowId,bookId,success) {

		// Prep button HTML
			function smallButtonPrep (name,action) {

				var button = '<div id="editButton" class="smallButton" onclick="javascript: ' + action + ';">' + name + '</div>';
				return button;
			}

		// Prep button HTML
			function smallButtonDisabled (name) {

				var button = '<div class="smallButton smallButtonDisabled">' + name + '</div>';
				return button;
			}

		// Format the product_type and product_code strings
			function formatTitle () {

				// ee product
				cart.productCheck(bookId,function(){

					book.product_type = bookId;

				// px product
				},function(){

					projects.projectVersionCheck(book.product_id,function(){

						// v.0.1
						book.product_type = '';

					},function(){

						// v.0.3 - Format product_type
						projects.formatString(book.product_type,function(formatted){

							book.product_type = formatted;

						});

					});

					// v.0.3 - Format product_code
					projects.formatString(book.product_code,function(formatted){

						book.product_code = formatted;

					});

				});

				var title = book.product_type + '<br>'
						  + book.product_code;

				return title;
			}

		// PREVIEW IMAGE
			function previewImage () {

				// ee product
				cart.productCheck(bookId,function(){

					preview.compiled = '<div class="cart-bg-preview" style="background-image: url(' + preview.path.ee + ');"></div>';

				// px product
				},function(){

					// Ordered item
					projects.orderedItemCheck(bookId,function(){

						preview.compiled = '<div class="cart-bg-preview" style="background-image: url(' + preview.path.px + ');"></div>';

					// New Item
					},function(){

						preview.compiled = '<div class="cart-bg-preview" style="background-image: url(' + preview.path.px + ');" onclick="' + button.edit.onclick + '"></div>';

					});

				});
			}

		// EDIT BUTTON ------------------------------------------------------------------------------------------------- //
			function buttonEdit () {

				// Ordered Item
				projects.orderedItemCheck(bookId,function(){

					button.edit.compiled = smallButtonPrep('projects','toolbox.docLoc(\'' + base.ee + button.edit.path + '\')');

				// Projects Item
				},function(){

					button.edit.compiled = smallButtonPrep('edit',button.edit.onclick);

				});
			}

		// START NEW BUTTON ------------------------------------------------------------------------------------------- //
			function buttonNew () {

				// v.0.1
				projects.projectVersionCheck(book.product_id,function(){

					button.start_new.path.compiled = base.ee + button.start_new.path.depreciated + book.theme_id + '/' + bookId;
					button.start_new.compiled = smallButtonPrep('start new','toolbox.docLoc(\'' + button.start_new.path.compiled + '\')');

				// v.0.3
				},function(){

					button.start_new.onclick = 'projects.newProject(\'' + bookId + '\')';
					button.start_new.compiled = smallButtonPrep('start new',button.start_new.onclick);

				});
			}

		// Initialize book data
			var book = {

				entry_id: projects.booksData[bookId].entry_id,
				theme_id: projects.booksData[bookId].theme_id,
				product_id: projects.booksData[bookId].product_id,
				product_type: projects.booksData[bookId].product_type,
				product_code: projects.booksData[bookId].product_code,
				share_code: projects.booksData[bookId].share_code,
				preview: projects.booksData[bookId].preview,
				ee_preview_url: projects.booksData[bookId].ee_preview_url,
				return_url: projects.booksData[bookId].return_url

			}

		// Initialize the selectors
			var selector = {

				preview: $('#previewImage_' + rowId),
				preview_name: $('#previewName_' + rowId),
				edit: $('#previewEdit_' + rowId)

			}

		// Initialize base urls
			var base = {

				px: '{pixfizz_url}',
				ee: '{site_url}'

			}

		// Initialize Image
			var preview = {

				compiled: '',

				path: {

					ee: projects.booksData[bookId].ee_preview_url,
					px: base.px + '/v1/books/' + bookId + '/preview.jpg?width=292px'

				}

			}

		// Initialize Buttons
			var button = {

				compiled: '',
				spacer: '<div style="display: table-cell; width: 8px;"></div>',

				edit: {

					compiled: '',
					onclick: 'projects.editProject(' + bookId + ')',
					path: 'index.php/account/projects'

				},

				start_new: {

					compiled: '',
					onclick: '',
					path: {

						compiled: '',
						return_url: book.return_url,
						depreciated: 'index.php/account/depreciated_new/'

					}

				}

			}

		// Put it all together
			var title = formatTitle();

			previewImage();

			// ee product
			cart.productCheck(bookId,function(){

				// Do nothing

			// px product
			},function(){

				buttonNew();
				buttonEdit();

				button.compiled = '<div class="cart-buttonSpacer">' + button.start_new.compiled + button.edit.compiled + '</div>';

				selector.edit.append(button.compiled);

			});

			selector.preview.append(preview.compiled);
			selector.preview_name.append(title);

			success();
	}

	// Checks all cart items for duplicates
	Items.prototype.scrubCart = function () {

		// Check each item in the string
		var itemCount = 0;

		// Check for duplicates
		for (var x in this.row) {

			// In all rows
			for (var y in this.row) {

				// ee product
				this.productCheck(this.row[y].book_id,function(){

					// Do nothing

				// px product
				},function(){

					// Count the times this book appears
					if (cart.row[y].book_id == cart.row[x].book_id) {

						itemCount++;

						// If there are multiples
						if (itemCount > 1) {

							// Set checked to true
							var sel = '#delete_this_' + y;
							$(sel).attr('checked',true);
							cart.scrub = true;

						}

					}

				});

			}

			itemCount = 0;

		}

		// Delete the duplicates if we need
		if (this.scrub) {

			$('#update_cart_form').submit();

		}
	}


	// ATTRIBUTES AND OPTIONS ---------------------

	// Create the DOM attributes
	Items.prototype.previewOptions = function (id) {

		var count = 0;
		var gate = false;
		var spacer = '';

		function descriptionCheck() {

			if (cart.row[id].field[x].description != '') {

				var d = '<div class="detailAttribute-description">' + cart.row[id].field[x].description + '</div>';
				return d;

			} else {
				return '';
			}

		}

		for (var x in cart.row[id].field) {

			if (cart.row[id].field[x].icon != '') {

				spacer += '<div id="attribute_container_' + x + '" class="detailAttribute" align="center">'
					   +	'<div>'
					   + 		'<div class="detailAttribute-bg" style="background-image: url(\'' + cart.row[id].field[x].icon + '\');"></div>'
					   + 		'<div class="detailAttribute-title">' + cart.row[id].field[x].title + '</div>'
					   +	'</div>'
					   +	'<div>'
					   +		descriptionCheck()
					   +	'</div>'
					   +  '</div>';

			}

		}

		if (gate) { spacer += '</div>'; }

		$('#attributes').append(spacer);
	}

	// Creates HTML for quantity pricing breakdown
	Items.prototype.previewPricing = function (id) {

		var title = '';
		var value = '';

		// Only output if more than 1 line item in pricing model
		var count = 0;
		for (var y in cart.row[id].pricing_model) {

			count += 1;
			if (count == 2) {

				for (var x in cart.row[id].pricing_model) {

					title += cart.row[id].pricing_model[x].title + '<br>';

					var subtotal = cart.getQuantityPrice(id,x);

					value += '$' + $.number(subtotal,2) + ' each<br>';

				}

				var html = '<div class="detailQuantityPricing">'
							+ '<div>'
								+ title
							+ '</div>'
							+ '<div>'
								+ value
							+ '</div>'
						 + '</div>';

				$('#pricing').prepend(html);

			}

		}
	}

	// Selected attributes html
	Items.prototype.formatAttributes = function (str,row) {

		projects.splitString(str,'|',function(){

			// No attributes

		},function(attributes){

			function attributeWrapper (title) {

				var wrapper = '<div class="cart-attributePreviewSpacer">'
							+ 	'<div class="optionItemBox">'
							+		title
							+ 	'</div>'
							+ '</div>';

				return wrapper;

			}

			for (var x in attributes) {

				attributeWrapper(attributes[x]);

				var html = attributeWrapper(attributes[x]);

				// Skip custom imprint
				cart.checkCustomImprint(attributes[x],function(){

				},function(){

					html = attributeWrapper('Return Address Imprinting, use<br><span class="strong">my shipping address</span>');
					$('#selected_attributes_' + row).append(html);

				},function(option){
					
					var html = attributeWrapper(option);
					$('#selected_attributes_' + row).append(html);

				});

			}
			
		});
	}

	// Get quantity from DOM
	Items.prototype.getQuantity = function (row) {

		var quantity = $('#product_quantity_' + row).val();

		// Check if minimum
		if (quantity == '' || parseInt(quantity) < cart.row[row].quantity_min) {

			quantity = cart.row[row].quantity_min;
			$('#product_quantity_' + row).val(quantity);

		}

		// Check if set
		var div = quantity / cart.row[row].quantity_set;
		if (div % 1 != 0 && quantity > 1) {

			div = parseInt(div) * cart.row[row].quantity_set;
			$('#product_quantity_' + row).val(div);

		}

		cart.row[row].quantity = parseInt(quantity);
		return quantity;
	}

	// Checks if NaN or 0
	Items.prototype.formatQuantity = function (qty) {

		var quantity = parseInt(qty);

		if (quantity < 1 || isNaN(quantity)) {

			return 1;

		} else {

			return quantity;

		}
	}

	// Check min and set quantity
	Items.prototype.checkQuantity = function (row) {

		var min = cart.formatQuantity(cart.row[row].quantity_min);
		var set = cart.formatQuantity(cart.row[row].quantity_set);

		if (set > 1) { $('#quantitySetNote_' + row).append('Sold in sets of ' + set); }
		if (min > 1 && min != set) { $('#quantityMinNote_' + row).append('Minimum quantity of ' + min); }
	}

	// Add to quantity count
	Items.prototype.addQuantity = function (row) {

		var quantity = parseInt(cart.getQuantity(row)) + cart.row[row].quantity_set;

		$('#product_quantity_' + row).val(quantity);
	}

	// Subtract from quantity count
	Items.prototype.subtractQuantity = function (row) {

		var quantity = parseInt(cart.getQuantity(row)) - cart.row[row].quantity_set;

		if (quantity < cart.row[row].quantity_min) { quantity = cart.row[row].quantity_min; }
		$('#product_quantity_' + row).val(quantity);
	}

	// Check for custom imprint field 
	Items.prototype.checkCustomImprint = function (option,yes,no,none) {

		if (option == 'yes_alternate_imprinting' || option == 'Yes, use alternate address') {

			yes(option);

		} else if (option == 'yes_shipping_imprinting' || option == 'Yes, use shipping address' || option == 'no_imprinting') {

			no(option);

		} else {

			none(option);

		}
	}

	// Check if custom imprint is used and throw alert
	Items.prototype.checkRequiredFields = function () {

		// Check if a field has a value
		function checkVal (el) {

			if ($(el).val().length == 0) { return true }
			else { return false }
		}

		// Check Each Custom Imprint Field
		var failed = false;

		for (var x in cart.row) {

			// If it's required
			if (cart.row[x].required == 'yes') {

				// Return alert if it's empty
				if (checkVal('#customImprint_' + x)) {

					failed = true;

					return "Your Alternate Address can't be blank";

				}

			}

		}

		return failed
	}

	// Check type of pricing
	Items.prototype.checkPricingModel = function (row,field,addOnce,addEach) {

		if (cart.row[row].field[field].pricing_model == 'Add price once') {
		
			addOnce();

		} else if (cart.row[row].field[field].pricing_model == 'Add price to each') {

			addEach();

		}
	}

	// Check if price is 0 or NaN
	Items.prototype.checkPrice = function (price,success,zero,nan) {

		if (price == 0) {

			zero(0);

		} else if (isNaN(price)) {

			nan(price);

		} else {

			success(price);

		}
	}

	// Checks selection type
	Items.prototype.checkSelectionType = function (row,field,checkbox,dropdown,radiobutton) {

		if (cart.row[row].field[field].selection_type == 'Checkbox ( multiple item selection )'){

			checkbox();

		} else if (cart.row[row].field[field].selection_type == 'Drop-Down ( single item selection )'){

			dropdown();

		} else if (cart.row[row].field[field].selection_type == 'Radio-Buttons ( single item selection )'){

			radiobutton();

		}
	}

	// Check if option is selected
	Items.prototype.checkIfSelected = function (title,str,success) {

		projects.splitString(str,'|',function(){

			// No attributes

		},function(attributes){

			for (var z in attributes) {

				if (attributes[z] == title) {

					success(title);

				}

			}
			
		});
	}

	// Checks if there is a color for this attribute
	// Return color
	Items.prototype.checkColor = function (row,field,option,success) {

		if (cart.row[row].field[field].option[option].color != '{color}' && cart.row[row].field[field].option[option].color != '') {

			success(cart.row[row].field[field].option[option].color);

		}
	}

	// Create the option DOM
	Items.prototype.createOption = function (row,field,attributes) {

		// Only if item doesn't already exist
		if (!$('#attribute_container_' + row + '_' + field).length) {

			// If icon exists
			var icon = '';
			if (cart.row[row].field[field].icon != '') { icon = '<div class="cart-bg-attribute" style="background-image: url(\'' + cart.row[row].field[field].icon + '\');" align="right"></div>'; }

			// Main attribute spacer -------------------------------//
			var spacer = '<div id="attribute_container_' + row + '_' + field + '" class="cart-attributeSpacer" align="right">'
					   + 	'<div align="right">'
					   +		'<div class="cart-attribute">'
					   + 			icon
					   +			'<div align="right">' + cart.row[row].field[field].title + '</div>'
					   + 		'</div>'
   					   + 	'</div>'
					   + 	'<div>' + cart.row[row].field[field].description + '</div>'
					   + 	'<div id="option_container_' + field + '_' + row + '" align="right"></div>'
					   + '</div>';

			$('#attributes_container_' + row).append(spacer);

			// Attribute container ---------------------------------//
			var container = '';

			// If Checkbox method
			cart.checkSelectionType(row,field,function(){

				container += '<div id="option_' + field + '_' + row + '"></div>';

			// If Drop-Down method
			},function(){

				container += '<select onchange="cart.updateCartPrice();" id="option_' + field + '_' + row + '" name="item_options[' + row + '][' + field + ']"></select>'
						   + '<div id="color_' + field + '_' + row + '" class="cart-previewColor"></div>';

			// If Radio Buttons
			},function(){

				container += '<div id="option_' + field + '_' + row + '"></div>';

			});

			// Check all options for custom imprint
			for (var z in cart.row[row].field[field].option) {

				// If custom Imprinting is needed
				cart.checkCustomImprint(z,function(){

					container += '<textarea name="item_options[' + row + '][purchased_custom_imprinting]" id="customImprint_' + row + '" class="cart-customTextarea" placeholder="type your alternate address here">' + cart.row[row].custom_imprint + '</textarea>';

				},function(){

				},function(){

				});

			}

			$('#option_container_' + field + '_' + row).html(container);

			// Create attributes
			var count = 0;
			for (var x in cart.row[row].field[field].option) {

				var html = '';
				var color = '';
				count += 1;

				// If the option has a color
				cart.checkColor(row,field,x,function(value){

					color = '<div class="cart-attributeColorSpacer"><div class="cart-attributeColor" style="background-color: #' + value + ';"></div></div>';

				});

				// If Checkbox method
				cart.checkSelectionType(row,field,function(){

					html = '<div class="cart-attributeOptionSpacer">'
							+ color + '<span id="check_' + field + '_' + x + '_' + row + '"></span><input '
																							+ 'onchange="cart.updateCartPrice();" '
																							+ 'type="checkbox" '
																							+ 'name="check_' + field + '_' + row + '" '
																							+ 'id="option_' + field + '_' + x + '_' + row + '" '
																							+ 'value="' + x + '">'
						 + '</div>';

				// If Drop-Down method
				},function(){

					html = '<option id="option_' + field + '_' + x + '_' + row + '" value="' + x + '"></option>';

				// If Radio Button method
				},function(){

					html = '<div class="cart-attributeOptionSpacer">'
							+ color + '<span id="radio_' + field + '_' + x + '_' + row + '"></span><input '
																						+ 'onchange="cart.updateCartPrice();" '
																						+ 'type="radio"'
																						+ 'name="check_' + field + '_' + row + '" '
																						+ 'id="option_' + field + '_' + x + '_' + row + '" '
																						+ 'value="' + x + '"';

					if (count == 1) { html += ' checked="checked"'; }
					html += '></div>';

				});

				$('#option_' + field + '_' + row).append(html);

				// Check option selection and update DOM
				cart.checkIfSelected(cart.row[row].field[field].option[x].title,attributes,function(title){

					// If Checkbox method
					cart.checkSelectionType(row,field,function(){

						document.getElementById('option_' + field + '_' + x + '_' + row).setAttribute('checked','checked');

					// If Drop-Down method
					},function(){

						document.getElementById('option_' + field + '_' + x + '_' + row).setAttribute('selected','selected');

					// If Radio Button method
					},function(){

						document.getElementById('option_' + field + '_' + x + '_' + row).setAttribute('checked','checked');

					});

					// Open if it's a custom imprint field
					// Selected
					cart.checkCustomImprint(x,function(){

						cart.updateCustomImprint('customImprint_',row,'yes');

					// Close if it's a custom imprint field
					// Not Selected
					},function(){

						cart.updateCustomImprint('customImprint_',row,'no');

					},function(){

					});

				});

			}

		}
	}

	// Create the option DOM pricing
	Items.prototype.createOptionPrices =function (row) {

		// Go through each row option and update DOM
		for (var y in cart.row[row].field) {

			// Update all the DOM prices and titles for this option
			for (var x in cart.row[row].field[y].option) {

				var id = '';

				// If Checkbox method
				cart.checkSelectionType(row,y,function(){

					id = 'check_' + y + '_' + x + '_' + row;

				// If Drop-Down method
				},function(){

					id = 'option_' + y + '_' + x + '_' + row;

				},function(){

					id = 'radio_' + y + '_' + x + '_' + row;

				});

				$('#' + id).html(cart.row[row].field[y].option[x].title);

				function optionHTML (val) {

					cart.checkPrice(toolbox.floatPrice(val),function(price){

						$('#' + id).append(' +$' + $.number(price,2));
		
						// Check if ea is needed
						// If price added once
						cart.checkPricingModel(row,y,function(){

						// If price added to each
						},function(){

							$('#' + id).append('<span class="cart-attributeOptionPrice">ea</span>');

						});

					// Price zero
					},function(subtotal){

					// Price NaN
					},function(subtotal){

					});

				}

				var optionPrice = cart.row[row].field[y].option[x].price;
				var optionPercent = cart.row[row].field[y].option[x].percent;

				// Option Percent
				cart.checkOptionPercent(cart.getOverridePricing(row),optionPercent,function(value){

					optionHTML(value);

				// Option Dollar
				},function(){

					optionHTML(optionPrice);

				});

			}

		}
	}


	// PRICING AND QUANTITY -----------------------

	// Checks if there is a price override for product
	Items.prototype.checkOverride = function (id,str,success,fail) {

		//if (str == '' || cart.row[id].checked) {
		if (str == '') {

			fail();

		} else {

			success(str);

		}
	}

	// Checks for override percent
	Items.prototype.checkOverridePercent = function (price,str,success,fail) {

		if (str.match(/%/)) {

			var subtotal = (toolbox.floatPrice(str) / 100) * price;
			success(subtotal);

		} else {

			fail(price);

		}
	}

	// Checks if attribute price is by dollar amount of percent of item
	Items.prototype.checkOptionPercent = function (price,str,success,fail) {

		if (str != '{percent}' && str != '') {

			var subtotal = (toolbox.floatPrice(str) / 100) * price;
			success(subtotal);

		} else {

			fail(price);

		}
	}

	// Get price for that model
	Items.prototype.getQuantityPrice = function (row,model) {

		var finalPrice = cart.row[row].price;

		// Quantity Percent
		cart.checkOptionPercent(cart.getOverridePricing(row),cart.row[row].pricing_model[model].percent,function(value){

			finalPrice = value;

		// Quantity Dollar
		},function(){

			// Price override
			cart.checkOverride(row,cart.row[row].price_override,function(override){

				// Price override by percent
				cart.checkOverridePercent(toolbox.floatPrice(cart.row[row].pricing_model[model].price),override,function(subtotal){

					finalPrice = subtotal;

				// Price override by dollar
				},function(){

					finalPrice = toolbox.floatPrice(cart.row[row].pricing_model[model].price);

				});

			// No price override
			},function(){

				finalPrice = toolbox.floatPrice(cart.row[row].pricing_model[model].price);

			});

		});

		// Valid price
		cart.checkPrice(finalPrice,function(subtotal){

			finalPrice = subtotal;

		// Price zero
		},function(subtotal){

			finalPrice = 0;

		// Price NaN
		},function(subtotal){

			finalPrice = cart.row[row].price;

		});

		return finalPrice;
	}

	// Get quantity discount pricing
	Items.prototype.getQuantityPricing = function (row) {

		var subtotal = this.getOverridePricing(row);

		for (var x in cart.row[row].pricing_model) {

			// Check if quantity has a price break
			if (cart.getQuantity(row) >= parseInt(x)) {

				subtotal = cart.getQuantityPrice(row,x);

			}

		}

		return subtotal;
	}

	// Get lowest quantity price
	Items.prototype.getLowestPrice = function (row) {

		var subtotal = this.getOverridePricing(row);
		var quantity = 1;

		for (var x in cart.row[row].pricing_model) {

			// Check if quantity has a price break
			if (parseInt(x) >= quantity) {

				subtotal = cart.getQuantityPrice(row,x);

			}

		}

		return subtotal;
	}

	// Get override pricing
	Items.prototype.getOverridePricing = function (row) {

		var finalPrice = cart.row[row].price;

		cart.checkOverride(row,cart.row[row].price_override,function(override){

			// Price override by percent
			cart.checkOverridePercent(cart.row[row].price,override,function(subtotal){

				finalPrice = subtotal;

			// Price override by dollar
			},function(){

				finalPrice = toolbox.floatPrice(override);

			});

		},function(){

		});

		return finalPrice;
	}

	// Checks if row item uses quantity discounts
	Items.prototype.checkQuantityModel = function (row,single,quantity) {

		var qty = false;
		for (var t in cart.row[row].pricing_model) { qty = true; }

		if (!qty) {

			single();

		} else {
			
			quantity();

		}
	}

	// Gets final row prices and attributes
	Items.prototype.compileRowData = function (row,success) {

		var subtotals = {

			total: 0,
			each: 0,
			once: 0,
			item: 0,
			discount: 0,
			coupon: 0

		};

 		// Updates the option price and updates custom imprint and color selection
		function updateOption (field,option) {

			// Save attribute
			attributes = projects.addItem(cart.row[row].field[field].option[option].title,attributes);

			var optionPrice = cart.row[row].field[field].option[option].price;
			var optionPercent = cart.row[row].field[field].option[option].percent;

			function getOptionPrice (val) {

				// Check if a price exists
				cart.checkPrice(val,function(subtotal){

					// Save to once subtotal
					cart.checkPricingModel(row,field,function(){

						// Get dollar amount from percent
						subtotals.once += subtotal;

					// Save to each subtotal
					},function(){

						// Get dollar amount from percent
						subtotals.each += subtotal;

					});

				// Price zero
				},function(subtotal){

				// Price NaN
				},function(subtotal){

				});
			}

			// Option Percent
			cart.checkOptionPercent(cart.getOverridePricing(row),optionPercent,function(value){

				getOptionPrice(value);

			// Option Dollar
			},function(value){

				getOptionPrice(toolbox.floatPrice(optionPrice));

			});

			// Open if custom imprinting exists
			cart.checkCustomImprint(option,function(){

				cart.updateCustomImprint('customImprint_',row,'yes');

			// Close if no imprinting exists
			},function(){

				cart.updateCustomImprint('customImprint_',row,'no');

			},function(){

			});

			// If the option has a color
			cart.checkColor(row,field,option,function(color){

				var html = 	'<div class="optionItemBox optionColor" style="background-color: #' + color + ';"></div>'
				$('#color_' + field + '_' + row).html(html);

			});
		}

		// Get item discount price for each row
		function getCouponDiscount (price) {

			function newPrice () {

				var p = price;
				var d = 0;

				// Discount by percent
				cart.checkOverridePercent(p,cart.coupon[coupon].itemDiscount,function(subtotal){

					d = p - subtotal;

				// Discount by dollar
				},function(){

					d = toolbox.floatPrice(cart.coupon[coupon].itemDiscount);

				});

				// We have a price override and a discount
				if (!isNaN(p) && !isNaN(d)) {

					var s = p - d;
					if (s < 0) { return 0; }
					else { return s; }

				// We have a price override
				} else if (!isNaN(p)) {

					return p;

				// We have a discount
				} else if (!isNaN(d)) {

					var s = price - d;
					if (s < 0) { return 0; }
					else { return s; }

				// We have nothing
				} else {

					return price;

				}
			}

			var subtotal = 0;
			var coupon = cart.row[row].coupon;

			// Check for coupon override
			if (coupon != '') {

				// Under coupon limits
				cart.checkCouponQuantity(cart.getQuantity(row),row,function(){

				// Within coupon limits
				},function(){

					cart.coupon[coupon].quantityCount += cart.getQuantity(row);
					subtotal = (newPrice() - price) * (-1);

				// Over coupon limits
				},function(max){

					cart.coupon[coupon].quantityCount += cart.row[row].quantity;
					subtotal = (((newPrice() - price) / cart.getQuantity(row)) * max) * (-1);

				});

			}

			return subtotal;
		}

		// If single price
		this.checkQuantityModel(row,function(){

			subtotals.item = toolbox.preciseRound(cart.getOverridePricing(row),2);

		// If quantity model
		},function(){

			subtotals.item = toolbox.preciseRound(cart.getQuantityPricing(row),2);

		});

		// For each selected option in this row add to the price.each 
		for (var x in cart.row[row].field) {

			var attributes = '';

			// Get all selected
			$('select[name="item_options[' + row + '][' + x + ']"]').each(function() {

				updateOption(x,this.value);

			});

			// Get all checked
			$('input:checked[name="check_' + x + '_' + row + '"]').each(function() {

				updateOption(x,this.value);

			});

			// Save all attributes for this row
			cart.row[row].field[x].selected_options = attributes;
		}

		// Get quantity and product pricing discount
		subtotals.discount = toolbox.preciseRound(cart.getOverridePricing(row),2) - subtotals.item;
		subtotals.coupon = getCouponDiscount(subtotals.item);
		subtotals.total = (subtotals.item - subtotals.coupon + subtotals.each) * cart.getQuantity(row) + subtotals.once;
		if (subtotals.total < 0) { subtotals.total = 0; }

		success(subtotals);
	}

	// Adds all rows for total cart price
	Items.prototype.compileTotalPrice = function (success) {

		var subtotals = {

			total: 0,
			itemDiscount: 0,
			cartDiscount: 0

		};

		// Add all row totals
		for (var x in cart.row) {

			subtotals.itemDiscount += (cart.row[x].subtotals.coupon + cart.row[x].subtotals.discount) * cart.row[x].quantity;
			subtotals.total += cart.row[x].subtotals.total;

		}

		if (subtotals.itemDiscount < 0) { subtotals.itemDiscount = 0; }
		if (subtotals.total < 0) { subtotals.total = 0; }

		cart.checkCoupon(function(coupon){

			// Check price minimum
			cart.checkCouponPrice(coupon,subtotals.total,function(){

				// Cart discount by percent
				cart.checkOverridePercent(subtotals.total,cart.coupon[coupon].cartDiscount,function(subtotal){

					subtotals.cartDiscount = subtotals.total - subtotal;

				// Cart discount by dollar
				},function(){

					subtotals.cartDiscount = toolbox.floatPrice(cart.coupon[coupon].cartDiscount);

					// No cart discount
					if (isNaN(subtotals.cartDiscount)) {

						subtotals.cartDiscount = 0;

					}

				});

			});

		},function(){

		});

		success(subtotals);
	}


	// UPDATE THE DOM -----------------------------

	// Updates all the prices for the row DOM
	Items.prototype.updateRowPrice = function (row) {

		// Update total price and attributes for row
		cart.compileRowData(row,function(subtotals){

			// Row prices
			$('#row_subtotal_' + row).html('$' + $.number(subtotals.each + subtotals.item,2) + '<span class="small">ea</span>');
			if (cart.row[row].quantity > 0) { $('#row_subtotal_' + row).append(' <span class="small">( x' + cart.row[row].quantity + ' )</span>'); }
			if (subtotals.once != 0) { $('#row_subtotal_' + row).append('&nbsp;&nbsp;+ $' + $.number(subtotals.once,2)); }

			// Discount
			if (subtotals.discount != 0) { $('#row_discount_' + row).html('Discount&nbsp;&nbsp;$' + $.number(subtotals.discount * cart.row[row].quantity,2) + '<br>'); }
			else { $('#row_discount_' + row).html(''); }

			// Coupon
			if (subtotals.coupon != 0) { $('#row_coupon_' + row).html('<span class="strong">' + cart.row[row].coupon + '</span>&nbsp;&nbsp;$' + $.number(subtotals.coupon * cart.row[row].quantity,2) + '<br>'); }
			else { $('#row_coupon_' + row).html(''); }

			// Subtotal
			$('#row_total_' + row).html('Subtotal&nbsp;&nbsp;<span class="strong">$' + $.number(subtotals.total,2) + '</span>');

			// Save each options selections to the row attribute list
			var total_selected_options = '';
			for (var z in cart.row[row].field) {

				// Add this field's selected attributes
				var selected = cart.row[row].field[z].selected_options;
				if (selected != '') { total_selected_options = projects.addItem(selected,total_selected_options); }

			}

			// Save the data to the DOM for submit
			$('#attributes_' + row).val(total_selected_options);

			// Save back to the object for cart price calculation
			cart.row[row].subtotals = subtotals;

		});
	}

	// Update the cart total price DOM
	Items.prototype.updateCartPrice = function () {

		// Update all rows
		for (var x in cart.coupon) { cart.coupon[x].quantityCount = 0; }
		for (var x in cart.row) { cart.updateRowPrice(x); }

		// Update total cart price
		cart.compileTotalPrice(function(subtotals){

			// Discount
			var totalDiscount = subtotals.itemDiscount + subtotals.cartDiscount;
			if (totalDiscount != 0) { $('#cart_discount_price').html('<span class="light">Discount</span>&nbsp;&nbsp;$' + $.number(totalDiscount,2)); }
			else { $('#cart_discount_price').html(''); }

			// Total
			$('#cart_total_price').html('<span class="strong">Subtotal</span>&nbsp;&nbsp;$' + $.number(subtotals.total - subtotals.cartDiscount,2));

			// Save back to cart object
			cart.subtotals = subtotals;

			// Distribute cart discount along all rows
			for (var x in cart.row) {

				var rowPrice = (cart.row[x].subtotals.total - cart.getCartDiscount(subtotals.cartDiscount)) / cart.getQuantity(x);

				$('#price_' + x).val(rowPrice);

			}

		});
	}

	// Custom imprint textarea
	Items.prototype.updateCustomImprint = function (el,row,action) {

		function setUpdateHeight (visibility,height,marginBottom,position) {

			var ci = el + row;

			document.getElementById(ci).style.visibility = visibility;
			document.getElementById(ci).style.height = height;
			document.getElementById(ci).style.position = position;
			document.getElementById(ci).style.marginBottom = marginBottom;
		}

		if (action == 'yes') {

			// adjust the update button height and visibility.
			setUpdateHeight('visible','80px','40px','relative');

		} else if (action == 'no') {

			// Clear the value
			document.getElementById(el+row).value = '';

			// adjust the update button height and visibility.
			setUpdateHeight('hidden','0','0','absolute');
		}

		this.row[row].required = action;
	}

	// Updates DOM flag
	Items.prototype.updateFlagStatus = function (status,id) {

		if (status == "Sale") {

			$('#product_flag_' + id).html('<div class="thumb-bg-flag-sale"></div>');

		}
	}

	// Updates price and flag in the DOM
	Items.prototype.updatePriceDetails = function (id) {

		// If single price
		this.checkQuantityModel(id,function(){

			$('#product_price_' + id).html('$' + $.number(cart.getOverridePricing(id),2));

		// If quantity model
		},function(){

			$('#product_price_' + id).html('as low as $' + $.number(cart.getLowestPrice(id),2) + '<span class="small">ea</span>');

		});

		cart.updateFlagStatus(cart.row[id].pricing_status,id);
	}

	Items.prototype.javascript_price_validation = function () {

		return true;
	}


	// CHECK EVERYTHING FOR SUBMIT
	Items.prototype.submitCart = function () {

		// IF ERROR OCCURED - ALERT FIELD ERROR
		var fieldError = this.checkRequiredFields();

		if (fieldError) {

			alert(fieldError);

			return false

		}

		// OTHERWISE SUBMIT THE FORM
		else { return true }
	}


	// COUPON ------------------------------------

	Items.prototype.submitCoupon = function () {

		var coupon = $('#couponInput').val();

		if (coupon != '') {

			toolbox.docLoc('{site_url}index.php/store/coupon/' + coupon);

		}
	}

	Items.prototype.prepCouponHTML = function (coupon) {

		var html = '<div align="right" class="cartFieldGroup strong" align="right">Coupon Code</div>'

				 + '<div class="cart-couponInput">'
				 + 		'<div><div class="smallButton" onclick="javascript: cart.submitCoupon();">Update</div></div>'
				 + 		'<div><input id="couponInput" type="text" placeholder="' + coupon + '"></div>'
				 + '</div>';

		return html;
	}

	// Checks if coupon exists
	Items.prototype.checkCoupon = function (valid,none) {

		var count = 0;

		// Check for coupon
		for (var x in cart.coupon) {

			count += 1;
			if (count == 1) { valid(x); }

		}

		// If a coupon does not exist
		if (count == 0) {

			none();

		}
	}

	// Checks if user has used this coupon
	Items.prototype.checkCouponUsage = function (coupon,valid,invalid) {

		// Coupon's usage is limited
		if (this.coupon[coupon].usageLimit) {

			// No coupons used - coupon is valid
			projects.splitString(keychain.userCoupons,'|',function(){

				valid();

			// User has used coupons
			},function(parts){

				var c = false;

				for (var i=0, len=parts.length; i < len; i++) {

					// check if coupon exists in user account
					if (parts[i] == coupon) {

						// Coupon has been used
						c = true;
						invalid(parts[i]);

					}

				}

				if (!c) { valid(); }

			});

		// Not limited
		} else { valid(); }
	}

	// Returns a per item discount for a total cart discount
	Items.prototype.getCartDiscount = function (price) {

		var d = 0;
		var c = 0;

		for (var x in cart.row) { c += 1; }
		d = toolbox.floatPrice(price) / c;

		return d;
	}

	// Checks min and max quantity limits
	Items.prototype.checkCouponQuantity = function (qty,row,under,within,over) {

		function checkNaN (q,r) {

			if (isNaN(q)) { return r; }
			else {

				var m = q - cart.coupon[coupon].quantityCount;
				if (m < 0) { return 0; } else { return m; }

			}
		}

		var coupon = cart.row[row].coupon;
		var qtyMin = checkNaN(cart.coupon[coupon].quantityMin,0);
		var qtyMax = checkNaN(cart.coupon[coupon].quantityMax,999999);

		if (qty < qtyMin) {

			under(qtyMin);

		} else if (qty <= qtyMax) {

			within(qty);

		} else {

			over(qtyMax);

		}
	}

	// Checks if the coupon has a cart total minimum
	Items.prototype.checkCouponPrice = function (coupon,total,success) {

		var price = toolbox.floatPrice(this.coupon[coupon].priceMin);

		if (isNaN(price)) { price = 0; }

		if (total >= price) {

			success();

		}
	}

	// Display coupon code
	Items.prototype.prepCoupon = function () {

		// We have a coupon
		this.checkCoupon(function(coupon){

			// HTML already preped
			$('#couponCode').html(cart.coupon[coupon].inputHTML);

		// No coupon
		},function(){

			// Prep HTML
			$('#couponCode').html(cart.prepCouponHTML(''));

		});
	}

	// Save valid coupon to the object
	Items.prototype.saveCoupon = function (el) {

		var coupons = $(el).val();

		this.checkCoupon(function(coupon){

			coupons = projects.addItem(coupon,coupons);
			$(el).val(coupons);

		},function(){

		});
	}

	// Output total at checkout
	Items.prototype.checkoutTotal = function (total,tax,shipping) {

		$('#cart_total_price').html('<span class="light">Subtotal</span>&nbsp;&nbsp;$' + $.number(toolbox.floatPrice(total) - toolbox.floatPrice(tax),2));
		$('#cart_total_tax').html('<span class="light">Tax</span>&nbsp;&nbsp;$' + $.number(toolbox.floatPrice(tax),2));

		cart.checkPrice(toolbox.floatPrice(shipping),function(price){

			$('#cart_shipping').html('<span class="light">Shipping</span>&nbsp;&nbsp;$' + $.number(price,2));

		},function(){

		});

		$('#cart_final_price').html('Total&nbsp;&nbsp;$' + $.number(toolbox.floatPrice(total),2));
	}

var cart = new Items({

	ciObject: {},
	cartItems: '',
	cartRows: '',
	scrub: false,

	subtotals: {},
	coupon: {},

	thisType: '',
	thisOrderValue: false,

	row: {}
});


// MEMBER ----------------------------------------------------------------------------------------------------- //
function Customer (details) {

	this.copyBilling = details.copyBilling;
	this.shipping = details.shipping;
	this.pickupLocations = details.pickupLocations;

	this.gatewaySelect = details.gatewaySelect;
}

	// Clear all the fields with the passed string
	Customer.prototype.updateValues = function (val,stateVal){

		function updateVal (el,value) { $(el).val(value); }

		updateVal('#shipping_first_name',val);
		updateVal('#shipping_last_name',val);
		updateVal('#shipping_address',val);
		updateVal('#shipping_address2',val);
		updateVal('#shipping_city',val);
		updateVal('#shipping_state',stateVal);
		updateVal('#shipping_zip',val);
	}

	// Copy Billing to Shipping
	Customer.prototype.copyValues = function (){

		function copyVal (el1,el2) { $(el1).val( document.getElementById(el2).value ); }

		copyVal('#shipping_first_name','first_name');
		copyVal('#shipping_last_name','last_name');
		copyVal('#shipping_address','address');
		copyVal('#shipping_address2','address2');
		copyVal('#shipping_city','city');
		copyVal('#shipping_state','state');
		copyVal('#shipping_zip','zip');
	}

	// Hide or Show the element
	Customer.prototype.changeElement = function (el,state) {
		if (state == true) {
			document.getElementById(el).style.visibility = 'visible';
			document.getElementById(el).style.height = 'auto';
			document.getElementById(el).style.paddingBottom = '30px';
		} else {
			document.getElementById(el).style.visibility = 'hidden';
			document.getElementById(el).style.height = '0px';
			document.getElementById(el).style.paddingBottom = '0px';
		}
	}

	Customer.prototype.setChoice = function (st1,st2) {
		this.changeElement('shipping',st1);
		return st2;
	}

	Customer.prototype.setChecked = function (el) {
		var checkBox = document.getElementById(el);
		if (checkBox.checked){ this.copyBilling = this.setChoice(false,true); }
		else { this.copyBilling = this.setChoice(true,false); }
	}

	// Select Shipping or In-Store Pickup - set the global Shipping variable so checkFieldError knows whether to check Shipping fields
	Customer.prototype.changeBilling = function (st) {
		this.changeElement('shipping',st);
		document.getElementById('copyBilling').checked = false;
		this.copyBilling = false;
		this.changeElement('copyBillingGroup',st);
	}

	Customer.prototype.setBilling = function (st,state) {
		this.updateValues('',state);
		this.changeBilling(st);
		return st;
	}

	// Check the selection and set the shipping or pickup status
	Customer.prototype.testValue = function (selection) {

		if (selection.value == 'Deliver to my shipping address') {
			this.shipping = this.setBilling(true,'');
		} else {
			var storeState = this.pickupLocations[selection.value].state; 
			this.shipping = this.setBilling(false,storeState);
		}
	}

	// CHECK EVERYTHING FOR SUBMIT
	// Check Required fields - return true if all pass or return the field error string 
	Customer.prototype.checkRequiredFields = function () {

		// Check if a field has a value
		function checkVal (el) {

			if ($(el).val().length == 0) { return true }
			else { return false }
		}

		function checkLength (el,ln) { if ($(el).val().length < ln) { return true } }

		// Check if 2 fields match
		function checkMatch (el1,el2) {

			if ($(el1).val() == $(el2).val()) { return false }
			else { return true }
		}

		// Check these values if customer is Registering
		if($('#registration').length){

			// Check Registration Email
			if (checkVal('#registerEmail')) { return "Email can't be blank"; }
			else if (checkVal('#confirmEmail')) { return "Email Confirm can't be blank"; }
			else if (checkMatch('#registerEmail','#confirmEmail')) { return "Your Email Addresses don't match"; }

			// Check Registration Password
			else if (checkVal('#registerPassword')) { return "Password can't be blank"; }
			else if (checkLength('#registerPassword',5)) { return "Your Password must be at least 5 characters long"; }
			else if (checkVal('#confirmPassword')) { return "Password Confirm can't be blank"; }
			else if (checkMatch('#registerPassword','#confirmPassword')) { return "Your Passwords don't match"; }

		}

		// Check Billing values
		if (checkVal('#phone')) { return "Your Phone Number is required"; }
		else if (checkVal('#first_name')) { return "Your Billing First Name is required"; }
		else if (checkVal('#last_name')) { return "Your Billing Last Name is required"; }
		else if (checkVal('#address')) { return "Your Billing Address is required"; }
		else if (checkVal('#city')) { return "Your Billing City is required"; }
		else if (checkVal('#state')) { return "Your Billing State is required"; }
		else if (checkVal('#zip')) { return "Your Billing Zip Code is required"; }
		else if (checkLength('#zip',5)) { return "Your Billing Zip is incorrect"; }

		// Check if customer is Shipping
		else if (this.shipping) {

			// Check Shipping values
			if (checkVal('#shipping_first_name')) { return "The Shipping First Name is required"; }
			else if (checkVal('#shipping_last_name')) { return "The Shipping Last Name is required"; }
			else if (checkVal('#shipping_address')) { return "The Shipping Address is required"; }
			else if (checkVal('#shipping_city')) { return "The Shipping City is required"; }
			else if (checkVal('#shipping_state')) { return "The Shipping State is required"; }
			else if (checkVal('#shipping_zip')) { return "The Shipping Zip Code is required"; }
			else if (checkLength('#shipping_zip',5)) { return "Your Shipping Zip is incorrect"; }
			else { return false }

		} else { return false }
	}

	Customer.prototype.setGateway = function (gateway){

		this.gatewaySelect = gateway.value;

		if (this.gatewaySelect == 'ct_save_order') {
			
			toolbox.docLoc('/index.php/store/checkout/' + this.gatewaySelect);

		} else {

			toolbox.docLoc('/index.php/store/checkout');

		}
	}

	// SUBMIT THE FORM
	// Check for a field error - return Callback if none exist
	Customer.prototype.submitCustomer = function () {

		// IF COPY BILLING IS SELECTED
		if (this.copyBilling) { this.copyValues(); }

		// IF ERROR OCCURED - ALERT FIELD ERROR
		var fieldError = this.checkRequiredFields();

		if (fieldError) { alert(fieldError); }
		// OTHERWISE SUBMIT THE FORM
		else { document.saveCustomer.submit(); }
	}

var member = new Customer({

	copyBilling: false,
	shipping: true,
	pickupLocations: {},

	gatewaySelect: 'authorize_net'
});