import test from 'node:test';
import assert from 'node:assert/strict';
import {blankIdea,normalizeIdea,ideaProgress,ensureTasks,ideaSource,tasksStale,ideaBrief,ideaPrompt,projectSeed,ideaHTML} from '../web/idea.mjs';

test('只有一句想法也可以得到可编辑的行动草案，不产生软件需求',()=>{
 const d=ensureTasks({...blankIdea(),thought:'整理家人的菜谱',direction:'create'});
 assert.equal(d.tasks.length,3);
 assert.ok(d.tasks[1].text.includes('小样'));
 assert.ok(ideaBrief(d).includes('不是模型分析'));
 assert.ok(ideaPrompt(d).includes('不默认要开发软件'));
 assert.deepEqual(projectSeed(d),{goal:'整理家人的菜谱',acceptance:'',constraints:'',notes:''});
});
test('每步进度按同一份字段定义计算，选填不阻止整理',()=>{
 const d={...blankIdea(),thought:'菜谱',who:'家人'};
 assert.deepEqual(ideaProgress(d,0),{filled:2,total:3});
 assert.deepEqual(ideaProgress(d,1),{filled:0,total:4});
 assert.ok(!ideaHTML(d,1).includes('required aria-required'));
});
test('修改想法不抹掉已编辑或完成的行动，导出标记旧行动',()=>{
 const d=ensureTasks({...blankIdea(),thought:'菜谱'});
 d.tasks[0].text='先问妈妈要三道菜';d.tasks[0].done=true;d.feedback='太多了，先一道';
 d.thought='只写一道菜';ensureTasks(d);
 assert.equal(d.tasks[0].text,'先问妈妈要三道菜');assert.equal(d.tasks[0].done,true);
 assert.equal(tasksStale(d),true);
 assert.ok(ideaBrief(d).includes('先前版本'));assert.ok(ideaBrief(d).includes('[x] 先问妈妈'));
});
test('JSON往返保留行动、勾选、反馈和输入版本，老草稿兼容',()=>{
 const d=ensureTasks({...blankIdea(),thought:'减少浪费',direction:'life',feedback:'有效'});
 d.tasks[1].done=true;
 assert.deepEqual(normalizeIdea(JSON.parse(JSON.stringify(d))),d);
 assert.deepEqual(normalizeIdea(undefined),blankIdea());
 assert.equal(normalizeIdea({direction:'bad',thought:5,tasks:[null,{text:'任务',done:'true'}]}).tasks[0].done,false);
});
test('转为项目仅携带用户填写的决定，技术与交付目标保持未定',()=>{
 const d={...blankIdea(),thought:'帮家人备菜',who:'家人',success:'一周少浪费两份食材',firstTry:'先用清单',resources:'零预算',time:'evening',feedback:'试过一次'};
 const seed=projectSeed(d);
 assert.equal(seed.acceptance,d.success);assert.equal(seed.constraints,d.resources);
 assert.ok(seed.notes.includes('先用清单'));assert.ok(seed.notes.includes('一个晚上'));
 assert.equal(seed.types,undefined);assert.equal(seed.depth,undefined);
});
test('文本与导入内容在页面上转义，不变成标记或脚本',()=>{
 const d=ensureTasks({...blankIdea(),thought:'<img src=x onerror=alert(1)>',who:'</textarea><script>x</script>',feedback:'<script>bad</script>'});
 const html=ideaHTML(d,2);
 assert.ok(!html.includes('<script>'));assert.ok(!html.includes('<img src=x'));
 assert.ok(html.includes('&lt;img'));assert.ok(html.includes('&lt;script&gt;bad'));
 assert.equal(d.taskSource,ideaSource(d));
});
test('最长合法输入的行动不会在保存后被截断，原想法完整导出',()=>{
 const d=ensureTasks({...blankIdea(),thought:'想'.repeat(2000),who:'人'.repeat(500),firstTry:'试'.repeat(1000),success:'好'.repeat(1000),time:'evening'});
 assert.deepEqual(normalizeIdea(d).tasks,d.tasks);
 assert.ok(ideaBrief(d).includes('想'.repeat(2000)));
});
