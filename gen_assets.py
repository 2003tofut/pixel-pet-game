from PIL import Image, ImageDraw
import random

# 华莱士龙虾8bit像素素材生成

def draw_pixel(img, x, y, color, size=4):
    """在(x,y)绘制一个像素块"""
    px = img.load()
    for dy in range(size):
        for dx in range(size):
            nx, ny = x * size + dx, y * size + dy
            if 0 <= nx < img.width and 0 <= ny < img.height:
                px[nx, ny] = color

def create_wallace_sprite(stage='idle'):
    """华莱士龙虾精灵 - 16x16基础"""
    W, H = 16, 16
    size = 64  # 每像素块大小
    img = Image.new('RGBA', (W*size, H*size), (0, 0, 0, 0))
    px = img.load()
    
    # 颜色
    RED = (220, 50, 50, 255)
    DARK_RED = (180, 30, 30, 255)
    ORANGE = (255, 150, 50, 255)
    WHITE = (255, 255, 255, 255)
    BLACK = (30, 30, 30, 255)
    PINK = (255, 200, 200, 255)
    
    # 像素图样 (y从0-15)
    # 0=透明, R=红, D=暗红, O=橙, W=白, B=黑, P=粉
    if stage == 'idle':
        sprite = [
            "....DDDD....",
            "...DRRRDD...",
            "..DRRRRRRDD.",
            ".DRRRRRRRRDD",
            "DRRRRORRRRRD",
            "DRRRRORRRRRD",
            "DRRRRWWRRRRD",
            "DRRRRBBBBRRD",
            ".DRRRPBPPRDD",
            ".DRRRPBPPRDD",
            "..DRRRRRRDD.",
            ".DDDRRRRRDD.",
            "..DDDRRRDDD.",
            "...DDDDDD...",
            "....DDDD....",
            "............",
        ]
    elif stage == 'wave':
        sprite = [
            "....DDDD....",
            "...DRRRDD...",
            "..DRRRRRRDD.",
            ".DRRRRRRRRDD",
            "DRRRRORRRRRD",
            "DRRRRORRRRRD",
            "DRRRRWWRRRRD",
            "DRRRRBBBBRRD",
            ".DRRRPBPPRDD",
            ".DRRRPBPPRDD",
            "..DRRRRRRDD.",
            ".DDDRRRRRDD.",
            "..DDDDDDDD..",
            "..DDDDDD....",
            "............",
            "............",
        ]
    elif stage == 'happy':
        sprite = [
            "....DDDD....",
            "...DRRRDD...",
            "..DRRRRRRDD.",
            ".DRRRRRRRRDD",
            "DRRRRORRRRRD",
            "DRRRRORRRRRD",
            "DRRRRWWRRRRD",
            "DRRRRBBBBRRD",
            ".DRRRPWPPRDD",
            ".DRRRPWPPRDD",
            "..DRRRRRRDD.",
            ".DDDRRRRRDD.",
            "..DDDRRRDDD.",
            "...DDDDDD...",
            "....DDDD....",
            "............",
        ]
    else:
        sprite = [
            "....DDDD....",
            "...DRRRDD...",
            "..DRRRRRRDD.",
            ".DRRRRRRRRDD",
            "DRRRRORRRRRD",
            "DRRRRORRRRRD",
            "DRRRRWWRRRRD",
            "DRRRRBBBBRRD",
            ".DRRRPBPPRDD",
            ".DRRRPBPPRDD",
            "..DRRRRRRDD.",
            ".DDDRRRRRDD.",
            "..DDDRRRDDD.",
            "...DDDDDD...",
            "....DDDD....",
            "............",
        ]
    
    # 绘制
    for y, row in enumerate(sprite):
        for x, ch in enumerate(row):
            if ch == 'D': color = DARK_RED
            elif ch == 'R': color = RED
            elif ch == 'O': color = ORANGE
            elif ch == 'W': color = WHITE
            elif ch == 'B': color = BLACK
            elif ch == 'P': color = PINK
            else: continue
            draw_pixel(img, x, y, color, size)
    
    return img

def create_wallace_logo():
    """华莱士大logo - 带文字效果"""
    W, H = 32, 16
    size = 8
    img = Image.new('RGBA', (W*size, H*size), (0, 0, 0, 0))
    px = img.load()
    
    RED = (220, 50, 50, 255)
    DARK_RED = (180, 30, 30, 255)
    ORANGE = (255, 150, 50, 255)
    WHITE = (255, 255, 255, 255)
    BLACK = (30, 30, 30, 255)
    PINK = (255, 200, 200, 255)
    GOLD = (255, 215, 0, 255)
    
    # 龙虾像素图（放大版）
    lobster = [
        "..............DDDD..............",
        ".............DRRRDD.............",
        "............DRRRRRRDD..........",
        "...........DRRRRRRRRRDD.........",
        "..........DRRRRORORRRRRD........",
        "..........DRRRRORORRRRRD........",
        "..........DRRRRWWRRRRRD.........",
        "..........DRRRRBBBBRRRD.........",
        ".........DRRRRPBPPRRRDD.........",
        ".........DRRRRPBPPRRRDD.........",
        "..........DRRRRRRRRRRD..........",
        "..........DDDRRRRRRRDD..........",
        "...........DDDDDRRRDDDD.........",
        "............DDDDDDDDDD..........",
        ".............DDDDDDDD...........",
        ".................................",
    ]
    
    for y, row in enumerate(lobster):
        for x, ch in enumerate(row):
            if ch == 'D': color = DARK_RED
            elif ch == 'R': color = RED
            elif ch == 'O': color = ORANGE
            elif ch == 'W': color = WHITE
            elif ch == 'B': color = BLACK
            elif ch == 'P': color = PINK
            else: continue
            draw_pixel(img, x, y, color, size)
    
    return img

