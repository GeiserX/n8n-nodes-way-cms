import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class WayCms implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Way-CMS',
		name: 'wayCms',
		icon: 'file:way-cms.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description:
			'Manage archived web content — edit files, search/replace, backup, and manage projects via Way-CMS',
		defaults: {
			name: 'Way-CMS',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'wayCmsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.url}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// ------------------------------------------------------------------
			//  Resource selector
			// ------------------------------------------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Backup', value: 'backup' },
					{ name: 'Download', value: 'download' },
					{ name: 'File', value: 'file' },
					{ name: 'Project', value: 'project' },
					{ name: 'Search', value: 'search' },
				],
				default: 'file',
			},

			// ==================================================================
			//  FILE operations
			// ==================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['file'] } },
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new file',
						action: 'Create a file',
						routing: {
							request: {
								method: 'POST',
								url: '/api/file',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a file',
						action: 'Delete a file',
						routing: {
							request: {
								method: 'DELETE',
								url: '/api/file',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single file',
						action: 'Get a file',
						routing: {
							request: {
								method: 'GET',
								url: '/api/file',
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						description: 'List files in a directory',
						action: 'List files',
						routing: {
							request: {
								method: 'GET',
								url: '/api/files',
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an existing file',
						action: 'Update a file',
						routing: {
							request: {
								method: 'PUT',
								url: '/api/file',
							},
						},
					},
				],
				default: 'list',
			},

			// File – path (query param for GET / DELETE, body for POST / PUT)
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				required: true,
				description: 'File path relative to the project root',
				displayOptions: {
					show: { resource: ['file'], operation: ['get', 'create', 'update', 'delete'] },
				},
				routing: {
					send: {
						type: 'query',
						property: 'path',
						value: '={{$value}}',
					},
				},
			},

			// File – content (body for POST / PUT)
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: { rows: 10 },
				default: '',
				required: true,
				description: 'File content to write',
				displayOptions: {
					show: { resource: ['file'], operation: ['create', 'update'] },
				},
				routing: {
					send: {
						type: 'body',
						property: 'content',
						value: '={{$value}}',
					},
				},
			},

			// File – path body for create/update (needed in body alongside content)
			{
				displayName: 'Path (Body)',
				name: 'pathBody',
				type: 'hidden',
				default: '',
				displayOptions: {
					show: { resource: ['file'], operation: ['create', 'update'] },
				},
				routing: {
					send: {
						type: 'body',
						property: 'path',
						value: '={{$parameter["path"]}}',
					},
				},
			},

			// File – list optional path filter
			{
				displayName: 'Subdirectory',
				name: 'listPath',
				type: 'string',
				default: '',
				description: 'Optional subdirectory to list files from',
				displayOptions: {
					show: { resource: ['file'], operation: ['list'] },
				},
				routing: {
					send: {
						type: 'query',
						property: 'path',
						value: '={{$value}}',
					},
				},
			},

			// ==================================================================
			//  SEARCH operations
			// ==================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['search'] } },
				options: [
					{
						name: 'Search and Replace',
						value: 'searchReplace',
						description: 'Search and replace text across files',
						action: 'Search and replace in files',
						routing: {
							request: {
								method: 'POST',
								url: '/api/search-replace',
							},
						},
					},
					{
						name: 'Search Files',
						value: 'searchFiles',
						description: 'Search for files containing a query string',
						action: 'Search files',
						routing: {
							request: {
								method: 'GET',
								url: '/api/search',
							},
						},
					},
				],
				default: 'searchFiles',
			},

			// Search – query
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				description: 'Search query string',
				displayOptions: {
					show: { resource: ['search'], operation: ['searchFiles'] },
				},
				routing: {
					send: {
						type: 'query',
						property: 'query',
						value: '={{$value}}',
					},
				},
			},

			// Search – optional path scope
			{
				displayName: 'Path Scope',
				name: 'searchPath',
				type: 'string',
				default: '',
				description: 'Optional path to limit search scope',
				displayOptions: {
					show: { resource: ['search'], operation: ['searchFiles'] },
				},
				routing: {
					send: {
						type: 'query',
						property: 'path',
						value: '={{$value}}',
					},
				},
			},

			// Search & Replace – search term
			{
				displayName: 'Search Term',
				name: 'search',
				type: 'string',
				default: '',
				required: true,
				description: 'Text to search for',
				displayOptions: {
					show: { resource: ['search'], operation: ['searchReplace'] },
				},
				routing: {
					send: {
						type: 'body',
						property: 'search',
						value: '={{$value}}',
					},
				},
			},

			// Search & Replace – replace term
			{
				displayName: 'Replace With',
				name: 'replace',
				type: 'string',
				default: '',
				required: true,
				description: 'Text to replace matches with',
				displayOptions: {
					show: { resource: ['search'], operation: ['searchReplace'] },
				},
				routing: {
					send: {
						type: 'body',
						property: 'replace',
						value: '={{$value}}',
					},
				},
			},

			// Search & Replace – optional path
			{
				displayName: 'Path Scope',
				name: 'replacePath',
				type: 'string',
				default: '',
				description: 'Optional path to limit replace scope',
				displayOptions: {
					show: { resource: ['search'], operation: ['searchReplace'] },
				},
				routing: {
					send: {
						type: 'body',
						property: 'path',
						value: '={{$value}}',
					},
				},
			},

			// Search & Replace – preview
			{
				displayName: 'Preview Only',
				name: 'preview',
				type: 'boolean',
				default: true,
				description:
					'Whether to only preview changes without applying them',
				displayOptions: {
					show: { resource: ['search'], operation: ['searchReplace'] },
				},
				routing: {
					send: {
						type: 'body',
						property: 'preview',
						value: '={{$value}}',
					},
				},
			},

			// ==================================================================
			//  BACKUP operations
			// ==================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['backup'] } },
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a full backup',
						action: 'Create a backup',
						routing: {
							request: {
								method: 'POST',
								url: '/api/create-backup',
							},
						},
					},
					{
						name: 'Create Folder Backup',
						value: 'createFolder',
						description: 'Create a backup of a specific folder',
						action: 'Create a folder backup',
						routing: {
							request: {
								method: 'POST',
								url: '/api/create-folder-backup',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a backup',
						action: 'Delete a backup',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/api/backup/{{$parameter["backupPath"]}}',
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all backups',
						action: 'List backups',
						routing: {
							request: {
								method: 'GET',
								url: '/api/backups',
							},
						},
					},
					{
						name: 'List Folder Backups',
						value: 'listFolder',
						description: 'List all folder-level backups',
						action: 'List folder backups',
						routing: {
							request: {
								method: 'GET',
								url: '/api/folder-backups',
							},
						},
					},
					{
						name: 'Restore',
						value: 'restore',
						description: 'Restore from a backup',
						action: 'Restore a backup',
						routing: {
							request: {
								method: 'POST',
								url: '/api/restore-backup',
							},
						},
					},
					{
						name: 'Restore Folder Backup',
						value: 'restoreFolder',
						description: 'Restore a folder-level backup',
						action: 'Restore a folder backup',
						routing: {
							request: {
								method: 'POST',
								url: '/api/restore-folder-backup',
							},
						},
					},
				],
				default: 'list',
			},

			// Backup – path for restore
			{
				displayName: 'Backup Path',
				name: 'backupPath',
				type: 'string',
				default: '',
				required: true,
				description: 'Path of the backup to restore or delete',
				displayOptions: {
					show: { resource: ['backup'], operation: ['restore', 'delete'] },
				},
				routing: {
					send: {
						type: 'body',
						property: 'path',
						value: '={{$value}}',
					},
				},
			},

			// Backup – folder path for create/restore folder backup
			{
				displayName: 'Folder Path',
				name: 'folderPath',
				type: 'string',
				default: '',
				required: true,
				description: 'Path of the folder to backup or restore',
				displayOptions: {
					show: {
						resource: ['backup'],
						operation: ['createFolder', 'restoreFolder'],
					},
				},
				routing: {
					send: {
						type: 'body',
						property: 'path',
						value: '={{$value}}',
					},
				},
			},

			// ==================================================================
			//  PROJECT operations
			// ==================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['project'] } },
				options: [
					{
						name: 'Get Config',
						value: 'getConfig',
						description: 'Get current configuration',
						action: 'Get config',
						routing: {
							request: {
								method: 'GET',
								url: '/api/config',
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						description: 'List available projects',
						action: 'List projects',
						routing: {
							request: {
								method: 'GET',
								url: '/api/my-projects',
							},
						},
					},
					{
						name: 'Switch',
						value: 'switch',
						description: 'Switch to a different project',
						action: 'Switch project',
						routing: {
							request: {
								method: 'POST',
								url: '/api/switch-project',
							},
						},
					},
				],
				default: 'list',
			},

			// Project – name for switch
			{
				displayName: 'Project Name',
				name: 'projectName',
				type: 'string',
				default: '',
				required: true,
				description: 'Name of the project to switch to',
				displayOptions: {
					show: { resource: ['project'], operation: ['switch'] },
				},
				routing: {
					send: {
						type: 'body',
						property: 'project',
						value: '={{$value}}',
					},
				},
			},

			// ==================================================================
			//  DOWNLOAD operations
			// ==================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['download'] } },
				options: [
					{
						name: 'Download File',
						value: 'downloadFile',
						description: 'Download a single file',
						action: 'Download a file',
						routing: {
							request: {
								method: 'GET',
								url: '/api/download-file',
							},
						},
					},
					{
						name: 'Download ZIP',
						value: 'downloadZip',
						description: 'Download the entire project as a ZIP archive',
						action: 'Download project as ZIP',
						routing: {
							request: {
								method: 'GET',
								url: '/api/download-zip',
								encoding: 'arraybuffer',
							},
						},
					},
					{
						name: 'Upload ZIP',
						value: 'uploadZip',
						description: 'Upload a ZIP archive to the project',
						action: 'Upload a ZIP archive',
						routing: {
							request: {
								method: 'POST',
								url: '/api/upload-zip',
								headers: {
									'Content-Type': 'application/zip',
								},
							},
							send: {
								type: 'body',
								property: '',
								value: '={{$binary.data.data}}',
							},
						},
					},
				],
				default: 'downloadFile',
			},

			// Download – file path
			{
				displayName: 'File Path',
				name: 'downloadPath',
				type: 'string',
				default: '',
				required: true,
				description: 'Path of the file to download',
				displayOptions: {
					show: { resource: ['download'], operation: ['downloadFile'] },
				},
				routing: {
					send: {
						type: 'query',
						property: 'path',
						value: '={{$value}}',
					},
				},
			},
		],
	};
}
