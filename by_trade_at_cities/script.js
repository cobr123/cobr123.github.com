
$(document).ready(function () { 
	loadProductCategories();
	loadProducts();
	loadCountries();
	loadRegions();
});
//////////////////////////////////////////////////////
function changeRealm(select) {
	document.location.href = select.value;
}
function changeCategory(select) {
	document.location.href = select.value;
}
function changeProduct(productId) {
	document.location.href = select.value;
}
function changeCountry(select) {
	document.location.href = select.value;
}
function changeRegion(select) {
	document.location.href = select.value;
}
function getRealm(){
	return $('#realm').val();
}
function getProductID(){
	return $('#id_product').val();
}
//////////////////////////////////////////////////////
function loadData() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var productID = '3868';//getProductID();
	if (productID == null || productID == '') return;
	
	$.getJSON('./'+realm+'/tradeAtCity_'+productID+'.json', function (data) {
		var output = '<table border="1" width="100%" cellspacing="0" cellpadding="2" bordercolorlight="#000000" bordercolordark="#FFFFFF">'
+'<tbody><tr class="theader"><td rowspan="2">Город</td><td rowspan="2">Индекс</td><td rowspan="2">Объём</td><td rowspan="2">Местные, %</td><td colspan="3">Местные</td><td colspan="3">Магазины</td><td rowspan="2">Обновлено</td></tr>'
+'<tr class="theader"><td>Цена</td><td>Качество</td><td>Бренд</td><td>Цена</td><td>Качество</td><td>Бренд</td></tr>';

		$.each(data, function (key, val) {
			var suitable = true;
			
			if (suitable && val.volume >= $('#volumeFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.volume <= $('#volumeTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.localPercent >= $('#localPercentFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.localPercent <= $('#localPercentTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.localPrice >= $('#localPriceFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.localPrice <= $('#localPriceTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.localQuality >= $('#localQualityFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.localQuality <= $('#localQualityTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.shopPrice >= $('#shopPriceFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.shopPrice <= $('#shopPriceTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.shopQuality >= $('#shopQualityFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.shopQuality <= $('#shopQualityTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.shopBrand >= $('#shopBrandFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.shopBrand <= $('#shopBrandTo').val()) {suitable = true;} else {suitable = false;}
			
			if(suitable){
				output += '<tr class="trec">';
				output += '<td><a href="http://virtonomica.ru/olga/main/globalreport/marketing/by_trade_at_cities/'+val.productId+'/'+val.countryId+'/'+val.regionId+'/'+val.cityId+'">'+val.cityCaption+'</a></td>';
				output += '<td align="center">'+val.marketIdx+'</td>';
				output += '<td align="right">'+val.volume+'</td>';
				output += '<td align="right" style="color:black">'+val.localPercent+'</td>';
				output += '<td align="right">'+val.localPrice+'</td>';
				output += '<td align="right">'+val.localQuality+'</td>';
				output += '<td align="right">'+val.shopPrice+'</td>';
				output += '<td align="right">'+val.shopQuality+'</td>';
				output += '<td align="right">'+val.shopBrand+'</td>';
				output += '<td align="center">11.03.2013</td>';
				output += '</tr>';
			}
		});
		output += '</tbody></table>';
		
		$('#grid').html(output); 	// replace all existing content
	});
	return false;
}

function loadProductCategories() {
	$.getJSON('./product_categories.json', function (data) {
		var output = '<select id="id_category" onchange="changeCategory(this);"><option value="0"></option>';

		$.each(data, function (key, val) {
			output += '<option value="'+val.id+'">'+val.caption+'</option>';
		});
		output += '</select>';
		
		$('#categories').html(output); 	// replace all existing content
	});
	return false;
}
function loadProducts() {
	$.getJSON('./products.json', function (data) {
		var output = '';
		var selected = $('#id_product').attr('value');
		
		$.each(data, function (key, val) {
			output += '<img src="'+val.src+'"';
			if(selected != null && selected == val.id){
				output += ' border="1"';
			}
			output += ' width="24" height="24" id="img'+val.id+'" title="'+val.caption+'" style="cursor:pointer" onclick="changeProduct('+val.id+')">&nbsp;';
		});
		
		$('#products').html(output); 	// replace all existing content
	});
	return false;
}
function loadCountries() {
	$.getJSON('./countries.json', function (data) {
		var output = '<select id="id_country" onchange="changeCountry(this);"><option value="0"></option>';

		$.each(data, function (key, val) {
			output += '<option value="'+val.id+'">'+val.caption+'</option>';
		});
		output += '</select>';
		
		$('#countries').html(output); 	// replace all existing content
	});
	return false;
}
function loadRegions() {
	$.getJSON('./regions.json', function (data) {
		var output = '<select id="id_region" onchange="changeRegion(this);"><option value="0"></option>';

		$.each(data, function (key, val) {
			output += '<option value="'+val.id+'">'+val.caption+'</option>';
		});
		output += '</select>';
		
		$('#regions').html(output); 	// replace all existing content
	});
	return false;
}
