const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }, // Mario hissi için yerçekimi biraz artırıldı
            debug: false
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

function preload() {
    // Kendi yüklediğin görselleri burada çağırıyoruz
    // Not: Dosyaları bir klasörün içine koyduysan 'assets/prens.png' şeklinde yazmalısın
    this.load.image('arkaPlan', 'arka-plan.png'); 
    this.load.image('yer', 'https://labs.phaser.io/assets/sprites/platform.png'); // Zemin için geçici
    this.load.image('prens', 'prens.png'); 
    this.load.image('prenses', 'prenses.png');
    this.load.image('kule', 'kule.png');
}

function create() {
    // 1. Arka Planı Ekle
    this.add.image(400, 300, 'arkaPlan').setScale(1.5);

    // 2. Kule ve Prensesi Yerleştir (Sağ tarafta yüksekte)
    this.add.image(700, 350, 'kule').setScale(0.8);
    this.add.image(700, 220, 'prenses').setScale(0.5); // Seni kulenin penceresine hizaladık

    // 3. Platformları Oluştur
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'yer').setScale(2.5).refreshBody(); // Ana zemin
    
    // Mario tarzı basamaklar
    platforms.create(300, 450, 'yer');
    platforms.create(500, 320, 'yer');
    platforms.create(650, 250, 'yer'); // Kuleye giden son basamak

    // 4. Prens (Erkek Arkadaşın) - Ana Karakter
    player = this.physics.add.sprite(100, 450, 'prens');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
    player.setScale(0.6); // Boyutunu buradan ayarlayabilirsin

    // 5. Fizik Kuralları
    this.physics.add.collider(player, platforms);

    // 6. Kontroller
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-180);
        player.flipX = true; // Sola dönerken karakteri ters çevirir
    } else if (cursors.right.isDown) {
        player.setVelocityX(180);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
    }

    // Zıplama
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }

    // Eğilme (Karakteri biraz küçültelim)
    if (cursors.down.isDown) {
        player.setScale(0.4); 
    } else {
        player.setScale(0.6);
    }
}
