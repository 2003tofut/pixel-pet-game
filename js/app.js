// ============================================
// 华莱士游戏站 - 主逻辑
// ============================================

// 全局状态
let currentUser = null;
let favorites = { games: [], news: [] };
let downloadHistory = [];
let searchHistory = [];
let currentFilter = 'all';
let currentNewsFilter = 'all';
let carouselIndex = 0;

// ============================================
// 初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    initUI();
    showPage('home');
    initWallace();
});

function loadUserData() {
    const saved = localStorage.getItem('wallaceUser');
    if (saved) {
        const data = JSON.parse(saved);
        currentUser = data.user;
        favorites = data.favorites || { games: [], news: [] };
        downloadHistory = data.downloadHistory || [];
        searchHistory = data.searchHistory || [];
    }
}

function saveUserData() {
    const data = {
        user: currentUser,
        favorites: favorites,
        downloadHistory: downloadHistory,
        searchHistory: searchHistory
    };
    localStorage.setItem('wallaceUser', JSON.stringify(data));
}

function initUI() {
    // 导航切换
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (toggle) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // 渲染首页
    renderHomeCarousel();
    renderHomeNews();
    
    // 渲染游戏列表
    renderGames();
    renderNews();
}

// ============================================
// 页面切换
// ============================================

function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // 显示目标页面
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
    }
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.remove('active');
        if (n.dataset.page === pageId) {
            n.classList.add('active');
        }
    });
    
    // 关闭移动端导航
    document.getElementById('navLinks')?.classList.remove('active');
    
    // 渲染页面内容
    switch (pageId) {
        case 'games':
            renderGames();
            break;
        case 'news':
            renderNews();
            break;
        case 'favorites':
            showFavorites();
            break;
        case 'user':
            showUserPanel();
            break;
        case 'search':
            document.getElementById('searchInput')?.focus();
            break;
    }
}

// ============================================
// 首页渲染
// ============================================

function renderHomeCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    track.innerHTML = GAMES_DATA.slice(0, 6).map(game => `
        <div class="game-card" onclick="showGameDetail(${game.id})">
            <img src="${game.cover}" alt="${game.title}" class="game-cover">
            <div class="game-title">${game.title}</div>
            <div class="game-meta">
                <span class="game-badge">${game.categoryName}</span>
                <span>⬇️ ${formatNumber(game.downloads)}</span>
            </div>
        </div>
    `).join('');
}

function renderHomeNews() {
    const grid = document.getElementById('homeNewsGrid');
    if (!grid) return;
    
    grid.innerHTML = NEWS_DATA.slice(0, 4).map(news => `
        <div class="news-card" onclick="showNewsDetail(${news.id})">
            <img src="${news.cover}" alt="${news.title}" class="news-cover">
            <div class="news-title">${news.title}</div>
            <div class="news-meta">${news.date} · ${formatNumber(news.views)}阅读</div>
            <div class="news-tag">${news.categoryName}</div>
        </div>
    `).join('');
}

// 轮播控制
function carouselNext() {
    const track = document.getElementById('carouselTrack');
    if (track) {
        track.scrollBy({ left: 220, behavior: 'smooth' });
    }
}

function carouselPrev() {
    const track = document.getElementById('carouselTrack');
    if (track) {
        track.scrollBy({ left: -220, behavior: 'smooth' });
    }
}

// ============================================
// 游戏列表
// ============================================

function renderGames(filter = 'all') {
    currentFilter = filter;
    const grid = document.getElementById('gameGrid');
    if (!grid) return;
    
    const games = filter === 'all' 
        ? GAMES_DATA 
        : GAMES_DATA.filter(g => g.category === filter);
    
    grid.innerHTML = games.map(game => `
        <div class="game-card" onclick="showGameDetail(${game.id})">
            <img src="${game.cover}" alt="${game.title}" class="game-cover">
            <div class="game-title">${game.title}</div>
            <div class="game-meta">
                <span class="game-badge">${game.categoryName}</span>
                <span>${game.platform}</span>
                <span>${game.size}</span>
                <span>⬇️ ${formatNumber(game.downloads)}</span>
            </div>
        </div>
    `).join('');
    
    // 更新按钮状态
    document.querySelectorAll('.game-filters .nes-btn').forEach(btn => {
        btn.classList.remove('is-primary');
        if (btn.textContent === '全部' && filter === 'all') btn.classList.add('is-primary');
        if (btn.textContent === '射击' && filter === 'shooter') btn.classList.add('is-primary');
        if (btn.textContent === 'RPG' && filter === 'rpg') btn.classList.add('is-primary');
        if (btn.textContent === '模拟' && filter === 'sim') btn.classList.add('is-primary');
        if (btn.textContent === '冒险' && filter === 'adventure') btn.classList.add('is-primary');
        if (btn.textContent === '解谜' && filter === 'puzzle') btn.classList.add('is-primary');
        if (btn.textContent === '独立' && filter === 'indie') btn.classList.add('is-primary');
    });
}

