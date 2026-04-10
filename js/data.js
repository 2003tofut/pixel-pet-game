// ============================================
// 华莱士游戏站 - 数据文件
// ============================================

// 游戏数据
const GAMES_DATA = [
    {
        id: 1,
        title: "星际猎手",
        category: "shooter",
        categoryName: "射击游戏",
        platform: "PC",
        size: "2.5GB",
        downloads: 15820,
        rating: 4.5,
        cover: "assets/sprites/game_1.png",
        description: "在浩瀚宇宙中驾驶战机，消灭入侵的外星生物！经典街机射击玩法，像素风格画面带你回到红白机时代。支持双人合作，重温当年一起打飞机的快乐时光。",
        screenshots: ["assets/sprites/game_1.png"],
        downloadLinks: [
            { name: "高速下载", url: "#" },
            { name: "网盘备份", url: "#" }
        ],
        updateTime: "2025-03-15"
    },
    {
        id: 2,
        title: "勇者传说",
        category: "rpg",
        categoryName: "角色扮演",
        platform: "PC",
        size: "3.8GB",
        downloads: 25340,
        rating: 4.8,
        cover: "assets/sprites/game_2.png",
        description: "经典像素RPG，扮演勇者拯救公主！丰富的职业系统、完整的技能树、庞大的世界观。回合制战斗易上手，剧情深入感人。",
        screenshots: ["assets/sprites/game_2.png"],
        downloadLinks: [
            { name: "高速下载", url: "#" },
            { name: "网盘备份", url: "#" }
        ],
        updateTime: "2025-03-10"
    },
    {
        id: 3,
        title: "模拟城市物语",
        category: "sim",
        categoryName: "模拟经营",
        platform: "PC/Android",
        size: "1.2GB",
        downloads: 18920,
        rating: 4.3,
        cover: "assets/sprites/game_3.png",
        description: "建造你的梦想城市！从一个小镇开始，发展成为繁华大都市。合理规划区域，管理市民满意度，抵御自然灾害。轻松有趣的模拟经营体验。",
        screenshots: ["assets/sprites/game_3.png"],
        downloadLinks: [
            { name: "高速下载", url: "#" },
            { name: "网盘备份", url: "#" }
        ],
        updateTime: "2025-03-08"
    },
    {
        id: 4,
        title: "像素迷宫",
        category: "adventure",
        categoryName: "冒险解谜",
        platform: "PC",
        size: "856MB",
        downloads: 9870,
        rating: 4.6,
        cover: "assets/sprites/game_4.png",
        description: "在像素构成的迷宫中探索解谜！独特的像素艺术风格，巧妙的谜题设计，隐藏的宝藏和秘密。每一个关卡都是一次新的冒险。",
        screenshots: ["assets/sprites/game_4.png"],
        downloadLinks: [
            { name: "高速下载", url: "#" },
            { name: "网盘备份", url: "#" }
        ],
        updateTime: "2025-03-05"
    },
    {
        id: 5,
        title: "独立游戏精选",
        category: "indie",
        categoryName: "小众神作",
        platform: "PC",
        size: "512MB",
        downloads: 12450,
        rating: 4.9,
        cover: "assets/sprites/game_5.png",
        description: "汇集多款精品独立游戏！每一个都是开发者倾注心血的作品。独特玩法、感人故事、精美像素艺术。适合静下心来细细品味。",
        screenshots: ["assets/sprites/game_5.png"],
        downloadLinks: [
            { name: "高速下载", url: "#" },
            { name: "网盘备份", url: "#" }
        ],
        updateTime: "2025-03-01"
    },
    {
        id: 6,
        title: "赛车大赛",
        category: "shooter",
        categoryName: "竞速游戏",
        platform: "PC/Android",
        size: "1.8GB",
        downloads: 11230,
        rating: 4.2,
        cover: "assets/sprites/game_6.png",
        description: "像素风格赛车游戏！多种赛道、炫酷赛车、刺激比赛。收集金币解锁新车，提升性能。简单易上手，老少皆宜。",
        screenshots: ["assets/sprites/game_6.png"],
        downloadLinks: [
            { name: "高速下载", url: "#" },
            { name: "网盘备份", url: "#" }
        ],
        updateTime: "2025-02-28"
    },
    {
        id: 7,
        title: "塔防传奇",
        category: "puzzle",
        categoryName: "策略塔防",
        platform: "PC/Android",
        size: "945MB",
        downloads: 7650,
        rating: 4.4,
        cover: "assets/sprites/game_7.png",
        description: "经典塔防玩法！建造防御塔阻止敌人入侵。升级塔防、解锁技能、挑战BOSS。多种难度模式，考验你的策略能力。",
        screenshots: ["assets/sprites/game_7.png"],
        downloadLinks: [
            { name: "高速下载", url: "#" },
            { name: "网盘备份", url: "#" }
        ],
        updateTime: "2025-02-25"
    },
    {
        id: 8,
        title: "农场物语",
        category: "sim",
        categoryName: "模拟经营",
        platform: "PC/Android",
        size: "1.1GB",
        downloads: 19870,
        rating: 4.7,
        cover: "assets/sprites/game_8.png",
        description: "经营你的像素农场！种植作物、养殖动物、与村民交流。季节变换、节日活动、恋爱结婚。悠闲治愈的田园生活。",
        screenshots: ["assets/sprites/game_8.png"],
        downloadLinks: [
            { name: "高速下载", url: "#" },
            { name: "网盘备份", url: "#" }
        ],
        updateTime: "2025-02-20"
    }
];

