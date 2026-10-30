import { poseAt, WHEEL_RADIUS } from './pose.js';

const TAU = Math.PI * 2;

function line(ctx, points, color, width = 2) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (const [x, y] of points.slice(1)) ctx.lineTo(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function circle(ctx, x, y, radius, stroke, width, fill) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}

function wheel(ctx, center, angle, ink, body, shadow) {
  circle(ctx, center.x, center.y, WHEEL_RADIUS - 2.5, ink, 5);
  if (!shadow) circle(ctx, center.x, center.y, WHEEL_RADIUS - 6, ink, 0.8);
  for (let index = 0; index < 16; index += 1) {
    const spoke = angle + index * TAU / 16;
    const r = WHEEL_RADIUS - 6;
    line(ctx, [[center.x, center.y], [center.x + Math.cos(spoke) * r, center.y + Math.sin(spoke) * r]], ink, 0.85);
  }
  circle(ctx, center.x, center.y, 4.3, ink, 1.4, shadow ? ink : body);
}

function leg(ctx, pose, side, ink, accent, shadow) {
  const knee = pose[`knee${side}`];
  const ankle = pose[`ankle${side}`];
  const points = [[pose.hip.x, pose.hip.y], [knee.x, knee.y], [ankle.x, ankle.y]];
  line(ctx, points, ink, 6);
  if (!shadow) line(ctx, points, accent, 3.2);
  // The sole is centered on the pedal spindle; the ankle and pedal never detach.
  line(ctx, [[ankle.x - 8, ankle.y], [ankle.x + 12, ankle.y], [ankle.x + 16, ankle.y - 3]], ink, 4.5);
  if (!shadow) line(ctx, [[ankle.x - 6, ankle.y - 0.5], [ankle.x + 11, ankle.y - 0.5]], accent, 2);
}

