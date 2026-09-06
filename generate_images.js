const fs = require('fs');
const path = require('path');
const outputDir = path.join(__dirname, 'static', 'images');

function svg(content, w = 800, h = 500) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
    <linearGradient id="paper" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#F7F3ED"/>
        <stop offset="100%" style="stop-color:#EDE6DB"/>
    </linearGradient>
    <filter id="ink"><feGaussianBlur stdDeviation="0.5"/></filter>
    <filter id="wash"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="wash2"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
<rect width="100%" height="100%" fill="url(#paper)"/>
${content}
</svg>`;
}

const ink = '#2C2C2C';
const lightInk = '#5A5A5A';
const paleInk = '#9A9A9A';
const veryPale = '#C8C8C8';

const categories = {

1: `
    <path d="M0,320 Q100,280 180,300 Q260,260 340,290 Q420,250 500,280 Q580,260 660,290 Q740,270 800,300 L800,500 L0,500 Z" fill="${veryPale}" opacity="0.5" filter="url(#wash2)"/>
    <path d="M0,360 Q80,320 160,340 Q240,300 320,340 Q400,310 480,350 Q560,320 640,360 Q720,330 800,360 L800,500 L0,500 Z" fill="${paleInk}" opacity="0.35" filter="url(#wash)"/>
    <path d="M0,400 Q60,380 120,400 Q200,370 280,400 Q360,380 440,410 Q520,390 600,420 Q680,400 760,430 L800,430 L800,500 L0,500 Z" fill="${lightInk}" opacity="0.25" filter="url(#wash)"/>
    <path d="M120,340 L140,280 L155,320 L170,270 L185,330 L200,290" stroke="${ink}" stroke-width="2" fill="none" filter="url(#ink)"/>
    <path d="M500,330 L520,270 L535,310 L550,260 L565,320 L580,280" stroke="${ink}" stroke-width="2" fill="none" filter="url(#ink)"/>
    <ellipse cx="400" cy="420" rx="30" ry="5" fill="${ink}" opacity="0.3" filter="url(#wash)"/>
    <path d="M400,420 L395,380 L405,380 L400,420" stroke="${ink}" stroke-width="1.5" fill="none"/>
    <path d="M395,380 Q380,375 370,370" stroke="${ink}" stroke-width="1" fill="none"/>
    <path d="M405,380 Q420,375 430,370" stroke="${ink}" stroke-width="1" fill="none"/>
    <circle cx="650" cy="120" r="35" fill="${veryPale}" opacity="0.4" filter="url(#wash)"/>
`,

2: `
    <path d="M0,350 Q200,330 400,360 Q600,340 800,370 L800,500 L0,500 Z" fill="${paleInk}" opacity="0.2" filter="url(#wash2)"/>
    <rect x="280" y="200" width="240" height="200" fill="${ink}" opacity="0.15" filter="url(#wash)"/>
    <rect x="280" y="200" width="240" height="12" fill="${ink}" opacity="0.3"/>
    <rect x="290" y="170" width="15" height="40" fill="${ink}" opacity="0.25"/>
    <rect x="495" y="170" width="15" height="40" fill="${ink}" opacity="0.25"/>
    <rect x="380" y="140" width="40" height="70" fill="${ink}" opacity="0.2"/>
    <path d="M380,140 L420,140 L410,120 L390,120 Z" fill="${ink}" opacity="0.3"/>
    <path d="M380,140 Q370,130 375,115" stroke="${ink}" stroke-width="1.5" fill="none"/>
    <path d="M420,140 Q430,130 425,115" stroke="${ink}" stroke-width="1.5" fill="none"/>
    <path d="M100,250 L120,240 L140,255 L160,245 L180,260" stroke="${paleInk}" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M600,260 L620,250 L640,265 L660,255 L680,270" stroke="${paleInk}" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M0,420 Q200,410 400,425 Q600,415 800,430 L800,500 L0,500 Z" fill="${lightInk}" opacity="0.15" filter="url(#wash)"/>
    <circle cx="120" cy="100" r="30" fill="${veryPale}" opacity="0.35" filter="url(#wash)"/>
