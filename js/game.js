/**
 * 8bit Pixel Pet Game - Core Game Logic
 * 像素宠物养成游戏 - 核心游戏逻辑
 */

// ============================================
// 游戏配置
// ============================================
const CONFIG = {
    // 属性衰减速率 (每秒)
    statDecayRate: {
        hunger: 0.1,
        clean: 0.08,
        happy: 0.12,
        energy: 0.05
    },
    // 操作效果
    actionEffects: {
        feed: { hunger: 30, happy: 5 },
        clean: { clean: 35, happy: 3 },
        play: { happy: 25, energy: -10 },
        rest: { energy: 40, hunger: -5 }
    },
    // 成长阶段阈值
    growthStages: [
        { name: '幼崽', threshold: 0 },
        { name: '青年', threshold: 100 },
        { name: '成年', threshold: 250 }
    ],
    // 成就定义
    achievements: [
        { id: 'first_feed', name: '初次喂食', desc: '第一次给宠物喂食', icon: '🍖' },
        { id: 'first_clean', name: '爱干净', desc: '第一次给宠物清洁', icon: '✨' },
        { id: 'first_play', name: '玩耍时光', desc: '第一次和宠物玩耍', icon: '🎮' },
        { id: 'first_rest', name: '好好休息', desc: '第一次让宠物休息', icon: '💤' },
        { id: 'grown_up', name: '长大了', desc: '宠物进化为成年', icon: '🎉' },
        { id: 'checkin_3', name: '坚持签到', desc: '连续签到3天', icon: '📅' },
        { id: 'checkin_7', name: '周签到达人', desc: '连续签到7天', icon: '🏆' },
        { id: 'happy_max', name: '快乐满满', desc: '快乐值达到100', icon: '😊' }
    ],
    // 宠物名称
    petNames: {
        cat: '小橘',
        dog: '小汪',
        monster: '小怪',
        bunny: '小白'
    }
};

// ============================================
// 游戏状态
// ============================================
let gameState = {
    // 当前用户
    currentUser: null,
    // 所有用户数据
    users: {},
    // 游戏设置
    settings: {
        bgmEnabled: false,
        sfxEnabled: true
    },
    // 当前宠物状态
    pet: null,
    // 游戏定时器
    timers: {
        decay: null,
        autoSave: null
    },
    // 小游戏状态
    miniGame: {
        target: 0,
        timeLeft: 10,
        timer: null,
        active: false
    }
};

// ============================================
// 工具函数
// ============================================

/**
 * 显示提示消息
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * 切换屏幕
 */
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

/**
 * 显示弹窗
 */
function showModal(modalId) {
    document.getElementById('modal-container').classList.add('active');
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.getElementById(modalId).classList.add('active');
}

/**
 * 关闭弹窗
 */
