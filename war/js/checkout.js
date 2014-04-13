var opts = {
	lines : 13, // The number of lines to draw
	length : 20, // The length of each line
	width : 10, // The line thickness
	radius : 30, // The radius of the inner circle
	corners : 1, // Corner roundness (0..1)
	rotate : 0, // The rotation offset
	direction : 1, // 1: clockwise, -1: counterclockwise
	color : '#000', // #rgb or #rrggbb or array of colors
	speed : 1, // Rounds per second
	trail : 60, // Afterglow percentage
	shadow : false, // Whether to render a shadow
	hwaccel : false, // Whether to use hardware acceleration
	className : 'spinner', // The CSS class to assign to the spinner
	zIndex : 2e9, // The z-index (defaults to 2000000000)
	top : '50%', // Top position relative to parent in px
	left : '50%' // Left position relative to parent in px
};
var spinner = null;
var spinner_div = 0;

var regex = /=(.+)/;
var username;
var password;
var address1;
var address2;
var landmark;
var city;
var email;
var contactnumber;
var region;
var deliveryCost;
var company;

var userResponse;
var esfuuid;
var esfCookieValues;
var regionArr;
var jqxhr = $.getJSON("http://easysmartfood.appspot.com/region", function() {
	console.log("success" + jqxhr);

	regionArr = jqxhr.responseJSON;

	populateRegions();

}).done(function() {

}).fail(function() {
	console.log("error");
}).always(function() {
	console.log("complete");
});

function calculateDeliveryCost(restName, region) {
	var url = 'http://easysmartfood.appspot.com/getdeliverycharge?restaurantname='
			+ restName + '&userregion=' + region;

	console.log(url);
	var deliveryDtls = $.getJSON(url, function() {

	}).done(
			function() {

				var totalStr = $('.simpleCart_total').text();

				console.log('Total: ' + totalStr);

				if (deliveryDtls.responseJSON.deliveryCost != '') {

					$('.simpleCart_shippingCost').text(
							'Rs ' + deliveryDtls.responseJSON.deliveryCost);
				} else {

					$('.simpleCart_shippingCost').text('Rs 20');
				}

				totalStr = totalStr.substring(2, totalStr.length);

				totalStr = totalStr.replace(/,/g, "");

				totalStr = parseFloat(totalStr);

				var delivery = $('.simpleCart_shippingCost').text();

				deliveryCost = delivery.substring(2, delivery.length);

				deliveryCost = parseFloat(deliveryCost);

				console.log('Delivery COST' + deliveryCost);

				var totalCost = deliveryCost + totalStr;

				$('.simpleCart_finalTotal').text(totalCost);
				console.log('done');

			}).fail(function() {

	});

}

function populateRegions() {
	$("#regselector").append(
			'<option value="' + 'Please Select' + '">' + 'Select Your Region'
					+ '</option>')

	for ( var regIndex = 0; regIndex < regionArr.length; regIndex++) {

		var obj = regionArr[regIndex];
		console.log(obj.region);
		$("#regselector").append(
				'<option value="' + obj.region + '">' + obj.region
						+ '</option>')

	}

}
var editAddrForm = '<form class="form-horizontal" role="form" id="usereditform" style="margin:50px;"><div class="form-group"><label for="inputPassword3" class="col-lg-4 control-label">Address1</label><div class="col-lg-6"><input type="text" class="form-control" placeholder="Address1" id="address1" name="address1"></div></div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Region'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+

		'<select id="regselector" style="width:100%;height:100%;">'
		+

		'</select>'
		+ '</div>'
		+ '</div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Address2'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="Address2"'
		+ 'id="address2" name="address2">'
		+ '</div>'
		+ '</div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Landmark'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="Landmark"'
		+ 'id="landmark" name="landmark">'
		+ '</div>'
		+ '</div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">City'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="City"'
		+ 'id="city" name="city">'
		+ '</div>'
		+ '</div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Username/Email'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="Email"'
		+ 'id="email" name="email">'
		+ '</div>'
		+ '</div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Phone'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="Phone"'
		+ 'id="contactnumber" name="contactnumber">'
		+ '</div>'
		+ '</div>'

		+ ' <script>$("#regselector").change(function() {var restname = getCookie(\'esfrestname\');console.log(restname);var region = $(\'#regselector\').val();console.log(region);calculateDeliveryCost(restname,region);});</script>'
		+ '</form>';

$("#regselector").change(function() {

	console.log('Value changed');

});

