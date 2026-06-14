// Sample photo library for the Sift prototype.
// Uses picsum.photos seeded IDs so the set is deterministic.
// Stacks simulate burst / near-duplicate shots (same frame, varying sharpness or crop).
(function () {
  const SRC = (id, w, h, q) => `https://picsum.photos/id/${id}/${w || 1600}/${h || 1060}${q || ''}`;
  const THUMB = (id, q) => `https://picsum.photos/id/${id}/240/160${q || ''}`;

  // Sample videos: self-contained local clips (see sift-media.js), with the dead
  // external bucket kept only as a last-resort fallback.
  const MEDIA = window.SIFT_MEDIA || {};
  const VID = (n) => (MEDIA[n] && MEDIA[n].mp4) || `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${n}.mp4`;

  let serial = 4018;
  function mk(picId, date, month, sortKey, meta, q, w, h) {
    serial += 1;
    return {
      id: 'ph' + serial,
      type: 'photo',
      src: SRC(picId, w, h, q),
      thumb: THUMB(picId, q),
      name: 'IMG_' + serial + '.jpg',
      date: date,
      month: month,
      sortKey: sortKey,
      meta: meta
    };
  }
  function mkv(picId, clip, date, month, sortKey, dur, meta) {
    serial += 1;
    return {
      id: 'ph' + serial,
      type: 'video',
      src: VID(clip),
      thumb: (MEDIA[clip] && MEDIA[clip].poster) || THUMB(picId),
      poster: (MEDIA[clip] && MEDIA[clip].poster) || SRC(picId),
      name: 'VID_' + serial + '.mp4',
      date: date,
      month: month,
      sortKey: sortKey,
      dur: dur,
      meta: meta
    };
  }

  const APR = ['April 2026', '2026-04'];
  const MAY = ['May 2026', '2026-05'];
  const JUN = ['June 2026', '2026-06'];

  const items = [];
  const single = (p) => items.push({ id: p.id, kind: 'photo', photos: [p] });
  const stack = (photos) => items.push({ id: 'st-' + photos[0].id, kind: 'stack', photos: photos });

  single(mk(1011, '4 Apr 2026', APR[0], APR[1], '26mm · ƒ2.2 · 1/320 · ISO 100'));
  single(mk(1015, '4 Apr 2026', APR[0], APR[1], '24mm · ƒ4.0 · 1/500 · ISO 100'));
  single(mk(1016, '5 Apr 2026', APR[0], APR[1], '35mm · ƒ5.6 · 1/640 · ISO 200'));

  stack([
    mk(1018, '5 Apr 2026', APR[0], APR[1], '50mm · ƒ2.8 · 1/800 · ISO 100'),
    mk(1018, '5 Apr 2026', APR[0], APR[1], '50mm · ƒ2.8 · 1/400 · ISO 100', '?blur=1'),
    mk(1018, '5 Apr 2026', APR[0], APR[1], '50mm · ƒ2.8 · 1/160 · ISO 100', '?blur=2')
  ]);

  single(mk(1020, '11 Apr 2026', APR[0], APR[1], '200mm · ƒ6.3 · 1/1000 · ISO 400'));
  single(mk(28, '11 Apr 2026', APR[0], APR[1], '35mm · ƒ4.0 · 1/250 · ISO 200'));
  single(mk(1035, '18 Apr 2026', APR[0], APR[1], '24mm · ƒ8.0 · 1/200 · ISO 100'));
  single(mkv(1037, 'ForBiggerBlazes', '18 Apr 2026', APR[0], APR[1], '0:15', '4K · 24fps · H.265'));

  single(mk(1036, '2 May 2026', MAY[0], MAY[1], '16mm · ƒ9.0 · 1/320 · ISO 100'));
  single(mk(1039, '2 May 2026', MAY[0], MAY[1], '24mm · ƒ11 · 1/60 · ISO 100'));

  stack([
    mk(1024, '9 May 2026', MAY[0], MAY[1], '300mm · ƒ5.6 · 1/2000 · ISO 800'),
    mk(1024, '9 May 2026', MAY[0], MAY[1], '300mm · ƒ5.6 · 1/2000 · ISO 800', '', 1500, 1060),
    mk(1024, '9 May 2026', MAY[0], MAY[1], '300mm · ƒ5.6 · 1/800 · ISO 800', '?blur=1')
  ]);

  single(mk(1043, '9 May 2026', MAY[0], MAY[1], '50mm · ƒ1.8 · 1/800 · ISO 100'));
  single(mkv(1042, 'ForBiggerJoyrides', '11 May 2026', MAY[0], MAY[1], '0:15', '1080p · 60fps · HDR'));
  single(mk(1044, '16 May 2026', MAY[0], MAY[1], '24mm · ƒ4.5 · 1/500 · ISO 100'));
  single(mk(1047, '16 May 2026', MAY[0], MAY[1], '28mm · ƒ7.1 · 1/400 · ISO 200'));
  single(mk(1050, '23 May 2026', MAY[0], MAY[1], '70mm · ƒ4.0 · 1/640 · ISO 100'));

  stack([
    mk(237, '30 May 2026', MAY[0], MAY[1], '85mm · ƒ1.8 · 1/1000 · ISO 200'),
    mk(237, '30 May 2026', MAY[0], MAY[1], '85mm · ƒ1.8 · 1/1000 · ISO 200', '', 1520, 1060),
    mk(237, '30 May 2026', MAY[0], MAY[1], '85mm · ƒ1.8 · 1/500 · ISO 200', '?blur=1'),
    mk(237, '30 May 2026', MAY[0], MAY[1], '85mm · ƒ1.8 · 1/250 · ISO 200', '?blur=2')
  ]);

  single(mk(1062, '6 Jun 2026', JUN[0], JUN[1], '35mm · ƒ2.0 · 1/125 · ISO 400'));
  single(mk(1069, '6 Jun 2026', JUN[0], JUN[1], '24mm · ƒ8.0 · 1/250 · ISO 100'));
  single(mk(1080, '7 Jun 2026', JUN[0], JUN[1], '60mm · ƒ4.0 · 1/200 · ISO 200'));
  single(mk(29, '7 Jun 2026', JUN[0], JUN[1], '16mm · ƒ10 · 1/320 · ISO 100'));
  single(mkv(1063, 'ForBiggerMeltdowns', '7 Jun 2026', JUN[0], JUN[1], '0:15', '4K · 30fps · H.265'));

  window.SIFT_DATA = {
    albums: [
      { key: '1', id: 'favorites', name: 'Favorites' },
      { key: '2', id: 'family', name: 'Family' },
      { key: '3', id: 'travel', name: 'Travel' }
    ],
    items: items,
    allPhotos: items.flatMap(function (i) { return i.photos; })
  };
})();
