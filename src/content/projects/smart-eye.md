---
title: "智瞳"
published: 2026-06-11
draft: false
order: 100
description: "基于 STM32 与红外阵列传感器的智能热成像测温模组，覆盖原理图、四层 PCB、固件与上位机。"
image: "/assets/images/projects/智瞳.png"
status: "开发项目"
tags: ["STM32F407", "嵌入式 AI", "热成像", "PyQt5"]
lang: "zh_CN"
---

智瞳面向工业与安防场景，核心采用海曼 HTPA 32×24 红外阵列传感器与 STM32F407。项目覆盖原理图、四层 PCB Layout、BOM 选型、C/HAL 固件，以及 Python + PyQt5 上位机。

## 关键实现

- 通过 I2C 读取热成像数据，经双线性插值上采样至 128×96。
- 使用铁红、彩虹、白热等伪彩色映射生成温度热力图。
- 支持 -40°C 至 300°C 测温范围、±0.5°C 精度与最高 16fps 刷新率。
- 上位机展示实时温度曲线、热力图与设备状态。

![智瞳热成像界面](/assets/images/projects/智瞳.png)
![四层 PCB](/assets/images/projects/PCB_PCB_SLV239-热成像项目.png)
![原理图](/assets/images/projects/Schematic_SLV239-热成像项目.png)
