
function getRealm(){
	return $('#realm').val();
}
function getProductID(){
	return $('#id_product').val();
}
function nvl(val1, val2){
	if (val1 == null || val1 == ''){
		return val2;
	} else {
		return val1;
	}
}
//////////////////////////////////////////////////////
function loadData() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var productID = getProductID();
	if (productID == null || productID == '') return;
	
	$.getJSON('./'+realm+'/tradeAtCity_'+productID+'.json', function (data) {
		var output = '';

		$.each(data, function (key, val) {
			var suitable = true;
			
			if (suitable && val.productId == $('#id_product').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.countryId == nvl($('#id_country').val(),val.countryId)) {suitable = true;} else {suitable = false;}
			if (suitable && val.regionId == nvl($('#id_region').val(),val.regionId)) {suitable = true;} else {suitable = false;}
			
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
				output += '<td id="td_city"><a href="http://virtonomica.ru/olga/main/globalreport/marketing/by_trade_at_cities/'+val.productId+'/'+val.countryId+'/'+val.regionId+'/'+val.cityId+'">'+val.cityCaption+'</a></td>';
				output += '<td align="center" id="td_idx">'+val.marketIdx+'</td>';
				output += '<td align="right" id="td_volume">'+val.volume+'</td>';
				output += '<td align="right" id="td_local_perc" style="color:black">'+val.localPercent+'</td>';
				output += '<td align="right" id="td_local_price">'+val.localPrice+'</td>';
				output += '<td align="right" id="td_local_quality">'+val.localQuality+'</td>';
				output += '<td align="right" id="td_shop_price">'+val.shopPrice+'</td>';
				output += '<td align="right" id="td_shop_quality">'+val.shopQuality+'</td>';
				output += '<td align="right" id="td_shop_brand">'+val.shopBrand+'</td>';
				output += '</tr>';
			}
		});
		
		$('#xtabletbody').html(output); 	// replace all existing content
	});
	var table = document.getElementById('xtable');
	var tableHead = table.querySelector('thead');
		
	tableHead.addEventListener('click',function(e){
    var tableBody = table.querySelector('tbody');
		var tableHeaders = tableHead.querySelectorAll('th');
    var tableHeader = e.target;
    var textContent = tableHeader.textContent;
    var tableHeaderIndex;
		var isAscending;
		var order;
		
		var tableHeaderId = tableHeader.getAttribute('id').substr(3);
		if (tableHeaderId != null && tableHeaderId != '') {
			//console.log(tableHeaderId);
			isAscending = tableHeader.getAttribute('data-order')==='asc';
			order = isAscending?'desc':'asc';
			tableHeader.setAttribute('data-order',order);
			tinysort(
					tableBody.querySelectorAll('tr')
					,{
							selector:'td#td_'+tableHeaderId
							,order: order
					}
			);
		}
	});
	return false;
}

function loadProductCategories() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	$.getJSON('./'+realm+'/product_categories.json', function (data) {
		var output = '<option value="" selected=""></option>';

		$.each(data, function (key, val) {
			output += '<option value="'+val.caption+'">'+val.caption+'</option>';
		});
		
		$('#id_category').html(output); 	// replace all existing content
	});
	return false;
}
function loadProducts() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	$.getJSON('./'+realm+'/products.json', function (data) {
		var output = '';
		var selected = $('#id_product').attr('value');
		
		$.each(data, function (key, val) {
			output += '<img src="http://virtonomica.ru'+val.imgUrl+'"';
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
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	$.getJSON('./'+realm+'/countries.json', function (data) {
		var output = '<option value="" selected=""></option>';

		$.each(data, function (key, val) {
			output += '<option value="'+val.id+'">'+val.caption+'</option>';
		});
		
		$('#id_country').html(output); 	// replace all existing content
	});
	return false;
}
function loadRegions() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	var svCountryId = $('#id_country').val();
	if (svCountryId == null || svCountryId == '') return;
	
	$.getJSON('./'+realm+'/regions.json', function (data) {
		var output = '<option value="" selected=""></option>';
		
		$.each(data, function (key, val) {
			if(val.countryId == svCountryId){
				output += '<option value="'+val.id+'">'+val.caption+'</option>';
			}
		});
		
		$('#id_region').html(output); 	// replace all existing content
	});
	return false;
}
function changeRealm(select) {
	loadProductCategories();
	loadCountries();
}
function changeCategory(select) {
	loadProducts();
}
function changeCountry(select) {
	loadRegions();
}
function changeRegion(select) {
	loadData();
}
function changeProduct(productId) {
	var selected = $('#id_product').val();
	if(selected != null && selected != ''){
		$('#img'+selected).val();
	}
	$('#id_product').val(productId);
	loadData();
}

//////////////////////////////////////////////////////
$(document).ready(function () { 
	loadProductCategories();
	loadCountries();
});