<p align="center">
  <img src="docs/images/banner.svg" alt="n8n-nodes-way-cms banner" width="900"/>
</p>

<p align="center">
  <a href="https://codecov.io/gh/GeiserX/n8n-nodes-way-cms"><img src="https://codecov.io/gh/GeiserX/n8n-nodes-way-cms/graph/badge.svg" alt="codecov"></a>
</p>

# n8n-nodes-way-cms

[n8n](https://n8n.io/) community node for [Way-CMS](https://github.com/nichochar/way-cms) — manage archived web content, files, backups, and search-replace operations.

Way-CMS is a self-hosted CMS for managing archived web content from the Wayback Machine. This node lets you automate file management, content search and replacement, backup workflows, and project switching directly from n8n.

## Installation

### Community Nodes (recommended)

1. Open **Settings > Community Nodes** in your n8n instance
2. Click **Install a community node**
3. Enter `n8n-nodes-way-cms`
4. Click **Install**

### Manual

```bash
cd ~/.n8n
npm install n8n-nodes-way-cms
```

## Credentials

| Field | Description |
|-------|-------------|
| **URL** | Base URL of your Way-CMS instance (e.g. `http://localhost:5000`) |
| **Auth Token** | Bearer token for API authentication |

## Resources & Operations

### File
| Operation | Method | Description |
|-----------|--------|-------------|
| **List** | `GET /api/files` | List files, optionally filtered by subdirectory |
| **Get** | `GET /api/file` | Retrieve a single file by path |
| **Create** | `POST /api/file` | Create a new file with content |
| **Update** | `PUT /api/file` | Update an existing file's content |
| **Delete** | `DELETE /api/file` | Delete a file by path |

### Search
| Operation | Method | Description |
|-----------|--------|-------------|
| **Search Files** | `GET /api/search` | Search for files matching a query string |
| **Search and Replace** | `POST /api/search-replace` | Find and replace text across files (with preview mode) |

### Backup
| Operation | Method | Description |
|-----------|--------|-------------|
| **List** | `GET /api/backups` | List all backups |
| **Create** | `POST /api/create-backup` | Create a full backup |
| **Restore** | `POST /api/restore-backup` | Restore from a backup |
| **Delete** | `DELETE /api/backup/{path}` | Delete a backup |
| **List Folder Backups** | `GET /api/folder-backups` | List folder-level backups |
| **Create Folder Backup** | `POST /api/create-folder-backup` | Back up a specific folder |
| **Restore Folder Backup** | `POST /api/restore-folder-backup` | Restore a folder backup |

### Project
| Operation | Method | Description |
|-----------|--------|-------------|
| **List** | `GET /api/my-projects` | List available projects |
| **Switch** | `POST /api/switch-project` | Switch active project |
| **Get Config** | `GET /api/config` | Get current configuration |

### Download
| Operation | Method | Description |
|-----------|--------|-------------|
| **Download ZIP** | `GET /api/download-zip` | Download the entire project as ZIP |
| **Download File** | `GET /api/download-file` | Download a single file |
| **Upload ZIP** | `POST /api/upload-zip` | Upload a ZIP archive |

## Other n8n Community Nodes by GeiserX

- [n8n-nodes-cashpilot](https://github.com/GeiserX/n8n-nodes-cashpilot) — Passive income monitoring
- [n8n-nodes-genieacs](https://github.com/GeiserX/n8n-nodes-genieacs) — TR-069 device management
- [n8n-nodes-lynxprompt](https://github.com/GeiserX/n8n-nodes-lynxprompt) — AI configuration blueprints
- [n8n-nodes-pumperly](https://github.com/GeiserX/n8n-nodes-pumperly) — Fuel and EV charging prices
- [n8n-nodes-telegram-archive](https://github.com/GeiserX/n8n-nodes-telegram-archive) — Telegram message archive


## Related Projects

| Project | Description |
|---------|-------------|
| [Wayback-Archive](https://github.com/GeiserX/Wayback-Archive) | Download complete websites from the Wayback Machine with full asset preservation |
| [Wayback-Diff](https://github.com/GeiserX/Wayback-Diff) | Intelligent web page comparison tool with Wayback Machine support |
| [Website-Diff](https://github.com/GeiserX/Website-Diff) | Intelligent web page comparison tool with visual regression testing |
| [Way-CMS](https://github.com/GeiserX/Way-CMS) | Simple web CMS for editing HTML/CSS files downloaded from Wayback Archive |
| [web-mirror](https://github.com/GeiserX/web-mirror) | Mirror any webpage to a local server for offline access |
| [media-download](https://github.com/GeiserX/media-download) | Download all media files from any web page into a folder schema |

## License

[GPL-3.0](LICENSE)
