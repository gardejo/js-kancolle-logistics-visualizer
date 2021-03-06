[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/gardejo/js-kancolle-logistics-visualizer/blob/master/LICENSE)
[![Build Status](http://img.shields.io/travis/gardejo/js-kancolle-logistics-visualizer.svg)](https://travis-ci.org/gardejo/js-kancolle-logistics-visualizer)
[![Code Climate](http://img.shields.io/codeclimate/github/gardejo/js-kancolle-logistics-visualizer.svg)](https://codeclimate.com/github/gardejo/js-kancolle-logistics-visualizer)
[![Coverage Status](https://img.shields.io/coveralls/gardejo/js-kancolle-logistics-visualizer.svg)](https://coveralls.io/r/gardejo/js-kancolle-logistics-visualizer?branch=master)

KanColle Logistics Visualizer
=============================

This file describes *KanColle Logistics Visualizer version 0.3.0 (Beta)* in brief.


* Please refer to *the [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki) pages* for more details.
* Note: Japanese follows English.

この文書は *KanColle Logistics Visualizer（艦これ 兵站図示儀） 第0.3.0版（ベータ版）* について簡単に記したものです。

* 詳細は[Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Home-%28ja%29)を参照してください。
* 註: [日本語は英語の後に記載しています](#%E8%89%A6%E3%81%93%E3%82%8C-%E5%85%B5%E7%AB%99%E5%9B%B3%E7%A4%BA%E5%84%80)。


Description
-----------

*[Kantai Collection -KanColle-](http://www.dmm.com/netgame/feature/kancolle.html)* is [said](http://www.4gamer.net/games/205/G020591/20130911062/) to be a **game of logistics**.

> "KanColle" is a game that was seen variously, as it is essentially "what" game, it is a "game of logistics". -- Mr. TANAKA Kensuke, Producer.

You, as an Admiral of many naval battles, may be suffering from management of materials on the your Naval District everyday, and may smile at skilled *Combined Fleet Girls* in exchange for materials.

You've got the right stuff! *KanColle Logistics Visualizer* draws various charts below:

* Indicator of ship's skill
    * Scatter chart of experience points
    * Scatter chart of levels
    * Histogram
    * Bubble chart of bench strength by ships classifications
* History of materials fluctuation
    * Line chart of resources (Fuel, Ammunition, Steel and Bauxite) (and Instant Repair, if desired)
    * Line chart of consumables (Instant Repair, Instant Construction and Development Material)
    * Candlestick chart of materials (ex. Daily/Weekly/Monthly/Yearly fluctuation of instant repair)
* ... and more (due to expansion)

See also [Gallery](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki#gallery)) for a catalog of various charts.

You can **manually fill out** designated forms (CSV: Comma-Separated Values) as a materials log and a ships roster. Furthermore, you can use **dumped log files**, if you use various agents (dedicated browses or dedicated proxies) for *KanColle* below:

* *[Logbook](http://kancolle.sanaechan.net/)*
    * *[Logbook Expanded Edition](https://github.com/nekopanda/logbook)*
* *[KCRDB (KanColle Received Data Browser)](http://hetaregrammer.blog.fc2.com/)*
* *[Sandanshiki Kanpan](http://3dan.preflight.cc/)* (Only materials log)
* ... and more (due to expansion)


Getting Started
---------------

Let's run it via GUI (Graphical User Interface).

1. Install this system in your computer with reference to *the [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki#installation) page*.
    * Note: This system runs on *WSH (Windows Script Host)* environment on *Microsoft Windows*. A guest language is (not *JavaScript* but) *JScript*.
2. Prepare log files for visualization.
    * If you use manually inputted log:
        * Fill out designated forms as a materials history and a ships roster, and save `materials.csv` and `ships.csv` with reference to *the [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Relations) page*.
    * If you use *Logbook* or *Logbook Expanded Edition*:
        * Materials log was outputted automatically as `資材ログ.csv`.
        * Output ships roster manually as `所有艦娘一覧.csv`.
            * Select `[所有艦娘一覧]` (Roster of owned ships) window - `[ファイル]` (File) menu - `[CSVファイルに保存]` (Output as CSV file) item.
    * If you use *KCRDB*:
        * Materials log was outputted automatically as `KCRDB-materialhistory.log`, if you turn on the `[設定]`(Configuration) window - `[ログ1]` (Log 1) tab - `[資源履歴を記録]` (Record materials history) check box.
        * Output ships roster manually such as `KCRDB-shiplist.csv` by any way of the following:
            * Turn on the `[CSV出力]` (CSV output) button - `[出力するCSVの選択]` (Select outputting CSV) window - `[所持している艦娘の一覧]` (Roster of owned ships) radio button, and press the `[OK]` button.
            * Right click `[全艦娘一覧]` (Roster of all ships) window or `[艦娘グループ]` (Ships group) window, and select `[表示中の艦娘一覧をCSVに出力]` (Output displaying ships roster as CSV) item in the context menu.
    * If you use *Sandanshiki Kanpan*:
        * Materials logs were outputted automatically as `fuel.0.4.dat`, `bullet.0.4.dat`, `steel.0.4.dat`, `bauxite.0.4.dat`, `burner.0.4.dat`, `bucket.0.4.dat` and `devMaterial.0.4.dat`.
3. Double click `visualizer.wsf` file.
4. Open a chart file which outputted to `chart` directory (folder), and browse a chart.

Note: It can be run via the [CLI (Command Line Interface)](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Command-Lines).


Support
-------

### Information Service

You can find documentation for this system at *the [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki) pages* (it was almost all written in Japanese, at the moment). Please read it before using.

Additionally, you can also use *the [users forum](http://ost.io/@gardejo/js-kancolle-logistics-visualizer)* for reciprocal help among users.

Release information of this system is provided by [Release Notes](https://github.com/gardejo/js-kancolle-logistics-visualizer/releases) and [RSS feed](https://github.com/gardejo/js-kancolle-logistics-visualizer/releases.atom). Also the author may tweet it at *[Twitter](https://twitter.com/gardejo)*.

Note: This software complies with [Semantic Versioning](http://semver.org/).

### Maintenance Service

I'd like to receive a report about bugs and a suggestion for enhancement at *the [issue tracker](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)*. Please refrain from contact via *Twitter* or e-mail, whenever possible. Please be considerate to share issues with stakeholders.

The author make no guarantees about responding to these inquiries. Besides the author is not able to respond to contacts about environment or configuration, in principle. Please accept my regrets.

**Do not dare** contact with authors of agents (dedicated browses or dedicated proxies) and official providers (DMM and Kadokawa Games) about this system.


Acknowledgements
----------------

I deeply thank people below:

* Dev & Ops team of *[Kantai Collection -KanColle-](http://www.dmm.com/netgame/feature/kancolle.html)*, DMM.com, Ltd. and Kadokawa Games, Ltd.
* *[@sanae_hirotaka](https://twitter.com/sanae_hirotaka)* wrote *[Logbook](https://twitter.com/sanae_hirotaka)*, which this system treats its log files.
* *[@nekopanda](http://nekopanda.blog.jp/)* wrote *[Logbook Expanded Edition](https://github.com/nekopanda/logbook)*, which this system treats its log files.
* *[@nash_fs](https://twitter.com/nash_fs)* wrote *[Sandanshiki Kanpan](http://3dan.preflight.cc/)*, which this system treats its log files. Besides, he readily struggle with my debugging.
* *[@kcInputAux](https://twitter.com/kcInputAux)* wrote *[KCLV Config Generator](http://kancolle.s601.xrea.com/kclv/)*, a handy tool that lets us edit and output a configuration of this system with Web browsers.
* *[No.983](http://jbbs.shitaraba.net/netgame/12394/storage/1386926329.html#983) of the thread about tools and dedicated browsers* wrote *[Graphicalizer Tool for KCRDB logs](https://dl.dropboxusercontent.com/s/6ortcavxtaucgnn/convert_graph.html)*, which this system gets an idea from.
* *Mozilla Contributors* wrote sample codes under the Public Domain at *[MDN](https://developer.mozilla.org/)*, which this system uses as [`lib/polyfill.js`](https://github.com/gardejo/js-kancolle-logistics-visualizer/blob/master/lib/polyfill.js) .
* Volunteers edited *[Kantai Collection -KanColle- Wiki](http://wikiwiki.jp/kancolle/)*, which this system refers to about specifications of the game.
* Volunteers edited *[Kancolle Wiki](http://kancolle.wikia.com/wiki/Kancolle_Wiki)*, which this system refers to about English equivalents for terminology of the game.


Contribution
------------

Thank you for regularly using *KanColle Visualizer*. Do you enjoy it?

The author of this system asks that you help support its continued development by making a small contribution.

* Feedback about this system. *Tell me your opinion later!* (as if Yuubari)
* Endorse this system.
    * Recommend your friends to use it.
    * Retweet author's tweets about it.
    * Star it on GitHub.
* Report about bugs at *the [issue tracker](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)*.
* Suggestion for enhancement at *the [issue tracker](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)*.
* Reciprocal help among users at *the [users forum](http://ost.io/@gardejo/js-kancolle-logistics-visualizer)*.
* Improve documentation at *the [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki)*.
* Collaboration on the code base via *[pull-requests](https://github.com/gardejo/js-kancolle-logistics-visualizer/pulls)*.
    * To maintain this system, please run `npm install`, `grunt build` and `grunt test` (and `grunt dist`).
* Purchase of an item in the game and official goods.
    * I'd recommend *Dock Extension Set* and *Port Extension* especially.
    * As for stereoscopically shaped articles, I'd like to suggest you a cute *[Nendoroid](http://www.goodsmile.info/ja/products/search?utf8=%E2%9C%93&search%5Bquery%5D=%E3%81%AD%E3%82%93%E3%81%A9%E3%82%8D%E3%81%84%E3%81%A9+%E8%89%A6%E9%9A%8A%E3%81%93%E3%82%8C%E3%81%8F%E3%81%97%E3%82%87%E3%82%93#searchResults)* and *[KanColle Model](http://www.f-toys.net/index.php?m=fproduct&t=detaile&product_id=236)*, unusual miniature ship models.
* Contribution to authors of agents (dedicated browses or dedicated proxies).


Author
------

MORIYA Masaki, alias "Gardejo".

* Website: [http://gardejo.org](http://en.gardejo.org/)
* Twitter: [@gardejo](https://twitter.com/gardejo)
* E-mail: [kclv@ermitejo.com](mailto:kclv@ermitejo.com)


Copyright and License
---------------------

Copyright (c) 2014-2015 MORIYA Masaki

This system is free software, released under the *The MIT license*. The full text of the license can be found in the [`LICENSE`](https://github.com/gardejo/js-kancolle-logistics-visualizer/blob/master/LICENSE) file included with this distribution.

All brand names and product names are trademarks or registered trademarks of their respective companies.


<a name="%E8%89%A6%E3%81%93%E3%82%8C-%E5%85%B5%E7%AB%99%E5%9B%B3%E7%A4%BA%E5%84%80">艦これ 兵站図示儀</a>
=================

概要
----

*[艦隊これくしょん -艦これ-](http://www.dmm.com/netgame/feature/kancolle.html)* は、 **兵站のゲーム** だと[言われています](http://www.4gamer.net/games/205/G020591/20130911062/)。

> 「艦これ」はいろいろな見方ができるゲームではありますが，では本質的に何のゲームかというと「兵站のゲーム」なんです。 ―― プロデューサー 田中謙介氏

歴戦の提督であるあなたも、鎮守府の日々の資材（資源）のやりくりに頭を悩ませたり、資材を引き替えにして育った *艦娘* たちに微笑みを向けていることでしょう。
*KanColle Logistics Visualizer（艦これ 兵站図示儀）* は、そんなあなたにぴったりの道具です。このシステムは、以下のような各種のグラフを描画するものです。

* 艦娘の育成状況
    * 経験値の分布図
    * 練度（レヴェル）の分布図
    * 柱状グラフ（ヒストグラム）
    * 艦種毎の風船図（バブル チャート）
* 資材の増減履歴
    * 資材（燃料・弾薬・鋼材・ボーキサイト）の折れ線グラフ（お好みで高速修復材との同時表示も可能）
    * 消耗品（高速修復材・高速建造材・開発資材）の折れ線グラフ
    * 資材のローソク足グラフ（例えば、高速修復材の日次・週次・月次・年次の増減）
* ……他にも拡張する予定

多彩なグラフの一覧は、[ギャラリー](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Home-%28ja%29#%E3%82%AE%E3%83%A3%E3%83%A9%E3%83%AA%E3%83%BC)をご覧ください。

資材履歴や艦娘一覧のデータは、所定の書式（CSV:カンマ区切りファイル）で **手入力したものが使えます** 。さらに、以下の *艦これ* のエージェント（専用ブラウザーやプロキシーなど）をお使いの場合は、それらが出力する **ログファイルを用いる** こともできます。

* *[航海日誌](http://kancolle.sanaechan.net/)*
    * *[航海日誌拡張版](https://github.com/nekopanda/logbook)*
* *[KCRDB（艦これ Received Data Browser）](http://hetaregrammer.blog.fc2.com/)*
* *[三段式甲板](http://3dan.preflight.cc/)* （資材ログのみ）
* ……（他にも拡張予定）


はじめに
--------

GUI（グラフィカル ユーザー インターフェース）で操作しましょう。

1. *[Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Home-%28ja%29#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)* を参照して、あなたのコンピューターにこのシステムをインストールします。
    * 註: このシステムは *Microsoft Windows* 上の *WSH（Windows Script Host）* 環境で稼働します。
2. 処理したいログ ファイルを用意します。
    * 手入力の場合
        * *[Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Relations-%28ja%29)* を参照して、資材履歴や艦娘一覧を所定の書式（CSV）で記述し、例えば`materials.csv`や`ships.csv`などのファイルに保存します。
    * *航海日誌* または *航海日誌拡張版* の場合
        * `資材ログ.csv`は、自動で出力されています。
        * `所有艦娘一覧.csv`は、手動で保存してください。
            * `[所有艦娘一覧]`ウィンドウの`[ファイル]`メニューから`[CSVファイルに保存]`アイテムを選択する
    * *KCRDB* の場合
        * 資材ログ`KCRDB-materialhistory.log`は、`[設定]`ウィンドウ - `[ログ1]`タブ - `[資源履歴を記録]`チェック ボックスをオンにすれば、自動で出力されます。
        * 所有艦娘一覧は、以下のいずれかの手段で、`KCRDB-shiplist.csv`などの名前で手動で保存してください。
            * `[CSV出力]`ボタン - `[出力するCSVの選択]`ウィンドウで`[所持している艦娘の一覧]`ラジオ ボタンをオンにして`[OK]`ボタンを押下する
            * `[全艦娘一覧]`ウィンドウまたは`[艦娘グループ]`ウィンドウを右クリックし、コンテキスト メニューから`[表示中の艦娘一覧をCSVに出力]`アイテムを選択する
    * *三段式甲板* の場合
        * 資材ログは、 `fuel.0.4.dat`・`bullet.0.4.dat`・`steel.0.4.dat`・`bauxite.0.4.dat`・`burner.0.4.dat`・`bucket.0.4.dat`・`devMaterial.0.4.dat`として、自動で出力されています。
3. `visualizer.wsf`ファイルをダブル クリックします。
4. `chart` ディレクトリー（フォルダー）に出力されたグラフ ファイルを開いて、グラフを閲覧します。

註: [CLI（コマンド ライン インターフェース）](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Command-Lines-%28ja%29)でも操作できます。


サポート
--------

### 情報提供

このシステムの説明書は[Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Home-%28ja%29)にあります（現在のところ、ほとんど日本語で記載されています）。ご利用の前にご覧ください。

このシステムのバージョン アップ情報は[リリース ノート](https://github.com/gardejo/js-kancolle-logistics-visualizer/releases)および[RSS](https://github.com/gardejo/js-kancolle-logistics-visualizer/releases.atom)で配信されます。また、著者が *[Twitter](https://twitter.com/gardejo)* で呟くこともあります。

註: このソフトウェアは[Semantic Versioning](http://semver.org/)（[日本語訳](http://shijimiii.info/technical-memo/semver/)）に準拠しています。


### 保守

バグのご報告や機能拡張のご提案は、 *[問題追跡システム](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)* で承ります。*Twitter* や電子メールでのお問い合わせは、できるだけご遠慮ください。問題を皆で共有するため、ご配慮ください。

訳註: オープン ソース ソフトウェアの世界は（不本意ながら[エスペラント](https://ja.wikipedia.org/wiki/%E3%82%A8%E3%82%B9%E3%83%9A%E3%83%A9%E3%83%B3%E3%83%88)ではなく）英語が共通語です。できるだけ英語でお書きください。

また、ユーザー同士の質疑応答のための *[掲示板](http://ost.io/@gardejo/js-kancolle-logistics-visualizer)* もお使いいただけます。

訳註: こちらは英語にこだわらずに日本語でお気軽に書き込んでいただけます。

著者はこれらの対応を必ずしもお約束するものではありません。また、使用環境や設定方法に関するお問い合わせには、原則として対応致しかねます。悪しからずご了承ください。

各エージェント（専用ブラウザーやプロキシーなど）の著者の方々や公式事業者（DMM・角川ゲームス）へは、このシステムについての質問を **絶対に** 寄せないでください。


謝辞
----

以下の方々に深く感謝致します。

* *株式会社DMM.com* および *株式会社角川ゲームス* 各社の、 *[艦隊これくしょん -艦これ-](http://www.dmm.com/netgame/feature/kancolle.html)* の開発・運営チームの皆さん。
* *[航海日誌](https://twitter.com/sanae_hirotaka)* をお書きになった *[@sanae_hirotaka](https://twitter.com/sanae_hirotaka)* さん。ログ ファイルを使わせていただきました。
* *[航海日誌拡張版](https://github.com/nekopanda/logbook)* をお書きになった *[@nekopanda](http://nekopanda.blog.jp/)* さん。ログ ファイルを使わせていただきました。
* *[KCRDB](http://hetaregrammer.blog.fc2.com/)* をお書きになった *へたれぐらま* さん。ログ ファイルを使わせていただきました。
* *[三段式甲板](http://3dan.preflight.cc/)* をお書きになった *[@nash_fs](https://twitter.com/nash_fs)* さん。ログ ファイルを使わせていただきました。また、デバッグにも快くお付き合いいただきました。
* このシステムの設定内容をWebブラウザーで編集・出力できる便利なツール *[KCLV Config Generator](http://kancolle.s601.xrea.com/kclv/)* をお作りいただいた、 *[@kcInputAux](https://twitter.com/kcInputAux)* さん。
* *[KCRDBログ グラフ化ツール](https://dl.dropboxusercontent.com/s/6ortcavxtaucgnn/convert_graph.html)* をお書きになった *ツール、専ブラスレの[983](http://jbbs.shitaraba.net/netgame/12394/storage/1386926329.html#983)* さん。着想をいただきました。
* *[MDN](https://developer.mozilla.org/)* でパブリック ドメインのサンプル コードをお書きになった *Mozilla Contributors* の方々。 [`lib/polyfill.js`](https://github.com/gardejo/js-kancolle-logistics-visualizer/blob/master/lib/polyfill.js) として使わせていただきました。
* *[艦隊これくしょん -艦これ- 攻略Wiki](http://wikiwiki.jp/kancolle/)* を編集された有志の方々。ゲームの仕様を参考にさせていただきました。
* *[Kancolle Wiki](http://kancolle.wikia.com/wiki/Kancolle_Wiki)* を編集された有志の方々。ゲーム用語の訳語を参考にさせていただきました。


寄与
----

*KanColle Visualizer* をご愛用いただき、ありがとうございます。このシステムがお気に召しましたでしょうか？

作者は開発を続けていくために、以下のようなささやかなご支援を求めています。

* 感想のご提供。 *「後で感想、聴かせてね！」* （夕張並感）
* 賛意のご表明。
    * お友達へのご推薦。
    * 作者のツイートのリツイート。
    * GitHubのお気に入り（Star）登録。
* *[問題追跡システム](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)* への、バグのご報告。
* *[問題追跡システム](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)* への、機能拡張のご提案。
* *[掲示板](http://ost.io/@gardejo/js-kancolle-logistics-visualizer)* での、ユーザー同士の質疑応答。
* *[Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Home-%28ja%29)* にある説明書の充実。
* *[Pull-Request](https://github.com/gardejo/js-kancolle-logistics-visualizer/pulls)* による、ソース コードのご提供。
    * このシステムを保守するには、`npm install`・`grunt build`・`grunt test`（・`grunt dist`）を実行します。
* 艦これのゲーム内でのアイテムのご購入や、公式グッズのご購入。
    * *ドック増設セット* や *母港拡張* が特にお薦めです。
    * 立体造形物としては、可愛らしい *[ねんどろいど](http://www.goodsmile.info/ja/products/search?utf8=%E2%9C%93&search%5Bquery%5D=%E3%81%AD%E3%82%93%E3%81%A9%E3%82%8D%E3%81%84%E3%81%A9+%E8%89%A6%E9%9A%8A%E3%81%93%E3%82%8C%E3%81%8F%E3%81%97%E3%82%87%E3%82%93#searchResults)* の他、一風変わった艦船模型 *[艦これ モデル](http://www.f-toys.net/index.php?m=fproduct&t=detaile&product_id=236)* もいかがでしょう。
* 各エージェント（専用ブラウザーやプロキシーなど）の著者への、各種のご寄与。


著者
----

守屋 雅樹 (Gardejo)

* ウェブ サイト: [http://gardejo.org](http://en.gardejo.org/)
* Twitter: [@gardejo](https://twitter.com/gardejo)
* 電子メール: [kclv@ermitejo.com](mailto:kclv@ermitejo.com)


著作権と使用許諾
----------------

Copyright (c) 2014-2015 MORIYA Masaki

このシステムは *MITライセンス* に基づくフリー ソフトウェアです。使用許諾書の全文は、この配布物に同梱されている[`LICENSE`](https://github.com/gardejo/js-kancolle-logistics-visualizer/blob/master/LICENSE)ファイルで確認できます。

訳註: **使用許諾書は英文のみが正文です。** [オープン ソース グループ ジャパン](http://opensource.jp/)による[日本語参考訳](http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license)も参照してください。

記載されている会社名および製品名は、すべて各社の商標または登録商標です。
