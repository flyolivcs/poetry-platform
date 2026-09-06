const fs = require('fs');

console.log('=== 1. 繁简映射 ===');
const tsLines = fs.readFileSync('TSCharacters.txt', 'utf8').trim().split('\n');
const t2s = new Map();
for (const line of tsLines) {
    if (line.startsWith('#')) continue;
    const parts = line.split('\t');
    if (parts.length >= 2) {
        const tr = parts[0].trim(), si = parts[1].trim().split(' ')[0];
        if (tr && si) t2s.set(tr, si);
    }
}
function toS(text) { if(!text) return ''; let r=''; for(const ch of text) r+=t2s.get(ch)||ch; return r; }

console.log('=== 2. 排名数据 ===');
const tangRank = JSON.parse(fs.readFileSync('tang_rank_all.json', 'utf8'));
const ciRank = JSON.parse(fs.readFileSync('ci_rank_all.json', 'utf8'));

function buildRankMap(rankData, useRhythmic) {
    const map = new Map();
    for (const r of rankData) {
        const title = toS(useRhythmic ? (r.rhythmic || r.title || '') : (r.title || ''));
        const author = toS(r.author || '');
        const key = title + '|' + author;
        const score = (r.baidu || 0) + (r.google || 0) + (r.bing || 0) + (r.so360 || 0);
        if (!map.has(key) || map.get(key) < score) map.set(key, score);
    }
    return map;
}
const tangRankMap = buildRankMap(tangRank, false);
const ciRankMap = buildRankMap(ciRank, true);

console.log('=== 3. 著名诗词加成列表 ===');
const famousPoems = [
    '静夜思','春望','将进酒','蜀道难','登高','望岳','琵琶行','长恨歌','出塞','凉州词',
    '咏鹅','回乡偶书','咏柳','登鹳雀楼','春晓','宿建德江','过故人庄','山居秋暝',
    '鹿柴','竹里馆','送元二使安西','九月九日忆山东兄弟','相思','鸟鸣涧',
    '赠汪伦','望庐山瀑布','早发白帝城','黄鹤楼送孟浩然之广陵','望天门山',
    '行路难','梦游天姥吟留别','独坐敬亭山','月下独酌','秋浦歌','长干行',
    '渡荆门送别','听蜀僧濬弹琴','夜泊牛渚怀古','登金陵凤凰台','江上吟',
    '赋得古原草送别','钱塘湖春行','暮江吟','问刘十九','卖炭翁',
    '乌衣巷','竹枝词','秋词','望洞庭','酬乐天扬州初逢席上见赠',
    '江雪','渔翁','登柳州城楼',
    '枫桥夜泊','滁州西涧','塞下曲','逢雪宿芙蓉山主人',
    '锦瑟','无题','夜雨寄北','嫦娥','登乐游原',
    '清明','山行','泊秦淮','江南春','赤壁',
    '茅屋为秋风所破歌','石壕吏','新安吏','潼关吏',
    '白雪歌送武判官归京','逢入京使','走马川行',
    '燕歌行','别董大',
    '咏怀古迹','秋兴','登楼','阁夜','旅夜书怀',
    '望洞庭湖赠张丞相','岁暮归南山','早寒江上有怀',
    '题西林壁','饮湖上初晴后雨','惠崇春江晚景','赠刘景文',
    '六月二十七日望湖楼醉书','春宵','和子由渑池怀旧',
    '示儿','游山西村','十一月四日风雨大作','书愤',
    '临安春雨初霁','冬夜读书','剑门道中遇微雨','沈园',
    '小池','晓出净慈寺送林子方','宿新市徐公店','舟过安仁',
    '春日','观书有感','泛舟',
    '四时田园杂兴','州桥','横塘',
    '水调歌头','念奴娇','江城子','定风波','蝶恋花','浣溪沙',
    '如梦令','声声慢','一剪梅','醉花阴','武陵春',
    '雨霖铃','八声甘州','望海潮','鹤冲天',
    '破阵子','踏莎行','玉楼春',
    '青玉案','摸鱼儿','丑奴儿','清平乐','西江月',
    '永遇乐','太常引','贺新郎','沁园春','南乡子',
    '满江红','小重山','诉衷情','卜算子','钗头凤',
    '苏幕遮','渔家傲','御街行',
    '扬州慢','暗香','疏影','点绛唇',
    '生查子','阮郎归','采桑子','浪淘沙','忆江南',
    '菩萨蛮','忆秦娥','调笑令','三字令',
    '凤栖梧','昼夜乐','忆帝京','凤箫吟',
    '卜算子','好事近','鹊桥仙','画堂春','减字木兰花'
];
console.log('著名诗词关键词数:', famousPoems.length);

