---
title: Spatial-Intelligence Vision-Robotic Assistant System
description: Vision-guided autonomous mobile manipulator for real-time user following, voice-command-driven grasping, and context-aware object placement.
status: Active
featured: false
order: 3
image: /assets/images/projects/spatial-intelligence-robot.jpeg
duration: 2024 - Present
funding: University Research Grant
team:
  - Md Yasin Arafat
  - Farhana Mehazbin Tusti
  - Ahnaf Ojayer
  - Dr. Shahnewaz Siddique
---

![Spatial-Intelligence Vision-Robotic Assistant System](/assets/images/projects/spatial-intelligence-robot.jpeg)

## Overview

Assistive mobile manipulators that can understand and respond to human commands in dynamic environments are key to practical human-robot interaction. This project develops a vision-guided robotic assistant capable of following a user, grasping objects on command, and delivering them to specified locations autonomously. Built on the Hiwonder JetAuto platform with a 6-DOF robotic arm, the system combines real-time perception, trajectory estimation, and motion planning to execute complex tasks seamlessly.

The system is particularly relevant for domestic robotics, healthcare, warehouse automation, and collaborative human-robot workflows. By integrating vision-based tracking, voice command recognition, LLM-based reasoning , and adaptive navigation. Thus providing a robust framework for interactive robotic assistance that moves beyond static manipulation, enabling robots to operate alongside humans naturally and safely.

Using modern AI vision models and a ROS2-based modular architecture, the system has been validated in simulation with Gazebo and MoveIt2 to ensure safe and accurate control of the manipulator and mobile base. Real-world deployment is planned to demonstrate interactive object following, grasping, and context-aware placement tasks.

## Objectives

- Develop a vision-guided mobile robot capable of continuously following a user in real time on command.
- Implement voice-command-driven object grasping, holding, and release.
- Enable autonomous navigation and localization to target locations for context-aware object delivery.
- Integrate perception, motion planning, and LLM-based reasoning into a unified pipeline to orchestrate complex tasks and human-robot interaction.
- Ensure operational safety through visual servoing-based distance control and collision avoidance..

## Methodology

The proposed system leverages a modular ROS2 architecture deployed on NVIDIA Jetson platforms, integrating high-fidelity perception, cognitive reasoning, and coordinated motion control. Visual state estimation employs YOLOv8 for real-time detection and EFS-StrongSORT for robust multi-object tracking, where 2D bounding boxes are stabilized and mapped to the robot's 3D coordinate frame via hand-eye TF transformations. High-level task planning is orchestrated by a Large Language Model (LLM) utilizing Chain-of-Thought (CoT) prompting to interpret unstructured voice commands . For autonomous navigation, the system combines Simultaneous Localization and Mapping (SLAM) with the Timed Elastic Band (TEB) planner to ensure dynamic obstacle avoidance, facilitated by the omnidirectional mobility of mecanum wheels. Active user-following is achieved through a decoupled visual servoing scheme, where a PID controller governs base standoff distance while the 6-DOF manipulator dynamically adjusts yaw and pitch joints for target centering. Finally, manipulation tasks are modeled and executed within a high-fidelity Gazebo simulation environment via MoveIt2 to validate collision-free trajectory planning and kinematic feasibility prior to physical deployment.

## Current Progress

Completed modular simulation in Gazebo for individual components:
  - Part 1: Spatial Localization and Simultaneous Mapping
  - Part 2: User-following with single-object tracking
  - Part 3: Multi-object tracking using LLMs for context-aware, dynamic target selection.
  - Part 4: Voice-command-driven robot mobility (forward, backward, left, right)
  - Part 5: Pick-and-place manipulation of selected objects
  - Part 6: Autonomous navigation to specified locations for object delivery
- Part-wise real-world deployment is ongoing, validating each module separately
- Upcoming milestones: full integration of all modules in Gazebo simulation, closed-loop testing of perception-action pipeline, and final deployment of the fully integrated system

