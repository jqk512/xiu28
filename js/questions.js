/* 每题 id 必须唯一；选项顺序可自由调整。scores 可同时给多个属性加权。
   四象：qinglong / xuanwu / baihu / zhuque
   七曜：wood / fire / earth / metal / water / sun / moon
   分值使用非负有限数字。题目数由程序读取，无需另外修改进度条。 */
window.XIU_QUESTIONS = [
  { id: 'q01', category: '开启一段未知', text: '周末突然空了出来，你更想把时间交给什么？', hint: '不用选理想中的自己，选更常发生的那一个。', options: [
    { text: '去一个没去过的地方，看看会遇到什么。', scores: { qinglong: 3, wood: 2, water: 1 } },
    { text: '回到熟悉的角落，把喜欢的事慢慢做完。', scores: { xuanwu: 3, earth: 2, moon: 1 } },
    { text: '约上朋友，给平常的一天加一点热闹。', scores: { zhuque: 3, sun: 2, fire: 1 } },
    { text: '完成一个搁置的挑战，看看自己能走多远。', scores: { baihu: 3, fire: 2, metal: 1 } }
  ] },
  { id: 'q02', category: '你与新的想法', text: '朋友带来一个有点疯狂的点子，你的第一反应是？', options: [
    { text: '先问清楚目标和值不值得做。', scores: { baihu: 3, metal: 2, sun: 1 } },
    { text: '它会让谁开心？想一起把体验做得有趣。', scores: { zhuque: 3, fire: 2, water: 1 } },
    { text: '先做个小实验，说不定真能成。', scores: { qinglong: 3, wood: 2, fire: 1 } },
    { text: '找些资料，理解它为什么可能成立。', scores: { xuanwu: 3, moon: 2, wood: 1 } }
  ] },
  { id: 'q03', category: '身处人群', text: '走进一个大多是陌生人的聚会，你通常会？', options: [
    { text: '先观察，找到一个舒服的位置。', scores: { xuanwu: 3, moon: 2, earth: 1 } },
    { text: '主动聊两句，让大家放松下来。', scores: { zhuque: 3, sun: 2, water: 1 } },
    { text: '找到感兴趣的人，聊一个新鲜话题。', scores: { qinglong: 3, water: 2, wood: 1 } },
    { text: '有话题就认真聊，不勉强自己融入。', scores: { baihu: 3, metal: 2, moon: 1 } }
  ] },
  { id: 'q04', category: '计划的另一面', text: '期待很久的出行临时被打乱，你会怎么接住它？', options: [
    { text: '换条路线，也许会发现更有意思的地方。', scores: { qinglong: 3, water: 2, fire: 1 } },
    { text: '先照顾同行人的情绪，再一起决定。', scores: { zhuque: 3, moon: 2, earth: 1 } },
    { text: '迅速筛选替代方案，把主动权拿回来。', scores: { baihu: 3, sun: 2, metal: 1 } },
    { text: '确认哪些安排还可靠，稳住基本节奏。', scores: { xuanwu: 3, earth: 2, metal: 1 } }
  ] },
  { id: 'q05', category: '让你投入的事', text: '一件事让你愿意长期投入，最常见的原因是？', options: [
    { text: '它能让人与人产生真切的共鸣。', scores: { zhuque: 3, moon: 2, sun: 1 } },
    { text: '它值得慢慢积累，越来越有深度。', scores: { xuanwu: 3, wood: 2, earth: 1 } },
    { text: '它始终有未知，让我持续变得不一样。', scores: { qinglong: 3, wood: 2, water: 1 } },
    { text: '它有挑战，我想把它做到自己的标准。', scores: { baihu: 3, metal: 2, fire: 1 } }
  ] },
  { id: 'q06', category: '分歧发生时', text: '小组对下一步意见不一，你更自然的做法是？', options: [
    { text: '把问题和标准摆出来，推动做出决定。', scores: { baihu: 3, sun: 2, metal: 1 } },
    { text: '听听没被说出的顾虑，别急着定论。', scores: { xuanwu: 3, moon: 2, water: 1 } },
    { text: '想一个能兼容不同想法的新方案。', scores: { qinglong: 3, water: 2, wood: 1 } },
    { text: '帮大家把话说开，让沟通重新流动。', scores: { zhuque: 3, sun: 2, earth: 1 } }
  ] },
  { id: 'q07', category: '靠近一段关系', text: '你最容易因为什么，对一个人产生信任？', options: [
    { text: '相处时能真实表达，情绪有回应。', scores: { zhuque: 3, moon: 2, fire: 1 } },
    { text: '彼此保有主见，重要时刻敢站在一起。', scores: { baihu: 3, metal: 2, sun: 1 } },
    { text: '说过的话有着落，小事也能看见用心。', scores: { xuanwu: 3, earth: 2, metal: 1 } },
    { text: '愿意一起试新事物，尊重各自的成长。', scores: { qinglong: 3, wood: 2, water: 1 } }
  ] },
  { id: 'q08', category: '自己的位置', text: '共同完成一件事后，哪句话最让你觉得被看见？', options: [
    { text: '“有你在，事情就稳稳地落下来了。”', scores: { xuanwu: 3, earth: 2, sun: 1 } },
    { text: '“你让我们看到了以前没想到的可能。”', scores: { qinglong: 3, wood: 2, moon: 1 } },
    { text: '“关键时刻，你真的敢做决定。”', scores: { baihu: 3, fire: 2, metal: 1 } },
    { text: '“你让这件事有了温度和记忆点。”', scores: { zhuque: 3, sun: 2, moon: 1 } }
  ] },
  { id: 'q09', category: '你的启动方式', text: '面对一个全新的任务，你通常从哪里开始？', options: [
    { text: '先查原理，边学习边搭一个小版本。', scores: { xuanwu: 2, qinglong: 1, wood: 3 } },
    { text: '立刻动手，做起来才知道缺什么。', scores: { baihu: 2, zhuque: 1, fire: 3 } },
    { text: '先列出步骤和时间，安排可执行的节奏。', scores: { qinglong: 2, xuanwu: 1, earth: 3 } },
    { text: '先确认什么才算做好，再确定方向。', scores: { zhuque: 2, baihu: 1, metal: 3 } }
  ] },
  { id: 'q10', category: '面对不确定', text: '信息还不充分，但需要做选择时，你更依赖？', options: [
    { text: '现场反馈，先留一个可以调整的出口。', scores: { baihu: 2, qinglong: 1, water: 3 } },
    { text: '对细节和人的感受，听听内心的提醒。', scores: { qinglong: 2, zhuque: 1, moon: 3 } },
    { text: '一个明确的目标，先让大家知道往哪走。', scores: { xuanwu: 2, baihu: 1, sun: 3 } },
    { text: '可复用的经验，把眼前这一步走稳。', scores: { zhuque: 2, xuanwu: 1, earth: 3 } }
  ] },
  { id: 'q11', category: '状态在线', text: '你最喜欢自己处于哪种状态？', options: [
    { text: '灵感很满，忍不住想立刻做点什么。', scores: { zhuque: 2, qinglong: 1, fire: 3 } },
    { text: '标准很清晰，能专心把细节磨好。', scores: { xuanwu: 2, baihu: 1, metal: 3 } },
    { text: '思路不断打开，每天都有新的理解。', scores: { baihu: 2, xuanwu: 1, wood: 3 } },
    { text: '交流很顺畅，能够把大家带到同一方向。', scores: { qinglong: 2, zhuque: 1, sun: 3 } }
  ] },
  { id: 'q12', category: '一点小摩擦', text: '朋友的语气有点不对，你更可能怎么回应？', options: [
    { text: '先察觉对方的状态，给一点安静和空间。', scores: { baihu: 2, xuanwu: 1, moon: 3 } },
    { text: '换个轻松的说法，看对方的反应再调整。', scores: { zhuque: 2, baihu: 1, water: 3 } },
    { text: '直接而温和地问清楚，不让误会拖着。', scores: { xuanwu: 2, zhuque: 1, sun: 3 } },
    { text: '先做一点实际的事，让对方知道我在。', scores: { qinglong: 2, xuanwu: 1, earth: 3 } }
  ] },
  { id: 'q13', category: '遇到阻力', text: '认真做的事情卡住了，你会优先尝试？', options: [
    { text: '重新核对关键条件，删掉不必要的部分。', scores: { zhuque: 2, baihu: 1, metal: 3 } },
    { text: '换一种路径，不必和原来的方法死磕。', scores: { xuanwu: 2, qinglong: 1, water: 3 } },
    { text: '找新的知识或工具，补上能力的缺口。', scores: { baihu: 2, xuanwu: 1, wood: 3 } },
    { text: '做一个快速尝试，用行动打破停滞。', scores: { qinglong: 2, zhuque: 1, fire: 3 } }
  ] },
  { id: 'q14', category: '恢复能量', text: '忙了一整天，什么最能帮你回到自己？', options: [
    { text: '留一点独处时间，整理那些细小的感受。', scores: { qinglong: 2, xuanwu: 1, moon: 3 } },
    { text: '按熟悉的习惯吃饭、收拾、休息。', scores: { baihu: 2, xuanwu: 1, earth: 3 } },
    { text: '随心换个环境，不给接下来的时间定计划。', scores: { zhuque: 2, qinglong: 1, water: 3 } },
    { text: '做件有热度的事，让身体和情绪动起来。', scores: { xuanwu: 2, zhuque: 1, fire: 3 } }
  ] },
  { id: 'q15', category: '你珍惜的品质', text: '给未来的自己留一个提醒，你会选哪句？', options: [
    { text: '保持清晰，别为了迎合丢掉自己的尺度。', scores: { qinglong: 2, baihu: 1, metal: 3 } },
    { text: '敢于被看见，你的声音也能照亮别人。', scores: { baihu: 2, zhuque: 1, sun: 3 } },
    { text: '不要停止学习，每个阶段都可以重新生长。', scores: { zhuque: 2, qinglong: 1, wood: 3 } },
    { text: '认真听见感受，不必急着给一切下结论。', scores: { xuanwu: 2, moon: 3 } }
  ] },
  { id: 'q16', category: '最后一个瞬间', text: '旅程结束，你最想带走的是？', hint: '跟随此刻最接近你的答案。', options: [
    { text: '一份被好好记录、以后还能重温的日常。', scores: { zhuque: 2, xuanwu: 1, earth: 3 } },
    { text: '一个没有说出口，却一直留在心里的瞬间。', scores: { baihu: 2, xuanwu: 1, moon: 3 } },
    { text: '一次计划之外的转弯，让我看见生活的弹性。', scores: { xuanwu: 2, qinglong: 1, water: 3 } },
    { text: '一种“我还可以再出发”的热烈心情。', scores: { qinglong: 2, zhuque: 1, fire: 3 } }
  ] }
];
