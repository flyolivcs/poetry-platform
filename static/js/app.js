const API = {
    token: localStorage.getItem('token') || '',

    async request(url, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
        const res = await fetch(url, { ...options, headers });
        const data = await res.json();
        return data;
    },

    getCategories() { return this.request('/api/categories'); },
    getPoems(params) {
        const query = new URLSearchParams(params).toString();
        return this.request('/api/poems?' + query);
    },
    getPoem(id) { return this.request('/api/poem/' + id); },
    register(username, password) { return this.request('/api/register', { method: 'POST', body: JSON.stringify({ username, password }) }); },
    login(username, password) { return this.request('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) }); },
    logout() { return this.request('/api/logout', { method: 'POST' }); },
    getUser() { return this.request('/api/user'); },
    toggleFavorite(poemId) { return this.request('/api/favorite', { method: 'POST', body: JSON.stringify({ poemId }) }); },
    getFavorites() { return this.request('/api/favorites'); },
    checkFavorite(poemId) { return this.request('/api/check-favorite?poemId=' + poemId); },
    like(poemId) { return this.request('/api/like', { method: 'POST', body: JSON.stringify({ poemId }) }); },
    getVideos() { return this.request('/api/videos'); },
    addVideo(title, url, poemId) { return this.request('/api/video', { method: 'POST', body: JSON.stringify({ title, url, poemId }) }); },
    deleteVideo(id) { return this.request('/api/video/' + id, { method: 'DELETE' }); },
    getStats() { return this.request('/api/stats'); },

    setToken(token) {
        this.token = token;
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }
};

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

async function renderNavbar() {
    const data = await API.getUser();
    const user = data.user;
    const userArea = document.getElementById('user-area');
    if (userArea) {
        if (user) {
            userArea.innerHTML = `
                <span style="color:var(--gold);font-size:14px;">欢迎，${user.username}</span>
                <button class="btn btn-outline" onclick="location.href='/favorites'">我的收藏</button>
                <button class="btn btn-outline" onclick="location.href='/videos'">我的视频</button>
                <button class="btn btn-primary" onclick="doLogout()">登出</button>
            `;
        } else {
            userArea.innerHTML = `
                <button class="btn btn-outline" onclick="location.href='/login'">登录</button>
                <button class="btn btn-primary" onclick="location.href='/register'">注册</button>
            `;
        }
    }
}

async function doLogout() {
    await API.logout();
    API.setToken('');
    showToast('已登出');
    setTimeout(() => location.href = '/', 1000);
}

function getQueryParam(name) {
    return new URLSearchParams(location.search).get(name);
}

function formatContent(content) {
    return content.split('\n').join('\n');
}

function createPoemCard(poem) {
    const card = document.createElement('div');
    card.className = 'poem-card';
    if (poem.grade) card.classList.add('school-poem');
    const contentPreview = poem.content.length > 100 ? poem.content.substring(0, 100) + '...' : poem.content;
    const gradeBadge = poem.grade ? `<span class="tag tag-grade">${poem.grade}</span>` : '';
    card.innerHTML = `
        <div class="poem-header">
            <div class="poem-title">${poem.title}${poem.rhythmic ? ' · ' + poem.rhythmic : ''}</div>
        </div>
        <div class="poem-meta">
            <span class="tag">${poem.dynasty}代</span>
            <span class="tag">${poem.type}</span>
            <span class="tag">${poem.author}</span>
            ${gradeBadge}
            <span style="margin-left:8px;">❤ ${poem.likes}</span>
        </div>
        <div class="poem-content">${formatContent(contentPreview)}</div>
        <div class="poem-actions">
            <button class="btn-like" onclick="quickLike('${poem.id}', this)">❤ 点赞</button>
            <button class="btn-fav" onclick="quickFav('${poem.id}', this)">★ 收藏</button>
            <button class="btn-detail" onclick="location.href='/detail?id=${poem.id}'">查看详情 →</button>
        </div>
    `;
    return card;
}

async function quickLike(poemId, btn) {
    const data = await API.like(poemId);
    if (data.likeCount) {
        btn.classList.add('active');
        showToast('点赞成功！' + data.likeCount + '赞');
    }
}

async function quickFav(poemId, btn) {
    if (!API.token) {
        showToast('请先登录');
        setTimeout(() => location.href = '/login', 1500);
        return;
    }
    const data = await API.toggleFavorite(poemId);
    if (data.favorited) {
        btn.classList.add('active');
        btn.innerHTML = '★ 已收藏';
        showToast('收藏成功！');
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '★ 收藏';
        showToast('已取消收藏');
    }
}

async function loadStats() {
    const stats = await API.getStats();
    const statsEl = document.getElementById('hero-stats');
    if (statsEl) {
        statsEl.innerHTML = `
            <div class="stat-item"><div class="num">${stats.totalPoemsShi}</div><div class="label">经典名诗</div></div>
            <div class="stat-item"><div class="num">${stats.totalPoemsCi}</div><div class="label">经典名词</div></div>
            <div class="stat-item"><div class="num">${stats.totalCategories}</div><div class="label">题材分类</div></div>
            <div class="stat-item"><div class="num">${stats.totalUsers}</div><div class="label">注册用户</div></div>
        `;
    }
}
