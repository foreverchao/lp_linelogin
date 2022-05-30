// 取得URL參數
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function (part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

// 取得隨機物件KEY
function getRandomPropertyKey(obj) {
  var keys = Object.keys(obj)
  return keys[keys.length * Math.random() << 0];
};

// 字串轉數字
function str2num(string) {
  var num = String(string).replace(/,/g, '');
  return num;
}

// 數字轉字串
function num2str(number) {
  var str = String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return str;
}

// 向後台取得商品資料
function getProductInfo(connection_data, product_data) {
  var data = {};
  $.ajax({
    url: connection_data.url,
    type: "GET",
    cache: false,
    async: false,
    data: {
      "type": "selectProduct",
      "accountId": connection_data.accountId,
      "promotionCode": connection_data.promotionCode,
      "regularPurchaseFlg": product_data.regularPurchaseFlg,
      "productCode": product_data.productCode,
    },
    dataType: "json",
    success: function (res) {
      data = res;
    },
    error: function (res) {
      console.error('商品代碼[' + product_data.productCode + ']查詢失敗, 請再次檢查連線設定是否有誤');
    }
  });

  return data;
}

// 清除購物車相關cookie
function cartCooKieClear() {
  $.removeCookie('acs_form_info', {
    path: '/'
  });
  $.removeCookie('acs_name01', {
    path: '/'
  });
  $.removeCookie('acs_name02', {
    path: '/'
  });
  $.removeCookie('acs_offer', {
    path: '/'
  });
  $.removeCookie('acs_shipping_date', {
    path: '/'
  });
  $.removeCookie('acs_promotion_code', {
    path: '/'
  });
  $.removeCookie('acs_product_code', {
    path: '/'
  });
  $.removeCookie('acs_regular', {
    path: '/'
  });
  $.removeCookie('acs_payment_method', {
    path: '/'
  });
  $.removeCookie('acs_receive_method', {
    path: '/'
  });
  $.removeCookie('acs_back_url', {
    path: '/'
  });
  // GA
  $.removeCookie('acs_ga1', {
    path: '/'
  });
  $.removeCookie('acs_ga2', {
    path: '/'
  });
  // 加購商品
  $.removeCookie('acs_upsell_product', {
    path: '/'
  });
  $.removeCookie('acs_payment_total', {
    path: '/'
  });
  // 複數商品
  $.removeCookie('acs_multi_product', {
    path: '/'
  });
}

// 導向到GA的URL
// Ex: thankyou.html?ad_src=xxx&ad_med=xxx
function redirectGA() {
  var acs_form_info = $.cookie('acs_form_info');
  if (acs_form_info == '1') {
    var redirect_url = location.href;
    var acs_ga1 = $.cookie('acs_ga1');
    var acs_ga2 = $.cookie('acs_ga2');
    if (acs_ga1 != null && acs_ga2 != null) {
      redirect_url += '&ad_src=' + acs_ga1;
      redirect_url += '&ad_med=' + acs_ga2;
    }

    // 清除購物車相關cookie
    cartCooKieClear();

    // 轉址
    location.href = redirect_url;
  }
}

// 導向到訂單資訊的URL
// Ex: thankyou.html?name01=xxx&name02=xxx&offer=xxx&shipping_date=yyyy/mm/dd&upsell_product=[xxx,xxx]&payment_total=xxx&ad_src=xxx&ad_med=xxx
function redirectOrderInfo() {
  var form_info = $.cookie('acs_form_info');
  if (form_info == '1') {
    // 取得URL參數
    var name01 = $.cookie('acs_name01');
    var name02 = $.cookie('acs_name02');
    var offer = $.cookie('acs_offer');
    var shipping_date = $.cookie('acs_shipping_date');
    var ga1 = $.cookie('acs_ga1');
    var ga2 = $.cookie('acs_ga2');

    // 加購資料
    var upsell_product = $.cookie('acs_upsell_product');
    var payment_total = $.cookie('acs_payment_total');

    // 複數商品資料
    var multi_product = $.cookie('acs_multi_product');

    // 轉址
    var redirect_url = location.href;
    redirect_url += '&name01=' + encodeURIComponent(name01);
    redirect_url += '&name02=' + encodeURIComponent(name02);
    redirect_url += '&shipping_date=' + encodeURIComponent(shipping_date);
    
    // 一般購物車商品資料
    if (offer != null && offer != '') {
      redirect_url += '&offer=' + encodeURIComponent(offer);
    }

    // 加購資料
    if (upsell_product != null && upsell_product != '') {
      redirect_url += '&upsell_product=' + encodeURIComponent(upsell_product);
    }
    if (payment_total != null && payment_total != '') {
      redirect_url += '&payment_total=' + payment_total;
    }

    // 複數商品資料
    if (multi_product != null && multi_product != '') {
      redirect_url += '&multi_product=' + encodeURIComponent(multi_product);
    }

    // GA
    if (ga1 != null && ga2 != null) {
      redirect_url += '&ad_src=' + ga1;
      redirect_url += '&ad_med=' + ga2;
    }
    redirect_url += '&show_order_info=1';

    // 清除購物車相關cookie
    cartCooKieClear();

    // 轉址
    location.href = redirect_url;
  }
}

// 列印訂單資訊
function printOrderInfo(el) {
  var url_query_parm = getJsonFromUrl();
  var url_show_order_info = url_query_parm.show_order_info;
  if (url_show_order_info == '1') {
    // 取得URL參數
    var url_order_id = url_query_parm.order_id;
    var url_name01 = decodeURIComponent(url_query_parm.name01);
    var url_name02 = decodeURIComponent(url_query_parm.name02);
    var url_offer = url_query_parm.offer;
    var url_payment_total = url_query_parm.payment_total;
    var url_shipping_date = decodeURIComponent(url_query_parm.shipping_date);
    
    // 加購商品資訊
    var url_upsell_product = url_query_parm.upsell_product;
    if (url_upsell_product != null && url_upsell_product != '') {
      url_upsell_product = JSON.parse(decodeURIComponent(url_upsell_product));
    }

    // 複數商品資訊
    var url_multi_product = url_query_parm.multi_product;
    if (url_multi_product != null && url_multi_product != '') {
      url_multi_product = JSON.parse(decodeURIComponent(url_multi_product));
    }

    // 列印訂單資訊
    var order_info = '';
    order_info += '【訂單編號】 ' + url_order_id + '<br>';
    order_info += '【顧客名稱】 ' + url_name01 + url_name02 + '<br>';
    order_info += '【訂單內容】 <br>';

    // 列印一般購物車商品資訊
    if (url_offer != null) {
      order_info += '　・' + url_offer + '<br>';
    }

    // 列印加購商品資訊
    if (url_upsell_product != null) {
      url_upsell_product.forEach(function (item) {
        order_info += '　・' + item + ' <br>';
      });
    }

    // 列印複數商品資訊
    if (url_multi_product != null) {
      url_multi_product.forEach(function (item) {
        order_info += '　・' + item + ' <br>';
      });
    }
    
    order_info += '【購入金額】 ' + num2str(url_payment_total) + ' 元<br>';
    order_info += '【預定到貨日】 ' + url_shipping_date;
    $(el).html(order_info);
  }
}

// 導向到加購功能的URL
// Ex: thankyou.html?name01=xxx&name02=xxx&promotion_code=xxx&offer=xxx&regular=x&shipping_date=yyyy/mm/dd&back_url=xxx&show_upsell=1&show_cart=xxx&ad_src=xxx&ad_med=xxx
function redirectThankUpsell(setting_js_list) {
  var form_info = $.cookie('acs_form_info');
  if (form_info == '1') {
    var redirect_url = location.href;
    var name01 = $.cookie('acs_name01');
    var name02 = $.cookie('acs_name02');
    var promotion_code = $.cookie('acs_promotion_code');
    var offer = $.cookie('acs_offer');
    var regular = $.cookie('acs_regular');
    var shipping_date = $.cookie('acs_shipping_date');
    var back_url = $.cookie('acs_back_url');
    var ga1 = $.cookie('acs_ga1');
    var ga2 = $.cookie('acs_ga2');
    redirect_url += '&name01=' + encodeURIComponent(name01);
    redirect_url += '&name02=' + encodeURIComponent(name02);
    redirect_url += '&promotion_code=' + promotion_code;
    redirect_url += '&offer=' + encodeURIComponent(offer);
    redirect_url += '&regular=' + regular;
    redirect_url += '&shipping_date=' + encodeURIComponent(shipping_date);
    redirect_url += '&back_url=' + encodeURIComponent(back_url);
    redirect_url += '&show_upsell=1';
    redirect_url += '&show_cart=' + getRandomPropertyKey(setting_js_list);
    if (ga1 != null && ga2 != null) {
      redirect_url += '&ad_src=' + ga1;
      redirect_url += '&ad_med=' + ga2;
    }

    // 清除購物車相關cookie
    cartCooKieClear();

    // 轉址
    location.href = redirect_url;
  }
}