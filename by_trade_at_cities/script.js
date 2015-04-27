
$(document).ready(function () { 
	loadProductCategories();
	loadProducts();
	loadCountries();
	loadRegions();
});
//////////////////////////////////////////////////////
function changeRealm(select) {
	loadData();
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
		var output = '<table id="xtable" border="1" width="100%" cellspacing="0" cellpadding="2" bordercolorlight="#000000" bordercolordark="#FFFFFF">'
+'<thead><tr class="theader"><th rowspan="2">Город</th><th rowspan="2">Индекс</th><th rowspan="2">Объём</th><th rowspan="2">Местные, %</th><th colspan="3">Местные</th><th colspan="3">Магазины</th><th rowspan="2">Обновлено</th></tr>'
+'<tr class="theader"><th>Цена</th><th>Качество</th><th>Бренд</th><th>Цена</th><th>Качество</th><th>Бренд</th></tr></thead><tbody>';

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
	var table = document.getElementById('xtable')
    ,tableHead = table.querySelector('thead')
    ,tableHeaders = tableHead.querySelectorAll('th')
    ,tableBody = table.querySelector('tbody')
	;
	tableHead.addEventListener('click',function(e){
    var tableHeader = e.target
        ,textContent = tableHeader.textContent
        ,tableHeaderIndex,isAscending,order
    ;
    if (textContent!=='add row') {
			while (tableHeader.nodeName!=='TH') {
					tableHeader = tableHeader.parentNode;
			}
			tableHeaderIndex = Array.prototype.indexOf.call(tableHeaders,tableHeader);
			isAscending = tableHeader.getAttribute('data-order')==='asc';
			order = isAscending?'desc':'asc';
			tableHeader.setAttribute('data-order',order);
			tinysort(
					tableBody.querySelectorAll('tr')
					,{
							selector:'td:nth-child('+(tableHeaderIndex+1)+')'
							,order: order
					}
			);
		}
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