`,

3: `
    <path d="M0,380 Q200,370 400,390 Q600,375 800,395 L800,500 L0,500 Z" fill="${paleInk}" opacity="0.15" filter="url(#wash2)"/>
    <rect x="250" y="180" width="300" height="220" fill="${ink}" opacity="0.12" filter="url(#wash)"/>
    <rect x="250" y="180" width="300" height="8" fill="${ink}" opacity="0.25"/>
    <rect x="270" y="200" width="260" height="190" fill="none" stroke="${lightInk}" stroke-width="1.5" opacity="0.3"/>
    <rect x="350" y="150" width="100" height="40" fill="${ink}" opacity="0.2"/>
    <path d="M350,150 Q360,140 370,150 Q380,140 390,150 Q400,140 410,150 Q420,140 430,150 Q440,140 450,150" stroke="${ink}" stroke-width="2" fill="none" opacity="0.3"/>
    <rect x="370" y="165" width="60" height="20" fill="${ink}" opacity="0.15"/>
    <rect x="300" y="400" width="200" height="15" fill="${ink}" opacity="0.2"/>
    <circle cx="400" cy="100" r="40" fill="none" stroke="${paleInk}" stroke-width="2" opacity="0.3" filter="url(#wash)"/>
    <circle cx="400" cy="100" r="25" fill="none" stroke="${paleInk}" stroke-width="1.5" opacity="0.2"/>
`,

4: `
    <path d="M0,400 Q200,390 400,410 Q600,395 800,415 L800,500 L0,500 Z" fill="${paleInk}" opacity="0.15" filter="url(#wash2)"/>
    <rect x="150" y="280" width="12" height="130" fill="${ink}" opacity="0.2"/>
    <path d="M156,280 Q140,260 145,240 Q160,250 156,280" fill="${lightInk}" opacity="0.3" filter="url(#wash)"/>
    <path d="M156,290 Q135,270 140,250 Q165,265 156,290" fill="${lightInk}" opacity="0.25" filter="url(#wash)"/>
    <path d="M156,300 Q145,285 150,270" stroke="${lightInk}" stroke-width="1.5" fill="none" opacity="0.3"/>
    <rect x="600" y="270" width="12" height="140" fill="${ink}" opacity="0.2"/>
    <path d="M606,270 Q590,250 595,230 Q610,240 606,270" fill="${lightInk}" opacity="0.3" filter="url(#wash)"/>
    <path d="M606,280 Q585,260 590,240 Q615,255 606,280" fill="${lightInk}" opacity="0.25" filter="url(#wash)"/>
    <path d="M0,420 Q150,410 300,420 Q450,415 600,425 Q700,420 800,425" stroke="${paleInk}" stroke-width="1" fill="none" opacity="0.3"/>
    <path d="M0,440 Q150,435 300,440 Q450,438 600,442 Q700,440 800,442" stroke="${paleInk}" stroke-width="0.8" fill="none" opacity="0.2"/>
    <path d="M700,350 L730,340 L740,360 L735,390 L725,395 L715,380 L710,360 Z" fill="${ink}" opacity="0.15" filter="url(#wash)"/>
    <path d="M725,395 L720,420" stroke="${ink}" stroke-width="1" opacity="0.2"/>
`,

5: `
    <path d="M0,380 Q200,370 400,390 Q600,375 800,395 L800,500 L0,500 Z" fill="${paleInk}" opacity="0.1" filter="url(#wash2)"/>
    <rect x="200" y="150" width="400" height="250" fill="none" stroke="${lightInk}" stroke-width="2" opacity="0.2"/>
    <path d="M200,150 Q210,140 220,150 Q230,140 240,150 Q250,140 260,150 Q270,140 280,150 Q290,140 300,150" stroke="${ink}" stroke-width="2" fill="none" opacity="0.25"/>
    <path d="M500,150 Q510,140 520,150 Q530,140 540,150 Q550,140 560,150 Q570,140 580,150 Q590,140 600,150" stroke="${ink}" stroke-width="2" fill="none" opacity="0.25"/>
    <path d="M200,400 Q210,410 220,400 Q230,410 240,400 Q250,410 260,400 Q270,410 280,400 Q290,410 300,400" stroke="${ink}" stroke-width="2" fill="none" opacity="0.25"/>
    <path d="M500,400 Q510,410 520,400 Q530,410 540,400 Q550,410 560,400 Q570,410 580,400 Q590,410 600,400" stroke="${ink}" stroke-width="2" fill="none" opacity="0.25"/>
    <path d="M300,200 Q280,220 290,260 Q310,280 320,250 Q330,220 300,200" fill="${ink}" opacity="0.08" filter="url(#wash)"/>
    <path d="M500,220 Q480,240 490,280 Q510,300 520,270 Q530,240 500,220" fill="${ink}" opacity="0.08" filter="url(#wash)"/>
    <circle cx="350" cy="320" r="4" fill="${ink}" opacity="0.15"/>
    <circle cx="450" cy="340" r="3" fill="${ink}" opacity="0.12"/>
    <circle cx="400" cy="360" r="5" fill="${ink}" opacity="0.1"/>
    <circle cx="380" cy="380" r="3" fill="${ink}" opacity="0.08"/>
    <circle cx="480" cy="370" r="4" fill="${ink}" opacity="0.1"/>
