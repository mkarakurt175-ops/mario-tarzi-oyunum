const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }, 
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
    // Görselleri yüklüyoruz. İsimlerin birebir aynı olduğundan emin ol.
    // Eğer klasör içindeyseler (assets gibi), yolunu 'assets/prens.png' yapmalısın.
    this.load.image('arkaPlan', 'arka-plan.png'); 
    this.load.image('yer', 'https://labs.phaser.io/assets/sprites/platform.png'); 
    this.load.image('prens', 'prens.png'); 
    this.load.image('prenses', 'prenses.png');
    this.load.image('kule', 'kule.png');
}

function create() {
    // 1. Arka Plan
    this.add.image(400, 300, 'arkaPlan').setScale(1.5);

    // 2. Kule ve Prenses (DAHA KÜÇÜK VE DÜZGÜN YERLEŞTİRİLMİŞ)
    // Kuleyi sağa ve aşağıya aldık, boyutunu küçülttük.
    this.add.image(720, 480, 'kule').setScale(0.3); 
    
    // Prensesi kule penceresine (varsa) veya yanına hizaladık, boyutunu küçülttük.
    this.add.image(720, 390, 'prenses').setScale(0.15); 

    // 3. Platformlar
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'yer').setScale(2.5).refreshBody(); // Ana zemin
    
    // Mario tarzı basamaklar (Konumları karakter boyutuna göre ayarladım)
    platforms.create(250, 480, 'yer');
    platforms.create(450, 380, 'yer');
    platforms.create(600, 310, 'yer'); // Kuleye giden son basamak

    // 4. Prens (Erkek Arkadaşın) - (DAHA KÜÇÜK VE BAŞLANGIÇ NOKTASI AYARLANMIŞ)
    player = this.physics.add.sprite(100, 500, 'prens');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
    
    // Prensin boyutunu küçülttük (En önemli değişiklik)
    player.setScale(0.25); 

    // 5. Fizik
    this.physics.add.collider(player, platforms);

    // 6. Kontroller
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Hızları ve zıplama gücünü küçük karakter boyutuna göre hafifçe ayarladım
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.flipX = true; 
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
    }

    // Zıplama
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }

    // Eğilme (Karakter zaten küçük olduğu için bu kısmı şimdilik pasif bırakıyorum)
    /*
    if (cursors.down.isDown) {
        player.setScale(0.15); 
    } else {
        player.setScale(0.25);
    }
    */
}
