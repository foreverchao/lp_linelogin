# lP_line_login_demo



## 全体の流れ - V2.0

### できること

 - LINE ID を CROS に登録することができるようになります。
 - LINE ID を CROS に登録した後、LINE の友達追加ページに自動的に遷移します。



### 対応が必要なこと

1. LINE 管理画面の設定

	LINE ログインを申請して、取得できる情報を CROS のシステム設定に設定する必要がある。
クライアント様（もしくは広告代理店などの LINE 運用者）にて情報を取得していただき、
その情報を ACCESS 台湾に教えてください。
2つの情報が必要です。
・Client ID
・Client Secret
その際、LINE ログイン完了後のリダイレクトページ（URL）を設定する必要があります。
下記 3 リダイレクトページの配置 で設定するリダイレクトページ（URL）を設定してください。

	***

1. 上記の情報を CROS に登録

	ACCESS台湾側にて設定しますので、 Client ID と Client Secret の情報を教えてください。

	***

1. リダイレクトページの配置

	1 の LINE 管理画面で設定したリダイレクトページ（URL）をクライアント様のサーバーに配置してください。

	`cros_receive.html`

	***

1. サンキューページ用 JavaScript ファイルの配置

	以下のフォルダをサンキューページと同じ URL に配置してください。
複数 JavaScript ファイルと html ファイルが含まれています。

	`cros_sns_js/`

	***

1. サンキューページ用設定ファイルの更新

	`cros_sns_js/cros_thankyou_line_login_setting.js`
	を開き、以下の設定をするように更新してください。

	`const CROS_SETTING_ACTION_HOST_NAME = 'CROS サービス URL'; // ACCESS 台湾にて指定します。
const CROS_SETTING_ID = 'CROSのクライアントｘ地域毎のアカウントID'; // ACCESS 台湾にて指定します。
const CROS_LINE_REDIRECT_URI= 'LINE ID 登録処理を実装するサンキューページの URL　（3 リダイレクトページの配置と同じにしてください）';
const CROS_LINE_ADD_FRIEND_URL= '公式アカウントを LINE の友達として追加するための URL';`

	オージオ様台湾本番アカウントの場合、以下となります。

	`const CROS_SETTING_ACTION_HOST_NAME =  ＝ 'https://asp.acs-tpkg.com/;
const CROS_SETTING_ID = '2015070001';`

	***

1. サンキューページの更新

	サンキューページの一番最後（</html> の後ろに、LINE ID 登録のための記述を2行追加してください。

	`<script src="../cros_sns_js/cros_thankyou_line_login_setting.js"></script>
<script src="./cros_sns_js/line_manager.js"></script>`



### 動作確認の方法例

1. テスト用の LP を作成（LP Tool をご利用ください）
1. 上記の LP のサンキューページとして、動作確認するためサンキューページ の URL を設定
1. テスト購入＆サンキューページの動作確認をする
1. サンキューページを本番に反映してください。その際、上記「5」で説明した設定ファイルの更新を忘れないようにお願いします。
