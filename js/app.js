(function () {
  'use strict';
  const Q = window.XIU_QUESTIONS, T = window.XIU_TYPES, G = window.XIU_GROUPS, E = window.XIU_ELEMENTS, S = window.XIU_SCORING;
  const main = document.getElementById('main');
  const storageKey = 'xiu28-offline-session-v1';
  let signature = 0;
  JSON.stringify(Q).split('').forEach(function (c) { signature = ((signature << 5) - signature + c.charCodeAt(0)) | 0; });
  const state = { answers: Array(Q.length).fill(null), cursor: 0, busy: false, timer: null, atlas: 'all' };
  let toastTimer;
  function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function completed() { return state.answers.filter(function (a) { return a !== null; }).length; }
  function persist() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ signature: signature, answers: state.answers, cursor: state.cursor })); } catch (_) { /* 禁用存储时继续纯内存运行。 */ }
  }
  function restore() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey));
      if (!saved || saved.signature !== signature || !Array.isArray(saved.answers) || saved.answers.length !== Q.length) return;
      if (saved.answers.some(function (a, i) { return a !== null && (!Number.isInteger(a) || !Q[i].options[a]); })) return;
      state.answers = saved.answers;
      state.cursor = Number.isInteger(saved.cursor) ? Math.max(0, Math.min(Q.length - 1, saved.cursor)) : 0;
    } catch (_) { /* file:// 下部分浏览器不允许存储；不影响完整测试。 */ }
  }
  function cancelAdvance() { clearTimeout(state.timer); state.busy = false; }
  function toast(message) {
    clearTimeout(toastTimer);
    const node = document.getElementById('toast'); node.textContent = message; node.classList.add('visible');
    toastTimer = setTimeout(function () { node.classList.remove('visible'); }, 3500);
  }
  function go(hash) { cancelAdvance(); if (location.hash === hash) render(); else location.hash = hash; }
  function reset() {
    cancelAdvance(); state.answers = Array(Q.length).fill(null); state.cursor = 0;
    try { sessionStorage.removeItem(storageKey); } catch (_) { /* 无存储也可重测。 */ }
    go('#quiz');
  }
  function groupMark(id, small) {
    const index = S.GROUP_ORDER.indexOf(id);
    return '<span class="group-mark ' + (small ? 'small' : '') + ' mark-' + id + '" aria-hidden="true">' + ['✳', '◈', '✦', '✷'][index] + '</span>';
  }
  function home() {
    const count = completed();
    main.innerHTML = '<section class="home-hero"><div class="hero-copy"><div class="intro-badge">四象 × 七曜 · 28 种人格</div><h1>认识自己，<br class="mobile-break">从你的<span class="lime">星宿人格</span>开始。</h1><p class="hero-description">有些特质，一直藏在你的日常选择里。<br>用 ' + Q.length + ' 个小问题，发现你独特的思考、感受与行动方式。</p>' +
      '<div class="hero-actions"><button class="button primary" data-action="' + (count && count < Q.length ? 'continue' : 'start') + '">' + (count && count < Q.length ? '继续测试 · ' + count + '/' + Q.length : '开始人格测试') + '<span>→</span></button></div><div class="hero-meta"><span>约 2 分钟</span><span>无需登录</span><span>完全离线</span></div></div>' +
      '<div class="steps-grid"><article class="step-card step-blue"><span class="step-number">01</span><div><span class="step-label">做真实的自己</span><h2>跟随日常的直觉</h2><p>没有对错，也不用努力选出“更好”的答案。选最像平时的你的那一个。</p></div></article><article class="step-card step-green"><span class="step-number">02</span><div><span class="step-label">发现你的星宿</span><h2>看见自己的独特</h2><p>从四象的内在驱动力，到七曜的行动倾向，找到属于你的星宿人格。</p></div></article><article class="step-card step-purple"><span class="step-number">03</span><div><span class="step-label">多理解自己一点</span><h2>读懂不同的侧面</h2><p>了解你的优势、社交和情绪模式。把结果当作一次温柔的自我探索。</p></div></article></div></section>' +
      '<section class="group-section"><div class="section-heading"><div><span class="section-kicker">四象人格</span><h2>不同的驱动力，同样值得被理解。</h2><p>你可以勇敢探索，也可以慢慢扎根。每一种方式，都有自己的力量。</p></div><a class="quiet-link" href="#atlas">浏览 28 宿图鉴 →</a></div><div class="group-grid">' +
      S.GROUP_ORDER.map(function (id) { const g = G[id]; return '<a href="#atlas/' + id + '" class="group-card tone-' + id + '" style="--accent:' + g.color + '"><div class="group-card-top"><span>' + g.direction + '方 · 七宿</span><span>→</span></div><div class="group-card-title"><h3>' + g.name + '</h3></div><p>' + g.tagline + '</p><span class="group-card-link">认识这一象 →</span></a>'; }).join('') +
      '</div></section><section class="home-note"><h2>星宿是灵感，答案是你。</h2><p>以中国传统二十八星宿为灵感，用当代的语言认识自己。<br>不预测命运，不给你设限。你始终比任何一种类型更丰富。</p></section>';
  }
  function quiz() {
    const i = state.cursor, q = Q[i], count = completed();
    main.innerHTML = '<section class="test-intro"><span class="section-kicker">XIU28 / 宿格</span><h2>星宿人格测试</h2><p>放轻松，选择最接近真实的你的答案。</p><div class="test-principles"><span>诚实作答</span><span>不必反复斟酌</span><span>没有标准答案</span></div></section><section class="quiz-shell"><div class="quiz-top"><a href="#home" class="back-link">← 暂回首页</a><span class="eyebrow muted">你的每一种感受，都值得被看见</span></div>' +
      '<div class="progress-label"><span>你的星宿，正在浮现</span><span><b>' + String(i + 1).padStart(2, '0') + '</b> / ' + Q.length + '</span></div><div class="progress-track" role="progressbar" aria-label="已完成题目" aria-valuemin="0" aria-valuemax="' + Q.length + '" aria-valuenow="' + count + '"><div style="width:' + (count / Q.length * 100) + '%"></div></div>' +
      '<div class="question-heading"><span class="question-index">Q' + String(i + 1).padStart(2, '0') + '</span><span class="question-category">' + esc(q.category || '日常的一刻') + '</span></div>' +
      '<h1 class="question-title">' + esc(q.text) + '</h1><p class="question-hint">' + esc(q.hint || '没有标准答案，选最像平时的你的那一个。') + '</p><div class="options" role="group" aria-label="第 ' + (i + 1) + ' 题选项">' +
      q.options.map(function (o, j) { return '<button class="option ' + (state.answers[i] === j ? 'selected' : '') + '" data-answer="' + j + '" aria-pressed="' + (state.answers[i] === j) + '"><span class="option-letter">' + 'ABCD'[j] + '</span><span>' + esc(o.text) + '</span><span class="option-end" aria-hidden="true">' + (state.answers[i] === j ? '✓' : '') + '</span></button>'; }).join('') + '</div>' +
      '<div class="quiz-bottom"><button class="text-button" data-action="previous" ' + (i === 0 ? 'disabled' : '') + '>← 上一题</button><span>选择后自动前进 · 可随时返回修改</span></div><div class="quiz-privacy"><span class="signal"></span> 答案留在此浏览器，不上传任何数据</div></section>';
  }
  function character(type) {
    // 正式 IP 稿未接入前不创建 img，也不请求预留图片路径。
    // 后续接入图片时使用 types.js 中的 image 字段。
    return '<div class="character-stage" aria-label="' + esc(type.name) + '形象预留区"><div class="character-empty"><span class="empty-frame" aria-hidden="true">＋</span><p>这里，留给未来的形象。</p><span>' + esc(type.name) + ' · IP 设计待接入</span></div></div>';
  }
  function reason(axis, dictionary, order) {
    const name = dictionary[axis.winner].name;
    if (axis.reason === 'total') return name + '的累计分最高。';
    const tiedNames = axis.tiedOnTotal.map(function (k) { return dictionary[k].name; }).join('、');
    if (axis.reason === 'leading') return tiedNames + '总分并列；' + name + '在单题内独立领先的次数更多。';
    if (axis.reason === 'strong') return tiedNames + '总分及单题领先次数仍并列；' + name + '获得至少 2 分的次数更多。';
    return tiedNames + '在前三项比较中仍并列，按固定顺序（' + order.map(function (k) { return dictionary[k].name; }).join(' → ') + '）选出' + name + '。';
  }
  function scoreBlock(axis, dictionary, label, order) {
    const sum = order.reduce(function (total, key) { return total + axis.totals[key]; }, 0);
    return '<div class="score-block"><h3>' + label + '</h3>' + order.map(function (key) {
      const value = axis.totals[key], percent = sum ? Math.round(value / sum * 100) : 0;
      return '<div class="score-row ' + (key === axis.winner ? 'winner' : '') + '"><span>' + dictionary[key].name + '</span><div class="score-track"><div style="width:' + percent + '%"></div></div><span>' + value + ' 分</span></div>';
    }).join('') + '<p class="score-reason">' + reason(axis, dictionary, order) + '</p></div>';
  }
  function personality(type, personal) {
    const g = G[type.groupId], el = E[type.elementId];
    const result = personal ? S.calculate(state.answers, Q, T) : null;
    main.innerHTML = '<section class="result-shell tone-' + type.groupId + '" style="--accent:' + g.color + '"><div class="result-top"><a class="back-link" href="#' + (personal ? 'home' : 'atlas' + (state.atlas === 'all' ? '' : '/' + state.atlas)) + '">← ' + (personal ? '返回首页' : '返回图鉴') + '</a><span class="eyebrow muted">' + (personal ? '你的星宿人格' : '28 宿人格图鉴') + '</span></div>' +
      '<div class="result-hero"><div class="result-intro"><div class="eyebrow result-eyebrow"><span class="signal"></span>' + (personal ? '与你此刻最接近的一宿' : '28 宿人格档案') + '</div><div class="identity-tags"><span>' + g.fullName + '</span><span>' + type.element + '曜 · ' + el.label + '</span></div><h1>' + esc(type.name) + '</h1><h2>' + esc(type.title) + '</h2><div class="keywords">' + type.keywords.map(function (k) { return '<span>' + esc(k) + '</span>'; }).join('') + '</div><blockquote>“' + esc(type.quote) + '”</blockquote><p class="identity-code">XIU28 / ' + type.id.toUpperCase() + '<span>对应动物：' + esc(type.animal) + '</span></p></div>' + character(type) + '</div>' +
      '<div class="result-actions">' + (personal ? '<button class="button primary" data-action="save">保存结果 <span>↓</span></button><a class="button secondary" href="#atlas">查看全部 28 宿 <span>↗</span></a><button class="text-button" data-action="start">重新测试 ↻</button>' : '<button class="button primary" data-action="' + (completed() && completed() < Q.length ? 'continue' : 'start') + '">' + (completed() && completed() < Q.length ? '继续我的测试' : '测测我是哪一宿') + ' <span>↗</span></button><a class="button secondary" href="#atlas">查看全部 28 宿</a>') + '</div>' +
      '<div class="reading-heading"><span class="section-kicker">认识你的不同侧面</span><h2>沿着星光，再认识你一点。</h2></div><div class="traits-grid">' +
      [['01', '你的优势', 'strengths', '↗'], ['02', '留意的另一面', 'weaknesses', '◐'], ['03', '你的社交模式', 'social', '↔'], ['04', '你的情绪模式', 'emotion', '≈']].map(function (item) {
        return '<article class="trait-card"><div class="trait-top"><span>' + item[0] + ' / ' + item[1] + '</span><span>' + item[3] + '</span></div><p>' + esc(type[item[2]]) + '</p></article>';
      }).join('') + '</div><div class="identity-explainer"><div>' + groupMark(type.groupId, true) + '<div><h3>' + g.fullName + ' · 内在驱动力</h3><p>' + esc(g.description) + '</p></div></div><div><span class="element-mark">' + type.element + '</span><div><h3>' + type.element + '曜 · 行动倾向</h3><p>' + esc(el.description) + '</p></div></div></div>' +
      (personal ? '<details class="score-details"><summary>为什么是这一宿？<span>查看评分依据 ＋</span></summary><div class="scores-grid">' + scoreBlock(result.group, G, '四象得分', S.GROUP_ORDER) + scoreBlock(result.element, E, '七曜得分', S.ELEMENT_ORDER) + '</div><p class="score-footnote">条形长度为本轴累计得分占比，不是人格准确率。并列规则：总分 → 单题独立领先次数 → 单题至少 2 分的次数 → 固定顺序。所有结果均从当前答案重新计算。</p></details>' : '') +
      '<p class="result-disclaimer">这是一份以传统星宿文化为灵感的创作性人格画像。它描述倾向，不定义你，也不用于心理诊断或命运预测。</p></section>';
  }
  function atlas(filter) {
    state.atlas = G[filter] ? filter : 'all';
    const groupIds = state.atlas === 'all' ? S.GROUP_ORDER : [state.atlas];
    main.innerHTML = '<section class="atlas-shell"><div class="atlas-heading"><div><div class="section-kicker">探索所有人格</div><h1>28 种星宿，<span class="lime">28 种可能。</span></h1><p>不必等一个测试结果，也能先遇见让你共鸣的那一宿。</p></div></div>' +
      '<nav class="atlas-filters" aria-label="按四象筛选"><a href="#atlas" ' + (state.atlas === 'all' ? 'aria-current="page"' : '') + '>全部 <span>28</span></a>' + S.GROUP_ORDER.map(function (id) { return '<a href="#atlas/' + id + '" ' + (state.atlas === id ? 'aria-current="page"' : '') + '>' + G[id].name + '<span>07</span></a>'; }).join('') + '</nav>' +
      groupIds.map(function (id) { const g = G[id]; return '<section class="atlas-group tone-' + id + '" style="--accent:' + g.color + '"><div class="atlas-group-heading">' + groupMark(id, true) + '<div><h2>' + g.fullName + '</h2><p>' + g.tagline + '</p></div><span>' + g.en + ' / 07</span></div><div class="atlas-grid">' + T.filter(function (t) { return t.groupId === id; }).map(function (t) {
        return '<a class="type-card" href="#type/' + t.id + '"><div class="type-card-meta"><span>NO. ' + String(T.indexOf(t) + 1).padStart(2, '0') + '</span><span>' + t.element + '曜</span></div><h3>' + t.name + '</h3><p>' + esc(t.title) + '</p><div class="type-card-bottom"><span>' + t.keywords.slice(0, 2).join(' / ') + '</span><span>↗</span></div></a>';
      }).join('') + '</div></section>'; }).join('') + '<div class="atlas-bottom"><p>哪一宿，都只是认识自己的开始。</p><button class="button primary" data-action="' + (completed() && completed() < Q.length ? 'continue' : 'start') + '">' + (completed() && completed() < Q.length ? '继续我的测试' : '找到我的星宿') + ' <span>↗</span></button></div></section>';
  }
  function render() {
    cancelAdvance();
    const path = location.hash.slice(1).split('/');
    try {
      if (path[0] === 'quiz') quiz();
      else if (path[0] === 'result' && completed() === Q.length) personality(S.calculate(state.answers, Q, T).type, true);
      else if (path[0] === 'atlas') atlas(path[1]);
      else if (path[0] === 'type' && T.some(function (t) { return t.id === path[1]; })) personality(T.find(function (t) { return t.id === path[1]; }), false);
      else home();
    } catch (error) { main.innerHTML = '<section class="error-panel"><h1>数据需要检查一下</h1><p>' + esc(error.message) + '</p><a href="#home">返回首页</a></section>'; }
    document.body.dataset.page = path[0] || 'home';
    document.title = (main.querySelector('h1') ? main.querySelector('h1').textContent.replace(/✳/g, '') + ' — ' : '') + 'XIU28 / 宿格';
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
  main.addEventListener('click', function (event) {
    const option = event.target.closest('[data-answer]');
    if (option) {
      if (state.busy) return;
      state.busy = true;
      const value = Number(option.dataset.answer);
      state.answers[state.cursor] = value;
      main.querySelectorAll('.option').forEach(function (node) {
        const selected = node === option;
        node.classList.toggle('selected', selected); node.setAttribute('aria-pressed', String(selected)); node.disabled = true;
        node.querySelector('.option-end').textContent = selected ? '✓' : '';
      });
      persist();
      state.timer = setTimeout(function () {
        state.busy = false;
        if (state.cursor < Q.length - 1) { state.cursor += 1; persist(); render(); }
        else if (completed() === Q.length) go('#result');
        else { state.cursor = state.answers.indexOf(null); persist(); render(); }
      }, 220);
      return;
    }
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (action === 'start') reset();
    else if (action === 'continue') go('#quiz');
    else if (action === 'previous' && state.cursor > 0) { cancelAdvance(); state.cursor -= 1; persist(); render(); }
    else if (action === 'save') toast('图片导出正在筹备中。当前版本可使用浏览器截图保存结果。');
  });
  document.querySelector('.skip-link').addEventListener('click', function (event) {
    event.preventDefault(); main.focus({ preventScroll: true });
  });
  window.addEventListener('hashchange', render);
  try { S.validate(Q, T); restore(); render(); }
  catch (error) { main.innerHTML = '<section class="error-panel"><h1>请检查题库和人格数据</h1><p>' + esc(error.message) + '</p></section>'; }
})();