/** Draw the neutral stage-1 rig in rear-axle coordinates, without retaining state. */
export function drawCyclist(ctx, t, { ink = '#29342c', body = '#f8f1dd', accent = '#bd733f', scale = 1, shadow = false } = {}) {
  const p = poseAt(t);
  ctx.save();
  try {
    ctx.scale(scale, scale);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const feather = shadow ? ink : body;
    const bill = shadow ? ink : accent;

    // Both wheels keep their phase from absolute road travel, including during seeks.
    wheel(ctx, p.rear, p.wheelAngle, ink, body, shadow);
    wheel(ctx, p.front, p.wheelAngle, ink, body, shadow);

    leg(ctx, p, 'Right', ink, accent, shadow);
    line(ctx, [[80, -22], [p.ankleRight.x, p.ankleRight.y]], ink, 3.5);

    // An original double-diamond roadster: crown, fork, seat post and chain stays.
    line(ctx, [[0, 0], [62, -79], [80, -22], [0, 0]], ink, 4.2);
    line(ctx, [[62, -79], [147, -76], [80, -22]], ink, 4.2);
    line(ctx, [[147, -76], [180, 0]], ink, 5);
    line(ctx, [[62, -79], [58, -113]], ink, 3.4);
    line(ctx, [[144, -76], [153, -96]], ink, 3.3);

    ctx.beginPath();
    ctx.moveTo(153, -96);
    ctx.bezierCurveTo(161, -100, 177, -97, 176, -88);
    ctx.bezierCurveTo(176, -83, 171, -81, 167, -83);
    ctx.strokeStyle = ink; ctx.lineWidth = 3.7; ctx.stroke();
    line(ctx, [[165, -84], [173, -84]], bill, 5);

    ctx.beginPath();
    ctx.moveTo(41, -115);
    ctx.bezierCurveTo(48, -121, 68, -121, 74, -115);
    ctx.bezierCurveTo(68, -111, 48, -110, 41, -115);
    ctx.fillStyle = ink; ctx.fill();

    // Chain follows the two sprockets without crossing a wheel or floating.
    ctx.beginPath();
    ctx.moveTo(0, -6); ctx.lineTo(78, -34);
    ctx.bezierCurveTo(95, -38, 100, -14, 82, -10);
    ctx.lineTo(0, 6); ctx.closePath();
    ctx.strokeStyle = ink; ctx.lineWidth = 1.3; ctx.stroke();
    circle(ctx, 80, -22, 12, ink, 1.8);
    for (let index = 0; index < 5; index += 1) {
      const angle = p.pedalAngle + index * TAU / 5;
      line(ctx, [[80, -22], [80 + 10 * Math.cos(angle), -22 + 10 * Math.sin(angle)]], ink, 1);
    }

    leg(ctx, p, 'Left', ink, accent, shadow);
    line(ctx, [[80, -22], [p.ankleLeft.x, p.ankleLeft.y]], ink, 3.4);
    circle(ctx, 80, -22, 3.2, ink, 1, shadow ? ink : body);
    for (const ankle of [p.ankleRight, p.ankleLeft]) {
      line(ctx, [[ankle.x - 8, ankle.y + 3], [ankle.x + 11, ankle.y + 3]], ink, 2.4);
    }

    // Tail, broad chest and a long S-shaped neck form the bird's white silhouette.
    ctx.beginPath();
    ctx.moveTo(27, -138);
    ctx.lineTo(-3, -142); ctx.lineTo(10, -130); ctx.lineTo(1, -131);
    ctx.bezierCurveTo(19, -112, 49, -112, 70, -115);
    ctx.bezierCurveTo(96, -119, 111, -136, 105, -158);
    ctx.bezierCurveTo(102, -173, 88, -177, 88, -190);
    ctx.bezierCurveTo(87, -201, 94, -208, 102, -206);
    ctx.bezierCurveTo(104, -193, 116, -192, 124, -200);
    ctx.bezierCurveTo(134, -208, 130, -223, 118, -229);
    ctx.bezierCurveTo(101, -238, 84, -230, 78, -217);
    ctx.bezierCurveTo(66, -194, 70, -180, 77, -167);
    ctx.bezierCurveTo(61, -179, 34, -173, 20, -162);
    ctx.bezierCurveTo(12, -156, 15, -145, 27, -138);
    ctx.closePath();
    ctx.fillStyle = feather; ctx.strokeStyle = ink; ctx.lineWidth = 2.7; ctx.fill(); ctx.stroke();

    // The long bill has a hooked tip; its generous throat pouch is unmistakable.
    ctx.beginPath();
    ctx.moveTo(121, -218);
    ctx.bezierCurveTo(151, -220, 194, -214, p.beakTip.x, p.beakTip.y);
    ctx.lineTo(218, -201);
    ctx.bezierCurveTo(204, -204, 184, -203, 168, -199);
    ctx.bezierCurveTo(153, -178, 131, -179, 121, -201);
    ctx.closePath();
    ctx.fillStyle = bill; ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
    if (!shadow) {
      ctx.beginPath();
      ctx.moveTo(126, -211);
      ctx.bezierCurveTo(151, -209, 186, -208, 215, -207);
      ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(129, -204);
      ctx.bezierCurveTo(143, -188, 153, -190, 166, -199);
      ctx.strokeStyle = body; ctx.lineWidth = 1.2; ctx.stroke();
    }

    // Folded flight feathers, followed by a forward wing reaching the actual grip.
    ctx.beginPath();
    ctx.moveTo(29, -158);
    ctx.bezierCurveTo(53, -171, 77, -155, 87, -137);
    ctx.bezierCurveTo(66, -134, 39, -135, 24, -144);
    ctx.bezierCurveTo(43, -145, 58, -145, 69, -145);
    ctx.bezierCurveTo(51, -148, 37, -149, 29, -158);
    ctx.fillStyle = ink; ctx.fill();
    if (!shadow) {
      for (let index = 0; index < 4; index += 1) {
        line(ctx, [[35 + index * 8, -154], [51 + index * 8, -142]], body, 0.85);
      }
    }
    ctx.beginPath();
    ctx.moveTo(76, -153);
    ctx.bezierCurveTo(94, -148, 103, -119, 117, -108);
    ctx.bezierCurveTo(128, -99, 150, -89, 168, -85);
    ctx.bezierCurveTo(161, -80, 145, -84, 130, -89);
    ctx.bezierCurveTo(102, -94, 84, -115, 76, -137);
    ctx.strokeStyle = ink; ctx.fillStyle = feather; ctx.lineWidth = 2.3; ctx.fill(); ctx.stroke();

    if (!shadow) {
      // The pale eye and tiny rear crest keep the expression dry and attentive.
      circle(ctx, p.head.x + 6, p.head.y - 5, 5.6, ink, 1, body);
      circle(ctx, p.head.x + 8.2, p.head.y - 5, 1.9, null, 0, ink);
      line(ctx, [[104, -226], [119, -225]], ink, 1.5);
      line(ctx, [[83, -225], [76, -228]], ink, 1.1);
      line(ctx, [[82, -222], [73, -224]], ink, 1.1);
      line(ctx, [[90, -177], [95, -166]], accent, 0.8);
    }
  } finally {
    ctx.restore();
  }
}
