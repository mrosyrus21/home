(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.WateringQueue = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STATE = Object.freeze({
    due:      Object.freeze({ key: "due",      rank: 0, compact: false, label: "Check soil",      color: "#22D3EE" }),
    soon:     Object.freeze({ key: "soon",     rank: 1, compact: true,  label: "Check soon",      color: "#FBBF24" }),
    good:     Object.freeze({ key: "good",     rank: 2, compact: true,  label: "Good",            color: "#4ADE80" }),
    tomorrow: Object.freeze({ key: "tomorrow", rank: 3, compact: true,  label: "Check tomorrow",  color: "#A5F3FC" }),
    watered:  Object.freeze({ key: "watered",  rank: 4, compact: true,  label: "Watered today",   color: "#4AD490" })
  });

  function classify(input) {
    const x = input || {};
    // A real due check wins over a stale deferral. Watered is only complete when
    // the whole watering unit (including shared pots) was logged today.
    if (x.wateredToday) return STATE.watered;
    if (x.due) return STATE.due;
    if (x.pushed) return STATE.tomorrow;
    if (x.soon) return STATE.soon;
    return STATE.good;
  }

  function dateKeyDay(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) return null;
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    const stamp = Date.UTC(year, month - 1, day), parsed = new Date(stamp);
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
    return stamp / 86400000;
  }

  function calendarDaysSince(fromKey, toKey) {
    const from = dateKeyDay(fromKey), to = dateKeyDay(toKey);
    if (from === null || to === null || from > to) return null;
    return to - from;
  }

  function isFutureDateKey(value, fromKey) {
    const valueDay = dateKeyDay(value), fromDay = dateKeyDay(fromKey);
    return valueDay !== null && fromDay !== null && valueDay > fromDay;
  }

  function validCadence(plant) {
    return !!plant && Number.isInteger(plant.days) && plant.days > 0;
  }

  function plantDue(plant, lastWatered, pushedUntil, dateKey) {
    if (dateKeyDay(dateKey) === null) return false;
    if (isFutureDateKey(pushedUntil, dateKey)) return false;
    if (!validCadence(plant)) return true;
    const age = calendarDaysSince(lastWatered, dateKey);
    return age === null || age >= plant.days;
  }

  function dueUrgency(entry) {
    return Number.isFinite(entry && entry.overdue) ? entry.overdue : Number.POSITIVE_INFINITY;
  }

  function compare(a, b) {
    const rankDiff = a.state.rank - b.state.rank;
    if (rankDiff) return rankDiff;
    if (a.state.key === "due") {
      const av = dueUrgency(a), bv = dueUrgency(b);
      if (av !== bv) {
        if (av === Number.POSITIVE_INFINITY) return -1;
        if (bv === Number.POSITIVE_INFINITY) return 1;
        return bv - av;
      }
    }
    return (a.order || 0) - (b.order || 0);
  }

  function sort(entries) {
    return (entries || []).slice().sort(compare);
  }

  function build(input) {
    const x = input || {}, plants = x.plants || [], watered = x.watered || {}, pushed = x.pushed || {};
    const dateKey = x.dateKey;
    if (dateKeyDay(dateKey) === null) return [];
    const groups = (x.groups || []).map(group => {
      const ids = (group.ids || []).filter(id => plants.some(plant => plant.id === id));
      return Object.assign({}, group, { ids: ids });
    }).filter(group => group.ids.length);
    const groupedIds = new Set(groups.flatMap(group => group.ids));

    function plantEntry(plant, order) {
      const age = calendarDaysSince(watered[plant.id], dateKey), cadenceOk = validCadence(plant);
      const due = plantDue(plant, watered[plant.id], pushed[plant.id], dateKey);
      const state = classify({
        wateredToday: watered[plant.id] === dateKey,
        due: due,
        pushed: isFutureDateKey(pushed[plant.id], dateKey),
        soon: age !== null && cadenceOk && age >= plant.days - 1
      });
      return {
        id: plant.id,
        p: plant,
        ids: [plant.id],
        days: age,
        state: state,
        warning: !cadenceOk ? "watering frequency needs review" : (age === null && watered[plant.id] ? "watering date needs review" : ""),
        overdue: age === null || !cadenceOk ? Number.POSITIVE_INFINITY : age - plant.days,
        order: order
      };
    }

    const entries = plants.filter(plant => !groupedIds.has(plant.id)).map(plantEntry);
    groups.forEach((group, groupIndex) => {
      const members = group.ids.map(id => plants.find(plant => plant.id === id)).filter(Boolean);
      const ages = members.map(plant => calendarDaysSince(watered[plant.id], dateKey));
      const allWateredToday = members.every(plant => watered[plant.id] === dateKey);
      const anyDue = members.some(plant => plantDue(plant, watered[plant.id], pushed[plant.id], dateKey));
      const anyPushed = members.some(plant => isFutureDateKey(pushed[plant.id], dateKey));
      const anySoon = members.some((plant, i) => ages[i] !== null && validCadence(plant) && ages[i] >= plant.days - 1);
      const age = ages.some(value => value === null) ? null : Math.max.apply(null, ages);
      const overdue = members.reduce((max, plant, i) => {
        if (ages[i] === null || !validCadence(plant)) return Number.POSITIVE_INFINITY;
        return Math.max(max, ages[i] - plant.days);
      }, Number.NEGATIVE_INFINITY);
      entries.push({
        id: group.id,
        p: group.plant,
        ids: group.ids.slice(),
        days: age,
        state: classify({ wateredToday: allWateredToday, due: anyDue, pushed: anyPushed, soon: anySoon }),
        warning: members.some(plant => !validCadence(plant)) ? "watering frequency needs review" : (age === null && members.some(plant => watered[plant.id]) ? "watering dates need review" : ""),
        overdue: overdue,
        order: plants.length + groupIndex
      });
    });
    return sort(entries);
  }

  return Object.freeze({
    STATE: STATE,
    classify: classify,
    compare: compare,
    sort: sort,
    build: build,
    plantDue: plantDue,
    validCadence: validCadence,
    dateKeyDay: dateKeyDay,
    calendarDaysSince: calendarDaysSince,
    isFutureDateKey: isFutureDateKey
  });
});
