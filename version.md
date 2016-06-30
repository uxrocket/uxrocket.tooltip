## Versiyon 1.3.1
- FIX: jQuery 3 ile kaldırılan `load` metodu, `on` versiyonu ile değiştirildi.

## Versiyon 1.3.0
- YENİ: Yeni tanımlanmaya başlayan, elemana bağlanmış uxRocket plugin listesi kontrolleri eklendi.

## Versiyon 1.2.0
- YENİ: $.uxtooltip.update metodu eklendi. Tooltip çalışma özellikleri ve içeriği değiştirdikten sonra tooltipi güncellemeye sağlar.
- YENİ: $.uxtooltip.remove metodu eklendi. Belirtilen ya da sayfadaki tüm tooltipleri kaldırmayı sağlar.
- YENİ: onUpdate callbacki eklendi. $.uxtooltip.update işleminden sonra çalışacak callbacki tanımlar.
- YENİ: onDestroy callbacki eklendi. $.uxtooltip.remove işleminden sonra çalışacak callbacki tanımlar.
- DEĞİŞİKLİK: instance_opts bilgisi `uxTooltip` datası ile eklenmeye başlandı. Tooltip çalışması da `options` değerini göndermek yerine, `uxTooltip` datası üzerinden alınarak yapılmaya başlandı.