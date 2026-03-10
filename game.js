// OYUN AYARLARI
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 }, // Mario tarzı zıplama için yerçekimi artırıldı
            debug: false // Geliştirme için true yapabilirsin
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let platforms;
let coins;
let obstacles;
let score = 0;
let scoreText;
let gameOver = false;

// GÖRSELLERİ YÜKLEME
function preload() {
    // Klasör yapını buraya uygun şekilde güncelledik
    // Eğer dosyaların bir klasörün içindeyse 'assets/arka-plan.png' gibi yazmalısın
    this.load.image('arkaPlan', 'arka-plan.png');
    this.load.image('yer', 'https://labs.phaser.io/assets/sprites/platform.png'); // Temsili zemin (Phaser'ın kendi assets'inden)
    
    // === Kişiselleştirilmiş Karakterler ===
    this.load.image('prens', 'prens.png.jpeg'); 
    this.load.image('prenses', 'prenses.png.jpeg');
    this.load.image('kule', 'kule.png');

    // === Oyun Elemanları ===
    // Phaser'ın kendi örnek altın ve engel görsellerini kullanıyoruz (Bunları da kendi yüklediklerinle değiştirebilirsin!)
    this.load.image('altin', 'https://labs.phaser.io/assets/sprites/coin.png');
    this.load.image('engel', 'https://labs.phaser.io/assets/sprites/spikes.png'); // Dikenli engel
}

// OYUN DÜNYASINI OLUŞTURMA
function create() {
    // 1. Arka Plan
    this.add.image(400, 300, 'arkaPlan').setScale(1.5);

    // 2. Kule (Sağda) ve Prensesi Yerleştir (Kule penceresinde)
    this.add.image(700, 350, 'kule').setScale(0.8);
    // === Prenses Küçültüldü ===
    // Seni kulenin penceresine sığdırmak için 0.3 yaptık. İhtiyaca göre bu rakamı değiştir.
    this.add.image(700, 220, 'prenses').setScale(0.3); 

    // 3. Platform Grubu (Sabit, fizik özellikli)
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'yer').setScale(2.5).refreshBody(); // Ana Zemin

    // Mario tarzı basamaklar (X, Y koordinatları)
    platforms.create(600, 400, 'yer');
    platforms.create(50, 250, 'yer');
    platforms.create(750, 220, 'yer'); // Kuleye giden son basamak

    // 4. Prens (Erkek Arkadaşın) - Ana Karakter
    player = this.physics.add.sprite(100, 450, 'prens');

    // === Prens Küçültüldü ===
    // Erkek arkadaşını Mario boyutuna yakın yapmak için 0.4 yaptık.
    player.setScale(0.4); 
    player.setBounce(0.2); // Hafif sekme
    player.setCollideWorldBounds(true); // Ekrandan çıkmasın

    // 5. Fizik Çarpışmaları (Karakter zemin ve platformlarla çarpışır)
    this.physics.add.collider(player, platforms);

    // 6. Kontroller (Klavye Ok Tuşları)
    cursors = this.input.keyboard.createCursorKeys();

    // 7. ALTINLARI EKLE (Kendi grubunu oluşturduk)
    coins = this.physics.add.group({
        key: 'altin',
        repeat: 7, // Toplam 8 altın
        setXY: { x: 150, y: 0, stepX: 90 } // İlki 150'de, sonra her 90 pikselde bir
    });

    // Altınların yere düşmesini sağla
    this.physics.add.collider(coins, platforms);
    
    // Oyuncu altına değdiğinde 'collectCoin' fonksiyonunu çalıştır
    this.physics.add.overlap(player, coins, collectCoin, null, this);

    // 8. ENGELLERİ EKLE (Dikenli Engeller)
    obstacles = this.physics.add.group();
    obstacles.create(400, 520, 'engel'); // İlk engel zemin üzerinde
    obstacles.create(650, 360, 'engel'); // İkinci engel platformda
    
    this.physics.add.collider(obstacles, platforms);
    
    // Oyuncu engele değdiğinde 'hitObstacle' fonksiyonunu çalıştır
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);

    // 9. Skor Metni
    scoreText = this.add.text(16, 16, 'Altın: 0', { fontSize: '32px', fill: '#fff' });
}

// OYUN DÖNGÜSÜ VE HAREKETLER
function update() {
    if (gameOver) { return; } // Oyun bittiyse hareket etme

    // Sağa/Sola Hareket
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.flipX = true; // Sola dönerken karakteri ters çevir
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.flipX = false; // Sağa dönerken düzel
    } else {
        player.setVelocityX(0);
    }

    // Zıplama (Sadece zemindeyken)
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-450); // Zıplama gücünü artırdık
    }

    // Eğilme (Basitçe hızı yavaşlatma)
    if (cursors.down.isDown) {
        player.setVelocityX(0); // Eğilirken dur
        player.setScale(0.3); // Eğilince biraz daha küçült
    } else {
        player.setScale(0.4); // Eğilmeyince normal boyutuna dön
    }
}

// ALTIN TOPLAMA FONKSİYONU
function collectCoin(player, coin) {
    coin.disableBody(true, true); // Altını yok et (Ekranda görünmez yap)
    
    score += 10; // 10 puan ekle
    scoreText.setText('Altın: ' + score); // Skoru güncelle
}

// ENGELE ÇARPMA FONKSİYONU
function hitObstacle(player, obstacle) {
    this.physics.pause(); // Oyunu durdur
    player.setTint(0xff0000); // Oyuncuyu kırmızı yap
    player.anims.play('turn'); // Durma animasyonu (varsa)
    gameOver = true; // Oyun bitti bayrağını işaretle
    this.add.text(400, 300, 'OYUN BİTTİ!', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);
}

