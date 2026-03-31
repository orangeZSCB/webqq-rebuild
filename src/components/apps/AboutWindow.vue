<template>
  <div class="about-window">
    <div class="about-window__content">
      <div class="about-window__header">
        <div class="about-window__logo">WebQQ 2.0</div>
        <h2 class="about-window__title">WebQQ 2.0 Rebuild</h2>
        <p class="about-window__subtitle">基于 WebQQ 2.0 (2010) 的现代化重构</p>
      </div>

      <div class="about-window__divider"></div>

      <div class="about-window__section">
        <h3>原版权声明</h3>
        <p>WebQQ 是腾讯公司于 2009 年推出的基于浏览器的即时通讯服务，已于 2019 年正式停止运营。</p>
        <p>原始界面设计、交互逻辑及相关视觉素材的版权归 <strong>深圳市腾讯计算机系统有限公司</strong> 所有。</p>
        <p>本项目中所使用的界面布局参考自 Wayback Machine 归档页面，仅用于学习研究目的，不包含任何腾讯公司的原始代码或受保护素材。</p>
        <p class="about-window__disclaimer">本项目仅供学习交流使用，不得用于商业用途。</p>
      </div>

      <div class="about-window__section">
        <h3>技术栈</h3>
        <div class="about-window__tech-grid">
          <span class="tech-tag">Vue 3</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">Vite</span>
          <span class="tech-tag">Pinia</span>
          <span class="tech-tag">NoneBot2</span>
          <span class="tech-tag">NapCatQQ</span>
          <span class="tech-tag">OneBot v11</span>
        </div>
      </div>

      <div class="about-window__section about-window__section--credits">
        <h3>重构者</h3>
        <div class="credit-card">
          <div class="credit-card__name">
            <a href="https://orangestd.cn" target="_blank">二月三十 (Orange)</a>
          </div>
          <div class="credit-card__links">
            <a href="https://x.com/tangeorange" target="_blank" class="credit-link">
              <span class="credit-link__label">X</span> @tangeorange
            </a>
            <a href="https://space.bilibili.com/576114286" target="_blank" class="credit-link">
              <span class="credit-link__label">哔哩哔哩</span> @橙橘桔橙啊
            </a>
          </div>
        </div>
      </div>

      <div class="about-window__footer">
        <p>Made by <a href="https://im.qq.com" target="_blank">Tencent</a> and Rebuild by Orange with ❤.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-window {
  height: 100%;
  background: rgba(255, 255, 255, 0.48);
  padding: 24px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 131, 186, 0.3) transparent;
}

.about-window__content {
  max-width: 440px;
  margin: 0 auto;
}

.about-window__header {
  text-align: center;
  margin-bottom: 20px;
}

.about-window__logo {
  display: inline-block;
  padding: 6px 20px;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff, color-mix(in srgb, #4a9de8 12%, white));
  border: 1px solid rgba(74, 131, 186, 0.22);
  box-shadow: 0 2px 8px rgba(74, 131, 186, 0.14);
  font-size: 16px;
  font-weight: 700;
  color: #2d5f8f;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.about-window__title {
  font-size: 17px;
  font-weight: 700;
  color: #2d5f8f;
  margin: 0 0 4px;
}

.about-window__subtitle {
  font-size: 11px;
  color: rgba(45, 95, 143, 0.55);
  margin: 0;
}

.about-window__divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74, 131, 186, 0.22), transparent);
  margin-bottom: 20px;
}

.about-window__section {
  margin-bottom: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 12px;
  border: 1px solid rgba(74, 131, 186, 0.14);
}

.about-window__section h3 {
  font-size: 13px;
  font-weight: 700;
  color: #2d5f8f;
  margin: 0 0 10px;
}

.about-window__section p {
  font-size: 11px;
  color: rgba(45, 95, 143, 0.78);
  line-height: 1.7;
  margin: 4px 0;
}

.about-window__disclaimer {
  margin-top: 8px !important;
  padding-top: 8px;
  border-top: 1px dashed rgba(74, 131, 186, 0.18);
  font-weight: 600;
  color: rgba(45, 95, 143, 0.65) !important;
}

.about-window__tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 10px;
  background: color-mix(in srgb, #4a9de8 8%, white);
  border: 1px solid rgba(74, 131, 186, 0.16);
  font-size: 11px;
  color: #2d5f8f;
  font-weight: 600;
}

.about-window__section--credits {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(95, 179, 246, 0.06));
}

.credit-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.credit-card__name {
  font-size: 15px;
  font-weight: 700;
}

.credit-card__name a {
  color: #2d5f8f;
  text-decoration: none;
}

.credit-card__name a:hover {
  text-decoration: underline;
}

.credit-card__links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.credit-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #4a83ba;
  text-decoration: none;
}

.credit-link:hover {
  text-decoration: underline;
}

.credit-link__label {
  display: inline-block;
  min-width: 42px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(74, 131, 186, 0.1);
  font-size: 10px;
  font-weight: 700;
  color: #2d5f8f;
  text-align: center;
  text-decoration: none;
}

.about-window__footer {
  text-align: center;
  padding: 16px 0 4px;
}

.about-window__footer p {
  font-size: 12px;
  color: rgba(45, 95, 143, 0.55);
  margin: 0;
}

.about-window__footer a {
  color: #4a83ba;
  text-decoration: none;
  font-weight: 600;
}

.about-window__footer a:hover {
  text-decoration: underline;
}

.about-window a {
  color: #4a83ba;
  text-decoration: none;
}

.about-window a:hover {
  text-decoration: underline;
}
</style>
