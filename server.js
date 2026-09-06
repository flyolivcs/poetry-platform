const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
const STATIC_DIR = path.join(__dirname, 'static');
const TEMPLATE_DIR = path.join(__dirname, 'templates');

const poems = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'all_poems.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf8'));

const DB_FILE = path.join(DATA_DIR, 'db.json');
let db = { users: {}, favorites: {}, likes: {}, videos: {}, sessions: {} };
try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
} catch(e) {}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db));
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

function getCategoryImage(id) {
    return `/static/images/category_${id}.jpg`;
}

const GRADE_ORDER = {
    '小学1年级': 1, '小学2年级': 2, '小学3年级': 3, '小学4年级': 4, '小学5年级': 5, '小学6年级': 6,
    '初中1年级': 7, '初中2年级': 8, '初中3年级': 9,
    '高中1年级': 10, '高中2年级': 11, '高中3年级': 12
};

function sortPoems(arr) {
    return arr.sort((a, b) => {
        const aSchool = a.id.startsWith('school_');
        const bSchool = b.id.startsWith('school_');
        if (aSchool && !bSchool) return -1;
        if (!aSchool && bSchool) return 1;
        if (aSchool && bSchool) {
            const ag = GRADE_ORDER[a.grade] || 99;
            const bg = GRADE_ORDER[b.grade] || 99;
            if (ag !== bg) return ag - bg;
            return a.id.localeCompare(b.id);
        }
        return 0;
    });
}

            const total = filtered.length;
            const totalPages = Math.ceil(total / pageSize);
            const start = (page - 1) * pageSize;
            const pageData = filtered.slice(start, start + pageSize);

            return sendJSON(res, { poems: pageData, total, page, pageSize, totalPages });
        }

        if (pathname.startsWith('/api/poem/') && method === 'GET') {
            const id = pathname.replace('/api/poem/', '');
            const poem = poems.find(p => p.id === id);
            if (!poem) return sendJSON(res, { error: '诗词不存在' }, 404);
            const likeCount = db.likes[id] || 0;
            return sendJSON(res, { poem, likeCount });
        }

        if (pathname === '/api/register' && method === 'POST') {
            const body = await parseBody(req);
            const { username, password } = body;
            if (!username || !password) return sendJSON(res, { error: '用户名和密码不能为空' }, 400);
            if (db.users[username]) return sendJSON(res, { error: '用户名已存在' }, 400);
            db.users[username] = { password: hashPassword(password), createdAt: Date.now() };
            const token = generateToken();
            db.sessions[token] = { username, createdAt: Date.now() };
            saveDB();
            return sendJSON(res, { token, username });
        }

        if (pathname === '/api/login' && method === 'POST') {
            const body = await parseBody(req);
            const { username, password } = body;
            if (!db.users[username]) return sendJSON(res, { error: '用户不存在' }, 400);
            if (db.users[username].password !== hashPassword(password)) return sendJSON(res, { error: '密码错误' }, 400);
            const token = generateToken();
            db.sessions[token] = { username, createdAt: Date.now() };
            saveDB();
            return sendJSON(res, { token, username });
        }

        if (pathname === '/api/logout' && method === 'POST') {
            const auth = req.headers.authorization;
            if (auth) {
                const token = auth.replace('Bearer ', '');
                delete db.sessions[token];
                saveDB();
            }
            return sendJSON(res, { success: true });
        }

        if (pathname === '/api/user' && method === 'GET') {
            if (!user) return sendJSON(res, { user: null });
            return sendJSON(res, { user: { username: user.username } });
        }

        if (pathname === '/api/favorite' && method === 'POST') {
            if (!user) return sendJSON(res, { error: '请先登录' }, 401);
            const body = await parseBody(req);
            const { poemId } = body;
            if (!db.favorites[user.username]) db.favorites[user.username] = [];
            const idx = db.favorites[user.username].indexOf(poemId);
            if (idx >= 0) {
                db.favorites[user.username].splice(idx, 1);
                saveDB();
                return sendJSON(res, { favorited: false });
            } else {
                db.favorites[user.username].push(poemId);
                saveDB();
                return sendJSON(res, { favorited: true });
            }
        }

        if (pathname === '/api/favorites' && method === 'GET') {
            if (!user) return sendJSON(res, { error: '请先登录' }, 401);
            const favIds = db.favorites[user.username] || [];
            const favPoems = favIds.map(id => poems.find(p => p.id === id)).filter(Boolean);
            return sendJSON(res, { favorites: favPoems });
        }

        if (pathname === '/api/check-favorite' && method === 'GET') {
            if (!user) return sendJSON(res, { favorited: false });
            const poemId = url.searchParams.get('poemId');
            const favIds = db.favorites[user.username] || [];
            return sendJSON(res, { favorited: favIds.includes(poemId) });
        }

        if (pathname === '/api/like' && method === 'POST') {
            const body = await parseBody(req);
            const { poemId } = body;
            db.likes[poemId] = (db.likes[poemId] || 0) + 1;
            saveDB();
            return sendJSON(res, { likeCount: db.likes[poemId] });
        }

        if (pathname === '/api/videos' && method === 'GET') {
            if (!user) return sendJSON(res, { error: '请先登录' }, 401);
            const videos = db.videos[user.username] || [];
            return sendJSON(res, { videos });
        }

        if (pathname === '/api/video' && method === 'POST') {
            if (!user) return sendJSON(res, { error: '请先登录' }, 401);
            const body = await parseBody(req);
            const { title, url: videoUrl, poemId } = body;
            if (!db.videos[user.username]) db.videos[user.username] = [];
            db.videos[user.username].push({
                id: 'vid_' + Date.now(),
                title: title || '未命名视频',
                url: videoUrl || '',
                poemId: poemId || '',
                createdAt: Date.now()
            });
            saveDB();
            return sendJSON(res, { success: true });
        }

        if (pathname.startsWith('/api/video/') && method === 'DELETE') {
            if (!user) return sendJSON(res, { error: '请先登录' }, 401);
            const vidId = pathname.replace('/api/video/', '');
            if (db.videos[user.username]) {
                db.videos[user.username] = db.videos[user.username].filter(v => v.id !== vidId);
                saveDB();
            }
            return sendJSON(res, { success: true });
        }

        if (pathname === '/api/stats' && method === 'GET') {
            return sendJSON(res, {
                totalPoems: poems.length,
                totalPoemsShi: poems.filter(p => p.type === '诗').length,
                totalPoemsCi: poems.filter(p => p.type === '词').length,
                totalCategories: categories.length,
                totalUsers: Object.keys(db.users).length
            });
        }

        return sendJSON(res, { error: 'API不存在' }, 404);
    }

    if (pathname === '/' || pathname === '/index.html') {
        return serveStatic(path.join(TEMPLATE_DIR, 'index.html'), res);
    }
    if (pathname === '/category') {
        return serveStatic(path.join(TEMPLATE_DIR, 'category.html'), res);
    }
    if (pathname === '/detail') {
        return serveStatic(path.join(TEMPLATE_DIR, 'detail.html'), res);
    }
    if (pathname === '/login') {
        return serveStatic(path.join(TEMPLATE_DIR, 'login.html'), res);
    }
    if (pathname === '/register') {
        return serveStatic(path.join(TEMPLATE_DIR, 'register.html'), res);
    }
    if (pathname === '/favorites') {
        return serveStatic(path.join(TEMPLATE_DIR, 'favorites.html'), res);
    }
    if (pathname === '/videos') {
        return serveStatic(path.join(TEMPLATE_DIR, 'videos.html'), res);
    }
    if (pathname === '/profile') {
        return serveStatic(path.join(TEMPLATE_DIR, 'profile.html'), res);
    }

    if (pathname.startsWith('/static/')) {
        const filePath = path.join(__dirname, pathname);
        return serveStatic(filePath, res);
    }

    return serveStatic(path.join(TEMPLATE_DIR, '404.html'), res);
});

(async () => {
    let port = parseInt(process.env.PORT) || 3000;
    const net = require('net');
    const checker = net.createServer();
    checker.unref();
    await new Promise((resolve) => {
        checker.once('error', () => { checker.close(); resolve(); });
        checker.listen(port, () => { checker.close(); resolve(); });
    });

    server.listen(port, '0.0.0.0', () => {
        console.log(`古诗词学习平台已启动，端口: ${port}`);
        console.log(`诗词总数: ${poems.length} (诗${poems.filter(p=>p.type==='诗').length} + 词${poems.filter(p=>p.type==='词').length})`);
        console.log(`类别数: ${categories.length}`);
    });
})();
