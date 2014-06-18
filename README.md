KanColle Logistics Visualizer
=============================

This file describes *KanColle Logistics Visualizer version 0.0.0 (Beta)* in brief.

* Please refer to *the [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki) pages* for more details.
* Note: Japanese follows English.

この文書は *KanColle Logistics Visualizer（艦これ 兵站図示儀） 第0.0.0版（ベータ版）* について簡単に記したものです。

* 詳細は[Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Home:ja)を参照してください。
* 註: [日本語は英語の後に記載しています](#%E8%89%A6%E3%81%93%E3%82%8C-%E5%85%B5%E7%AB%99%E5%9B%B3%E7%A4%BA%E5%84%80)。
                                         

Description
-----------

*[Kantai Collection -KanColle-](http://www.dmm.com/netgame/feature/kancolle.html)* is [said](http://www.4gamer.net/games/205/G020591/20130911062/) to be a **game of logistics**.

> "KanColle" is a game that was seen variously, as it is "what" game, it is a "game of logistics". -- Mr. TANAKA Kensuke, Producer.

You, as an Admiral of many naval battles, may be suffering from management of materials on the your Naval District everyday, and may smile at skilled *Combined Fleet Girls* in exchange for materials.

You've got the right stuff! *KanColle Logistics Visualizer* treats materials log files and ships roster files from various agents (dedicated browses or dedicated proxies) for *KanColle* below:

* *[Logbook](http://kancolle.sanaechan.net/)*
* *[KCRDB (KanColle Received Data Browser)](http://hetaregrammer.blog.fc2.com/)*
* And more (due to expansion)

... and draws various charts below:

* Indicator of ship's skill
    * Scatter chart of experience points
    * Scatter chart of levels
    * Histogram
* History of materials fluctuation
    * Line chart of resources (Fuel, Ammunition, Steel and Bauxite)
    * Line chart of resources (Fuel, Ammunition, Steel and Bauxite) + Instant repair
    * Line chart of consumables (Instant Repair, Instant construction and Development material)
    * Candlestick chart of materials (ex. Weekly fluctuation of instant repair)
* And more (due to expansion)


Getting Started
---------------

Let's run it via GUI (Graphical User Interface).

1. Install this system in your computer with reference to *the [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki#installation) page*.
    * Note: This system runs on *WSH (Windows Script Host)* environment on *Microsoft Windows*. A guest language is (not *JavaScript* but) *JScript*.
2. Double clik `visualizer.wsf` file.
3. Open a chart file which outputted to `chart` directory (folder), and browse a chart.

Note: It can be run via the [CLI (Command Line Interface)](https://github.com/gardejo/js-kancolle-logistics-visualizer/Command-Line).


Support
-------

### Information Service

You can find documentation for this system at *the [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki) pages* (it was almost all written in Japanese, at the moment). Please read it before using.

Release information of this system is provided by [RSS feed](https://github.com/gardejo/js-kancolle-logistics-visualizer/releases.atom). Also the author may tweet it at *[Twitter](https://twitter.com/gardejo)*.

### Maintenance Service

I'd like to receive a report about bugs and a suggestion for enhancement at *the [issue tracker](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)*. Please refrain from contact via *Twitter* or e-mail, whenever possible. Please be considerate to share issues with stakeholders.

The author make no guarantees about responding to these inquiries. Besides the author is not able to respond to contacts about environment or configuration, in principle. Please accept my regrets.

**Do not dare** contact with authors of agents (dedicated browses or dedicated proxies) and official providers (DMM and Kadokawa Games) about this system.


Acknowledgements
----------------

I deeply thank people below:

* Dev & Ops team of *[Kantai Collection -KanColle-](http://www.dmm.com/netgame/feature/kancolle.html)*, DMM.com, Ltd. and Kadokawa Games, Ltd.
* *[@sanae_hirotaka](https://twitter.com/sanae_hirotaka)* wrote *[Logbook](https://twitter.com/sanae_hirotaka)*, which this system treats its log files.
* *hetaregrammer* wrote *[KCRDB](http://hetaregrammer.blog.fc2.com/)*, which this system treats.
* *[No.983](http://jbbs.shitaraba.net/netgame/12394/storage/1386926329.html#983) of the thread about tools and dedicated browsers* wrote *[Graphicalizer Tool for KCRDB logs](https://dl.dropboxusercontent.com/s/6ortcavxtaucgnn/convert_graph.html)*, which this system gets an idea from.
* Mozilla Contributors wrote sample codes under the Public Domain at *[MDN](https://developer.mozilla.org/)*, which this system uses as [`lib/kclv.polyfill.js`](https://github.com/gardejo/js-kancolle-logistics-visualizer/blob/master/lib/kclv.polyfill.js) .


Contribution
------------

Thank you for regularly using *KanColle Visualizer*. Do you enjoy it?

The author of this system asks that you help support its continued development by making a small contribution.

* Report about bugs at *the [issue tracker](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)*.
* Suggestion for enhancement at *the [issue tracker](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)*.
* Reciprocal help among users at *the [discussion forum](http://ost.io/@gardejo/js-kancolle-logistics-visualizer)*.
* Improve documentation at *the [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki)*.
* Collaboration on the code base via *[pull-requests](https://github.com/gardejo/js-kancolle-logistics-visualizer/pulls)*.
* Purchase of an item in the game and official goods.
    * I'd recommend *Dock Extension Set* and *Port Extension* especially.
    * As for stereoscopically shaped articles, I'd like to suggest you a cute *[Nendoroid](http://www.goodsmile.info/ja/products/search?utf8=%E2%9C%93&search%5Bquery%5D=%E3%81%AD%E3%82%93%E3%81%A9%E3%82%8D%E3%81%84%E3%81%A9+%E8%89%A6%E9%9A%8A%E3%81%93%E3%82%8C%E3%81%8F%E3%81%97%E3%82%87%E3%82%93#searchResults)* and *[KanColle Model](http://www.f-toys.net/index.php?m=fproduct&t=detaile&product_id=236)*, unusual miniature ship models.
* Contribution to authors of agents (dedicated browses or dedicated proxies).
* Donation for me via [Amazon Gift Cards (E-mail Delivery)](http://www.amazon.com/gift-cards/) or [Amazon Wishlist](http://www.amazon.co.jp/registry/wishlist/3O5J3JV19DOJ1/) suggested. I'm sorry, but I'm not accept an offer of a refund or a return.

However, even if you contribute to me, I'm afraid that I can not offer special support or special enhancement. Please accept my regrets.


Author
------

MORIYA Masaki, alias "Gardejo".

* Website: [http://gardejo.org](http://en.gardejo.org/)
* Twitter: [@gardejo](https://twitter.com/gardejo)
* E-mail: [kclv@ermitejo.com](mailto:kclv@ermitejo.com)


Copyright and License
---------------------

Copyright (c) 2014 MORIYA Masaki

This system is free software, released under the *The MIT license*. The full text of the license can be found in the [`LICENSE`](https://github.com/gardejo/js-kancolle-logistics-visualizer/blob/master/LICENSE) file included with this distribution.

All brand names and product names are trademarks or registered trademarks of their respective companies.


艦これ 兵站図示儀
=================

概要
----

*[艦隊これくしょん -艦これ-](http://www.dmm.com/netgame/feature/kancolle.html)* は、 **兵站のゲーム** だと[言われています](http://www.4gamer.net/games/205/G020591/20130911062/)。

> 「艦これ」はいろいろな見方ができるゲームではありますが，では本質的に何のゲームかというと「兵站のゲーム」なんです。 ―― プロデューサー 田中謙介氏

歴戦の提督であるあなたも、鎮守府の日々の資材のやりくりに頭を悩ませたり、資材を引き替えにして育った *艦娘* たちに微笑みを向けていることでしょう。
*KanColle Logistics Visualizer（艦これ 兵站図示儀）* は、そんなあなたにぴったりの道具です。このシステムは、以下の *艦これ* のエージェント（専用ブラウザーやプロキシーなど）……

* *[航海日誌](http://kancolle.sanaechan.net/)*
* *[KCRDB（艦これ Received Data Browser）](http://hetaregrammer.blog.fc2.com/)*
* ……（他にも拡張予定）

……が出力する資材履歴ログファイルや艦娘一覧ファイルを加工し、以下のような各種のグラフを描画します。

* 艦娘の育成状況
    * 経験値の分布図
    * 練度（レヴェル）の分布図
* 資材の増減履歴
    * 資材（燃料・弾薬・鋼材・ボーキサイト）の折れ線グラフ
    * 資材（燃料・弾薬・鋼材・ボーキサイト）の折れ線グラフ（高速修復材付き）
    * 消耗品（高速修復材・高速建造材・開発資材）の折れ線グラフ
    * 資材のローソク足グラフ（例えば、高速修復材の週次の増減）
* ……他にも拡張する予定


はじめに
--------

GUI（グラフィカル ユーザー インターフェース）で操作しましょう。

1. [Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Home:ja#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)を参照して、あなたのコンピューターにこのシステムをインストールします。
    * 註: このシステムは *Microsoft Windows* 上の *WSH（Windows Script Host）* 環境で稼働します。
2. `visualizer.wsf`ファイルをダブル クリックします。
3. chart ディレクトリー（フォルダー）に出力されたグラフ ファイルを開いて、グラフを閲覧します。

註: CLI（コマンド ライン インターフェース）でも操作できます。


サポート
--------

### 情報提供

このシステムの説明書は[Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki/Home:ja)にあります（現在のところ、ほとんど日本語で記載されています）。ご利用の前にご覧ください。

このシステムのバージョン アップ情報は[RSS](https://github.com/gardejo/js-kancolle-logistics-visualizer/releases.atom)で配信されます。また、著者が *[Twitter](https://twitter.com/gardejo)* で呟くこともあります。

### 保守

バグのご報告や機能拡張のご提案は、 *[問題追跡システム](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)* で承ります。*Twitter* や電子メールでのお問い合わせは、できるだけご遠慮ください。問題を皆で共有するため、ご配慮ください。

訳註: オープン ソース ソフトウェアの世界は（不本意ながら[エスペラント](https://ja.wikipedia.org/wiki/%E3%82%A8%E3%82%B9%E3%83%9A%E3%83%A9%E3%83%B3%E3%83%88)ではなく）英語が共通語です。できるだけ英語でお書きください。

著者はこれらの対応を必ずしもお約束するものではありません。また、使用環境や設定方法に関するお問い合わせには、原則として対応致しかねます。悪しからずご了承ください。

各エージェント（専用ブラウザーやプロキシーなど）の著者の方々や公式事業者（DMM・角川ゲームズ）へは、このシステムについての質問を **絶対に** 寄せないでください。


謝辞
----

以下の方々に深く感謝致します。

* *株式会社DMM.com* および *株式会社角川ゲームス* 各社の、 *[艦隊これくしょん -艦これ-](http://www.dmm.com/netgame/feature/kancolle.html)* の開発・運営チームの皆さん。
* *[航海日誌](https://twitter.com/sanae_hirotaka)* をお書きになった *[@sanae_hirotaka](https://twitter.com/sanae_hirotaka)* さん。ログ ファイルを使わせていただきました。
* *[KCRDB](http://hetaregrammer.blog.fc2.com/)* をお書きになった *hetaregrammer* さん。ログ ファイルを使わせていただきました。
* *[KCRDBログ グラフ化ツール](https://dl.dropboxusercontent.com/s/6ortcavxtaucgnn/convert_graph.html)* をお書きになった *ツール、専ブラスレの[983](http://jbbs.shitaraba.net/netgame/12394/storage/1386926329.html#983)* さん。着想をいただきました。
* *[MDN](https://developer.mozilla.org/)* でパブリック ドメインのサンプル コードをお書きになった Mozilla 貢献者さんたち。 [`lib/polyfill.js`](https://github.com/gardejo/js-kancolle-logistics-visualizer/blob/master/lib/kclv.polyfill.js) として使わせていただきました。


寄与
----

*KanColle Visualizer* をご愛用いただき、ありがとうございます。このシステムがお気に召しましたでしょうか？

作者は開発を続けていくために、以下のようなささやかなご支援を求めています。

* *[問題追跡システム](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)* への、バグのご報告。
* *[問題追跡システム](https://github.com/gardejo/js-kancolle-logistics-visualizer/issues)* への、機能拡張のご提案。
* *[掲示板](http://ost.io/@gardejo/js-kancolle-logistics-visualizer)* での、ユーザー同士の質疑応答。
* *[Wiki](https://github.com/gardejo/js-kancolle-logistics-visualizer/wiki)* にある説明書の充実。
* *[Pull-Request](https://github.com/gardejo/js-kancolle-logistics-visualizer/pulls)* による、ソース コードのご提供。
* 艦これのゲーム内でのアイテムのご購入や、公式グッズのご購入。
    * *修理ドック* や *母港拡張* が特にお薦めです。
    * 立体造形物としては、可愛らしい *[ねんどろいど](http://www.goodsmile.info/ja/products/search?utf8=%E2%9C%93&search%5Bquery%5D=%E3%81%AD%E3%82%93%E3%81%A9%E3%82%8D%E3%81%84%E3%81%A9+%E8%89%A6%E9%9A%8A%E3%81%93%E3%82%8C%E3%81%8F%E3%81%97%E3%82%87%E3%82%93#searchResults)* の他、一風変わった艦船模型 *[艦これ モデル](http://www.f-toys.net/index.php?m=fproduct&t=detaile&product_id=236)* もいかがでしょう。
* 各エージェント（専用ブラウザーやプロキシーなど）の著者への、各種のご寄与。
* [Amazonギフト券（Eメールタイプ）](http://www.amazon.co.jp/gp/gc)または[Amazonのほしい物リスト](http://www.amazon.co.jp/registry/wishlist/3O5J3JV19DOJ1/)による、開発費のご寄付。恐れ入りますが、ご返金やご返品には応じかねます。

ただし、ご支援をいただいても、特別な機能追加やサポートのご提供は致しかねます。悪しからずご了承ください。


著者
----

守屋 雅樹 (Gardejo)

* ウェブ サイト: [http://gardejo.org](http://en.gardejo.org/)
* Twitter: [@gardejo](https://twitter.com/gardejo)
* 電子メール: [kclv@ermitejo.com](mailto:kclv@ermitejo.com)


著作権と使用許諾
----------------

Copyright (c) 2014 MORIYA Masaki

このシステムは *MITライセンス* に基づくフリー ソフトウェアです。使用許諾書の全文は、この配布物に同梱されている[`LICENSE`](https://github.com/gardejo/js-kancolle-logistics-visualizer/blob/master/LICENSE)ファイルで確認できます。

訳註: **使用許諾書は英文のみが正文です。** [オープン ソース グループ ジャパン](http://opensource.jp/)による[日本語参考訳](http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license)も参照してください。

記載されている会社名および製品名は、すべて各社の商標または登録商標です。
