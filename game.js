// Oyun Konfigürasyonu
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }, // Yerçekimi (Mario tarzı zıplama için)
            debug: false // Geliştirme aşamasında true yapabilirsin
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
let tower;
let princess;

// GÖRSELLERİ VE SESLERİ YÜKLEME BÖLÜMÜ
function preload() {
    // TEMSİLİ GÖRSELLER (Önce bunları çalıştıracağız, sonra sizinkileri ekleyeceğiz)
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png'); // Arka plan
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png'); // Platformlar
    
    // Prens (Siyah Kıyafetli) Temsili Görsel
    this.load.image('prens', 'https://labs.phaser.io/assets/sprites/phaser-dude.png'); 
    
    // Kule ve Prenses Temsili Görsel
    this.load.image('kule', 'https://labs.phaser.io/assets/skies/gradient26.png'); // Basit bir kule gövdesi
}

// OYUN DÜNYASINI OLUŞTURMA BÖLÜMÜ
function create() {
    // 1. Arka Plan
    this.add.image(400, 300, 'sky').setScale(2);

    // 2. Kuleyi Arka Plana Koy
    tower = this.add.image(700, 400, 'kule').setScale(0.3); // Kule sağda duracak

    // 3. Platform Grubu (Fizik özellikli)
    platforms = this.physics.add.staticGroup();

    // Zemin ve ara platformlar (Mario tarzı)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // Ana Zemin
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // 4. Prens (Karakter) Oluşturma
    player = this.physics.add.sprite(100, 450, 'prens');

    player.setBounce(0.2); // Zıpladıktan sonra hafif sekme
    player.setCollideWorldBounds(true); // Ekrandan dışarı çıkmasın

    // 5. Çarpışma Kontrolleri
    this.physics.add.collider(player, platforms); // Oyuncu platformların üzerinde durabilsin

    // 6. Kontrolleri Ayarla (Klavye Ok Tuşları)
    cursors = this.input.keyboard.createCursorKeys();
}

// OYUNUN DÖNGÜSÜ VE HAREKETLER
function update() {
    // Sola Gitme
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    }
    // Sağa Gitme
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }
    // Durma
    else {
        player.setVelocityX(0);
    }

    // Zıplama (Yalnızca zemindeyken)
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    // Eğilme (Basitçe hızı yavaşlatma veya görsel değiştirme)
    if (cursors.down.isDown) {
        // player.setTint(0xff0000); // Eğildiğini göstermek için kırmızı yap
        // İleride buraya 'eğilme' animasyonu ekleyeceğiz
    } else {
        // player.clearTint();
    }
}