function getFamousBonus(title, rhythmic) {
    const fullTitle = title + (rhythmic ? ' ' + rhythmic : '');
    for (const famous of famousPoems) {
        if (fullTitle.includes(famous)) return 500000000;
    }
    return 0;
}

console.log('=== 4. 加载原始数据 ===');
const tangAll = JSON.parse(fs.readFileSync('tang_all.json', 'utf8'));
const ciAll = JSON.parse(fs.readFileSync('ci_all.json', 'utf8'));
console.log('唐诗:', tangAll.length, ', 宋词:', ciAll.length);

console.log('=== 5. 繁简转换 + 排名 + 过滤 ===');
function processPoem(p, type, rankMap, useRhythmic) {
    const title = toS(p.title || p.rhythmic || '无题');
    const author = toS(p.author || '佚名');
    const rhythmic = toS(p.rhythmic || '');
    const paragraphs = (p.paragraphs || []).map(para => toS(para));
    const content = paragraphs.join('\n');

    const rankKey = (useRhythmic ? rhythmic : title) + '|' + author;
    const rankScore = rankMap.get(rankKey) || 0;
    const famousBonus = getFamousBonus(title, rhythmic);
    const totalScore = rankScore + famousBonus;

    return { title, author, rhythmic, paragraphs, content,
        rankScore: totalScore, hasFamousBonus: famousBonus > 0,
        dynasty: type === 'tang' ? '唐' : '宋', type: type === 'tang' ? '诗' : '词' };
}

const tangProcessed = tangAll.map(p => processPoem(p, 'tang', tangRankMap, false));
const ciProcessed = ciAll.map(p => processPoem(p, 'ci', ciRankMap, true));

// 过滤：标题过短(<=2字)且无著名加成的诗词降权
function dedupAndSort(poems, count) {
    const seen = new Set();
    let unique = [];
    for (const p of poems) {
        const key = p.title + '|' + p.author + '|' + p.content.substring(0, 30);
        if (seen.has(key)) continue;
        if (!p.content || p.content.length < 10) continue;
        seen.add(key);
        unique.push(p);
    }

    // 排序：著名加成优先，然后按排名分数
    unique.sort((a, b) => {
        if (a.hasFamousBonus && !b.hasFamousBonus) return -1;
        if (!a.hasFamousBonus && b.hasFamousBonus) return 1;
        return b.rankScore - a.rankScore;
    });

    // 选取前count首，但过滤掉标题过短(<=1字)且无加成的
    const result = [];
    const shortTitleReserve = [];
    for (const p of unique) {
        if (p.title.length <= 1 && !p.hasFamousBonus) {
            shortTitleReserve.push(p);
        } else {
            result.push(p);
        }
        if (result.length >= count) break;
    }
    // 如果不足，用短标题的补充
    if (result.length < count) {
        for (const p of shortTitleReserve) {
            result.push(p);
            if (result.length >= count) break;
        }
    }
    return result.slice(0, count);
}

const tangSorted = dedupAndSort(tangProcessed, 1000);
const ciSorted = dedupAndSort(ciProcessed, 1000);
console.log('选取唐诗:', tangSorted.length, ', 宋词:', ciSorted.length);
console.log('唐诗前10名:');
tangSorted.slice(0, 10).forEach((p, i) => console.log(`  ${i+1}. ${p.title} - ${p.author} (${p.hasFamousBonus?'★著名':''} 分数:${p.rankScore})`));
console.log('宋词前10名:');
ciSorted.slice(0, 10).forEach((p, i) => console.log(`  ${i+1}. ${p.title} - ${p.author} (${p.hasFamousBonus?'★著名':''} 分数:${p.rankScore})`));