function closeModal() {
    document.getElementById('modal-container').classList.remove('active');
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

/**
 * 本地存储操作
 */
const Storage = {
    get(key) {
        try {
            const data = localStorage.getItem(`petgame_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(`petgame_${key}`, JSON.stringify(value));
        } catch (e) {
            console.error('Storage set error:', e);
        }
    },
    
    remove(key) {
        localStorage.removeItem(`petgame_${key}`);
    }
};

/**
 * 简单加密 (仅用于演示，非安全加密)
 */
function simpleEncrypt(text) {
    return btoa(encodeURIComponent(text));
}

function simpleDecrypt(encoded) {
    try {
        return decodeURIComponent(atob(encoded));
    } catch (e) {
        return '';
    }
}

// ============================================
// 用户系统
// ============================================

/**
 * 初始化用户系统
 */
function initUserSystem() {
    gameState.users = Storage.get('users') || {};
    
    // 检查是否已登录
    const savedLogin = Storage.get('currentLogin');
    if (savedLogin && gameState.users[savedLogin]) {
        gameState.currentUser = savedLogin;
        loadUserData();
        
        // 检查是否有宠物
        if (gameState.pet) {
            switchScreen('game-screen');
            startGame();
        } else {
            switchScreen('select-screen');
            updateUserInfo();
        }
    } else {
        switchScreen('auth-screen');
    }
}

/**
 * 显示登录表单
 */
function showLogin() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('login-form').classList.add('active');
}

/**
 * 显示注册表单
 */
function showRegister() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('register-form').classList.add('active');
}

/**
 * 显示密码重置表单
 */
function showForgotPassword() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('reset-form').classList.add('active');
}

/**
 * 处理登录
 */
function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    // 验证输入
    if (!username || !password) {
        showToast('请输入用户名和密码', 'error');
        return;
    }
    
    // 检查用户是否存在
    if (!gameState.users[username]) {
        showToast('用户名不存在', 'error');
        return;
    }
    
    // 验证密码
    const storedPassword = simpleDecrypt(gameState.users[username].password);
    if (password !== storedPassword) {
        showToast('密码错误', 'error');
        return;
    }
    
    // 登录成功
    gameState.currentUser = username;
    Storage.set('currentLogin', username);
    loadUserData();
    
    showToast('登录成功！', 'success');
    playSound('success');
    
    // 检查是否有宠物
    if (gameState.pet) {
        switchScreen('game-screen');
        startGame();
    } else {
        switchScreen('select-screen');
        updateUserInfo();
    }
}

/**
 * 处理注册
 */
function handleRegister() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    
    // 验证用户名
    if (!username || username.length < 3 || username.length > 12) {
        showToast('用户名需要3-12个字符', 'error');
        return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showToast('用户名只能包含字母数字和下划线', 'error');
        return;
    }
    
    // 检查用户名是否已存在
    if (gameState.users[username]) {
        showToast('用户名已存在', 'error');
        return;
    }
    
    // 验证密码
    if (!password || password.length < 6 || password.length > 12) {
        showToast('密码需要6-12个字符', 'error');
        return;
    }
    
    if (password !== confirm) {
        showToast('两次密码输入不一致', 'error');
        return;
    }
    
    // 创建用户
    gameState.users[username] = {
        password: simpleEncrypt(password),
        createdAt: Date.now()
    };
    Storage.set('users', gameState.users);
    
    showToast('注册成功！请登录', 'success');
    playSound('success');
    
    // 清空表单并切换到登录
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-confirm').value = '';
    showLogin();
    document.getElementById('login-username').value = username;
}

/**
 * 处理密码重置
 */
function handleResetPassword() {
    const username = document.getElementById('reset-username').value.trim();
    const password = document.getElementById('reset-password').value;
    const confirm = document.getElementById('reset-confirm').value;
    
    // 验证用户名
    if (!username) {
        showToast('请输入用户名', 'error');
        return;
    }
    
    if (!gameState.users[username]) {
        showToast('用户名不存在', 'error');
        return;
    }
    
    // 验证密码
    if (!password || password.length < 6 || password.length > 12) {
        showToast('密码需要6-12个字符', 'error');
        return;
    }
    
    if (password !== confirm) {
        showToast('两次密码输入不一致', 'error');
        return;
    }
    
    // 更新密码
    gameState.users[username].password = simpleEncrypt(password);
    Storage.set('users', gameState.users);
    
    showToast('密码重置成功！请登录', 'success');
    playSound('success');
    
    // 清空表单并切换到登录
    document.getElementById('reset-username').value = '';
    document.getElementById('reset-password').value = '';
    document.getElementById('reset-confirm').value = '';
    showLogin();
    document.getElementById('login-username').value = username;
}

/**
 * 处理退出登录
 */
function handleLogout() {
    if (gameState.pet) {
        saveUserData();
    }
    
    gameState.currentUser = null;
    gameState.pet = null;
    Storage.remove('currentLogin');
    
    stopGameTimers();
    closeModal();
    switchScreen('auth-screen');
    showLogin();
    
    showToast('已退出登录', 'info');
}

/**
 * 加载用户数据
 */
function loadUserData() {
    if (!gameState.currentUser) return;
    
    const userData = Storage.get(`user_${gameState.currentUser}`);
    if (userData) {
        gameState.pet = userData.pet || null;
        gameState.settings = userData.settings || { bgmEnabled: false, sfxEnabled: true };
    }
}

/**
 * 保存用户数据
 */
function saveUserData() {
    if (!gameState.currentUser) return;
    
    const userData = {
        pet: gameState.pet,
        settings: gameState.settings,
        lastSave: Date.now()
    };
    Storage.set(`user_${gameState.currentUser}`, userData);
}

/**
 * 更新用户信息显示
 */
function updateUserInfo() {
    const username = gameState.currentUser || '玩家';
    
    // 选择页
    const displayUsername = document.getElementById('display-username');
    if (displayUsername) {
        displayUsername.textContent = username;
    }
    
    // 游戏页
    const gameUsername = document.getElementById('game-username');
    if (gameUsername) {
        gameUsername.textContent = username;
    }
}

// ============================================
// 宠物系统
// ============================================

/**
 * 选择宠物
 */
function selectPet(type) {
    if (!gameState.currentUser) {
        showToast('请先登录', 'error');
        switchScreen('auth-screen');
        return;
    }
    
    gameState.pet = {
        type: type,
        name: CONFIG.petNames[type],
        stage: 0,
        growth: 0,
        stats: {
            hunger: 100,
            clean: 100,
            happy: 100,
            energy: 100
        },
        items: {
            food: 10,
            clean: 10
        },
        checkIn: {
            days: 0,
            lastCheckIn: null,
            history: []
        },
        achievements: [],
        createdAt: Date.now()
    };
    
    saveUserData();
    showToast(`你选择了${CONFIG.petNames[type]}！`, 'success');
    playSound('success');
    
    switchScreen('game-screen');
    startGame();
}

/**
 * 开始游戏
 */
function startGame() {
    updateUserInfo();
    updatePetDisplay();
    updateStats();
    updateItems();
    startGameTimers();
}

/**
 * 更新宠物显示
 */
function updatePetDisplay() {
    if (!gameState.pet) return;
    
    const sprite = document.getElementById('pet-sprite');
    const name = document.getElementById('pet-name');
    const stageText = document.getElementById('pet-stage-text');
    const growthFill = document.getElementById('growth-fill');
    const growthText = document.getElementById('growth-text');
    
    // 根据成长阶段选择精灵图
    const stage = getCurrentStage();
    const stageNames = ['baby', 'youth', 'adult'];
    const stageName = stageNames[Math.min(stage, 2)];
    sprite.src = `assets/sprites/${gameState.pet.type}_${stageName}.png`;
    
    // 根据成长阶段调整大小
    const scales = [1, 1.15, 1.35];
    sprite.style.transform = `scale(${scales[stage]})`;
    
    // 更新名称和阶段
    name.textContent = gameState.pet.name;
    stageText.textContent = CONFIG.growthStages[stage].name;
    
    // 更新成长条
    const nextThreshold = getNextThreshold();
    const currentThreshold = CONFIG.growthStages[stage].threshold;
    const progress = nextThreshold ? 
        ((gameState.pet.growth - currentThreshold) / (nextThreshold - currentThreshold)) * 100 :
        100;
    
    growthFill.style.width = `${Math.min(progress, 100)}%`;
    growthText.textContent = `${gameState.pet.growth}/${nextThreshold || 'MAX'}`;
}

/**
 * 获取当前成长阶段索引
 */
function getCurrentStage() {
    let stage = 0;
    for (let i = CONFIG.growthStages.length - 1; i >= 0; i--) {
        if (gameState.pet.growth >= CONFIG.growthStages[i].threshold) {
            stage = i;
            break;
        }
    }
    return stage;
}

/**
 * 获取下一阶段阈值
 */
function getNextThreshold() {
    const currentStage = getCurrentStage();
    if (currentStage < CONFIG.growthStages.length - 1) {
        return CONFIG.growthStages[currentStage + 1].threshold;
    }
    return null;
}

/**
 * 更新属性显示
 */
function updateStats() {
    if (!gameState.pet) return;
    
    const stats = ['hunger', 'clean', 'happy', 'energy'];
    
    stats.forEach(stat => {
        const bar = document.getElementById(`${stat}-bar`);
        const value = document.getElementById(`${stat}-value`);
        
        const statValue = Math.max(0, Math.min(100, gameState.pet.stats[stat]));
        
        bar.style.width = `${statValue}%`;
        value.textContent = Math.round(statValue);
        
        // 低值警告
        if (statValue < 30) {
            bar.classList.add('low');
        } else {
            bar.classList.remove('low');
        }
    });
}

/**
 * 更新道具显示
 */
function updateItems() {
    if (!gameState.pet) return;
    
    document.getElementById('food-count').textContent = `x${gameState.pet.items.food}`;
    document.getElementById('clean-count').textContent = `x${gameState.pet.items.clean}`;
}

/**
 * 执行操作
 */
function doAction(action) {
    if (!gameState.pet) return;
    
    const pet = gameState.pet;
    const effects = CONFIG.actionEffects[action];
    const sprite = document.getElementById('pet-sprite');
    
    // 检查体力
    if (action !== 'rest' && pet.stats.energy < 10) {
        showToast('宠物太累了，让它休息一下吧', 'warning');
        return;
    }
    
    // 检查道具
    if (action === 'feed' && pet.items.food <= 0) {
        showToast('食物不足！请签到获取', 'warning');
        return;
    }
    
    if (action === 'clean' && pet.items.clean <= 0) {
        showToast('清洁道具不足！请签到获取', 'warning');
        return;
    }
    
    // 消耗道具
    if (action === 'feed') pet.items.food--;
    if (action === 'clean') pet.items.clean--;
    
    // 应用效果
    for (const [stat, value] of Object.entries(effects)) {
        pet.stats[stat] = Math.max(0, Math.min(100, pet.stats[stat] + value));
    }
    
    // 播放动画
    const animName = action === 'feed' ? 'anim-eating' : 
                     action === 'clean' ? 'anim-cleaning' :
                     action === 'play' ? 'anim-playing' : 'anim-sleeping';
    sprite.className = 'pet-display ' + animName;
    const duration = action === 'play' ? 900 : 500;
    setTimeout(() => {
        sprite.className = 'pet-display';
        // 恢复scale
        const stage = getCurrentStage();
        const scales = [1, 1.15, 1.35];
        sprite.style.transform = `scale(${scales[stage]})`;
    }, duration);
    
    // 增加成长值
    addGrowth(5);
    
    // 检查成就
    checkAchievements(action);
    
    // 更新显示
    updateStats();
    updateItems();
    updatePetDisplay();
    
    // 播放音效
    playSound('action');
    
    // 保存
    saveUserData();
}

/**
 * 增加成长值
 */
function addGrowth(amount) {
    if (!gameState.pet) return;
    
    const oldStage = getCurrentStage();
    gameState.pet.growth += amount;
    const newStage = getCurrentStage();
    
    // 检查是否进化
    if (newStage > oldStage) {
        onEvolve(newStage);
    }
}

/**
 * 进化事件
 */
function onEvolve(newStage) {
    const stage = CONFIG.growthStages[newStage];
    showToast(`恭喜！宠物进化为${stage.name}！`, 'success');
    playSound('levelup');
    
    // 播放进化动画
    const sprite = document.getElementById('pet-sprite');
    sprite.className = 'pet-display anim-evolve';
    setTimeout(() => {
        sprite.className = 'pet-display';
        const stage = getCurrentStage();
        const scales = [1, 1.15, 1.35];
        sprite.style.transform = `scale(${scales[stage]})`;
    }, 2000);
    
    // 检查成就
    if (newStage === 2) {
        unlockAchievement('grown_up');
    }
    
    updatePetDisplay();
}

/**
 * 检查成就
 */
function checkAchievements(action) {
    const achievementMap = {
        feed: 'first_feed',
        clean: 'first_clean',
        play: 'first_play',
        rest: 'first_rest'
    };
    
    if (achievementMap[action]) {
        unlockAchievement(achievementMap[action]);
    }
    
    // 检查快乐值满
    if (gameState.pet.stats.happy >= 100) {
        unlockAchievement('happy_max');
    }
}

/**
 * 解锁成就
 */
function unlockAchievement(achievementId) {
    if (!gameState.pet) return;
    
    if (!gameState.pet.achievements.includes(achievementId)) {
        gameState.pet.achievements.push(achievementId);
        const achievement = CONFIG.achievements.find(a => a.id === achievementId);
        if (achievement) {
            showToast(`解锁成就：${achievement.name}`, 'success');
            playSound('achievement');
        }
        saveUserData();
    }
}

// ============================================
// 签到系统
// ============================================

/**
 * 显示签到弹窗
 */
function showCheckIn() {
    renderCheckInCalendar();
    showModal('checkin-modal');
}

/**
 * 渲染签到日历
 */
function renderCheckInCalendar() {
    if (!gameState.pet) return;
    
    const calendar = document.getElementById('checkin-calendar');
    const daysDisplay = document.getElementById('checkin-days');
    const checkinBtn = document.getElementById('checkin-btn');
    
    // 显示连续签到天数
    daysDisplay.textContent = gameState.pet.checkIn.days;
    
    // 渲染日历
    calendar.innerHTML = '';
    const today = new Date().getDay();
    
    for (let i = 0; i < 7; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = ['日', '一', '二', '三', '四', '五', '六'][i];
        
        if (gameState.pet.checkIn.history.includes(i)) {
            day.classList.add('checked');
        }
        
        calendar.appendChild(day);
    }
    
    // 检查今天是否已签到
    const todayStr = new Date().toDateString();
    const lastCheckIn = gameState.pet.checkIn.lastCheckIn;
    
    if (lastCheckIn === todayStr) {
        checkinBtn.disabled = true;
        checkinBtn.innerHTML = '<span class="btn-text">今日已签到</span>';
    } else {
        checkinBtn.disabled = false;
        checkinBtn.innerHTML = '<span class="btn-text">签到领奖励</span>';
    }
}

/**
 * 执行签到
 */
function doCheckIn() {
    if (!gameState.pet) return;
    
    const today = new Date();
    const todayStr = today.toDateString();
    const dayOfWeek = today.getDay();
    
    // 检查是否已签到
    if (gameState.pet.checkIn.lastCheckIn === todayStr) {
        showToast('今天已经签到过了', 'warning');
        return;
    }
    
    // 检查连续签到
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (gameState.pet.checkIn.lastCheckIn === yesterdayStr) {
        gameState.pet.checkIn.days++;
    } else {
        gameState.pet.checkIn.days = 1;
        gameState.pet.checkIn.history = [];
    }
    
    // 更新签到记录
    gameState.pet.checkIn.lastCheckIn = todayStr;
    gameState.pet.checkIn.history.push(dayOfWeek);
    
    // 发放奖励
    let reward = Math.floor(Math.random() * 3) + 1; // 1-3个道具
    
    // 连续签到奖励
    if (gameState.pet.checkIn.days >= 3) {
        reward += 5;
        unlockAchievement('checkin_3');
    }
    if (gameState.pet.checkIn.days >= 7) {
        reward += 10;
        unlockAchievement('checkin_7');
    }
    
    // 随机分配食物和清洁道具
    const food = Math.floor(Math.random() * reward) + 1;
    const clean = reward - food;
    
    gameState.pet.items.food += food;
    gameState.pet.items.clean += clean;
    
    showToast(`签到成功！获得 ${food} 食物，${clean} 清洁道具`, 'success');
    playSound('success');
    
    updateItems();
    renderCheckInCalendar();
    saveUserData();
}

// ============================================
// 小游戏系统
// ============================================

/**
 * 启动小游戏
 */
function startMiniGame() {
    if (!gameState.pet) return;
    
    // 检查体力
    if (gameState.pet.stats.energy < 10) {
        showToast('宠物太累了，无法玩耍', 'warning');
        return;
    }
    
    gameState.miniGame.active = true;
    gameState.miniGame.target = Math.floor(Math.random() * 10) + 1;
    gameState.miniGame.timeLeft = 10;
    
    // 渲染数字按钮
    const grid = document.getElementById('number-grid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = i;
        btn.onclick = () => guessNumber(i);
        grid.appendChild(btn);
    }
    
    document.getElementById('game-result').textContent = '';
    document.getElementById('game-timer').textContent = '剩余时间: 10s';
    
    showModal('minigame-modal');
    
    // 启动计时器
    gameState.miniGame.timer = setInterval(() => {
        gameState.miniGame.timeLeft--;
        document.getElementById('game-timer').textContent = `剩余时间: ${gameState.miniGame.timeLeft}s`;
        
        if (gameState.miniGame.timeLeft <= 0) {
            endMiniGame(false);
        }
    }, 1000);
}

/**
 * 猜数字
 */
function guessNumber(num) {
    if (!gameState.miniGame.active) return;
    
    const btn = document.querySelector(`.number-btn:nth-child(${num})`);
    const result = document.getElementById('game-result');
    
    if (num === gameState.miniGame.target) {
        btn.classList.add('correct');
        result.textContent = '🎉 猜对了！';
        result.style.color = '#4caf50';
        endMiniGame(true);
    } else {
        btn.classList.add('wrong');
        result.textContent = num < gameState.miniGame.target ? '太小了！' : '太大了！';
        result.style.color = '#ff6b6b';
    }
}

/**
 * 结束小游戏
 */
function endMiniGame(success) {
    gameState.miniGame.active = false;
    clearInterval(gameState.miniGame.timer);
    
    if (success) {
        gameState.pet.stats.happy = Math.min(100, gameState.pet.stats.happy + 25);
        gameState.pet.stats.energy = Math.max(0, gameState.pet.stats.energy - 10);
        addGrowth(5);
        showToast('玩耍成功！快乐值+25', 'success');
    } else {
        gameState.pet.stats.energy = Math.max(0, gameState.pet.stats.energy - 5);
        showToast('时间到！体力-5', 'warning');
    }
    
    updateStats();
    updatePetDisplay();
    saveUserData();
    
    setTimeout(() => {
        closeModal();
    }, 1500);
}

/**
 * 关闭小游戏
 */
function closeMiniGame() {
    gameState.miniGame.active = false;
    clearInterval(gameState.miniGame.timer);
    closeModal();
}

// ============================================
// 成就系统
// ============================================

/**
 * 显示成就弹窗
 */
function showAchievements() {
    renderAchievements();
    showModal('achievement-modal');
}

/**
 * 渲染成就列表
 */
function renderAchievements() {
    const list = document.getElementById('achievement-list');
    list.innerHTML = '';
    
    CONFIG.achievements.forEach(achievement => {
        const unlocked = gameState.pet && gameState.pet.achievements.includes(achievement.id);
        
        const item = document.createElement('div');
        item.className = `achievement-item ${unlocked ? '' : 'locked'}`;
        item.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;
        list.appendChild(item);
    });
}

// ============================================
// 设置系统
// ============================================

/**
 * 显示设置弹窗
 */
function showSettings() {
    document.getElementById('bgm-toggle').checked = gameState.settings.bgmEnabled;
    document.getElementById('sfx-toggle').checked = gameState.settings.sfxEnabled;
    showModal('settings-modal');
}

/**
 * 切换背景音乐
 */
function toggleBGM() {
    gameState.settings.bgmEnabled = document.getElementById('bgm-toggle').checked;
    saveUserData();
}

/**
 * 切换音效
 */
function toggleSFX() {
    gameState.settings.sfxEnabled = document.getElementById('sfx-toggle').checked;
    saveUserData();
}

/**
 * 重置游戏
 */
function resetGame() {
    if (confirm('确定要重置游戏吗？所有进度将被清除！')) {
        gameState.pet = null;
        saveUserData();
        closeModal();
        switchScreen('select-screen');
        showToast('游戏已重置', 'info');
    }
}

// ============================================
// 帮助系统
// ============================================

/**
 * 显示帮助弹窗
 */
function showHelp() {
    showModal('help-modal');
}

/**
 * 显示道具商店（签到入口）
 */
function showShop() {
    showCheckIn();
}

// ============================================
// 音效系统
// ============================================

/**
 * 播放音效
 */
function playSound(type) {
    if (!gameState.settings.sfxEnabled) return;
    
    // 使用Web Audio API生成简单的8bit音效
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 不同类型的音效
        const soundTypes = {
            action: { freq: 440, duration: 0.1 },
            success: { freq: 523, duration: 0.2 },
            achievement: { freq: 659, duration: 0.3 },
            levelup: { freq: 784, duration: 0.4 },
            warning: { freq: 220, duration: 0.15 }
        };
        
        const sound = soundTypes[type] || soundTypes.action;
        
        oscillator.type = 'square'; // 8bit风格
        oscillator.frequency.setValueAtTime(sound.freq, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sound.duration);
    } catch (e) {
        // 音效播放失败，忽略
    }
}

// ============================================
// 游戏循环
// ============================================

/**
 * 启动游戏定时器
 */
function startGameTimers() {
    // 属性衰减
    gameState.timers.decay = setInterval(() => {
        if (!gameState.pet) return;
        
        for (const [stat, rate] of Object.entries(CONFIG.statDecayRate)) {
            gameState.pet.stats[stat] = Math.max(0, gameState.pet.stats[stat] - rate);
        }
        
        updateStats();
    }, 1000);
    
    // 自动保存
    gameState.timers.autoSave = setInterval(() => {
        saveUserData();
    }, 30000);
}

/**
 * 停止游戏定时器
 */
function stopGameTimers() {
    if (gameState.timers.decay) {
        clearInterval(gameState.timers.decay);
        gameState.timers.decay = null;
    }
    if (gameState.timers.autoSave) {
        clearInterval(gameState.timers.autoSave);
        gameState.timers.autoSave = null;
    }
}

// ============================================
// 初始化
// ============================================

/**
 * 游戏初始化
 */
function init() {
    // 加载画面动画
    setTimeout(() => {
        switchScreen('auth-screen');
        initUserSystem();
    }, 2500);
    
    // 页面关闭前保存
    window.addEventListener('beforeunload', () => {
        saveUserData();
    });
    
    // 处理玩耍按钮（打开小游戏）
    const originalDoAction = doAction;
    window.doAction = function(action) {
        if (action === 'play') {
            startMiniGame();
        } else {
            originalDoAction(action);
        }
    };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
