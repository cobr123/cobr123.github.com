
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
	return JSON.parse(window.localStorage.getItem(spName));
}
function setVal(spName, pValue){
	window.localStorage.setItem(spName,JSON.stringify(pValue));
}
function loadSavedFlt(){
	//var params = getSearchParameters();
	var realm = getVal('realm');
	var id_category = getVal('id_category');
	var id_product = getVal('id_product');
	
	if (realm != null || realm != '') {
		$('#realm').val(realm);
		var loadProductsCallback = function() {
			//console.log("$('#products').childNodes.length = " + document.getElementById('products').childNodes.length);
			if (id_product == null || id_product == '') return;
			changeProduct(id_product);
		};
		var productCategoriesCallback = function() {
			//console.log("$('#id_category').childNodes.length = " + document.getElementById('id_category').childNodes.length);
			if (id_category == null || id_category == '') return;
			$('#id_category').val(id_category);
			loadProducts(loadProductsCallback);
  		};
		changeRealm(productCategoriesCallback);
		
	} else {
		loadProductCategories();
		fillUpdateDate();
	}
}
//////////////////////////////////////////////////////
var material_remains = [];
var results = [];
function calcResult(recipe, materials) {
	console.log('calcResult for materials.length = ' + materials.length);
}
function cartesianProduct(a) { // a = array of array
    var i, j, l, m, a1, o = [];
    if (!a || a.length == 0) return a;

    a1 = a.splice(0,1);
    a = cartesianProduct(a);
    for (i = 0, l = a1[0].length; i < l; i++) {
        if (a && a.length) for (j = 0, m = a.length; j < m; j++)
            o.push([a1[0][i]].concat(a[j]));
        else
            o.push([a1[0][i]]);
    }
    return o;
}
function calcProduction(recipe) {
	var remains = [];
	recipe.ip.forEach(function(ingredient) {
		if (material_remains[ingredient.pi] == null || material_remains[ingredient.pi].length == 0) {
			console.log('calcProduction not all ingredients has remains');
			return;
		}
		remains.push(material_remains[ingredient.pi]);
	});
	console.log('cartesianProduct for remains.length = ' + remains.length);
	materials = cartesianProduct(remains);
	console.log('cartesianProduct result materials.length = ' + materials.length);
	calcResult(recipe, materials);
}
function loadRemains(recipe, productID) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	if (productID == null || productID == '') return;
	
	console.log('load ./'+realm+'/product_remains_'+productID+'.json');
	$.getJSON('./'+realm+'/product_remains_'+productID+'.json', function (remains) {
		remains.forEach(function(remain) {
			if(material_remains[productID] == null){
				material_remains[productID] = [];
			}
			material_remains[productID].push(remain);
		});
		calcProduction(recipe);
	});
}
function loadRecipe() {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	var productID = getProductID();
	if (productID == null || productID == '') return;
	material_remains = [];
	results = [];
	console.log('load ./'+realm+'/recipe_'+productID+'.json');
	$.getJSON('./'+realm+'/recipe_'+productID+'.json', function (recipes) {
		recipes.forEach(function(recipe) {
			recipe.ip.forEach(function(ingredient) {
				loadRemains(recipe, ingredient.pi);
			});
		});
	});
}
function loadData() {
	/*
	- загрузить рецепт
	- для каждого ингридиента загрузить остатки
	- посчитать производимую продукцию
	- применить фильтр и если подошло записать в таблицу результатов
	*/
	loadRecipe();
	/*
	$.getJSON('./'+realm+'/recipe_'+productID+'.json', function (recipes) {
		var output = '';

		$.each(data, function (key, val) {
			var suitable = true;
			
			if (suitable && val.pi == $('#id_product').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.ci == nvl($('#id_country').val(),val.ci)) {suitable = true;} else {suitable = false;}
			if (suitable && val.ri == nvl($('#id_region').val(),val.ri)) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.wi >= $('#wealthIndexFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.wi <= $('#wealthIndexTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.v >= $('#volumeFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.v <= $('#volumeTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.lpe >= $('#localPercentFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.lpe <= $('#localPercentTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.lpr >= $('#localPriceFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.lpr <= $('#localPriceTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.lq >= $('#localQualityFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.lq <= $('#localQualityTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.spr >= $('#shopPriceFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.spr <= $('#shopPriceTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.sq >= $('#shopQualityFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.sq <= $('#shopQualityTo').val()) {suitable = true;} else {suitable = false;}
			
			if (suitable && val.sb >= $('#shopBrandFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && val.sb <= $('#shopBrandTo').val()) {suitable = true;} else {suitable = false;}
			
			if(suitable){
				output += '<tr class="trec">';
				output += '<td id="td_city"><a target="_blank" href="http://virtonomica.ru/'+realm+'/main/globalreport/marketing/by_trade_at_cities/'+val.pi+'/'+val.ci+'/'+val.ri+'/'+val.ti+'">'+val.tc+'</a></td>';
				output += '<td align="center" id="td_w_idx">'+val.wi+'</td>';
				output += '<td align="center" id="td_idx">'+val.mi+'</td>';
				output += '<td align="right" id="td_volume">'+val.v+'</td>';
				output += '<td align="right" id="td_local_perc" style="color:black">'+val.lpe+'</td>';
				output += '<td align="right" id="td_local_price">'+val.lpr+'</td>';
				output += '<td align="right" id="td_local_quality">'+val.lq+'</td>';
				output += '<td align="right" id="td_shop_price">'+val.spr+'</td>';
				output += '<td align="right" id="td_shop_quality">'+val.sq+'</td>';
				output += '<td align="right" id="td_shop_brand">'+val.sb+'</td>';
				output += '</tr>';
			}
		});
		
		$('#xtabletbody').html(output); 	// replace all existing content
		
		var svOrder = $('#sort_dir').val();
		var svColId = $('#sort_col_id').val();
		var isAscending = svOrder=='asc';
		var orderArrow = isAscending?'&#9650;':'&#9660;';
		$('#sort_by_'+svColId).html(orderArrow);
		 
		var table = document.getElementById('xtable');
		var tableBody = table.querySelector('tbody');
		tinysort(
				tableBody.querySelectorAll('tr')
				,{
						selector:'td#td_'+svColId
						,order: svOrder
				}
		);
	});*/
	return false;
}