`,

6: `
    <circle cx="400" cy="200" r="80" fill="${veryPale}" opacity="0.3" filter="url(#wash2)"/>
    <circle cx="400" cy="200" r="60" fill="${paleInk}" opacity="0.15" filter="url(#wash)"/>
    <path d="M320,200 Q350,180 380,200 Q400,190 420,200 Q450,180 480,200" stroke="${lightInk}" stroke-width="1" fill="none" opacity="0.2"/>
    <path d="M200,350 Q220,340 240,350 Q260,340 280,350" stroke="${ink}" stroke-width="1.5" fill="none" opacity="0.2"/>
    <path d="M210,350 L210,330 M230,350 L230,320 M250,350 L250,325" stroke="${ink}" stroke-width="1" opacity="0.15"/>
    <path d="M520,350 Q540,340 560,350 Q580,340 600,350" stroke="${ink}" stroke-width="1.5" fill="none" opacity="0.2"/>
    <path d="M530,350 L530,325 M550,350 L550,315 M570,350 L570,320" stroke="${ink}" stroke-width="1" opacity="0.15"/>
    <path d="M300,380 Q350,370 400,380 Q450,370 500,380" stroke="${paleInk}" stroke-width="1" fill="none" opacity="0.15"/>
    <path d="M100,150 Q120,130 140,150 Q160,130 180,150" stroke="${lightInk}" stroke-width="1" fill="none" opacity="0.2"/>
    <path d="M110,150 L110,135 M130,150 L130,130 M150,150 L150,138 M170,150 L170,132" stroke="${lightInk}" stroke-width="0.8" opacity="0.15"/>
    <path d="M620,150 Q640,130 660,150 Q680,130 700,150" stroke="${lightInk}" stroke-width="1" fill="none" opacity="0.2"/>
    <path d="M630,150 L630,135 M650,150 L650,130 M670,150 L670,138 M690,150 L690,132" stroke="${lightInk}" stroke-width="0.8" opacity="0.15"/>
`,

7: `
    <path d="M300,420 Q300,350 310,280 Q320,220 330,170 Q340,130 350,100" stroke="${ink}" stroke-width="3" fill="none" filter="url(#ink)"/>
    <path d="M310,280 Q280,260 260,230" stroke="${ink}" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M260,230 Q250,220 240,200" stroke="${ink}" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M330,170 Q360,150 380,120" stroke="${ink}" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M380,120 Q390,110 400,95" stroke="${ink}" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M340,130 Q310,110 290,85" stroke="${ink}" stroke-width="1.5" fill="none" opacity="0.6"/>
    <ellipse cx="255" cy="225" rx="12" ry="4" fill="${ink}" opacity="0.2" transform="rotate(-30 255 225)"/>
    <ellipse cx="375" cy="115" rx="12" ry="4" fill="${ink}" opacity="0.2" transform="rotate(30 375 115)"/>
    <ellipse cx="295" cy="80" rx="10" ry="3" fill="${ink}" opacity="0.15" transform="rotate(-40 295 80)"/>
    <circle cx="550" cy="180" r="25" fill="none" stroke="${ink}" stroke-width="2" opacity="0.3" filter="url(#wash)"/>
    <circle cx="550" cy="180" r="15" fill="${ink}" opacity="0.1" filter="url(#wash)"/>
    <path d="M550,155 Q545,150 550,145 Q555,150 550,155" fill="${ink}" opacity="0.2"/>
    <path d="M0,430 Q200,420 400,435 Q600,425 800,440 L800,500 L0,500 Z" fill="${paleInk}" opacity="0.1" filter="url(#wash2)"/>
