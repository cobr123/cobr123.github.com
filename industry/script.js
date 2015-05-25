
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
//резделитель разрядов
function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	}
	return val;
}
//////////////////////////////////////////////////////
var tableCache = [];
function addToResultCache(val){
	var suitable = true;
	
	if (suitable && val.quality >= $('#qualityFrom').val()) {suitable = true;} else {suitable = false;}
	if (suitable && val.quality <= $('#qualityTo').val()) {suitable = true;} else {suitable = false;}
	
	if (suitable && val.cost >= $('#costFrom').val()) {suitable = true;} else {suitable = false;}
	if (suitable && val.cost <= $('#costTo').val()) {suitable = true;} else {suitable = false;}
	
	if(suitable){
		var existed = tableCache[val.quality];
		if(existed == null || existed.cost > val.cost){
			tableCache[val.quality] = val;
		}
	}
}
function sortTable(){
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
}
var sagMaterialImg = [];
function updateTableFromCache(){
	var output = '';
	 
	tableCache.forEach(function(val){
		output += '<tr class="trec">';
		output += '<td align="center">'+val.spec+'</td>';
		output += '<td align="center">'+val.equipQual+'</td>';
		output += '<td align="center" id="td_tech">'+val.tech+'</td>';
		var svMaterialsImg = '';
		var svMaterialsQual = '';
		var svMaterialsPrice = '';
		val.materials.forEach(function(mat){
			svMaterialsImg += '<td align="center"><img src="http://virtonomica.ru'+sagMaterialImg[mat.productID]+'"></td>';
			svMaterialsQual += '<td align="center">'+mat.quality+'</td>';
			svMaterialsPrice += '<td align="center">'+mat.price+'</td>';
		});
		output += '<td align="center"><table><tr>'+svMaterialsImg+'</tr><tr>'+svMaterialsQual+'</tr><tr>'+svMaterialsPrice+'</tr></table></td>';
		output += '<td align="center" id="td_quality">'+val.quality+'</td>';
		output += '<td align="center" id="td_quantity">'+val.quantity+'</td>';
		output += '<td align="center" id="td_cost">'+val.cost+'</td>';
		output += '<td align="center" id="td_profit">'+val.profit+'</td>';
		output += '</tr>';
	});
	$('#xtabletbody').html(output); 	// replace all existing content
	sortTable();
}
//////////////////////////////////////////////////////
var material_remains = [];
function calcResult(recipe, materials, tech) {
	console.log('calcResult for materials.length = ' + materials.length);
	var result = {
		spec: recipe.s
	 ,tech: tech
	 ,quality: 0
	 ,quantity: 0
	 ,cost: 0
	 ,profit: 0
	 ,equipQual: 0
	 ,materials: materials
	};
	var ingQual = [],
				ingPrice = [],
				ingBaseQty = [],
				ingTotalPrice = [],
				ingCost = [],
				IngTotalCost = 0;
				
	recipe.ip.forEach(function(ingredient) {
		ingBaseQty.push(ingredient.q || 0);
	});
	materials.forEach(function(material){
		ingQual.push(material.quality || 0);
		ingPrice.push(material.price || 0);
	});
	var num = ingQual.length;
	var eff = 1;
	var Sale_Price = parseFloat($("#salePrice").val(),10) || 0;
	//количество товаров производимых 1 человеком
	var prodbase_quan   = recipe.rp[0].pbq;
	//var prodbase_quan2  = recipe.rp[1].pbq || 0;
	
	var work_quant	= parseFloat($("#workQuan").val(),10) || 10000;
	var work_salary	= parseFloat($("#workSalary").val().replace(',', '.'),10) || 300;
	
	//квалификация работников
	var PersonalQual = Math.pow(tech, 0.8);
	//$("#PersonalQual", this).text(PersonalQual.toFixed(2));
	
	//качество станков
	var EquipQual = Math.pow(tech, 1.2);
	//$("#EquipQuan", this).text(EquipQual.toFixed(2));
	result.equipQual = EquipQual.toFixed(2);
	
	var ingQuantity = [];
	//количество ингридиентов
	for (var i = 0; i < num; i++) {
		ingQuantity[i] = ingBaseQty[i] * prodbase_quan * work_quant * Math.pow(1.05, tech-1 ) * eff;
	}
	//цена ингридиентов
	for (var i = 0; i < num; i++) {
		if (ingPrice[i] > 0) {
			ingTotalPrice[i] = ingQuantity[i] * ingPrice[i];
		} else {
			ingTotalPrice[i] = 0;
		}
	}
	//общая цена ингридиентов
	for (var i = 0; i < num; i++) {
		IngTotalCost += ingTotalPrice[i];
	}
	//объем выпускаемой продукции
	var Prod_Quantity = work_quant * prodbase_quan * Math.pow(1.05, tech-1) *  eff;
	result.quantity = Math.round (Prod_Quantity);
	
	//итоговое качество ингридиентов
	var IngTotalQual = 0;
	var IngTotalQty = 0;
	for (var i = 0; i < num; i++) {
		IngTotalQual+= ingQual[i]*ingBaseQty[i];
		IngTotalQty += ingBaseQty[i];
	};
	IngTotalQual = IngTotalQual/IngTotalQty*eff;	
	
	//качество товара
	var ProdQual = Math.pow(IngTotalQual, 0.5) * Math.pow(tech, 0.65);
	//ограничение качества (по технологии)
	if (ProdQual > Math.pow(tech, 1.3) ) {ProdQual = Math.pow(tech, 1.3)}
	if ( ProdQual < 1 ) { ProdQual = 1 }	
	//бонус к качеству
	ProdQual = ProdQual * ( 1 + recipe.rp[0].qbp / 100 );
	//$("#ProdQual", this).text( ProdQual.toFixed(2) ) ;
	result.quality = ProdQual.toFixed(2);
	
	//себестоимость
	var zp = work_salary * work_quant;
	var exps = IngTotalCost + zp + zp * 0.1 ;
	//$("#Cost", this).text( "$" + commaSeparateNumber((exps / Prod_Quantity).toFixed(2)) );
	result.cost = (exps / Prod_Quantity).toFixed(2);
	
	//прибыль
	var profit = ( Sale_Price * Prod_Quantity ) - exps;
	//$("#profit", this).text( "$" + commaSeparateNumber(profit.toFixed(2)) );
	result.profit = profit;
	return result;
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
	var allExists = true;
	recipe.ip.forEach(function(ingredient) {
		if(allExists){
			if (material_remains[ingredient.pi] == null || material_remains[ingredient.pi].length == 0) {
				allExists = false;
			} else {
				remains.push(material_remains[ingredient.pi]);
			}
		}
	});
	console.log('cartesianProduct for remains.length = ' + remains.length);
	if (!allExists){
		console.log('calcProduction not all ingredients has remains');
		return;
	}
	
	materials = cartesianProduct(remains);
	console.log('cartesianProduct result materials.length = ' + materials.length);
	var techFrom = $("#techFrom", this).val() || 10;
	var techTo = $("#techTo", this).val() || techFrom;
	for (tech = techFrom; tech <= techTo; i++) { 
		var result = calcResult(recipe, materials, tech);
		addToResultCache(result);
	}
	updateTableFromCache();
}
function loadRemains(recipe, productID, npMinQuality) {
	var realm = getRealm();
	if (realm == null || realm == '') return;
	if (productID == null || productID == '') return;
	
	console.log('load ./'+realm+'/product_remains_'+productID+'.json');
	$.getJSON('./'+realm+'/product_remains_'+productID+'.json', function (remains) {
		remains.forEach(function(remain) {
			var suitable = true;
			if(material_remains[productID] == null){
				material_remains[productID] = [];
			}
			if (suitable && remain.r >= $('#volumeFrom').val()) {suitable = true;} else {suitable = false;}
			if (suitable && remain.r <= $('#volumeTo').val()) {suitable = true;} else {suitable = false;}
			if (suitable && remain.q >= npMinQuality) {suitable = true;} else {suitable = false;}
			if(suitable){
				material_remains[productID].push({
					quality: remain.q
				 ,price  : remain.p
				 ,productID : productID
				});
			}
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
	console.log('load ./'+realm+'/recipe_'+productID+'.json');
	$.getJSON('./'+realm+'/recipe_'+productID+'.json', function (recipes) {
		recipes.forEach(function(recipe) {
			recipe.ip.forEach(function(ingredient) {
				loadRemains(recipe, ingredient.pi, ingredient.mq);
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
		
		sagMaterialImg = [];
		$.each(data, function (key, val) {
			sagMaterialImg[val.i] = val.s;
			
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