// 资讯数据
const NEWS_DATA = [
    {
        id: 1,
        title: "《星际猎手2》正式公布！2026年发售",
        category: "newgame",
        categoryName: "新游预告",
        cover: "assets/sprites/game_1.png",
        author: "华莱士",
        date: "2025-03-15",
        views: 5620,
        excerpt: "经典射击游戏《星际猎手》的续作正式公布！全新引擎打造，更精美的像素画面，更多关卡，更多Boss。预告片已发布，一起来看看吧！",
        content: "经过漫长的等待，经典像素射击游戏《星际猎手》的续作终于正式公布！\n\n游戏特色：\n1. 全新的像素引擎，支持4K分辨率\n2. 20个全新关卡，8个巨型Boss\n3. 双人合作模式全面升级\n4. 原创OST，经典与新曲融合\n5. Steam创意工坊支持\n\n发售日期：2026年春季\n平台：PC/Switch\n\n《星际猎手2》预告片已在B站发布，点击量已突破50万！"
    },
    {
        id: 2,
        title: "2025年最佳像素游戏评选结果出炉",
        category: "review",
        categoryName: "游戏评测",
        cover: "assets/sprites/game_5.png",
        author: "像素菌",
        date: "2025-03-12",
        views: 8930,
        excerpt: "经过两周的投票，2025年最佳像素游戏评选结果正式出炉！哪些游戏获得玩家青睐？一起来看看获奖名单！",
        content: "2025年度最佳像素游戏评选历时两周，共有超过20000名玩家参与投票。\n\n获奖名单：\n🥇 最佳像素游戏：《独立游戏精选》\n🥈 最佳剧情：《勇者传说》\n🥉 最佳音乐：《星际猎手》\n\n其他奖项：\n• 最佳解谜：《像素迷宫》\n• 最佳画面：《农场物语》\n• 最佳创新：《塔防传奇》\n• 最佳独立游戏：《像素迷宫》"
    },
    {
        id: 3,
        title: "像素游戏市场份额突破历史新高",
        category: "industry",
        categoryName: "行业动态",
        cover: "assets/sprites/icon_indie.png",
        author: "游戏日报",
        date: "2025-03-10",
        views: 3420,
        excerpt: "据最新数据显示，像素游戏市场份额在过去一年增长68%，创下历史新高。独立游戏成为增长主力军。",
        content: "根据游戏行业分析公司SuperData的最新报告，像素游戏市场在过去一年实现了惊人的增长。\n\n关键数据：\n• 市场规模：28亿美元\n• 同比增长：68%\n• 玩家数量：3.2亿\n• 平均游戏时长：每月14小时\n\n增长原因分析：\n1. 怀旧情绪持续升温\n2. 开发门槛降低\n3. 独立游戏质量提升\n4. 社交分享便利"
    },
    {
        id: 4,
        title: "《勇者传说》新版本全攻略",
        category: "guide",
        categoryName: "攻略技巧",
        cover: "assets/sprites/game_2.png",
        author: "攻略组",
        date: "2025-03-08",
        views: 12100,
        excerpt: "《勇者传说》3.0版本已经更新，本文为你带来最新最全的攻略！从入门到精通，一文搞定！",
        content: "《勇者传说》3.0版本攻略大全\n\n一、新手入门\n1. 职业选择建议\n2. 前期快速升级技巧\n3. 必做的支线任务\n\n二、职业攻略\n1. 战士：高伤害输出\n2. 法师：元素魔法\n3. 牧师：治疗辅助\n4. 盗贼：暴击暗杀\n\n三、Boss打法\n1. 史莱姆王\n2. 火龙\n3. 暗黑骑士\n4. 最终Boss\n\n四、装备获取\n1. 副本掉落\n2. 制作配方\n3. 商人购买"
    },
    {
        id: 5,
        title: "Switch像素游戏合集即将发售",
        category: "newgame",
        categoryName: "新游预告",
        cover: "assets/sprites/icon_newgame.png",
        author: "任饭之家",
        date: "2025-03-05",
        views: 6780,
        excerpt: "任天堂宣布将推出Switch独占像素游戏合集，收录30款经典像素游戏，首发价格仅需29.99美元！",
        content: "任天堂今日正式宣布，将于今年夏季推出Switch独占像素游戏合集《Nintendo Pixel Collection》。\n\n收录内容：\n• 30款经典像素游戏\n• 独占新游戏3款\n• 完整攻略指南\n• OST原声碟\n\n首发价格：29.99美元\n首发特典：限定NS外壳贴纸"
    },
    {
        id: 6,
        title: "独立游戏开发者分享创作心得",
        category: "industry",
        categoryName: "行业动态",
        cover: "assets/sprites/icon_indie.png",
        author: "像素工坊",
        date: "2025-03-03",
        views: 2890,
        excerpt: "三位独立游戏开发者分享他们的创作故事，从灵感到实现，一步步打造属于自己的像素游戏。",
        content: "独立游戏开发者访谈\n\n开发者A（农场物语）：\n\"我花了2年时间一个人完成了整个游戏。最难的是保持动力，但看到玩家喜爱我的游戏，一切值得。\"\n\n开发者B（像素迷宫）：\n\"好的像素游戏关键在于细节。每个像素都应该有存在的理由。\"\n\n开发者C（塔防传奇）：\n\"独立游戏不需要完美，但需要独特。让玩家记住你的游戏的核心玩法。\""
    },
    {
        id: 7,
        title: "像素游戏画面优化指南",
        category: "guide",
        categoryName: "攻略技巧",
        cover: "assets/sprites/icon_guide.png",
        author: "技术组",
        date: "2025-03-01",
        views: 4560,
        excerpt: "如何优化像素游戏的显示效果？本文从分辨率、缩放算法、色调等方面为你详细讲解。",
        content: "像素游戏画面优化完全指南\n\n一、分辨率设置\n• 推荐使用原始分辨率整数倍\n• 16:9显示器建议1920x1080\n\n二、缩放算法\n• nearest-neighbor：最锐利\n• bicubic：更平滑\n• hqx/xsai：介于两者之间\n\n三、色彩管理\n• 使用受限调色板\n• 避免渐变断层\n• 善用抖动效果"
    },
    {
        id: 8,
        title: "2025年最受期待像素游戏TOP10",
        category: "review",
        categoryName: "游戏评测",
        cover: "assets/sprites/icon_review.png",
        author: "华莱士",
        date: "2025-02-28",
        views: 9870,
        excerpt: "2025年有哪些值得期待的像素游戏？本文为你盘点最受玩家期待的10款像素游戏！",
        content: "2025最受期待像素游戏TOP10\n\n1. 星际猎手2\n2. 勇者传说2\n3. 像素银河\n4. 龙之谷物语\n5. 地下城与勇士像素版\n6. 我的世界2\n7. 泰拉瑞亚2\n8. 星露谷物语2\n9. 饥荒2\n10. 超级肉肉哥像素版"
    }
];

// 华莱士对话
const WALLACE_DIALOGUES = [
    "欢迎来到华莱士游戏站！🎮",
    "这些游戏超好玩的！🦞",
    "下载试试看吧！⬇️",
    "华莱士陪你玩游戏！💪",
    "像素游戏最棒了！✨",
    "今天想玩什么游戏？🎯",
    "华莱士为你精选！⭐",
    "好玩的游戏在这里！🎯",
    "下载速度很快哦！⚡",
    "华莱士在等你！🦞"
];
