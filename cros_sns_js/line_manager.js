


var $ = jQuery;

var client_id = null;
var client_secret = null;
var lpurl = null;
var getUrlString = location.href;
var url = new URL(getUrlString);

//初始化
Init();

//初始化
function Init() {

    //判斷是否隱藏 Line Login Button
    DisplayAndHiddenLineLoginBtnWithFlag();

    //抓取orderKey
    if (sessionStorage.getItem("orderKey") === null) {
        console.log("TO GET orderKey");
        getOrderInfo();
    }

    // 抓取 line id token
    var id_token = url.searchParams.get('line_id_token');
    if (id_token === null) {
        console.log("NOT GET line_id_token");       
    }
    else{
        console.log("GET line_id_token");
        LineLoginInit();
    }
}




// pressed line login button then implement lineLoginGotoAuth function (gotoAuth)
function lineLoginGotoAuth(){
    // Line gotoAuth
    // 將 client_id+','+ client_secret+','+ CROS_LINE_REDIRECT_URI+','+ lpurl 參數 塞入state 中，
    // state 參數 傳至 receive.html中 

    //感謝頁 網址
    lpurl=location.origin + location.pathname;
    //console.log("lpurl: ",lpurl);
    
    let link = 'https://access.line.me/oauth2/v2.1/authorize?';
    link += 'response_type=code';
    link += '&client_id=' + client_id;
    link += '&redirect_uri=' + CROS_LINE_REDIRECT_URI;
    link += '&state=' + client_id+','+ client_secret+','+ CROS_LINE_REDIRECT_URI+','+ lpurl;
    link += '&scope=openid%20profile%20email';
    // 選填 以下為可不用傳送的資料
    link += '&nonce=helloWorld' 
    link += '&prompt=consent'
    link += '&max_age=3600'
    link += '&ui_locales=zh-TW'
    link += '&bot_prompt=normal'

    window.open(link, '_self') // 轉跳到該網址
}



/**
 * @todo 初始化
 * login 完成後，先建立相關Element並呼叫API
 * 
 */
 function LineLoginInit() {
    getRegistsnsInfo();
    
  }

function DisplayAndHiddenLineLoginBtnWithFlag() {

    // 經過完整流程 從 receive.html 導回 可能為不同domain 故將  line_registration_flg 放至 導回 感謝頁的URL中
    
    var flag = url.searchParams.get('line_registration_flg');

    //相同 domain 下會先從 sessionStorage 中抓取 line_registration_flg
    var sessionFlag = sessionStorage.getItem("line_registration_flg");
    var currentBtn = document.getElementById("lineLoginBtn");
    
    if ( flag == 1 || sessionFlag == 1) {
        currentBtn.style.display = "none";
    }
    else{
        currentBtn.style.display = "block"; //style中的display属性
    }
}


// request registsnsinfo API
function getRegistsnsInfo(){

    orderKey = sessionStorage.getItem('orderKey');

    // 成功Line Login 後 receive.html 會將 token 塞入 導回 感謝頁 URL　參數中  
    var id_token = url.searchParams.get('line_id_token');
    console.log("line_id_token",id_token);

    var API_URL = CROS_SETTING_ACTION_HOST_NAME + '/registsnsinfo';
    console.log(API_URL)
    fetch(API_URL, {
        method: 'POST',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }),
        body: JSON.stringify(
            {"account_id": CROS_SETTING_ID,
             "token":id_token, 
             "order_key":orderKey, 
             "type":"1"})

    })
    .then(function(res){
        console.log(res);
        return res.json();
    })
    .then(function(data){
        console.log('API Response:');
        console.log("registsnsinfo ",data);
        location.href = CROS_LINE_ADD_FRIEND_URL;
    })
    .catch(function(err) {
        console.log(err);
    });
}


// request orderinfo API
function getOrderInfo(){
    
    var orderUrl = getJsonFromUrl()
    console.log("JSON_URL ",orderUrl);
    sessionStorage.setItem('orderKey',orderUrl.orderKey);
  
    var API_URL = CROS_SETTING_ACTION_HOST_NAME + '/orderinfo?account_id=' + CROS_SETTING_ID + '&order_key=' + orderUrl.orderKey ;
    console.log(API_URL)
    fetch(API_URL, {
        method: 'get'
    })
    .then(function(res){
        console.log(res);
        return res.json();
    })
    .then(function(data){
        console.log('API Response:');
        console.log("oderInfo ",data);

        // orderinfo line_registration_flg = 1 代表已經登錄過，不需顯示 LINE LOGIN button
        sessionStorage.setItem('line_registration_flg',data.line_registration_flg);
        DisplayAndHiddenLineLoginBtnWithFlag();

        // orderinfo client_id & client_secret 從 orderinfo api 抓取
        client_id = data.line_client_id;
        client_secret = data.line_client_secret;
  
    })
    .catch(function(err) {
        console.log(err);
    });
}
  

           
