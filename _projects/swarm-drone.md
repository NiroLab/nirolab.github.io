---
title: Coordinated Drone Swarms for Precision Agriculture, Fisheries, and Drone Show Applications
description: A coordinated multi-drone system designed for precision agriculture, fisheries management, and drone show applications.
status: Active
featured: true
order: 3
image: /assets/images/projects/swarm-drone.jpg
duration: 2025 - Present
funding:
team:
  - Dr. Shahnewaz Siddique
  - Shafwan Ahmed
  - Tajnimul Hossain
  - Rodshi Jahin Prapty
---

This project presents a coordinated multi-drone system designed for precision agriculture, fisheries management, and drone show applications. Using the Pixhawk flight controller, dual GPS modules, and ArduCopter firmware, each drone operates collaboratively to perform automated tasks such as field monitoring and resource distribution.

Through telemetry links, a ground control station coordinates navigation, communication, and coordination. The system demonstrates how swarm coordination can minimize labor, improve efficiency, and boost sustainability in rural sectors.

**Keywords:** ArduCopter, Pixhawk, Drone Swarm, Precision Farming, Automated Fishing, Drone Show

## Key Features

### Precision Agriculture
Automated field monitoring, crop health assessment, and precise resource distribution using coordinated flight patterns.

### Fisheries Management
Automated feeding systems, surveillance operations, and efficient fishery monitoring to reduce manual labor.

### Drone Light Shows
Synchronized aerial entertainment with LED modules, offering an eco-friendly alternative to traditional fireworks.

### Advanced Communication
Dual communication system using radio telemetry and Wi-Fi for reliable swarm coordination and control.

### High Precision Navigation
RTK-GPS correction achieving centimeter-level positioning accuracy with dual GPS module configuration.

## System Architecture

### Hardware Components

| Component | Specification | Purpose |
|-----------|--------------|---------|
| Flight Controller | Pixhawk 2.4.8 | Stabilization, navigation, motor control |
| GPS Modules | Dual M9N GPS | Enhanced positioning accuracy |
| Companion Computer | Raspberry Pi Zero 2W | High-level computation, coordination |
| Battery | 11.1V 3500mAh LiPo | Power source for flight operations |
| Communication | Radio Telemetry + Wi-Fi | Ground station and inter-drone communication |
| RTK System | RTK-GPS Base Station | Centimeter-level positioning corrections |

### Software Stack

- **ArduPilot Firmware:** Core flight control managing attitude stabilization, navigation, and sensor fusion
- **Mission Planner:** Ground control interface for mission planning, waypoint configuration, and real-time monitoring
- **Custom Coordination Software:** Python and C++ programs for formation control and swarm behavior
- **Simulation Environment:** CoppeliaSim for pre-deployment testing and validation

## Experimental Results

### Positioning Accuracy
The system achieved impressive positioning accuracy through GPS module optimization. Using dual M9N GPS modules with RTK correction, positioning errors were reduced to just 0.5-1 meters, compared to 9-10 meters with basic M6 modules.

### Formation Control
Real-world flight tests demonstrated stable formation control with lightweight LED payloads. The drones maintained coordinated flight patterns with minimal inter-drone separation errors.

### Simulation Validation
Extensive testing in CoppeliaSim verified trajectory tracking, formation stability, and energy consumption patterns before real-world deployment.

## Impact & Applications

### Environmental Benefits
The system promotes sustainability through precise resource distribution, reducing waste of fertilizers, pesticides, and water. Drone light shows eliminate the air pollution, chemical residue, and noise associated with traditional fireworks.

### Societal Impact
By automating physically demanding and hazardous agricultural tasks, the system reduces worker exposure to dangerous conditions and chemicals.

### Economic Advantages
The unified platform approach allows the same drone fleet to serve multiple application domains with minimal reconfiguration.

## Future Directions

- Enhanced durability with custom-designed waterproof frames
- Integration of cameras and sensors for autonomous obstacle avoidance
- Extended flight time with high-capacity batteries
- Advanced protocols for better inter-drone coordination and larger swarm scalability
