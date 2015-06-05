UX Rocket Tooltip
================
Tooltip, farklı içerik gösterim metodlarına sahiptir. Sayfa içerisindeki bir ögeyi, bir metni, bir ajax sorgu sonucunu ya da bir JavaScript fonksiyonunun sonucunu içerik olarak gösterebilmektedir. Bununla beraber, temalanabilme yeteneği sayesinde, sayfa içinde farklı görünümlerde kullanılabilir.

```HTML
<span class="tooltip" data-content="Tootip içeriği">metin</span>
<span class="tooltip" data-content="#tooltip-sample" data-type="popover">metin</span>
<span class="tooltip" data-content="/data/tooltip">metin</span>
<span class="tooltip" data-content="countTips()">metin</span>
```

### Notlar
Gösterilecek içerik `data-content` attribute ile, sadece metin gösterimi durumunda `title` ile de tanımlanabilir

* düz metin girişi yapıldığında, metin gösterilir.
* #id, .class şeklinde sayfa içinde bir ögenin id ya da classı yazılırsa, bu ögenin içeriği gösterilir.
* http://, https://, / şeklinde url ile, ajax sorgusu yapılır ve dönen sonuç içerik olarak gösterilir
* myfunc() şeklinde window da tanımlı bir fonksiyon çalıştırılabilir.

Tooltip içeriklerinin ve çalışma şeklinin tanımları `data` attributeleri ile yapıldığı için, güncelleme sırasında `$(".tooltip").attr('data-content', 'yeni içerik')` şeklinde yapılacak tanımlama işlemleri tooltipi güncelle__me__yecektir. `data` attribute güncellemelerinin `data()` fonksiyonu ile yapılması gerekmektedir.

```JAVASCRIPT
var $tooltip = $(".tooltip");
// Yanlış güncelleme 
$tooltip.attr('data-content', 'yeni içerik');
$.uxtooltip.update($tooltip); // eski içerik görüntülenmeye devam edecektir

// Doğru güncelleme
$tooltip.data('content', 'yeni içerik');
$.uxtooltip.update($tooltip); // yeni içerik görüntülenmeye başlayacaktır
```
Yukarıda belirtilen örnek ve güncelleme kullanımları `data` attribute ile belirlenen bütün tooltip özellikleri için geçerlidir.


### Tanımlar
Property 			 | Default			| Açıklama
-------------------- | ---------------- | --------
placement            | top              | Tooltipin elemanın ne tarafında gözükeceğini belirler.
position             | center           | Tooltipin elemana göre pozisyonunu belirler. "center" tanımı, tooltip elemana ortalar. "start" tanımı, elemanın baş tarafına, "end" tanımı da son tarafına hizalar.
template             | &lt;div {id} class="tooltip-pop {class}">&lt;div class="tooltip-content">{content}&lt;/div>&lt;div class="tooltip-arrow">&lt;/div>&lt;/div> | Açılan tooltipin html template formatını belirler. _{id}_ placeholderı, id değerini, _{class}_ placeholderı atanacak class değerini, _{content}_ placeholderı da, içeriğin gözükeceği yeri belirler. Bu placeholder tanımları korunması şartı ile, tooltipin html formatı istenildiği gibi değiştirilebilir.
cssClass             | null             | Tooltip html template içerisine eklenecek CSS classını belirtir. Farklı tema kullanılmak için CSSde ilgili class tanımlaması yapılabilir.
id                   | null             | Tooltip html template içerisine eklenecek CSS idsini belirtir. Farklı tema kullanılmak için CSSde ilgili id tanımlaması yapılabilir.
showAnimate          | false            | Tooltip animasyon ile görünür hale gelir.
type                 | tooltip          | "tooltip" ya da "popover" değerleri tanımlanabilir. _"tooltip"_ değerinde, fare elemanın üzerinden çekildiğinde tooltip kaybolur. _"popover"_ değerinde ise, fare ile tooltip içerisinde gezilebilir, tooltip dışında bir yere tıklanınca tooltip kaybolur.


Data Attribute 			   | &nbsp;
-------------------------- | -----
content                    | Gösterilecek tooltip içeriğini tanımlar. data-content değeri boş ise, `title` değeri kontrol edilir, ve bu değerdeki içerik tooltip içeriği olarak kullanılır.
type                       | Tooltip görünüm formatını ("tooltip", "popover") belirler
placement                  | Tooltipin elemanın ne tarafında gözükeceğini belirler.
position                   | Tooltipin elemana göre pozisyonunu belirler. "center" tanımı, tooltip elemana ortalar. "start" tanımı, elemanın baş tarafına, "end" tanımı da son tarafına hizalar.


Callback			 | &nbsp;
-------------------- | -----
onReady              | Tooltip, ilgili elemana bağlandığında çalışacak fonksiyonu çağırır.
onOpen               | Tooltip açıldığında çalışacak fonksiyonu çağırır.
onClose              | Tooltip "popover" modundayken "x" ikonuna basıp kapatıldığında çalışacak fonksiyonu çağırır.
onRemove             | Tooltip kapandıktan sonra çalışacak fonksiyonu çağırır.
onUpdate             | Tooltipe ait instance güncellendikten sonra çalışacak fonksiyonu çağırır.
onDestroy            | Tooltipe ait instance sayfadan kaldırıldıktan sonra çalışacak fonksiyonu çağırır.


### Public Metodlar
Metod						 | Açıklama
---------------------------- | -------------------------------------------------------
$(selector).tooltip(options) | Bu method plugini manuel olarak bir elemana bağlamanızı sağlar.
$.uxtooltip                  | Bu method pluginin detayını görmenizi sağlar.
$.uxtooltip.update(el)       | İçeriği değiştirilen tooltipi güncellemeyi sağlar. `el` gönderilmezse sayfadaki bütün tooltipleri günceller.
$.uxtooltip.remove(el)       | Seçilen elemanda tooltip instance bilgisini ve tooltip aksiyonlarını kaldırır. `el` gönderilmezse sayfadaki bütün tooltipleri kaldırır.
$.uxtooltip.version          | Sayfaya eklenmiş pluginin versiyon numarasını gösterir.
$.uxtooltip.settings         | Aktif pluginin ayarlarını gösterir.
