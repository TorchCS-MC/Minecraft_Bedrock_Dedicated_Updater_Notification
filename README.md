# Minecraft Bedrock Dedicated Server Updater 🚀

## Description
This project automatically checks for new versions of the **Minecraft Bedrock Dedicated Server** and sends notifications to a **Discord Webhook**.

---

## Features
- Automatically detects new server versions.
- Sends notifications to Discord.
- Supports **Windows** and **Linux** platforms.

---

## Installation & Usage

### 1. Clone the Repository
```bash
git clone https://github.com/TorchCS-MC/Minecraft_Bedrock_Dedicated_Updater_Notification.git
cd Minecraft_Bedrock_Dedicated_Updater_Notification
```

### 2. Build the Docker Image
```bash
docker build -t bedrock-updater .
```

### 3. Run the Docker Container
```bash
docker run -d --name bedrock-updater bedrock-updater
```

---

## License
This project is licensed under the MIT License.

---

## Repository
[GitHub Repository](https://github.com/TorchCS-MC/Minecraft_Bedrock_Dedicated_Updater_Notification.git)