`,

8: `
    <rect x="250" y="120" width="300" height="280" fill="${veryPale}" opacity="0.3" filter="url(#wash)"/>
    <rect x="250" y="120" width="300" height="280" fill="none" stroke="${ink}" stroke-width="2" opacity="0.2"/>
    <line x1="270" y1="150" x2="530" y2="150" stroke="${lightInk}" stroke-width="1" opacity="0.15"/>
    <line x1="270" y1="180" x2="530" y2="180" stroke="${lightInk}" stroke-width="1" opacity="0.15"/>
    <line x1="270" y1="210" x2="530" y2="210" stroke="${lightInk}" stroke-width="1" opacity="0.15"/>
    <line x1="270" y1="240" x2="530" y2="240" stroke="${lightInk}" stroke-width="1" opacity="0.15"/>
    <line x1="270" y1="270" x2="530" y2="270" stroke="${lightInk}" stroke-width="1" opacity="0.15"/>
    <line x1="270" y1="300" x2="530" y2="300" stroke="${lightInk}" stroke-width="1" opacity="0.15"/>
    <line x1="270" y1="330" x2="530" y2="330" stroke="${lightInk}" stroke-width="1" opacity="0.15"/>
    <line x1="270" y1="360" x2="530" y2="360" stroke="${lightInk}" stroke-width="1" opacity="0.15"/>
    <rect x="240" y="110" width="320" height="15" fill="${ink}" opacity="0.12" rx="2"/>
    <rect x="240" y="395" width="320" height="15" fill="${ink}" opacity="0.12" rx="2"/>
    <rect x="580" y="130" width="6" height="250" fill="${ink}" opacity="0.3"/>
    <rect x="575" y="125" width="16" height="12" fill="${ink}" opacity="0.35"/>
    <path d="M583,380 L578,395 L588,395 Z" fill="${ink}" opacity="0.3"/>
    <path d="M540,200 Q560,180 570,200" stroke="${ink}" stroke-width="1.5" fill="none" opacity="0.15"/>
`,

9: `
    <circle cx="400" cy="230" r="130" fill="none" stroke="${ink}" stroke-width="2.5" opacity="0.15" filter="url(#wash)"/>
    <circle cx="400" cy="230" r="95" fill="none" stroke="${ink}" stroke-width="2" opacity="0.2" filter="url(#wash)"/>
    <circle cx="400" cy="230" r="60" fill="none" stroke="${ink}" stroke-width="1.5" opacity="0.25"/>
    <circle cx="400" cy="230" r="30" fill="${ink}" opacity="0.05"/>
    <path d="M400,100 Q420,160 400,230 Q380,300 400,360" stroke="${lightInk}" stroke-width="1.5" fill="none" opacity="0.15"/>
    <path d="M270,230 Q340,210 400,230 Q460,250 530,230" stroke="${lightInk}" stroke-width="1.5" fill="none" opacity="0.15"/>
    <path d="M300,170 Q350,200 400,170 Q450,140 500,170" stroke="${paleInk}" stroke-width="1" fill="none" opacity="0.1"/>
    <path d="M300,290 Q350,260 400,290 Q450,320 500,290" stroke="${paleInk}" stroke-width="1" fill="none" opacity="0.1"/>
    <circle cx="400" cy="230" r="4" fill="${ink}" opacity="0.3"/>
    <path d="M0,420 Q200,410 400,425 Q600,415 800,430 L800,500 L0,500 Z" fill="${paleInk}" opacity="0.08" filter="url(#wash2)"/>
`,

10: `
    <rect x="180" y="100" width="440" height="320" fill="${veryPale}" opacity="0.2" filter="url(#wash)"/>
    <rect x="180" y="100" width="440" height="320" fill="none" stroke="${ink}" stroke-width="2.5" opacity="0.15"/>
    <path d="M200,380 Q280,340 360,310 Q440,280 520,250 Q560,235 590,220" stroke="${ink}" stroke-width="3" fill="none" opacity="0.3" filter="url(#ink)"/>
    <path d="M200,400 Q280,370 380,360 Q480,350 590,340" stroke="${ink}" stroke-width="2" fill="none" opacity="0.2" filter="url(#wash)"/>
    <path d="M220,360 Q260,340 300,350" stroke="${lightInk}" stroke-width="1.5" fill="none" opacity="0.15"/>
    <circle cx="500" cy="180" r="30" fill="none" stroke="${ink}" stroke-width="2" opacity="0.2" filter="url(#wash)"/>
    <circle cx="500" cy="180" r="18" fill="${ink}" opacity="0.08" filter="url(#wash)"/>
    <rect x="620" y="120" width="8" height="280" fill="${ink}" opacity="0.25"/>
    <rect x="614" y="115" width="20" height="15" fill="${ink}" opacity="0.3"/>
    <path d="M624,400 L619,415 L629,415 Z" fill="${ink}" opacity="0.25"/>
    <path d="M590,220 Q600,210 610,200" stroke="${ink}" stroke-width="2" fill="none" opacity="0.2"/>
    <path d="M300,250 Q320,230 340,240" stroke="${paleInk}" stroke-width="1" fill="none" opacity="0.1"/>
`

};

for (const [id, content] of Object.entries(categories)) {
    const filePath = path.join(outputDir, `category_${id}.svg`);
    fs.writeFileSync(filePath, svg(content));
    console.log(`生成: category_${id}.svg`);
}
console.log('\n所有水墨画风格图片已生成');
