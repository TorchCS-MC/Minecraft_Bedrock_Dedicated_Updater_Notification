
const discord_webhook_url = "your discord webhook";

let last_version = {
    windows: { normal: "", preview: "" },
    linux: { normal: "", preview: "" }
};

function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function logWithTimestamp(message) {
    const now = new Date();
    const timestamp = now.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
    console.log(`[${timestamp}] ${message}`);
}


async function get_download_urls_from_minecraft_website_bedrock_download() {
    try {
        const response = await fetch("https://www.minecraft.net/de-de/download/server/bedrock");
        const response_text = await response.text();
        return response_text.match(/https:\/\/www\.minecraft\.net\/[\w\-\/]+\/bedrock-server-\d+\.\d+\.\d+\.\d+\.zip/g);
    } catch (error) {
        logWithTimestamp(`Error fetching download URLs: ${error.message}`);
        return [];
    }
}

async function send_discord_webhook(platform, versionType, downloadUrl) {
    const versionMatch = downloadUrl.match(/bedrock-server-(\d+\.\d+\.\d+\.\d+)\.zip/);
    const version = versionMatch ? versionMatch[1] : "Unknown";

    const discord_webhook_payload = {
        embeds: [
            {
                title: "TorchCS Updater for Minecraft Bedrock Dedicated",
                description: `A new update Version **${version}** is available for **Minecraft Bedrock Dedicated ${capitalizeFirstLetter(platform)} ${capitalizeFirstLetter(versionType)}**.`,
                color: platform === "windows" ? 3447003 : 15105570,
                fields: [
                    {
                        name: "Download Link",
                        value: `[Click here](${downloadUrl})`
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Minecraft Bedrock Dedicated " + capitalizeFirstLetter(versionType)
                }
            }
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 5,
                        label: "Download Now",
                        url: downloadUrl
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(discord_webhook_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(discord_webhook_payload)
        });

        if (response.ok) {
            logWithTimestamp(`Successfully sent webhook for ${platform} (${versionType}, Version: ${version}). URL: ${downloadUrl}`);
        } else {
            logWithTimestamp(`Failed to send webhook for ${platform} (${versionType}, Version: ${version}). Status: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        logWithTimestamp(`Error sending webhook for ${platform} (${versionType}, Version: ${version}). Error: ${error.message}`);
    }
}

async function update() {
    const urls = await get_download_urls_from_minecraft_website_bedrock_download();
    if (!urls) return;

    for (const url of urls) {
        if (url.includes("win")) {
            let last_version_ = last_version.windows;
            if (url.includes("preview")) {
                if (last_version_.preview !== url) {
                    last_version_.preview = url;
                    logWithTimestamp(`Windows Preview updated to: ${url}`);
                    await send_discord_webhook("windows", "preview", url);
                }
            } else {
                if (last_version_.normal !== url) {
                    last_version_.normal = url;
                    logWithTimestamp(`Windows Normal updated to: ${url}`);
                    await send_discord_webhook("windows", "normal", url);
                }
            }
        } else if (url.includes("linux")) {
            let last_version_ = last_version.linux;
            if (url.includes("preview")) {
                if (last_version_.preview !== url) {
                    last_version_.preview = url;
                    logWithTimestamp(`Linux Preview updated to: ${url}`);
                    await send_discord_webhook("linux", "preview", url);
                }
            } else {
                if (last_version_.normal !== url) {
                    last_version_.normal = url;
                    logWithTimestamp(`Linux Normal updated to: ${url}`);
                    await send_discord_webhook("linux", "normal", url);
                }
            }
        }
    }
}

async function main() {
    setInterval(async () => {
        await update();
        logWithTimestamp("Update check completed.");
    }, 5000);
}

main();