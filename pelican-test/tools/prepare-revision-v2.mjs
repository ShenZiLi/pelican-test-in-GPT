import fs from 'node:fs/promises';
import path from 'node:path';
const audit=await fs.readFile('docs/creative-audit-2026-10-25.md','utf8');
const sections=[...audit.matchAll(/^### (\d{2}) ([^\n]+)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)];
const files=await fs.readdir('briefs');
for(const [,id,heading,body] of sections){const file=files.find(f=>f.startsWith(id+'-'));if(!file)throw Error(id);
 const target=path.join('briefs',file),old=(await fs.readFile(target,'utf8')).split('\n## V2 创意重制')[0];
 const lines=body.split('\n').filter(l=>l.startsWith('- **'));
 await fs.writeFile(target,`${old.trim()}\n\n## V2 创意重制\n\n${heading}\n\n${lines.join('\n\n')}\n\n实际目标画幅1920×840，画中正方形1000单位，以最终600像素展示检查笔触、表情、道具和标题。0.5、2.5、5.5秒关键帧用于验证布局，不以代码通过替代实际画面。\n`);
}
await fs.mkdir('exports/revision-v2',{recursive:true});
const evidence=JSON.parse(await fs.readFile('exports/creative-audit/evidence.json','utf8'));
await fs.writeFile('exports/revision-v2/baseline.json',JSON.stringify({source:evidence.movie,sha256:evidence.sha256,evidence:'exports/creative-audit/evidence.json',preserved:true,createdAt:new Date().toISOString()},null,2));
await fs.writeFile('docs/art-direction-v2.md',`# 《鹈鹕测试》V2美术执行标准\n\n目标：1920×840、60fps、137秒，画廊保持多幅同屏。画框600×600像素，顶部50像素，标题位于画框下53/83/112像素。黑白大关系先于细节，关键事件有0.5–1秒阅读时间。\n\n五种水墨：汉拓片用黑底石刻和缺墨；唐白描用提按长线；宋山水用岩骨、皴擦、积墨与云气；清明上河图用界画、桥构和淡彩生活；八大写意用大留白与少笔枯润。统一工具不等于统一滤镜。\n\n主体与背景应共享材质。重要轮廓在成片中约1.5–3像素，表情和孔洞需要正常观看可读。完整车舆、金色四边框、棕榈树、屏内鸟和片尾台词必须落在可见安全区。\n\n源时间保持120BPM；皮影10Hz、GIF8Hz、像素12Hz内部动作，外层镜头60fps。局部媒介拥有裁切区，正常画面不穿仪器外壳、消息框、黑边和代码栏。合法穿框需要显式短交接。\n\n采用实际渲染的0.5/2.5/5.5秒关键帧作为可评审构图样片，优先于抽象占位草图；所有画面证据必须标明修改前或修改后。每阶段记录未通过项，并在修复后复验。\n\n原成片与174帧基线记录在exports/revision-v2/baseline.json，源媒体保留不覆盖。\n`);
console.log(`Updated ${sections.length} briefs and preserved the baseline.`);
