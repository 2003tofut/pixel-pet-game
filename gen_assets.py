from PIL import Image
import random

# ============================================
# 背景图 - 更好看的像素风格
# ============================================

def create_grass_bg():
    """草地背景 - 64x64 可平铺"""
    size = 64
    img = Image.new('RGBA', (size, size), (34, 180, 34, 255))
    pixels = img.load()
    
    random.seed(123)
    for y in range(size):
        for x in range(size):
            # 基础绿色变化
            base = 34 + (x * 3 + y * 2) % 20
            pixels[x, y] = (base, 160 + (x + y) % 40, base, 255)
            
            # 草丛细节
            if (x * 7 + y * 13) % 23 == 0:
                pixels[x, y] = (20, 120, 20, 255)  # 深绿
            if (x * 11 + y * 7) % 19 == 0:
                pixels[x, y] = (60, 200, 60, 255)  # 亮绿
            # 小花
            if (x * 5 + y * 9) % 31 == 0:
                pixels[x, y] = (255, 255, 100, 255)  # 黄花
            if (x * 13 + y * 5) % 37 == 0:
                pixels[x, y] = (255, 150, 200, 255)  # 粉花
    
    img.save('assets/sprites/bg_grass.png')
    print('bg_grass.png: 64x64')

def create_room_bg():
    """房间背景 - 64x64 木地板"""
    size = 64
    img = Image.new('RGBA', (size, size), (180, 140, 100, 255))
    pixels = img.load()
    
    for y in range(size):
        for x in range(size):
            # 木纹条纹
            stripe = (y // 8) % 4
            if stripe == 0:
                pixels[x, y] = (160, 120, 80, 255)
            elif stripe == 1:
                pixels[x, y] = (180, 140, 100, 255)
            elif stripe == 2:
                pixels[x, y] = (140, 100, 60, 255)
            else:
                pixels[x, y] = (200, 160, 120, 255)
            
            # 木节
            if (x % 16 == 3 and y % 8 == 2):
                pixels[x, y] = (100, 70, 40, 255)
                if x > 0: pixels[x-1, y] = (120, 90, 60, 255)
                if y > 0: pixels[x, y-1] = (120, 90, 60, 255)
            
            # 高光
            if y % 8 == 0:
                pixels[x, y] = (220, 180, 140, 255)
    
    img.save('assets/sprites/bg_room.png')
    print('bg_room.png: 64x64')

def create_stars_bg():
    """星空背景 - 64x64 深蓝星空"""
    size = 64
    img = Image.new('RGBA', (size, size), (15, 15, 45, 255))
    pixels = img.load()
    
    random.seed(456)
    # 星星
    for _ in range(30):
        x = random.randint(0, size-1)
        y = random.randint(0, size-1)
        brightness = random.randint(180, 255)
        pixels[x, y] = (brightness, brightness, brightness, 255)
        # 星光
        if x > 0: pixels[x-1, y] = (brightness//2, brightness//2, brightness, 200)
        if x < size-1: pixels[x+1, y] = (brightness//2, brightness//2, brightness, 200)
        if y > 0: pixels[x, y-1] = (brightness//2, brightness//2, brightness, 200)
        if y < size-1: pixels[x, y+1] = (brightness//2, brightness//2, brightness, 200)
    
    # 几颗亮星
    for _ in range(5):
        x = random.randint(4, size-5)
        y = random.randint(4, size-5)
        pixels[x, y] = (255, 255, 255, 255)
        pixels[x-1, y] = (200, 200, 255, 255)
        pixels[x+1, y] = (200, 200, 255, 255)
        pixels[x, y-1] = (200, 200, 255, 255)
        pixels[x, y+1] = (200, 200, 255, 255)
    
    img.save('assets/sprites/bg_stars.png')
    print('bg_stars.png: 64x64')

# ============================================
# 宠物精灵图 - 更清晰可爱
# ============================================

def draw_pixel_circle(pixels, cx, cy, r, color, size):
    """画填充圆"""
    for y in range(size):
        for x in range(size):
            if (x - cx)**2 + (y - cy)**2 <= r*r:
                pixels[x, y] = color

def draw_pixel_ellipse(pixels, cx, cy, rx, ry, color, size):
    """画填充椭圆"""
    for y in range(size):
        for x in range(size):
            if ((x - cx)/rx)**2 + ((y - cy)/ry)**2 <= 1:
                pixels[x, y] = color

def draw_pixel_rect(pixels, x1, y1, x2, y2, color, size):
    """画填充矩形"""
    for y in range(max(0, y1), min(size, y2+1)):
        for x in range(max(0, x1), min(size, x2+1)):
            pixels[x, y] = color

def create_cat_sprite(stage):
    """猫咪精灵"""
    sizes = {'baby': 64, 'youth': 96, 'adult': 128}
    size = sizes[stage]
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pixels = img.load()
    
    s = size // 16  # 单位
    
    # 身体 - 椭圆
    draw_pixel_ellipse(pixels, 8*s, 10*s, 4*s, 3*s, (255, 180, 100, 255), size)
    
    # 头
    draw_pixel_circle(pixels, 8*s, 5*s, 3*s, (255, 180, 100, 255), size)
    
    # 耳朵 - 三角
    draw_pixel_rect(pixels, 4*s, 1*s, 6*s, 3*s, (255, 180, 100, 255), size)
    draw_pixel_rect(pixels, 10*s, 1*s, 12*s, 3*s, (255, 180, 100, 255), size)
    # 耳朵内部
    draw_pixel_rect(pixels, 5*s, 2*s, 5*s, 2*s, (255, 150, 150, 255), size)
    draw_pixel_rect(pixels, 11*s, 2*s, 11*s, 2*s, (255, 150, 150, 255), size)
    
    # 眼睛
    draw_pixel_circle(pixels, 6*s, 5*s, s, (50, 50, 50, 255), size)
    draw_pixel_circle(pixels, 10*s, 5*s, s, (50, 50, 50, 255), size)
    # 眼睛高光
    draw_pixel_rect(pixels, 6*s, 4*s, 6*s, 4*s, (255, 255, 255, 255), size)
    draw_pixel_rect(pixels, 10*s, 4*s, 10*s, 4*s, (255, 255, 255, 255), size)
    
    # 鼻子
    draw_pixel_rect(pixels, 7*s, 6*s, 9*s, 6*s, (255, 150, 150, 255), size)
    
    # 嘴巴
    draw_pixel_rect(pixels, 7*s, 7*s, 7*s, 7*s, (200, 100, 100, 255), size)
    draw_pixel_rect(pixels, 9*s, 7*s, 9*s, 7*s, (200, 100, 100, 255), size)
    
    # 尾巴
    draw_pixel_rect(pixels, 12*s, 9*s, 14*s, 12*s, (255, 180, 100, 255), size)
    
    img.save(f'assets/sprites/cat_{stage}.png')
    print(f'cat_{stage}.png: {size}x{size}')

def create_dog_sprite(stage):
    """狗狗精灵"""
    sizes = {'baby': 64, 'youth': 96, 'adult': 128}
    size = sizes[stage]
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pixels = img.load()
    
    s = size // 16
    
    # 身体
    draw_pixel_ellipse(pixels, 8*s, 10*s, 5*s, 3*s, (180, 130, 80, 255), size)
    
    # 头
    draw_pixel_circle(pixels, 8*s, 5*s, 4*s, (180, 130, 80, 255), size)
    
    # 耳朵 - 下垂
    draw_pixel_ellipse(pixels, 3*s, 6*s, 2*s, 3*s, (140, 100, 60, 255), size)
    draw_pixel_ellipse(pixels, 13*s, 6*s, 2*s, 3*s, (140, 100, 60, 255), size)
    
    # 眼睛
    draw_pixel_circle(pixels, 6*s, 4*s, s, (40, 40, 40, 255), size)
    draw_pixel_circle(pixels, 10*s, 4*s, s, (40, 40, 40, 255), size)
    # 高光
    draw_pixel_rect(pixels, 6*s, 3*s, 6*s, 3*s, (255, 255, 255, 255), size)
    draw_pixel_rect(pixels, 10*s, 3*s, 10*s, 3*s, (255, 255, 255, 255), size)
    
    # 鼻子
    draw_pixel_ellipse(pixels, 8*s, 6*s, 2*s, s, (40, 30, 30, 255), size)
    
    # 舌头
    draw_pixel_rect(pixels, 7*s, 7*s, 9*s, 9*s, (255, 150, 150, 255), size)
    
    # 尾巴 - 摇摆
    draw_pixel_rect(pixels, 13*s, 8*s, 15*s, 10*s, (180, 130, 80, 255), size)
    
    img.save(f'assets/sprites/dog_{stage}.png')
    print(f'dog_{stage}.png: {size}x{size}')

def create_bunny_sprite(stage):
    """兔子精灵"""
    sizes = {'baby': 64, 'youth': 96, 'adult': 128}
    size = sizes[stage]
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pixels = img.load()
    
    s = size // 16
    
    # 身体
    draw_pixel_ellipse(pixels, 8*s, 11*s, 4*s, 3*s, (255, 255, 255, 255), size)
    
    # 头
    draw_pixel_circle(pixels, 8*s, 6*s, 3*s, (255, 255, 255, 255), size)
    
    # 长耳朵
    draw_pixel_rect(pixels, 4*s, 0, 6*s, 5*s, (255, 255, 255, 255), size)
    draw_pixel_rect(pixels, 10*s, 0, 12*s, 5*s, (255, 255, 255, 255), size)
    # 耳朵内部粉色
    draw_pixel_rect(pixels, 5*s, 1*s, 5*s, 4*s, (255, 200, 200, 255), size)
    draw_pixel_rect(pixels, 11*s, 1*s, 11*s, 4*s, (255, 200, 200, 255), size)
    
    # 眼睛 - 红色
    draw_pixel_circle(pixels, 6*s, 6*s, s, (255, 80, 80, 255), size)
    draw_pixel_circle(pixels, 10*s, 6*s, s, (255, 80, 80, 255), size)
    # 高光
    draw_pixel_rect(pixels, 5*s, 5*s, 5*s, 5*s, (255, 255, 255, 255), size)
    draw_pixel_rect(pixels, 9*s, 5*s, 9*s, 5*s, (255, 255, 255, 255), size)
    
    # 鼻子
    draw_pixel_rect(pixels, 7*s, 7*s, 9*s, 7*s, (255, 180, 180, 255), size)
    
    # 嘴巴 - Y形
    draw_pixel_rect(pixels, 7*s, 8*s, 7*s, 8*s, (200, 150, 150, 255), size)
    draw_pixel_rect(pixels, 9*s, 8*s, 9*s, 8*s, (200, 150, 150, 255), size)
    draw_pixel_rect(pixels, 8*s, 9*s, 8*s, 9*s, (200, 150, 150, 255), size)
    
    img.save(f'assets/sprites/bunny_{stage}.png')
    print(f'bunny_{stage}.png: {size}x{size}')

def create_monster_sprite(stage):
    """小怪精灵"""
    sizes = {'baby': 64, 'youth': 96, 'adult': 128}
    size = sizes[stage]
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pixels = img.load()
    
    s = size // 16
    
    # 身体 - 圆滚滚
    draw_pixel_circle(pixels, 8*s, 9*s, 5*s, (180, 130, 220, 255), size)
    
    # 角
    draw_pixel_rect(pixels, 3*s, 2*s, 5*s, 5*s, (255, 100, 120, 255), size)
    draw_pixel_rect(pixels, 11*s, 2*s, 13*s, 5*s, (255, 100, 120, 255), size)
    # 角尖
    draw_pixel_rect(pixels, 4*s, 1*s, 4*s, 1*s, (255, 100, 120, 255), size)
    draw_pixel_rect(pixels, 12*s, 1*s, 12*s, 1*s, (255, 100, 120, 255), size)
    
    # 大眼睛 - 白色
    draw_pixel_circle(pixels, 8*s, 7*s, 3*s, (255, 255, 255, 255), size)
    
    # 瞳孔
    draw_pixel_circle(pixels, 8*s, 7*s, 2*s, (30, 30, 30, 255), size)
    
    # 眼睛高光
    draw_pixel_rect(pixels, 9*s, 6*s, 10*s, 6*s, (255, 255, 255, 255), size)
    
    # 嘴巴 - 微笑
    draw_pixel_rect(pixels, 5*s, 11*s, 6*s, 11*s, (50, 50, 50, 255), size)
    draw_pixel_rect(pixels, 10*s, 11*s, 11*s, 11*s, (50, 50, 50, 255), size)
    draw_pixel_rect(pixels, 6*s, 12*s, 10*s, 12*s, (50, 50, 50, 255), size)
    
    # 小牙齿
    draw_pixel_rect(pixels, 6*s, 10*s, 6*s, 10*s, (255, 255, 255, 255), size)
    draw_pixel_rect(pixels, 10*s, 10*s, 10*s, 10*s, (255, 255, 255, 255), size)
    
    img.save(f'assets/sprites/monster_{stage}.png')
    print(f'monster_{stage}.png: {size}x{size}')

# ============================================
# 生成所有资源
# ============================================

print('=== 背景图 ===')
create_grass_bg()
create_room_bg()
create_stars_bg()

print('\n=== 宠物精灵 ===')
for stage in ['baby', 'youth', 'adult']:
    create_cat_sprite(stage)
    create_dog_sprite(stage)
    create_bunny_sprite(stage)
    create_monster_sprite(stage)

print('\nDone!')
