// JavaScript Document


// LIGHTBOX --------------------------------------------------------------------------------------------------- //
$(window).load(function() { $('#pinnedFooter').pinFooter(); });
$(window).resize(function() { $('#pinnedFooter').pinFooter(); });

function Collection (details) {

	this.totalResults = details.totalResults;
	this.categoryId = details.categoryId;
	this.category = details.category;
	this.favoriteItems = details.favoriteItems;
	this.recentItems = details.recentItems;
	this.boxLocation = details.boxLocation;
}

	// Open if not already and make selected Lightbox active
	Collection.prototype.showLightbox = function (closing,opening) {

		// Slide open
		toolbox.classReplacer('footerBox','footerBox footerBoxOpen');
		toolbox.classReplacer('pinnedFooter','visibilityLarge pinnedFooter pinnedFooterOpen');

		// Make inactive Lightboxes transparent
		toolbox.classReplacer('pinnedFooter_' + closing,'transparent');
		
		// Set the Lightbox header styles
		toolbox.classReplacer('title_' + closing,'pinnedFooterHeader pinnedFooterTxtLink ghost');
		toolbox.classReplacer('title_' + opening,'pinnedFooterHeader');
		
		// Make active Lightbox opaque and hide inactive
		setTimeout(function(){
			toolbox.classModifier('pinnedFooter_' + closing,'inactive');
			toolbox.classReplacer('pinnedFooter_' + opening,'active opaque');
		}, 500);
	}

	// Close Lightboxes
	Collection.prototype.hideLightbox = function () {

		// Slide closed
		toolbox.classReplacer('footerBox','footerBox footerBoxClosed');
		toolbox.classReplacer('pinnedFooter','visibilityLarge pinnedFooter pinnedFooterClosed');

		function setClasses (el) {
			toolbox.classReplacer('pinnedFooter_' + el,'transparent');
			toolbox.classReplacer('title_' + el,'pinnedFooterHeader pinnedFooterTxtLink');
		}

		setClasses('favorites');
		setClasses('recents');
	}

	// Lightbox management
	Collection.prototype.loadLightbox = function (items,list,txt) { $('#pinnedFooter_' + list).load('{site_url}index.php/' + this.boxLocation + '/list/' + list + '/' + txt + '/' + items); }
	Collection.prototype.addItems = function (entryId,list) { 		$('#pinnedFooter_' + list).load('{site_url}index.php/lightbox/add/' + entryId + '/' + list); }
	Collection.prototype.addAll = function (list) { 				$('#pinnedFooter_' + list).load('{site_url}index.php/lightbox/add_all/' + list); }
	Collection.prototype.moveItems = function (entryId,list) { 		$('#pinnedFooter_' + list).load('{site_url}index.php/lightbox/move/' + entryId + '/' + list); }
	Collection.prototype.removeItems = function (entryId,list) { 	$('#pinnedFooter_' + list).load('{site_url}index.php/lightbox/remove/' + entryId + '/' + list); }
	Collection.prototype.clearItems = function (list) { 			$('#pinnedFooter_' + list).load('{site_url}index.php/lightbox/clear/' + list); }
	Collection.prototype.refreshLightbox = function (list) { 		$('#pinnedFooter_' + list).load('{site_url}index.php/lightbox/load/' + list); }

	// SET LIGHTBOX COUNT
	Collection.prototype.setLightboxCount = function (el,count) { document.getElementById(el).innerHTML = count; }

var lightbox = new Collection({

	totalResults: 0,
	categoryId: 0,
	category: '',
	favoriteItems: '',
	recentItems: '',
	boxLocation: 'lightbox'
});