console.log('=== 6. 分类 ===');
const categories = [
    {id: 1, name: '山水田园', keywords: ['山','水','田','园','林','溪','湖','江','野','村','池','泉','松','竹','亭','楼','岳','望','登','游','居','庄','夜','宿','泊','舟','渔','归','闲','幽','静','清','晓','晴','云','烟','月','风','花','草','木','径','桥','院','苔','峰','岭','石','崖','谷','涧','堤','岸']},
    {id: 2, name: '边塞军旅', keywords: ['塞','军','战','征','戍','将','兵','营','阵','弓','剑','马','旗','关','城','防','敌','胡','羌','凉','燕','从','出','使','烽','火','鼓','角','笛','鞍','鞭','雁','鹰','单于','可汗','长城','玉门','阳关','凉州']},
    {id: 3, name: '咏史怀古', keywords: ['史','古','故','昔','汉','秦','魏','吴','蜀','朝','兴','亡','怀','咏','叹','铜','台','陵','墓','碑','王','帝','侯','相','将','帅','宫','殿','庙','祠','功','名','英雄','豪杰','赤壁','乌江','金谷','马嵬','长信','秋兴','咏怀','古迹','怀古']},
    {id: 4, name: '离别送行', keywords: ['送','别','离','行','远','归','客','游','留','赠','寄','赴','迁','谪','贬','还','回','逢','遇','友','人','送人','别客','赠别','寄远','留别','送别','赴任','还乡','归家','回乡','远行','客游','留人']},
    {id: 5, name: '爱情闺怨', keywords: ['情','爱','思','念','怨','愁','泪','梦','闺','妆','红','翠','鸳','鸯','相思','恨','肠','心','郎','妾','珠','帘','屏','帐','枕','闺怨','长干','玉台','粉','黛','脂','罗','绮','纱','锦','绣']},
    {id: 6, name: '节令风俗', keywords: ['春','夏','秋','冬','寒','暑','节','风','雨','雪','月','日','夜','旦','朝','夕','岁','年','时','七夕','中秋','重阳','端午','清明','元宵','除夕','正月','腊月','冬至','立春','花朝','上巳','中元','春日','春晓','春夜','春宵','秋日','秋夜','冬夜','寒食','除夜','元日','岁除','腊日','社日']},
    {id: 7, name: '咏物言志', keywords: ['咏','题','物','花','鸟','鱼','虫','树','草','石','竹','梅','兰','菊','荷','莲','桃','李','杏','柳','桂','枫','蜂','蝶','鹤','鹰','燕','雁','莺','蝉','萤','蛙','蛇','龟','蟹','虾','咏鹅','咏柳','咏梅','咏菊','咏荷','咏兰','咏竹','咏石','咏剑','咏镜','咏琴']},
    {id: 8, name: '叙事抒怀', keywords: ['感','怀','叹','悲','喜','怒','哀','乐','忧','思','忆','念','书','读','学','述','记','叙','事','传','录','行','状','序','跋','杂','说','解','释','注','评','感遇','感怀','遣怀','书事','读书','学书','述怀','记事','叙事','杂诗','偶书','偶感','漫成','漫兴','遣兴']},
    {id: 9, name: '禅理悟道', keywords: ['禅','道','佛','僧','寺','庵','空','无','悟','心','静','远','玄','真','虚','幻','尘','世','缘','觉','观','照','见','性','偈','颂','赞','铭','戒','律','宗','门','空门','禅院','佛寺','僧房','道观','悟道','见性','观心','照见','无相','无念','无住','无为','无我','空寂','虚静','玄妙','真如','佛性','禅心','道心']},
    {id: 10, name: '题画写意', keywords: ['画','图','墨','笔','书','写','描','绘','丹','青','卷','幅','屏','障','扇','壁','观','赏','题画','题图','墨竹','墨梅','墨兰','墨菊','画鹰','画马','画鹤','画山水','丹青','水墨','工笔','写意','白描','题扇','题屏','题壁','题柱','题额','题跋','题款','题印']}
];

function classifyPoem(title, paragraphs) {
    const text = title + (paragraphs ? paragraphs.join('') : '');
    const scores = categories.map(cat => {
        let s = 0; for (const kw of cat.keywords) if (text.includes(kw)) s++;
        return {id: cat.id, score: s};
    });
    scores.sort((a, b) => b.score - a.score);
    return scores[0].score > 0 ? scores[0].id : (Math.floor(Math.random() * 10) + 1);
}

