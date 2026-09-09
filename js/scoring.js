(function () {
  'use strict';
  // 最后的固定顺序仅在前三项完全相等时使用，不随机、不按最后一题决定。
  const GROUP_ORDER = ['qinglong', 'xuanwu', 'baihu', 'zhuque'];
  const ELEMENT_ORDER = ['wood', 'fire', 'earth', 'metal', 'water', 'sun', 'moon'];
  const ALL_KEYS = GROUP_ORDER.concat(ELEMENT_ORDER);
  function blank(keys) { return Object.fromEntries(keys.map(function (key) { return [key, 0]; })); }

  function validate(questions, types) {
    const ids = new Set();
    if (!Array.isArray(questions) || !questions.length) throw new Error('题库不能为空。');
    questions.forEach(function (q) {
      if (!q.id || ids.has(q.id)) throw new Error('题目 id 缺失或重复。');
      ids.add(q.id);
      if (!q.text || !Array.isArray(q.options) || q.options.length !== 4) throw new Error(q.id + ' 需要题干和四个选项。');
      q.options.forEach(function (option) {
        if (!option.text || !option.scores || !Object.keys(option.scores).length) throw new Error(q.id + ' 选项缺少文案或分值。');
        Object.keys(option.scores).forEach(function (key) {
          if (!ALL_KEYS.includes(key) || !Number.isFinite(option.scores[key]) || option.scores[key] < 0) throw new Error(q.id + ' 分值无效：' + key);
        });
      });
    });
    const pairs = new Set();
    const typeIds = new Set();
    types.forEach(function (type) {
      const pair = type.groupId + ':' + type.elementId;
      if (!GROUP_ORDER.includes(type.groupId) || !ELEMENT_ORDER.includes(type.elementId) || pairs.has(pair) || !type.id || typeIds.has(type.id)) throw new Error('人格映射缺失、重复或无效：' + type.id);
      pairs.add(pair); typeIds.add(type.id);
    });
    if (pairs.size !== 28) throw new Error('需要完整的 4 × 7 共 28 种人格。');
    return true;
  }

  function rankAxis(keys, chosen) {
    const totals = blank(keys), leading = blank(keys), strong = blank(keys);
    chosen.forEach(function (option) {
      const values = keys.map(function (key) { return option.scores[key] || 0; });
      const max = Math.max.apply(null, values);
      const leaders = keys.filter(function (key) { return (option.scores[key] || 0) === max; });
      keys.forEach(function (key) {
        const value = option.scores[key] || 0;
        totals[key] += value;
        if (value >= 2) strong[key] += 1;
      });
      if (max > 0 && leaders.length === 1) leading[leaders[0]] += 1;
    });
    const ranked = keys.slice().sort(function (a, b) {
      return totals[b] - totals[a] || leading[b] - leading[a] || strong[b] - strong[a] || keys.indexOf(a) - keys.indexOf(b);
    });
    let candidates = keys.slice();
    let reason = 'total';
    [['total', totals], ['leading', leading], ['strong', strong]].some(function (entry) {
      const max = Math.max.apply(null, candidates.map(function (key) { return entry[1][key]; }));
      candidates = candidates.filter(function (key) { return entry[1][key] === max; });
      reason = entry[0];
      return candidates.length === 1;
    });
    if (candidates.length > 1) reason = 'order';
    return { winner: ranked[0], totals: totals, leading: leading, strong: strong, ranked: ranked, reason: reason,
      tiedOnTotal: keys.filter(function (key) { return totals[key] === totals[ranked[0]]; }) };
  }

  function calculate(answers, questions, types) {
    validate(questions, types);
    if (!Array.isArray(answers) || answers.length !== questions.length || questions.some(function (q, i) { return !Number.isInteger(answers[i]) || !q.options[answers[i]]; })) throw new Error('请完成所有题目后查看结果。');
    // 从答案快照重新汇总，不保留任何上一次计算的累计值。
    const chosen = questions.map(function (q, i) { return q.options[answers[i]]; });
    const group = rankAxis(GROUP_ORDER, chosen);
    const element = rankAxis(ELEMENT_ORDER, chosen);
    const type = types.find(function (t) { return t.groupId === group.winner && t.elementId === element.winner; });
    return { type: type, group: group, element: element };
  }
  window.XIU_SCORING = { calculate: calculate, validate: validate, rankAxis: rankAxis, GROUP_ORDER: GROUP_ORDER, ELEMENT_ORDER: ELEMENT_ORDER };
})();
