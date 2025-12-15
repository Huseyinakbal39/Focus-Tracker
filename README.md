# 📱 Focus Tracker – Dijital Dikkat Takip Uygulaması

Focus Tracker, dijital dikkat dağınıklığıyla mücadele etmek amacıyla geliştirilmiş
bir mobil odaklanma ve dikkat takip uygulamasıdır. Uygulama, kullanıcının kendi
başlattığı odaklanma seanslarını takip eder, dikkat dağınıklıklarını tespit eder
ve elde edilen verileri istatistikler ile grafikler aracılığıyla kullanıcıya sunar.

Bu proje, React Native ve Expo platformu kullanılarak geliştirilmiş olup,
akademik bir proje kapsamında minimum gereksinimleri karşılayacak şekilde
tasarlanmıştır.

---

## 🎯 Projenin Amacı

Bu projenin amacı, kullanıcıların odaklanma alışkanlıklarını takip edebilecekleri,
dikkat dağınıklığına sebep olan durumları somut verilerle analiz edebilecekleri
bir mobil uygulama geliştirmektir. Uygulama sayesinde kullanıcılar, odaklanma
sürelerini ölçebilir, hangi aktivitelerde daha verimli olduklarını
gözlemleyebilir ve dikkatlerini dağıtan faktörlerin farkına varabilirler.

---

## 🧩 Uygulama Özellikleri

- ⏱ Ayarlanabilir odaklanma süresi (Pomodoro mantığı – varsayılan 25 dk)
- ▶️ Başlat / ⏸ Durdur / 🔄 Sıfırla butonları
- 📂 Seans öncesi kategori seçimi
- 🚨 Uygulamadan çıkıldığında otomatik dikkat dağınıklığı tespiti
- 📝 Seans bitiminde seans özeti (süre, kategori, dikkat dağınıklığı)
- 💾 SQLite ile kalıcı veri saklama
- 📊 Son 7 güne ait odaklanma süreleri (Bar Chart)
- 🥧 Kategorilere göre odaklanma dağılımı (Pie Chart)

---

## 🖥️ Ekranlar

### 1. Ana Sayfa (Zamanlayıcı)
- Odaklanma seansı başlatma ve durdurma
- Süre artırma ve azaltma
- Kategori seçimi
- Seans tamamlandığında özet bilgilerin gösterilmesi

### 2. Raporlar (Dashboard)
- Günlük toplam odaklanma süresi
- Tüm zamanlara ait toplam odaklanma süresi
- Toplam dikkat dağınıklığı sayısı
- Son 7 gün odaklanma grafiği
- Kategori bazlı odaklanma dağılımı grafiği
- Geçmiş seansların listelenmesi

---

## 🧱 Kullanılan Teknolojiler

- **Expo** – React Native geliştirme ortamı  
- **React Native** – Mobil uygulama geliştirme  
- **React Navigation** – Alt menü (Tab Navigator)  
- **Expo SQLite** – Yerel veritabanı  
- **AppState API** – Dikkat dağınıklığı takibi  
- **react-native-chart-kit** – Grafik ve veri görselleştirme  
- **react-native-svg** – Grafik altyapısı  

---

## 🗄️ Veritabanı Yapısı

Uygulama içerisinde SQLite veritabanı kullanılmaktadır. Her odaklanma seansı
aşağıdaki bilgilerle kaydedilmektedir:

- Seans başlangıç zamanı
- Seans bitiş zamanı
- Seans süresi (dakika)
- Seans kategorisi
- Dikkat dağınıklığı sayısı

Bu yapı sayesinde geçmiş seanslar kalıcı olarak saklanmakta ve raporlanabilmektedir.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Repository klonlama
```bash
git clone https://github.com/kullanici-adi/focus-tracker.git
cd focus-tracker

### 2. Bağımlılıkları yükleme
npm install

### 3. Uygulamayı çalıştırma
npx expo start 
