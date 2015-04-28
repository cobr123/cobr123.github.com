
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
function getVal(spName){
	window.localStorage.getItem(spName);
}
function setVal(spName, pValue){
	return JSON.parse(window.localStorage.setItem(spName,JSON.stringify(pValue)));
}
function loadSavedFlt(){
	//var params = getSearchParameters();
	var realm = getVal('realm');
	if (realm != null || realm != '') {
		$('#realm').val(realm);
		changeRealm();
		
		var id_country = getVal('id_country');
		if (id_country != null || id_country != '') {
			$('#id_country').val(id_country);
			changeCountry();
			var id_region = getVal('id_region');
			if (id_region != null || id_region != '') {
				$('#id_region').val(id_region);
				changeRegion();
			}
		}
		var id_category = getVal('id_category');
		if (id_category == null || id_category == '') return;
		$('#id_category').val(id_category);
		
		var id_product = getVal('id_product');
		if (id_product == null || id_product == '') return;
		changeProduct(id_product);
	} else {
		loadProductCategories();
		loadCountries();
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
		
		var svOrder = $('#sort_dir').val();
		var svColId = $('#sort_col_id').val();
		var table = document.getElementById('xtable');
		var tableBody = table.querySelector('tbody');
		tinysort(
				tableBody.querySelectorAll('tr')
				,{
						selector:'td#td_'+svColId
						,order: svOrder
				}
		);
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
		$('#products').html(''); 
	});
	return false;
}
function loadProducts() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	var svCategoryId = $('#id_category').val();
	if (svCategoryId == null || svCategoryId == '') return;
	
	$.getJSON('./'+realm+'/products.json', function (data) {
		var output = '';
		var selected = $('#id_product').attr('value');
		
		$.each(data, function (key, val) {
			if(svCategoryId == val.productCategory){
				output += '&nbsp;<img src="http://virtonomica.ru'+val.imgUrl+'"';
				if(selected != null && selected == val.id){
					output += ' border="1"';
				}
				output += ' width="24" height="24" id="img'+val.id+'" title="'+val.caption+'" style="cursor:pointer" onclick="changeProduct('+val.id+')">';
			}
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
function changeRealm() {
	loadProductCategories();
	loadCountries();
	setVal('realm', getRealm());
}
function changeCategory() {
	loadProducts();
	setVal('id_category', $('#id_category').val());
}
function changeCountry() {
	loadRegions();
	loadData();
	setVal('id_country', $('#id_country').val());
}
function changeRegion() {
	loadData();
	setVal('id_region', $('#id_region').val());
}
function changeProduct(productId) {
	var selected = $('#id_product').val();
	if(selected != null && selected != ''){
		$('#img'+selected).attr('border','');
	}
	$('#img'+productId).attr('border','1');
	$('#id_product').val(productId);
	loadData();
	setVal('id_product', $('#id_product').val());
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}
function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

//////////////////////////////////////////////////////
$(document).ready(function () { 
	var table = document.getElementById('xtable');
	var tableHead = table.querySelector('thead');
		
	tableHead.addEventListener('click',function(e){
		var tableBody = table.querySelector('tbody');
		var tableHeader = e.target;
		var isAscending;
		var order;
		
		var tableHeaderId = tableHeader.getAttribute('id').substr(3);
		if (tableHeaderId != null && tableHeaderId != '') {
			//console.log(tableHeaderId);
			isAscending = tableHeader.getAttribute('data-order')=='asc';
			order = isAscending?'desc':'asc';
			tableHeader.setAttribute('data-order',order);
			$('#sort_col_id').val(tableHeaderId);
			$('#sort_dir').val(order);
			setVal('sort_col_id', $('#sort_col_id').val());
			setVal('sort_dir', $('#sort_dir').val());
			tinysort(
					tableBody.querySelectorAll('tr')
					,{
							selector:'td#td_'+tableHeaderId
							,order: order
					}
			);
		}
	});
	loadSavedFlt();
});