function filterGames(filter) {
    renderGames(filter);
    showPage('games');
}

function showGameDetail(id) {
    const game = GAMES_DATA.find(g => g.id === id);
    if (!game) return;
    
    const container = document.getElementById('gameDetail');
    if (!container) return;
    
    const isFav = favorites.games.includes(id);
    
    container.innerHTML = `
        <div class="game-detail-inner">
            <img src="${game.cover}" alt="${game.title}" class="detail-cover">
            <h2 class="detail-title">${game.title}</h2>
            <div class="detail-meta">
                <span class="game-badge">${game.categoryName}</span>
                <span>📱 ${game.platform}</span>
                <span>💾 ${game.size}</span>
                <span>⬇️ ${formatNumber(game.downloads)}下载</span>
                <span>⭐ ${game.rating}分</span>
                <span>🕐 ${game.updateTime}</span>
            </div>
            <div class="detail-content">
                <p>${game.description}</p>
            </div>
            <button class="download-btn" onclick="downloadGame(${game.id})">
                ⬇️ 立即下载
            </button>
            <button class="nes-btn ${isFav ? 'is-warning' : ''}" onclick="toggleFavGame(${game.id})" style="margin-left:10px;">
                ${isFav ? '⭐ 已收藏' : '☆ 收藏'}
            </button>
        </div>
    `;
    
    showPage('game-detail');
}

function downloadGame(id) {
    const game = GAMES_DATA.find(g => g.id === id);
    if (!game) return;
    
    // 记录下载
    if (!downloadHistory.includes(id)) {
        downloadHistory.push(id);
        saveUserData();
    }
    
    showToast(`正在下载: ${game.title}`);
    wallaceReact('happy');
    
    // 模拟下载
    setTimeout(() => {
        showToast(`下载完成: ${game.title}！`);
    }, 2000);
}

function toggleFavGame(id) {
    if (!currentUser) {
        showToast('请先登录后再收藏~');
        showModal('loginModal');
        return;
    }
    
    const idx = favorites.games.indexOf(id);
    if (idx > -1) {
        favorites.games.splice(idx, 1);
        showToast('已取消收藏');
    } else {
        favorites.games.push(id);
        showToast('收藏成功！⭐');
    }
    saveUserData();
}

// ============================================
// 资讯列表
// ============================================

function renderNews(filter = 'all') {
    currentNewsFilter = filter;
    const list = document.getElementById('newsList');
    if (!list) return;
    
    const news = filter === 'all' 
        ? NEWS_DATA 
        : NEWS_DATA.filter(n => n.category === filter);
    
    list.innerHTML = news.map(item => `
        <div class="news-card" onclick="showNewsDetail(${item.id})">
            <img src="${item.cover}" alt="${item.title}" class="news-cover">
            <div class="news-title">${item.title}</div>
            <div class="news-meta">${item.date} · ${formatNumber(item.views)}阅读 · ${item.author}</div>
            <div class="news-excerpt">${item.excerpt}</div>
            <div class="news-tag">${item.categoryName}</div>
        </div>
    `).join('');
    
    // 更新按钮状态
    const btnMap = { all: '全部', newgame: '新游预告', review: '游戏评测', industry: '行业动态', guide: '攻略技巧' };
    document.querySelectorAll('.news-tabs .nes-btn').forEach(btn => {
        btn.classList.remove('is-primary');
        if (btn.textContent === btnMap[filter]) btn.classList.add('is-primary');
    });
}

function filterNews(filter) {
    renderNews(filter);
    showPage('news');
}