console.log('=== 7. 类别分配 + 作者多样性 ===');
function interleaveByAuthor(poems) {
    const byAuthor = {};
    for (const p of poems) { if (!byAuthor[p.author]) byAuthor[p.author] = []; byAuthor[p.author].push(p); }
    const groups = Object.values(byAuthor).sort((a, b) => b.length - a.length);
    const total = poems.length;
    const result = new Array(total).fill(null);
    const used = new Array(total).fill(false);
    for (const group of groups) {
        const emptyPos = [];
        for (let i = 0; i < total; i++) if (!used[i]) emptyPos.push(i);
        const step = emptyPos.length / group.length;
        for (let i = 0; i < group.length; i++) {
            let idx = Math.min(Math.floor(i * step), emptyPos.length - 1);
            result[emptyPos[idx]] = group[i]; used[emptyPos[idx]] = true;
            emptyPos.splice(idx, 1);
        }
    }
    return result.filter(p => p !== null);
}

function assignAndShuffle(poems, typePrefix) {
    for (const p of poems) p.category = classifyPoem(p.title, p.paragraphs);
    const byCat = {};
    for (const p of poems) { if (!byCat[p.category]) byCat[p.category] = []; byCat[p.category].push(p); }
    const result = [], seen = new Set();
    for (const catId of Object.keys(byCat)) {
        const catPoems = byCat[catId].sort((a, b) => b.rankScore - a.rankScore);
        const shuffled = interleaveByAuthor(catPoems);
        for (const p of shuffled) {
            const key = p.title + '|' + p.author + '|' + p.content.substring(0, 30);
            if (seen.has(key)) continue; seen.add(key);
            result.push({
                id: typePrefix + '_' + String(result.length).padStart(4, '0'),
                title: p.title, author: p.author, dynasty: p.dynasty, type: p.type,
                rhythmic: p.rhythmic, content: p.content, paragraphs: p.paragraphs,
                category: p.category, rankScore: p.rankScore,
                likes: Math.min(9999, Math.floor(Math.sqrt(p.rankScore) / 10) + 100)
            });
        }
    }
    return result;
}

const tangFinal = assignAndShuffle(tangSorted, 'tang');
const ciFinal = assignAndShuffle(ciSorted, 'ci');
const allPoems = [...tangFinal, ...ciFinal];
console.log('总计:', allPoems.length, '首 (诗', tangFinal.length, '+ 词', ciFinal.length, ')');

const catCount = {};
for (const p of allPoems) catCount[p.category] = (catCount[p.category] || 0) + 1;
console.log('\n各类别分布:');
categories.forEach(cat => console.log(`  ${cat.id}. ${cat.name}: ${catCount[cat.id] || 0}首`));

console.log('\n=== 8. 验证 ===');
for (const catId of [1, 2, 5, 6]) {
    const catPoems = allPoems.filter(p => p.category === catId).slice(0, 10);
    const authors = catPoems.map(p => p.author);
    const uniqueA = new Set(authors).size;
    let consec = 0;
    for (let i = 1; i < authors.length; i++) if (authors[i] === authors[i-1]) consec++;
    console.log(`类别${catId}前10首: ${uniqueA}位作者, 连续相同:${consec}`);
    console.log(`  ${catPoems.map(p => `${p.title}(${p.author})`).join(' → ')}`);
}

// 验证著名诗词
console.log('\n=== 著名诗词在数据中 ===');
const checkFamous = ['静夜思','将进酒','蜀道难','咏鹅','春晓','回乡偶书','山居秋暝','水调歌头','如梦令','声声慢','满江红','念奴娇'];
for (const t of checkFamous) {
    const found = allPoems.find(p => p.title.includes(t) || p.rhythmic.includes(t));
    if (found) console.log(`  ✓ ${t} -> ${found.title} - ${found.author} (类别${found.category})`);
}

// 验证繁简
let tradCount = 0;
for (const p of allPoems) {
    for (const ch of p.content) if (t2s.has(ch) && t2s.get(ch) !== ch) { tradCount++; break; }
}
console.log(`\n仍含繁体字: ${tradCount}/${allPoems.length}`);

const catInfo = categories.map(c => ({id: c.id, name: c.name, count: catCount[c.id] || 0}));
fs.writeFileSync('all_poems.json', JSON.stringify(allPoems));
fs.writeFileSync('categories.json', JSON.stringify(catInfo));
console.log('\n=== 数据已保存 ===');