def create_game_icons():
    """生成游戏分类图标"""
    icons = {
        'shooter': (255, 80, 80, 255),    # 红色 - 射击
        'rpg': (80, 150, 255, 255),       # 蓝色 - 角色扮演
        'sim': (80, 200, 100, 255),       # 绿色 - 模拟经营
        'adventure': (255, 180, 80, 255), # 橙色 - 冒险
        'puzzle': (180, 100, 255, 255),   # 紫色 - 解谜
        'indie': (255, 100, 200, 255),    # 粉色 - 小众
    }
    
    for name, color in icons.items():
        W, H = 8, 8
        size = 12
        img = Image.new('RGBA', (W*size, H*size), (0, 0, 0, 0))
        px = img.load()
        
        # 简单像素图标
        for py in range(H*size):
            for px_px in range(W*size):
                # 圆形图标
                cx, cy = W*size//2, H*size//2
                r = min(W, H)*size//2 - 2
                if (px_px-cx)**2 + (py-cy)**2 < r*r:
                    px[px_px, py] = color
        
        img.save(f'assets/sprites/icon_{name}.png')
        print(f'icon_{name}.png created')

def create_news_icons():
    """生成资讯分类图标"""
    news_types = {
        'newgame': (100, 200, 255, 255),   # 蓝色 - 新游
        'review': (255, 200, 100, 255),   # 黄色 - 评测
        'industry': (150, 150, 150, 255),  # 灰色 - 行业
        'guide': (100, 255, 150, 255),    # 绿色 - 攻略
    }
    
    for name, color in news_types.items():
        W, H = 8, 8
        size = 12
        img = Image.new('RGBA', (W*size, H*size), (0, 0, 0, 0))
        px = img.load()
        
        for py in range(H*size):
            for px_px in range(W*size):
                if size <= px_px < (W-1)*size and size <= py < (H-1)*size:
                    px[px_px, py] = color
        
        img.save(f'assets/sprites/icon_{name}.png')
        print(f'icon_{name}.png created')

def create_bg_grass():
    """草地背景"""
    size = 128
    img = Image.new('RGB', (size, size), (50, 180, 50))
    px = img.load()
    
    random.seed(111)
    for y in range(size):
        for x in range(size):
            # 草丛
            if (x + y * 3) % 17 == 0:
                px[x, y] = (40, 140, 40)
            elif (x * 7 + y) % 23 == 0:
                px[x, y] = (70, 200, 70)
            # 小花
            if (x * 13 + y * 7) % 41 == 0:
                px[x, y] = (255, 255, 100)
            if (x * 11 + y * 11) % 43 == 0:
                px[x, y] = (255, 200, 150)
    
    img.save('assets/sprites/bg_grass.png')
    print('bg_grass.png created')

def create_bg_dark():
    """深色游戏主题背景"""
    size = 128
    img = Image.new('RGB', (size, size), (20, 20, 40))
    px = img.load()
    
    random.seed(222)
    for _ in range(50):
        x, y = random.randint(0, size-1), random.randint(0, size-1)
        brightness = random.randint(150, 255)
        px[x, y] = (brightness, brightness, brightness)
        if x > 0: px[x-1, y] = (brightness//2, brightness//2, brightness//2+50)
    
    img.save('assets/sprites/bg_dark.png')
    print('bg_dark.png created')

def create_placeholder_game(poster_color, name='Game'):
    """生成占位游戏封面"""
    W, H = 16, 16
    size = 16
    img = Image.new('RGBA', (W*size, H*size), poster_color)
    px = img.load()
    
    # 添加一些像素细节
    for py in range(H*size):
        for px_px in range(W*size):
            bx, by = px_px // size, py // size
            # 内部区域边框
            if bx == 2 or bx == 13 or by == 2 or by == 13:
                if 2 <= bx <= 13 and 2 <= by <= 13:
                    r = max(0, poster_color[0] - 40)
                    g = max(0, poster_color[1] - 40)
                    b = max(0, poster_color[2] - 40)
                    px[px_px, py] = (r, g, b, 255)
    
    return img

# 生成华莱士精灵
print("=== 华莱士龙虾像素素材 ===")
for stage in ['idle', 'wave', 'happy']:
    img = create_wallace_sprite(stage)
    img.save(f'assets/sprites/wallace_{stage}.png')
    print(f'wallace_{stage}.png created')

# 华莱士大logo
logo = create_wallace_logo()
logo.save('assets/sprites/wallace_logo.png')
print('wallace_logo.png created')

# 图标
print("\n=== 图标素材 ===")
create_game_icons()
create_news_icons()

# 背景
print("\n=== 背景素材 ===")
create_bg_grass()
create_bg_dark()

# 生成一些占位游戏封面
print("\n=== 游戏封面 ===")
colors = [
    (200, 60, 60, 255),   # 红
    (60, 100, 200, 255),  # 蓝
    (60, 180, 100, 255),  # 绿
    (200, 150, 60, 255),  # 金
    (180, 60, 180, 255),  # 紫
    (60, 180, 180, 255),  # 青
    (200, 100, 150, 255), # 粉
    (150, 150, 80, 255),  # 棕
]
names = ['星际射击', '勇者传说', '模拟城市', '像素迷宫', '独立游戏', '赛车大赛', '塔防传奇', '农场物语']
for i, (color, name) in enumerate(zip(colors, names)):
    img = create_placeholder_game(color)
    img.save(f'assets/sprites/game_{i+1}.png')
    print(f'game_{i+1}.png ({name}) created')

print("\n✅ 所有素材生成完毕!")