function showNewsDetail(id) {
    const news = NEWS_DATA.find(n => n.id === id);
    if (!news) return;
    
    const container = document.getElementById('newsDetail');
    if (!container) return;
    
    const isFav = favorites.news.includes(id);
    
    container.innerHTML = `
        <img src="${news.cover}" alt="${news.title}" class="detail-cover">
        <h2 class="detail-title">${news.title}</h2>
        <div class="detail-meta">
            <span class="news-tag">${news.categoryName}</span>
            <span>👤 ${news.author}</span>
            <span>📅 ${news.date}</span>
            <span>👁️ ${formatNumber(news.views)}阅读</span>
        </div>
        <div class="detail-content">
            ${news.content.split('\n').map(p => `<p style="margin-bottom:15px;">${p}</p>`).join('')}
        </div>
        <button class="nes-btn ${isFav ? 'is-warning' : ''}" onclick="toggleFavNews(${news.id})">
            ${isFav ? '⭐ 已收藏' : '☆ 收藏本文'}
        </button>
    `;
    
    // 相关推荐
    const related = document.getElementById('relatedNews');
    if (related) {
        const relatedNews = NEWS_DATA.filter(n => n.id !== id && n.category === news.category).slice(0, 2);
        related.innerHTML = relatedNews.map(n => `
            <div class="news-card" onclick="showNewsDetail(${n.id})">
                <img src="${n.cover}" alt="${n.title}" class="news-cover">
                <div class="news-title">${n.title}</div>
                <div class="news-meta">${n.date}</div>
            </div>
        `).join('');
    }
    
    showPage('news-detail');
}

function toggleFavNews(id) {
    if (!currentUser) {
        showToast('请先登录后再收藏~');
        showModal('loginModal');
        return;
    }
    
    const idx = favorites.news.indexOf(id);
    if (idx > -1) {
        favorites.news.splice(idx, 1);
        showToast('已取消收藏');
    } else {
        favorites.news.push(id);
        showToast('收藏成功！⭐');
    }
    saveUserData();
}

// ============================================
// 搜索
// ============================================

function doSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchGames = document.getElementById('searchGames').checked;
    const searchNews = document.getElementById('searchNews').checked;
    const results = document.getElementById('searchResults');
    
    if (!query) {
        results.innerHTML = '<p style="color:var(--text-secondary);padding:20px;">输入关键词开始搜索...</p>';
        return;
    }
    
    // 记录搜索历史
    if (currentUser && !searchHistory.includes(query)) {
        searchHistory.unshift(query);
        if (searchHistory.length > 10) searchHistory.pop();
        saveUserData();
    }
    
    let html = '';
    
    if (searchGames) {
        const games = GAMES_DATA.filter(g => 
            g.title.toLowerCase().includes(query) ||
            g.categoryName.toLowerCase().includes(query)
        );
        if (games.length) {
            html += '<h3 style="color:var(--pixel-yellow);margin:20px 0 10px;">🎮 游戏结果</h3>';
            html += games.map(g => `
                <div class="search-result-item" onclick="showGameDetail(${g.id})">
                    <img src="${g.cover}" class="search-result-img">
                    <div class="search-result-info">
                        <div class="search-result-title">${highlightText(g.title, query)}</div>
                        <span class="search-result-type">${g.categoryName}</span>
                        <div style="font-size:8px;color:var(--text-secondary);margin-top:5px;">
                            ${g.platform} · ${g.size} · ⬇️${formatNumber(g.downloads)}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (searchNews) {
        const news = NEWS_DATA.filter(n =>
            n.title.toLowerCase().includes(query) ||
            n.excerpt.toLowerCase().includes(query)
        );
        if (news.length) {
            html += '<h3 style="color:var(--pixel-yellow);margin:20px 0 10px;">📰 资讯结果</h3>';
            html += news.map(n => `
                <div class="search-result-item" onclick="showNewsDetail(${n.id})">
                    <img src="${n.cover}" class="search-result-img">
                    <div class="search-result-info">
                        <div class="search-result-title">${highlightText(n.title, query)}</div>
                        <span class="search-result-type">${n.categoryName}</span>
                        <div style="font-size:8px;color:var(--text-secondary);margin-top:5px;">
                            ${n.date} · ${n.author}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (!html) {
        html = `
            <div style="text-align:center;padding:40px;">
                <img src="assets/sprites/wallace_idle.png" style="width:64px;opacity:0.5;">
                <p style="color:var(--text-secondary);margin-top:15px;">没有找到"${query}"相关内容</p>
            </div>
        `;
    }
    
    results.innerHTML = html;
}

function highlightText(text, query) {
    return text.replace(new RegExp(query, 'gi'), 
        match => `<span style="background:var(--pixel-yellow);color:var(--bg-primary);">${match}</span>`
    );
}

// ============================================
// 收藏
// ============================================

function showFavTab(tab) {
    showFavorites(tab);
}

function showFavorites(tab = 'games') {
    const content = document.getElementById('favoritesContent');
    if (!content) return;
    
    const isGames = tab === 'games';
    const ids = isGames ? favorites.games : favorites.news;
    const data = isGames ? GAMES_DATA : NEWS_DATA;
    const items = ids.map(id => data.find(d => d.id === id)).filter(Boolean);
    
    if (!currentUser) {
        content.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <p style="color:var(--text-secondary);margin-bottom:20px;">登录后可查看收藏</p>
                <button class="nes-btn is-primary" onclick="showModal('loginModal')">登录</button>
            </div>
        `;
        return;
    }
    
    if (!items.length) {
        content.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <img src="assets/sprites/wallace_idle.png" style="width:64px;opacity:0.5;">
                <p style="color:var(--text-secondary);margin-top:15px;">还没有收藏哦~</p>
            </div>
        `;
        return;
    }
    
    if (isGames) {
        content.innerHTML = `
            <div class="game-grid">
                ${items.map(g => `
                    <div class="game-card" onclick="showGameDetail(${g.id})">
                        <img src="${g.cover}" class="game-cover">
                        <div class="game-title">${g.title}</div>
                        <div class="game-meta">
                            <span class="game-badge">${g.categoryName}</span>
                            <span>⬇️ ${formatNumber(g.downloads)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="news-grid">
                ${items.map(n => `
                    <div class="news-card" onclick="showNewsDetail(${n.id})">
                        <img src="${n.cover}" class="news-cover">
                        <div class="news-title">${n.title}</div>
                        <div class="news-meta">${n.date}</div>
                        <div class="news-tag">${n.categoryName}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// ============================================
// 用户中心
// ============================================

function showUserPanel() {
    const panel = document.getElementById('userPanel');
    if (!panel) return;
    
    if (!currentUser) {
        panel.innerHTML = `
            <div class="user-panel">
                <div style="text-align:center;">
                    <img src="assets/sprites/wallace_idle.png" class="user-avatar" style="display:block;margin:0 auto 20px;">
                    <h2 style="color:var(--pixel-yellow);margin-bottom:10px;">欢迎来到华莱士游戏站</h2>
                    <p style="color:var(--text-secondary);margin-bottom:30px;">登录后可收藏游戏、查看下载记录</p>
                    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                        <button class="nes-btn is-primary" onclick="showModal('loginModal')">🔐 登录</button>
                        <button class="nes-btn" onclick="handleRegister()">📝 注册</button>
                    </div>
                    <p style="color:var(--text-secondary);margin-top:20px;font-size:8px;">💡 可直接浏览，无需注册</p>
                </div>
            </div>
        `;
        return;
    }
    
    panel.innerHTML = `
        <div class="user-panel">
            <div style="text-align:center;">
                <img src="assets/sprites/wallace_happy.png" class="user-avatar" style="display:block;margin:0 auto 15px;">
                <h2 style="color:var(--pixel-yellow);">${currentUser.username}</h2>
                <p style="color:var(--text-secondary);font-size:8px;">欢迎回来，华莱士为你服务！</p>
            </div>
            
            <div class="settings-group">
                <h3 style="color:var(--pixel-yellow);margin-bottom:15px;">📊 我的数据</h3>
                <div class="settings-item">
                    <span>收藏游戏</span>
                    <span>${favorites.games.length} 个</span>
                </div>
                <div class="settings-item">
                    <span>收藏资讯</span>
                    <span>${favorites.news.length} 篇</span>
                </div>
                <div class="settings-item">
                    <span>下载记录</span>
                    <span>${downloadHistory.length} 个</span>
                </div>
                <div class="settings-item">
                    <span>搜索历史</span>
                    <span>${searchHistory.length} 条</span>
                </div>
            </div>
            
            <div class="settings-group">
                <h3 style="color:var(--pixel-yellow);margin-bottom:15px;">⚙️ 设置</h3>
                <div class="settings-item">
                    <span>🗑️ 清除下载记录</span>
                    <button class="nes-btn is-small" onclick="clearDownloads()">确认</button>
                </div>
                <div class="settings-item">
                    <span>🗑️ 清除搜索历史</span>
                    <button class="nes-btn is-small" onclick="clearSearchHistory()">确认</button>
                </div>
            </div>
            
            <div style="margin-top:30px;text-align:center;">
                <button class="nes-btn is-error" onclick="handleLogout()">🚪 退出登录</button>
            </div>
        </div>
    `;
}

function clearDownloads() {
    downloadHistory = [];
    saveUserData();
    showToast('下载记录已清除');
    showUserPanel();
}

function clearSearchHistory() {
    searchHistory = [];
    saveUserData();
    showToast('搜索历史已清除');
    showUserPanel();
}

// ============================================
// 登录注册
// ============================================

function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showToast('请输入用户名和密码');
        return;
    }
    
    // 简单验证
    const users = JSON.parse(localStorage.getItem('wallaceUsers') || '[]');
    const user = users.find(u => u.username === username && u.password === btoa(password));
    
    if (!user) {
        showToast('用户名或密码错误');
        return;
    }
    
    currentUser = { username: user.username };
    saveUserData();
    closeModal('loginModal');
    showToast(`欢迎回来，${username}！`);
    wallaceReact('happy');
    showUserPanel();
}

function handleRegister() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showToast('请输入用户名和密码');
        return;
    }
    
    if (username.length < 3) {
        showToast('用户名至少3个字符');
        return;
    }
    
    if (password.length < 4) {
        showToast('密码至少4个字符');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('wallaceUsers') || '[]');
    
    if (users.find(u => u.username === username)) {
        showToast('用户名已存在');
        return;
    }
    
    users.push({ username, password: btoa(password) });
    localStorage.setItem('wallaceUsers', JSON.stringify(users));
    
    currentUser = { username };
    favorites = { games: [], news: [] };
    downloadHistory = [];
    saveUserData();
    
    closeModal('loginModal');
    showToast(`注册成功，欢迎 ${username}！`);
    wallaceReact('happy');
    showUserPanel();
}

function handleLogout() {
    currentUser = null;
    favorites = { games: [], news: [] };
    downloadHistory = [];
    searchHistory = [];
    saveUserData();
    showToast('已退出登录');
    showPage('home');
}

// ============================================
// 华莱士彩蛋
// ============================================

let wallaceState = 'idle';

function initWallace() {
    const egg = document.getElementById('wallaceEgg');
    if (egg) {
        // 随机显示对话
        setInterval(() => {
            if (Math.random() > 0.7) {
                showWallaceBubble(WALLACE_DIALOGUES[Math.floor(Math.random() * WALLACE_DIALOGUES.length)]);
            }
        }, 10000);
    }
}

function wallaceInteract() {
    const stages = ['wave', 'happy', 'idle'];
    wallaceState = stages[Math.floor(Math.random() * stages.length)];
    
    const img = document.getElementById('eggWallace');
    if (img) {
        img.src = `assets/sprites/wallace_${wallaceState}.png`;
        setTimeout(() => {
            img.src = 'assets/sprites/wallace_idle.png';
        }, 2000);
    }
    
    const messages = [
        '要玩游戏吗？🎮',
        '我超喜欢像素游戏的！',
        '今天想下载什么？',
        '华莱士陪你玩！',
        '这个游戏超好玩！'
    ];
    showWallaceBubble(messages[Math.floor(Math.random() * messages.length)]);
}

function wallaceReact(type) {
    const img = document.getElementById('eggWallace');
    if (img) {
        img.src = `assets/sprites/wallace_${type}.png`;
        setTimeout(() => {
            img.src = 'assets/sprites/wallace_idle.png';
        }, 1500);
    }
}

function showWallaceBubble(text) {
    const bubble = document.getElementById('eggBubble');
    if (bubble) {
        bubble.textContent = text;
        bubble.classList.add('show');
        setTimeout(() => bubble.classList.remove('show'), 3000);
    }
}

// ============================================
// 模态框
// ============================================

function showModal(id) {
    document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
}

// 点击背景关闭
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ============================================
// 提示消息
// ============================================

function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// 工具函数
// ============================================

function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
    }
    return num.toLocaleString();
}