$(document)
		.ready(
				function() {

					esfuuid = getCookie('esfuuid');
					if (esfuuid != null) {

						esfCookieValues = esfuuid.split('|');

						bindUser();

					} else {

						$('div#shipmentdetails').html(editAddrForm);

						$('#editaddressbutton').remove();

					}

					var restName = getCookie('esfrestname');

					var esfuserCookie = getCookie('esfuuid');

					if (esfuserCookie != null) {
						var region = esfuserCookie.split('|');

						calculateDeliveryCost(restName, region[2]);

					}

					$('#signinbutton').on('click', function() {

						console.log('sign in');

						window.location = 'login.html';

					});

					var foodArr = new Array();
					$('#orderbutton')
							.on(
									'click',
									function() {

										spinner_div = $('#spinner').get(0);

										console.log(spinner_div);

										if (spinner == null) {
											spinner = new Spinner(opts)
													.spin(spinner_div);
										} else {
											spinner.spin(spinner_div);
										}

										var data = unescape(
												getCookie('simpleCart')).split(
												'++');

										console.log(data);
										for ( var x = 0, xlen = data.length; x < xlen; x++) {

											var custOrder = data[x].split('||');

											var id = custOrder[0].match(regex);
											var name = custOrder[1]
													.match(regex);
											var price = custOrder[2]
													.match(regex);
											var quantity = custOrder[3]
													.match(regex);
											var item = new Food(id[1], name[1],
													price[1], quantity[1]);

											foodArr.push(item);

										}

										esfuuid = getCookie('esfuuid');

										var createdBy = 'guest';
										if (esfuuid != null) {

											userResponse.userType = 'login';
											createdBy = userResponse.username;
											userResponse.foodComments = $(
													'#foodcomments').val();

										} else {

											userResponse = new UserResponse();
											userResponse.username = 'guest';
											userResponse.password = 'NA';
											userResponse.uuid = 'NA';
											userResponse.createDate = new Date();
											userResponse.updateDate = new Date();
											userResponse.fullname = '';
											userResponse.contactnumber = $(
													'#contactnumber').val();
											userResponse.email = $('#email')
													.val();
											userResponse.region = '';
											userResponse.address1 = $(
													'#address1').val();
											userResponse.address2 = $(
													'#address2').val();
											userResponse.landmark = $(
													'#landmark').val();
											userResponse.city = $('#city')
													.val();
											userResponse.zip = 'NA';
											userResponse.foodComments = $(
													'#foodcomments').val();

											console
													.log('USER Response: '
															+ userResponse.foodComments);

										}

										var delivery = $(
												'.simpleCart_shippingCost')
												.text();

										var totalCost = $(
												'.simpleCart_finalTotal')
												.text();

										this.orderStatus = orderStatus;
										this.createTs = createTs;
										this.createdBy = createdBy;
										this.updatedTs = updatedTs;
										this.updatedBy = updatedBy;

										var orderStatus = 'Order Created';
										var createTs = new Date();
										var updatedTs = 'NA';
										var updatedBy = '';

										var priceSummaryData = new PriceSummaryData(
												'0.0', '0.0', '0',
												deliveryCost, '0.0', totalCost,
												'Rs');
										userResponse.foodComments = $(
												'#foodcomments').val();

										var restaurantName = getCookie('esfrestname');

										var orderData = new Order(orderStatus,
												createTs, createdBy, updatedTs,
												updatedBy, userResponse,
												foodArr, priceSummaryData,
												restaurantName);

										orderStrData = JSON
												.stringify(orderData);

										console.log(orderStrData);

										var response = $
												.ajax(
														{
															type : "POST",
															url : "http://easysmartfood.appspot.com/order",
															data : orderStrData
														})
												.fail(
														function(msg) {

															console.log(msg);
															$(
																	'#confirmationheader')
																	.text(
																			'Order Creation failed. Please contact Phone: +917558943030, +919388803073');

															spinner
																	.stop(spinner_div);

														})
												.done(
														function(msg) {

															console
																	.log('order Created'
																			+ msg);

															simpleCart.cartHeaders = [
																	"Name",
																	"Price",
																	"Quantity",
																	"Total" ];

															$(
																	'#confirmationheader')
																	.text(
																			'Your Order has been Successfully Created.');

															$(
																	'#foodconfirmationheader')
																	.text(
																			'Food Will be Delivered To Below address:');

															$(
																	'#checkoutcontainer')
																	.html('');
															$(
																	'#editaddressbutton')
																	.remove();

															$('#orderbutton')
																	.remove();

															spinner
																	.stop(spinner_div);

														});

									});

					$('#editaddressbutton')
							.on(
									'click',
									function() {

										var buttonText = $('#editaddressbutton')
												.text();

										if (buttonText == 'Change Delivery Address') {

											$('div#shipmentdetails').html(
													editAddrForm);

											if (esfuuid != null) {
												$('#address1').val(address1);
												$('#address2').val(address2);
												$('#landmark').val(landmark);
												$('#city').val(city);
												$('#email').val(email);
												$('#contactnumber').val(
														contactnumber);

												populateRegions();

												$('#editaddressbutton')
														.text(
																'Update Delivery Address');

											}
										} else {

											console.log('inside else'
													+ getCookie('esfuuid'));

											var updaddress1 = $('#address1')
													.val();

											var updaddress2 = $('#address2')
													.val();

											var updlandmark = $('#landmark')
													.val();

											console.log(updlandmark);

											var updcity = $('#city').val();

											var updemail = $('#email').val();

											var updcontactnumber = $(
													'#contactnumber').val();

											var updatedUserData = new Profile(
													updcontactnumber, updemail,
													updaddress1, updaddress2,
													updlandmark, updcity);

											var updateStrData = JSON
													.stringify(updatedUserData);

											console.log(updateStrData);
											var response = $
													.ajax(
															{
																type : "PUT",
																url : "http://easysmartfood.appspot.com/user?username="
																		+ esfCookieValues[1]
																		+ "&useruuid="
																		+ esfCookieValues[0],
																data : updateStrData
															})
													.fail(
															function(msg) {

																console
																		.log('Error Occured');
															})
													.done(
															function(msg) {

																console
																		.log(response);

																var jqxhr = $
																		.get(
																				"https://easysmartfood.appspot.com/user?useruuid="
																						+ esfCookieValues[0],
																				function() {

																				})
																		.done(
																				function() {

																					userResponse = jqxhr.responseJSON;
																					address1 = userResponse.address1;
																					address2 = userResponse.address2;
																					region = userResponse.region;
																					landmark = userResponse.landmark;
																					city = userResponse.city;
																					contactnumber = userResponse.contactnumber;
																					email = userResponse.email;
																					company = userResponse.company

																					var afterUpdateHtml = '<div class="col-lg-6 col-xs-12" style="padding:50px;"><h4>'
																							+ address1
																							+ '</h4><h4>'
																							+ address2
																							+ '</h4><h4>'
																							+ city
																							+ '</h4><h4>'
																							+ landmark
																							+ '</h4></div><div class="col-lg-4 col-xs-12" style="padding:50px;"><h5>'
																							+ email
																							+ '</h5><h5>'
																							+ contactnumber
																							+ '</h5></div>';

																					$(
																							'div#shipmentdetails')
																							.html(
																									afterUpdateHtml);

																					$(
																							'#editaddressbutton')
																							.text(
																									'Change Delivery Address');

																				})
																		.fail(
																				function() {
																					alert("error");
																				})
																		.always(
																				function() {
																				});

															});

										}

									});

					function Profile(contactnumber, email, address1, address2,
							landmark, city) {

						this.contactnumber = contactnumber;
						this.email = email;
						this.address1 = address1;
						this.address2 = address2;
						this.landmark = landmark;
						this.city = city;

					}

					function bindUser() {

						console.log(esfCookieValues[0]);

						var jqxhr = $.get(
								"https://easysmartfood.appspot.com/user?useruuid="
										+ esfCookieValues[0], function() {

								}).done(function() {

							userResponse = jqxhr.responseJSON;

							var source = $("#shiptotemplate").html();

							console.log(source);

							var template = Handlebars.compile(source);
							username = userResponse.username;
							region = userResponse.region;
							address1 = userResponse.address1;
							address2 = userResponse.address2;
							landmark = userResponse.landmark;
							city = userResponse.city;
							contactnumber = userResponse.contactnumber;
							email = userResponse.email;
							company = userResponse.company;

							var html = template(userResponse);

							$('div#shipmentdetails').html(html);

						}).fail(function() {
							alert("error");
						}).always(function() {
						});
					}

				});

function Food(foodUuid, displayName, price, quantity) {

	this.foodUuid = foodUuid;
	this.displayName = displayName;
	this.price = price;
	this.quantity = quantity;

}

function UserResponse() {

}

function PriceSummaryData(totalWithoutTax, taxAmt, taxPercent, deliveryCharge,
		packingCharge, grandTotal, currency) {

	this.totalWithoutTax = totalWithoutTax;
	this.taxAmt = taxAmt;
	this.taxPercent = taxPercent;
	this.deliveryCharge = deliveryCharge;
	this.packingCharge = packingCharge;
	this.grandTotal = grandTotal;
	this.currency = currency;
}

function Order(orderStatus, createTs, createdBy, updatedTs, updatedBy,
		userData, foodItems, priceSummaryData, restaurantName) {

	this.orderStatus = orderStatus;
	this.createTs = createTs;
	this.createdBy = createdBy;
	this.updatedTs = updatedTs;
	this.updatedBy = updatedBy;
	// object
	this.userData = userData;
	// array
	this.foodItems = foodItems;
	// object
	this.priceSummaryData = priceSummaryData;
	this.restaurantName = restaurantName;

}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1) {
		c_value = null;
	} else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start, c_end));
	}
	return c_value;
}
