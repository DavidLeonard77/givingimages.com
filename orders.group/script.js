// JavaScript Document ---------------------------------------------------------------------------------------- //
// Developed by David Leonard
// Copyright Lakeside Camera Photoworks, LLC

// ORDERS ----------------------------------------------------------------------------------------------------- //
function Process (details) {

	this.loading = details.loading;
	this.order = details.order;
	this.totals = details.totals;
	this.view = details.view;
}

	// Deletes PDF file
		// Process.prototype.deleteFile = function (fileId,error,success) {

		// 	var url = 'files/' + fileId + '.json';

		// 	keychain.pf_wrapper(url,null,function(xhr){

		// 		toolbox.quietAlert('There was an error ' + xhr.status + ' deleting ' + fileId);
		// 		error();

		// 	},function(returnedData){

		// 		success();

		// 	},'delete');
		// }

	// Process PDF file
	Process.prototype.processOrder = function (orderId,success) {

		orders.getItemCount(orderId,function(itemCount){

			function processItem (bookId) {

				orders.createFile(bookId,function(){

					// Set next array count
					i++;

					// Keep going to next item
					if (i <= itemCount) {

						// Break physics
						processItem(orders.order[orderId].item[i].id);

					} else {

						// We're done
						success();

					}

				});
			}

			// Start the show
			var i = 1;
			processItem(orders.order[orderId].item[i].id);

		});
	}

	// Process all new orders
	Process.prototype.processOrders = function (success) {

		orders.getOrderCount(function(process){

			function processOrder (orderId) {

				// Checks is the item department matches filtered order view
				function departmentMatch (success) {

					// If view all departments
					if (orders.view.department == 0) success();

					// Or if department matched
					else {

						var d = 0;
						for (var item in orders.order[orderId].item) if (orders.order[orderId].item[item].department == orders.view.department) d++;
						if (d != 0) success();

					}
				}

				// Checks if the order status matches the filtered order view
				function statusMatch (success) {

					if (orders.view.status == '{order_status_all}' || orders.view.status == 'New Order') success();

				}

				// Keep going to next order
				if (c < process.length) {

					var el = '#order_status_' + orderId;

					// Status match
					statusMatch(function(){

						// Department match
						departmentMatch(function(){

							// create order row container
							$('#displayOrders').prepend('<div id="orderRow_' + orderId + '" class="orderRow-order">' + orders.loading + '</div>');
							$('.orderRow-loading').css({'margin-top':'-2px'});
							
						});

					});

					orders.processOrder(orderId,function(){

						// Output hidden form elements
						orders.getDepartments(orderId,function(){

							// Prep SafeCracker form
							orders.postSafeCracker('form[name="updateOrderStatus_' + process[c] + '"]',function(form){

								$(form).submit();

							},function(form){

								// Set next array count
								c++;

								// Status match
								statusMatch(function(){

									// Department match
									departmentMatch(function(){
										
										// load the order in to the row container
										$('#orderRow_' + orderId).load('{site_url}index.php/orders/order/' + encodeURIComponent('{order_status_all}') + '/' + orders.view.department + '/' + orderId);

									});

								});

								// Break physics
								processOrder(process[c]);

							});

						});

					});

				} else {

					// We're done
					success();

				}
			}

			if (process.length > 0) {

				// Start the show
				var c = 0;
				processOrder(process[c]);

			} else {

				// We're done
				success();

			}

		});
	}

	// Update order
	Process.prototype.postSafeCracker = function (el,ready,done) {

		// Ajax EE Safecracker
		$(el).submit(function(event){

			// Prevent safecracker default submit
			event.preventDefault(); 

			var formData = $(this).serialize(),
				url = window.location.pathname,
				form = $(this),
				load = $('.fields');

			$.ajax({
				
				url: url,
				type: "POST",
				data: formData,

				error: function(jqXHR, textStatus, errorThrown) { toolbox.quietAlert('Ajax Error') },

				success: function(submitData) {

					if (submitData.match(/Error/)) toolbox.quietAlert('Matched Error');
					else {

						$.get(url, function(returnData) {

							var newXID = $(returnData).find('.ajax_save input[name="XID"]').val(),
								newData = $(returnData).find('.fields').html();
							form.find('input[name="XID"]').val(newXID);
							load.html(newData);

						});

						done();

					}

				}

			});

			return false;

		});

		ready(el);
	}

	// Get the order object and return array
	Process.prototype.getOrderCount = function (success) {

		var c = 0;
		var processed = [];
		for (var order in orders.order) {

			processed[c] = order;
			c++;

		};

		success(processed);
	}

	// Get the item count for the order and return
	Process.prototype.getItemCount = function (orderId,success) {

		var c = 0;
		for (var item in orders.order[orderId].item) c++;

		success(c);
	}

	// Get PDF file data
	Process.prototype.getFileName = function (bookId,fail,success) {

		var url = 'books/' + bookId + '/files.json';

		keychain.pf_wrapper(url,null,function(xhr){

			toolbox.quietAlert('There was an error ' + xhr.status + ' getting ' + bookId);
			fail();

		},function(returnedData){

			var book = [];

			if (returnedData[0]) book = returnedData.slice();
			else {

				book[0] = {
					status: 'Unprocessed',
					id: null,
					http_links: []
				};

			}

			success(book);

		},'get');
	}

	// Get all file names
	Process.prototype.getPDFs = function (orderId,success) {

		// Syncronous Ajax calls
		function getFiles (bookId) {

			// EE Product
			cart.productCheck(bookId,function(){

				i++;
				if (i <= c) getFiles(orders.order[orderId].item[i].id, function(){});
				else success(orderId);

			// Px Product
			},function(){

				// Ajax call for pdf and returns book array
				orders.getFileName(bookId,function(){

					i++;
					if (i <= c) getFiles(orders.order[orderId].item[i].id, function(){});
					else success(orderId);

				},function(book){

					orders.order[orderId].item[i].pdf = book.slice();

					i++;
					if (i <= c) getFiles(orders.order[orderId].item[i].id, function(){});
					else success(orderId);

				});

			});
		}
					
		// Get total count
		var c = 0;
		for (var x in orders.order[orderId].item) c++;

		// Get all file names
		var i = 1;
		getFiles(orders.order[orderId].item[i].id);
	}

	// Get row files
	Process.prototype.getOrderItem = function (orderId,item) {

		// EE Product
		cart.productCheck(orders.order[orderId].item[item].id,function(){

		// Px Product
		},function(){

			// Parses file name from url and returns link html
			function createLink (url) {

				var link = '';

				// Get filename from URL
				projects.splitString(url,'/',function(){

				},function(parts){

					link = '<a class="strong" href="' + url + '" target="_blank">' + parts[parts.length-1] + '</a><br>';

				});

				return link;
			}

			// Creates HTML button
			function createButton (action,txt) {

				// Add button
				var button = '<div class="smallButton" onclick="javascript: ' + action + ';">' + txt + '</div>'
				return button;
			}

			// Queued or started file
			function refreshItem () {

				// Refresh
				var action = 'orders.refreshItem(' + orderId + ',' + item + ')';
				var button = createButton(action,'REFRESH');

				return button;
			}

			// Deleted or Error file
			function processItem (bookId) {

				// Process
				var action = 'orders.createFile(\'' + orders.order[orderId].item[item].id + '\',function(){ orders.refreshItem(' + orderId + ',' + item + ') });';
				var button = createButton(action,'PROCESS');

				return button;
			}

			// What in a div
			function wrap (html) {

				var w = '<div>' + html + '</div>';
				return w;
			}

			var files = '';
			var pdf = orders.order[orderId].item[item].pdf.length-1;
			var book = orders.order[orderId].item[item].id;
			var status = orders.order[orderId].item[item].pdf[pdf].status;
			var msg = orders.order[orderId].item[item].pdf[pdf].error_message;
			var container = '<div id="file_' + book + '" class="fileInfo"><div id="pdfIcon_' + book + '">PDF</div></div>';

			$('#fileLink_' + book).append(container);

			switch (status) {

				// Completed
				case 'Completed':

					$('#pdfIcon_' + book).addClass('bgcolor-green');
					for (var l=0, len=orders.order[orderId].item[item].pdf[pdf].http_links.length; l<len; l++) files += createLink(orders.order[orderId].item[item].pdf[pdf].http_links[l]);
					$('#file_' + book).append(wrap(files));
					break;

				// Process
				case 'Error occurred':

					toolbox.quietAlert(msg);

					$('#pdfIcon_' + book).addClass('bgcolor-darkGrey');
					$('#file_' + book).append(wrap(status));
					$('#file_' + book).append(processItem(book));
					break;

				case 'Deleted':

					$('#pdfIcon_' + book).addClass('bgcolor-darkGrey');
					$('#file_' + book).append(wrap(msg));
					$('#file_' + book).append(processItem(book));
					break;

				// Refesh
				default:

					$('#pdfIcon_' + book).addClass('bgcolor-lightGrey');
					$('#file_' + book).append(wrap(status));
					$('#file_' + book).append(refreshItem(book));
					break;

			}

		});
	}

	// Get department for each item
	Process.prototype.getDepartments = function (orderId,success) {

		// Filter through items. Grab department category ids and save unique to object
		var dep = {};
		for (var item in orders.order[orderId].item) {

			var d = orders.order[orderId].item[item].department;
			if (d != '') dep[d] = { id: d };

		}

		// Each unique department create form element to save back to order
		for (var i in dep) $('#departments_' + orderId).append('<input type="hidden" name="category[]" value="' + i + '">');

		success();
	}

	// Link to order
	Process.prototype.getOrder = function () {

		var orderIdVal = $('#orderIdField').val();

		if ((orderIdVal.length > 0) && (orderIdVal != '0')) {

			orders.viewOrder(orderIdVal,orders.view.department);
			orders.resetStatus();

		} else alert('Please enter a valid order number');
	}

	// Gets the total ticket page count
	Process.prototype.getPageCount = function (orderId) {

		// Get the total unique department count. Return min 1
		var c = 0;
		for (var y in orders.order[orderId].department) c++;
		if (c > 0) return c;
		else return 1;
	}

	// Get and split attributes
	Process.prototype.createAttributes = function (orderId) {

		for (var i=1, len=orders.order[orderId].pageCount; i<=len; i++) {

			for (var z in orders.order[orderId].item) {

				projects.splitString(orders.order[orderId].item[z].attributes,'|',function(){

					// No attributes

				},function(attributes){

					for (var x in attributes) {

						$('#purchased_attributes_' + i + '_' + z).append(attributes[x] + '<br>');

					}

				});

			}

		}
	}

	// Outputs page numbers to DOM
	Process.prototype.createPagesNumbers = function (orderId) {

		for (var i=1, len=orders.order[orderId].pageCount; i<=len; i++) $('#ticketTotal_' + i).html(orders.order[orderId].pageCount);
	}

	// Checks PDF file status
	Process.prototype.createOrderItems = function (orderId) {

		for (var s in orders.order[orderId].item) orders.getOrderItem(orderId,s);
	}

	// Process PDF file
	Process.prototype.createFile = function (bookId,success) {

		cart.productCheck(bookId,function(){

			// EE Product
			success();

		},function(){
		
			var url = 'books/' + bookId + '/files.json';

			// Pixfizz Product - Process it
			keychain.pf_wrapper(url, null, function(xhr){

				toolbox.quietAlert('There was an error ' + xhr.status + ' creating the order ' + bookId);
				success();

			}, function(returnedData){

				success();

			},'post');

		});
	}

	// Get unique department count and load tickets
	Process.prototype.createTickets = function (orderId) {

		function loadTicket (dep) {

			$('#tickets').append('<div id="ticket_' + c + '" class="ticket"></div>');
			$('#ticket_' + c).load('{site_url}index.php/orders/print_ticket/' + orderId + '/' + dep + '/' + c);
		}
		
		// Get the total unique department count
		function getPageCount () {
			
			var p = 0;
			for (var y in orders.order[orderId].department) p++;
			if (p > 0) return p;
			else return 1;
		}

		var c = 0;
		orders.order[orderId].pageCount = getPageCount();

		// Load page for each unique department
		for (var dep in orders.order[orderId].department) {

			c++;

			// Get departments
			loadTicket(dep);

		}
	}

	// Ticket file name
	Process.prototype.createTicketFiles = function (orderId) {

		var c = 0;

		// Load page for each unique department
		for (var dep in orders.order[orderId].department) {

			c++;

			for (var x in orders.order[orderId].item) {

				var el = '#fileName_' + c + '_' + orders.order[orderId].item[x].id;

				for (var y in orders.order[orderId].item[x].pdf) {

					for (var z in orders.order[orderId].item[x].pdf[y].http_links) {

						projects.splitString(orders.order[orderId].item[x].pdf[y].http_links[z],'/',function(){

						},function(urlParts){

							$(el).append(urlParts[urlParts.length-1] + '<br>');

						});

					}

				}

			}

		}
	}

	// Output pricing to DOM
	Process.prototype.createPricing = function (orderId) {

		for (var i=1, len=orders.order[orderId].pageCount; i<=len; i++) {

			$('#order_subtotal_' + i).html('$' + toolbox.preciseRound(orders.order[orderId].totals.subtotal,2));
			$('#order_shipping_cost_' + i).html('$' + toolbox.preciseRound(orders.order[orderId].totals.shipping,2));
			$('#order_tax_' + i).html('$' + toolbox.preciseRound(orders.order[orderId].totals.tax,2));
			$('#order_total_' + i).html('$' + toolbox.preciseRound(orders.order[orderId].totals.total,2));
			$('#order_coupon_' + i).html(orders.order[orderId].totals.order_coupon);

			var payment = '#order_payment_status_' + i;
			if (orders.order[orderId].totals.payment == "Paid") $(payment).addClass('color-green');
			else $(payment).addClass('color-turquoise');
			$(payment).html(orders.order[orderId].totals.payment);

			for (var item in orders.order[orderId].item) $('#subtotal_' + i + '_' + item).html('$' + toolbox.preciseRound(orders.order[orderId].item[item].subtotal,2));

		}
	}

	// Creates the status select drop-down
	Process.prototype.createStatusSelect = function (status) {

		projects.splitString('{order_status_all}','|',function(){

		},function(parts){

			for (var c=0, len=parts.length; c<len; c++) $('select[name="status"]').append('<option value="' + parts[c] + '">' + parts[c] + '</option>');

			// Active status
			$('option[value="' + status + '"]').prop('selected', true);

		})
	}

	// Dim items not related to the department
	Process.prototype.checkItemRow = function (orderId,row,department,success) {

		if (orders.order[orderId].item[row].department != department && department != '0') success();
	}

	// Check to dim all detail rows
	Process.prototype.checkDetailRows = function (orderId,department) {

		for (var item in orders.order[orderId].item) {

			orders.checkItemRow(orderId,item,department,function(){

				$('#itemRow_' + item).css({'opacity':'0.5'});

			});

		}
	}

	// Check to dim all ticket rows
	Process.prototype.checkTicketRows = function (orderId) {

		// Load page for each unique department
		var c = 0;
		for (var dep in orders.order[orderId].department) {

			c++;

			for (var item in orders.order[orderId].item) {

				orders.checkItemRow(orderId,item,dep,function(){

					$('#itemRow_' + c + '_' + item).css({'color':'#999'});

				});

			}

		}
	}

	// Checks if it's time to print the page
	Process.prototype.checkPrintPage = function (orderId,success) {

		if (orders.order[orderId].loadCount == orders.order[orderId].pageCount) success(orderId);
	}

	// Check if items have been loaded
	Process.prototype.checkItemLoad = function (orderId,department) {

		if ($('#detailItems').html().length == 0) {

			$('#detailItems').html(orders.loading);
			$('#detailItems').load('{site_url}index.php/orders/detail_item/' + orderId + '/' + department);

		} else {

			orders.createPricing(orderId);
			orders.createStatusSelect(orders.order[orderId].status);
			$('#submitUpdateOrder').click(function(){ orders.updateOrder(orderId,department); });
		}
	}

	// Check if there orders are beign filtered otherwise load all orders
	Process.prototype.prepButtons = function () {

		function prep (el) {

			$(el).each(function(){

				$(this).click(function(){

					$(el).each(function(){ $(this).addClass('buttonHover'); });
					$(this).removeClass('buttonHover');

				});

			});
		}

		prep('.statusButton');
		prep('.departmentButton');

		orders.resetStatus();
		orders.resetDepartments();
	}

	// Sets to View All
	Process.prototype.resetStatus = function () {

		$('.statusButton').each(function(){

			$(this).addClass('buttonHover');
			if ($(this).html() == 'View All') $(this).removeClass('buttonHover');

		});

		orders.view.status = '{order_status_all}';
	}

	// Sets to All Departments
	Process.prototype.resetDepartments = function () {

		$('.departmentButton').each(function(){

			$(this).addClass('buttonHover');
			if ($(this).html() == 'All Departments') $(this).removeClass('buttonHover');

		});

		orders.view.department = 0;
	}

	// Refresh the order item
	Process.prototype.refreshItem = function (orderId,item) {

		$('#fileLink_' + orders.order[orderId].item[item].id).empty();
		
		// Ajax call for pdf and returns book array
		orders.getFileName(orders.order[orderId].item[item].id,function(){

		},function(book){

			orders.order[orderId].item[item].pdf = book.slice();
			orders.getOrderItem(orderId,item);

		});
	}

	// View orders url management
	Process.prototype.viewOrders = function (status,department) {

		orders.view.status = status;
		orders.view.department = department;

		$('#displayOrders').html(orders.loading);
		$('#displayOrders').load('{site_url}index.php/orders/order/' + encodeURIComponent(orders.view.status) + '/' + orders.view.department);
	}

	// Detail order view
	Process.prototype.viewOrder = function (orderId,department) {

		$('#displayOrders').html(orders.loading);
		$('#displayOrders').load('{site_url}index.php/orders/detail/' + orderId + '/' + department);
	}

	// Ajax update order
	Process.prototype.updateOrder = function (orderId,department) {

		orders.postSafeCracker('form[name="updateOrder"]',function(form){

			$('.orderRow-detail').hide();
			$('#detailHeader').prepend(orders.loading);

		},function(){

			$('#detailHeader').load('{site_url}index.php/orders/detail_header/' + orderId + '/' + department);

		});
	}

var orders = new Process({

	loading: '<div class="orderRow-loading" align="center"><img src="{site_url}graphics/graphics/loading.gif" width="32" height="32"></div>',
	order: {},
	totals: {},
	view: {

		status: '{order_status_all}',
		department: '0'

	}
});