function loadProductCategories(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	$.getJSON('./'+realm+'/materials.json', function (data) {
		var output = '<option value="" selected=""></option>';
		var categories = [];
		$.each(data, function (key, val) {
			if(categories[val.pc] == null){
				output += '<option value="'+val.pc+'">'+val.pc+'</option>';
				categories[val.pc] = 1;
			}
		});
		
		$('#id_category').html(output); 	// replace all existing content
		$('#materials').html(''); 
		if(callback != null) callback();
	});
	return false;
}
function loadProducts(callback) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	var svCategoryId = $('#id_category').val();
	if (svCategoryId == null || svCategoryId == '') return;
	
	$.getJSON('./'+realm+'/materials.json', function (data) {
		var output = '';
		var selected = $('#id_product').attr('value');
		
		$.each(data, function (key, val) {
			if(svCategoryId == val.pc){
				output += '&nbsp;<img src="http://virtonomica.ru'+val.s+'"';
				if(selected != null && selected == val.i){
					output += ' border="1"';
				}
				output += ' width="24" height="24" id="img'+val.i+'" title="'+val.c+'" style="cursor:pointer" onclick="changeProduct('+val.i+')">';
			}
		});
		
		$('#materials').html(output); 	// replace all existing content
		if(callback != null) callback();
	});
	return false;
}
function changeRealm(productCategoriesCallback) {
	loadProductCategories(productCategoriesCallback);
	setVal('realm', getRealm());
	fillUpdateDate();
}
function changeCategory(callback) {
	loadProducts(callback);
	setVal('id_category', $('#id_category').val());
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
function fillUpdateDate() {
	$('#update_date').val(''); 	// replace all existing content
	var realm = getRealm();
	if (realm == null || realm == '') return;
	
	$.getJSON('./'+realm+'/updateDate.json', function (data) {
		$('#update_date').val('обновлено: ' + data.d); 	// replace all existing content
	});
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
		
		while (tableHeader.nodeName!=='TH') {
				tableHeader = tableHeader.parentNode;
		}
		
		var tableHeaderId = tableHeader.getAttribute('id').substr(3);
		if (tableHeaderId != null && tableHeaderId != '') {
			//console.log(tableHeaderId);
			isAscending = tableHeader.getAttribute('data-order')=='asc';
			order = isAscending?'desc':'asc';
			tableHeader.setAttribute('data-order',order);
			$('#sort_by_'+$('#sort_col_id').val()).html('');
			$('#sort_col_id').val(tableHeaderId);
			$('#sort_dir').val(order);
			setVal('sort_col_id', $('#sort_col_id').val());
			setVal('sort_dir', $('#sort_dir').val());
			var orderArrow = isAscending?'&#9660;':'&#9650;';
			$('#sort_by_'+tableHeaderId).html(orderArrow);
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
