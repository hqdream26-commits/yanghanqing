/**
 * 流星雨背景特效 - 生动版
 * 大批流星同时从左侧向右侧划过，带碎屑粒子、尾迹波纹和尾巴光点
 */
(function() {
    const canvas = document.createElement('canvas');
    canvas.className = 'meteor-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let w, h;
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ========== 星空背景 ==========
    const STARS_COUNT = 160;
    const stars = [];
    for (let i = 0; i < STARS_COUNT; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.5 + 0.4,
            alpha: Math.random() * 0.7 + 0.15,
            twinkleSpeed: Math.random() * 0.025 + 0.004,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }

    // ========== 流星碎屑粒子 ==========
    class SparkParticle {
        constructor(x, y, vx, vy, life, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.life = life;
            this.maxLife = life;
            this.color = color;
            this.size = Math.random() * 1.2 + 0.3;
        }
        update(dt) {
            this.life -= dt;
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            // 减速
            this.vx *= 0.97;
            this.vy *= 0.97;
            return this.life <= 0;
        }
        draw(ctx) {
            const alpha = Math.max(0, this.life / this.maxLife);
            const c = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha * 0.8})`;
            ctx.fill();
        }
    }

    // ========== 流星类 ==========
    class Meteor {
        constructor(batchIndex, totalInBatch) {
            this.id = Math.random();
            this.batchIndex = batchIndex;
            this.reset();
            this.sparks = [];
            this.totalSparks = 0;
            this.wobbleOffset = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 3 + 2;
            this.wobbleAmp = Math.random() * 2.5 + 1;
        }

        reset() {
            // 角度：从左向右，微倾 ~5°~30°
            this.angle = Math.random() * 0.44 + 0.08;

            // 速度 像素/秒
            this.speedPxPerSec = Math.random() * 200 + 160;

            // 起点
            this.startX = -(Math.random() * w * 0.55 + 40);
            this.startY = Math.random() * h * 0.88;

            // 终点
            const travelDist = w + h * 0.25 + 350;
            this.endX = this.startX + Math.cos(this.angle) * travelDist;
            this.endY = this.startY + Math.sin(this.angle) * travelDist;

            // 视觉参数 - 低透明度，不影响阅读
            this.headRadius = Math.random() * 1.2 + 0.6;
            this.opacity = Math.random() * 0.18 + 0.12;
            this.progress = 0;

            // 颜色：更丰富的色调
            const rnd = Math.random();
            if (rnd < 0.35) {
                this.color = { r: 255, g: 255, b: 255 };            // 纯白
            } else if (rnd < 0.55) {
                this.color = { r: 255, g: 248, b: 225 };            // 暖白
            } else if (rnd < 0.72) {
                this.color = { r: 200, g: 225, b: 255 };            // 淡蓝白
            } else if (rnd < 0.86) {
                this.color = { r: 255, g: 235, b: 190 };            // 金白
            } else {
                this.color = { r: 220, g: 200, b: 255 };            // 淡紫白
            }

            // 尾迹长度比例
            this.tailRatio = Math.random() * 0.12 + 0.14;

            // 淡入淡出 - 更柔和
            this.fadeInDuration = 0.03;
            this.fadeOutStart = 0.75;

            // 内核心抖动
            this.wobbleOffset = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 3.5 + 2.5;
            this.wobbleAmp = Math.random() * 2.0 + 0.8;
        }

        update(dt) {
            const totalDist = Math.hypot(this.endX - this.startX, this.endY - this.startY);
            const progressPerSec = this.speedPxPerSec / totalDist;
            this.progress += progressPerSec * dt;

            const head = this.getCurrentHead();

            // 生成尾部碎屑 —— 大幅减少
            if (this.progress > this.fadeInDuration && this.progress < this.fadeOutStart) {
                this.totalSparks += dt * 60;
                const sparkRate = 1.2;
                while (this.totalSparks > 1 / sparkRate) {
                    this.totalSparks -= 1 / sparkRate;
                    const spreadAngle = this.angle + (Math.random() - 0.5) * 0.6;
                    const speed = Math.random() * 30 + 8;
                    const perpX = -Math.sin(this.angle) * (Math.random() - 0.5) * 20;
                    const perpY = Math.cos(this.angle) * (Math.random() - 0.5) * 20;
                    this.sparks.push(new SparkParticle(
                        head.x - Math.cos(this.angle) * 6 + perpX * 0.2,
                        head.y - Math.sin(this.angle) * 6 + perpY * 0.2,
                        Math.cos(spreadAngle) * speed + perpX * 0.3,
                        Math.sin(spreadAngle) * speed + perpY * 0.3,
                        Math.random() * 0.4 + 0.2,
                        this.color
                    ));
                }
            }

            // 更新碎屑
            for (let i = this.sparks.length - 1; i >= 0; i--) {
                if (this.sparks[i].update(dt)) this.sparks.splice(i, 1);
            }

            return this.progress >= 1.18;
        }

        getCurrentHead() {
            const t = this.progress;
            return {
                x: this.startX + (this.endX - this.startX) * t,
                y: this.startY + (this.endY - this.startY) * t
            };
        }

        // 使用正弦抖动模拟尾迹波纹
        getTailPoint(fractionFromHead) {
            const t = Math.max(0, this.progress - fractionFromHead);
            // 在尾迹上叠加正弦波纹，越靠近尾部波纹越大
            const wobbleFactor = fractionFromHead * 1.5;
            const wobble = Math.sin(this.progress * this.wobbleSpeed * 8 + this.wobbleOffset + fractionFromHead * 12)
                * this.wobbleAmp * wobbleFactor;

            const baseX = this.startX + (this.endX - this.startX) * t;
            const baseY = this.startY + (this.endY - this.startY) * t;

            return {
                x: baseX + Math.cos(this.angle + Math.PI / 2) * wobble,
                y: baseY + Math.sin(this.angle + Math.PI / 2) * wobble
            };
        }

        getCurrentOpacity() {
            if (this.progress < this.fadeInDuration) {
                return this.opacity * (this.progress / this.fadeInDuration);
            }
            if (this.progress > this.fadeOutStart) {
                const ratio = (this.progress - this.fadeOutStart) / (1 - this.fadeOutStart);
                return this.opacity * (1 - ratio);
            }
            return this.opacity;
        }

        draw(ctx) {
            const head = this.getCurrentHead();
            const tail0 = this.getTailPoint(this.tailRatio);     // 尾迹近端
            const tail1 = this.getTailPoint(this.tailRatio * 2); // 尾迹中端
            const tail2 = this.getTailPoint(this.tailRatio * 3); // 尾迹远端

            const alpha = this.getCurrentOpacity() * 0.45;
            if (alpha < 0.002) return;
            if (head.x > w + 200 && tail2.x > w + 200) return;
            if (head.x < -200 && tail2.x < -200) return;

            const c = this.color;
            const perp = Math.PI / 2;
            const headWobble = Math.sin(this.progress * this.wobbleSpeed * 4 + this.wobbleOffset) * this.wobbleAmp * 0.3;

            // ===== 绘制碎屑粒子（在尾迹下方） =====
            for (const spark of this.sparks) {
                spark.draw(ctx);
            }

            // ===== 1. 最外层超宽光晕 =====
            ctx.beginPath();
            const gloriaGrad = ctx.createLinearGradient(tail2.x, tail2.y, head.x, head.y);
            gloriaGrad.addColorStop(0, 'rgba(255,255,255,0)');
            gloriaGrad.addColorStop(0.4, `rgba(${c.r},${c.g},${c.b},${alpha * 0.015})`);
            gloriaGrad.addColorStop(0.8, `rgba(${c.r},${c.g},${c.b},${alpha * 0.03})`);
            gloriaGrad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},${alpha * 0.05})`);
            ctx.moveTo(tail2.x, tail2.y);
            ctx.lineTo(head.x, head.y);
            ctx.strokeStyle = gloriaGrad;
            ctx.lineWidth = this.headRadius * 6;
            ctx.lineCap = 'round';
            ctx.stroke();

            // ===== 2. 外层拖尾 =====
            ctx.beginPath();
            const outerGrad = ctx.createLinearGradient(tail1.x, tail1.y, head.x, head.y);
            outerGrad.addColorStop(0, 'rgba(255,255,255,0)');
            outerGrad.addColorStop(0.3, `rgba(${c.r},${c.g},${c.b},${alpha * 0.025})`);
            outerGrad.addColorStop(0.65, `rgba(${c.r},${c.g},${c.b},${alpha * 0.08})`);
            outerGrad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},${alpha * 0.14})`);
            ctx.moveTo(tail1.x, tail1.y);
            ctx.lineTo(head.x, head.y);
            ctx.strokeStyle = outerGrad;
            ctx.lineWidth = this.headRadius * 4;
            ctx.lineCap = 'round';
            ctx.stroke();

            // ===== 3. 中层拖尾 =====
            ctx.beginPath();
            const midGrad = ctx.createLinearGradient(tail0.x, tail0.y, head.x, head.y);
            midGrad.addColorStop(0, 'rgba(255,255,255,0)');
            midGrad.addColorStop(0.25, `rgba(${c.r},${c.g},${c.b},${alpha * 0.05})`);
            midGrad.addColorStop(0.55, `rgba(${c.r},${c.g},${c.b},${alpha * 0.16})`);
            midGrad.addColorStop(0.85, `rgba(${c.r},${c.g},${c.b},${alpha * 0.32})`);
            midGrad.addColorStop(1, `rgba(255,255,255,${alpha * 0.45})`);
            ctx.moveTo(tail0.x, tail0.y);
            ctx.lineTo(head.x, head.y);
            ctx.strokeStyle = midGrad;
            ctx.lineWidth = this.headRadius * 2;
            ctx.lineCap = 'round';
            ctx.stroke();

            // ===== 4. 内核心亮线 =====
            ctx.beginPath();
            const coreGrad = ctx.createLinearGradient(tail0.x, tail0.y, head.x, head.y);
            coreGrad.addColorStop(0, 'rgba(255,255,255,0)');
            coreGrad.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.08})`);
            coreGrad.addColorStop(0.8, `rgba(255,255,255,${alpha * 0.3})`);
            coreGrad.addColorStop(1, `rgba(255,255,255,${Math.min(1, alpha * 0.55)})`);
            ctx.moveTo(tail0.x, tail0.y);
            ctx.lineTo(head.x, head.y);
            ctx.strokeStyle = coreGrad;
            ctx.lineWidth = this.headRadius * 0.55;
            ctx.lineCap = 'round';
            ctx.stroke();

            // ===== 5. 头部外层大光晕 =====
            const bigGlowR = this.headRadius * 5;
            const bigGlow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, bigGlowR);
            bigGlow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha * 0.35})`);
            bigGlow.addColorStop(0.1, `rgba(${c.r},${c.g},${c.b},${alpha * 0.2})`);
            bigGlow.addColorStop(0.35, `rgba(${c.r},${c.g},${c.b},${alpha * 0.05})`);
            bigGlow.addColorStop(0.7, `rgba(${c.r},${c.g},${c.b},${alpha * 0.008})`);
            bigGlow.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.beginPath();
            ctx.arc(head.x, head.y, bigGlowR, 0, Math.PI * 2);
            ctx.fillStyle = bigGlow;
            ctx.fill();

            // ===== 6. 头部中层光晕 =====
            const midGlowR = this.headRadius * 2.5;
            const midGlow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, midGlowR);
            midGlow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha * 0.55})`);
            midGlow.addColorStop(0.25, `rgba(${c.r},${c.g},${c.b},${alpha * 0.3})`);
            midGlow.addColorStop(0.6, `rgba(${c.r},${c.g},${c.b},${alpha * 0.06})`);
            midGlow.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.beginPath();
            ctx.arc(head.x, head.y, midGlowR, 0, Math.PI * 2);
            ctx.fillStyle = midGlow;
            ctx.fill();

            // ===== 7. 头部内核光点 =====
            const kernelR = this.headRadius * 1.2;
            const kernelGlow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, kernelR);
            kernelGlow.addColorStop(0, `rgba(255,255,255,${Math.min(1, alpha * 0.85)})`);
            kernelGlow.addColorStop(0.3, `rgba(${c.r},${c.g},${c.b},${alpha * 0.6})`);
            kernelGlow.addColorStop(0.7, `rgba(${c.r},${c.g},${c.b},${alpha * 0.15})`);
            kernelGlow.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.beginPath();
            ctx.arc(head.x, head.y, kernelR, 0, Math.PI * 2);
            ctx.fillStyle = kernelGlow;
            ctx.fill();

            // ===== 8. 极核白点 =====
            ctx.beginPath();
            ctx.arc(head.x, head.y, this.headRadius * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha * 0.9)})`;
            ctx.fill();
        }
    }

    // ========== 流星批次管理 ==========
    let meteors = [];
    let batchTimer = 0;
    const BATCH_INTERVAL = 5.0;  // 每 5 秒一波
    const BATCH_SIZE_MIN = 3;
    const BATCH_SIZE_MAX = 7;

    function spawnBatch() {
        const count = BATCH_SIZE_MIN + Math.floor(Math.random() * (BATCH_SIZE_MAX - BATCH_SIZE_MIN + 1));
        for (let i = 0; i < count; i++) {
            const staggerDelay = Math.random() * 0.5;
            setTimeout(() => meteors.push(new Meteor(i, count)), staggerDelay * 1000);
        }
    }

    setTimeout(() => spawnBatch(), 250);

    // ========== 动画循环 ==========
    let time = 0;
    let lastTimestamp = 0;

    function animate(timestamp) {
        let dt = 0;
        if (lastTimestamp) {
            dt = (timestamp - lastTimestamp) / 1000;
            if (dt > 0.2) dt = 0.2;
        }
        lastTimestamp = timestamp;

        ctx.clearRect(0, 0, w, h);

        // 绘制星空
        for (const star of stars) {
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6;
            const alpha = star.alpha * twinkle;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fill();
        }

        // 绘制流星
        for (let i = meteors.length - 1; i >= 0; i--) {
            const meteor = meteors[i];
            meteor.draw(ctx);
            if (meteor.update(dt)) {
                meteors.splice(i, 1);
            }
        }

        // 批次计时
        batchTimer += dt;
        if (batchTimer >= BATCH_INTERVAL) {
            batchTimer = 0;
            spawnBatch();
        }

        time += dt;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();
