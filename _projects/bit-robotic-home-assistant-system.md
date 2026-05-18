---
title: BIT - An AI-Powered Spatial-Intelligence Vision-Robotic Home Assistant System
description: AI-powered ROS2 robotic assistant for autonomous navigation, voice-command interaction, robotic manipulation, and multimodal perception for elderly and physically challenged individuals.
status: Active
featured: false
order: 6
image: /assets/images/projects/Bit-Home.gif
duration: 2025 - Present
funding: University Research Grant
team:
  - Md Yasin Arafat
  - Farhana Mehazbin Tusti
  - Dr. Shahnewaz Siddique
---
![BIT Robotic Home Assistant System](/assets/images/projects/spatial-intelligence-robot-sim.jpeg)
## Overview
BIT is an AI-powered robotic home assistant built on ROS2, Jetson SBC, STM32, and a 6-DOF arm, designed to assist elderly and physically challenged individuals. It integrates voice commands, LLM/VLLM reasoning, SLAM navigation, and computer vision into a unified framework for natural, safe human-robot interaction.
## Objectives
- Develop an AI-powered robotic assistant capable of autonomous navigation and real-time interaction in indoor environments.
- Implement voice-command-driven robotic motion, object tracking, and robotic arm manipulation.
- Enable autonomous localization and waypoint-based navigation for assistive delivery tasks.
- Integrate perception, robotic control, and LLM/VLLM-based reasoning into a unified ROS2 framework for multimodal human-robot interaction.
- Ensure operational safety through PID-based control, obstacle avoidance, and real-time hardware monitoring.
## Methodology
BIT uses a modular ROS2 architecture on NVIDIA Jetson, combining YOLOv5, NanoTrack, and MediaPipe for perception, and LLM/VLLMs for natural language reasoning. SLAM Toolbox and Nav2 handle autonomous navigation, while PID control and inverse kinematics manage the 6-DOF arm via a custom STM32 UART protocol.

![BIT Methodology](/assets/images/projects/bit-methodology.jpg)

## Computer Vision Pipeline
![BIT Computer Vision Pipeline](/assets/images/projects/Bit_CV_Pipeline.jpg)

## Current Progress
Nine modules have been individually implemented and validated, covering SLAM navigation, voice interaction, object tracking, arm manipulation, fall detection, and LLM-guided motion. Integrated deployment is ongoing, with upcoming milestones including on-device LLM quantization, Bangla ASR, and full assistive home deployment.

### Demo Videos

{% include youtube.html id="ztXiBMU8h5A" %}

{% include youtube.html id="QCs8_d0pvAI" %}
