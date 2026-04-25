import { describe, it, expect } from 'vitest';
import { WayCms } from '../nodes/WayCms/WayCms.node';

const node = new WayCms();
const desc = node.description;

// Helper: find operation prop for a resource
function getOpsForResource(resource: string) {
	return desc.properties.find(
		(p) =>
			p.name === 'operation' &&
			(p.displayOptions?.show?.resource as string[] | undefined)?.includes(resource),
	);
}

// Helper: find a property by name + optional filters
function findProp(name: string, filters?: { resource?: string; operation?: string }) {
	return desc.properties.find((p) => {
		if (p.name !== name) return false;
		if (filters?.resource && !(p.displayOptions?.show?.resource as string[])?.includes(filters.resource)) return false;
		if (filters?.operation && !(p.displayOptions?.show?.operation as string[])?.includes(filters.operation)) return false;
		return true;
	});
}

// ---------------------------------------------------------------------------
// Node metadata
// ---------------------------------------------------------------------------
describe('WayCms Node', () => {
	it('has correct node name', () => {
		expect(desc.name).toBe('wayCms');
	});

	it('requires wayCmsApi credentials', () => {
		const credNames = desc.credentials!.map((c) => c.name);
		expect(credNames).toContain('wayCmsApi');
	});

	it('has 5 resources', () => {
		const resourceProp = desc.properties.find((p) => p.name === 'resource');
		expect(resourceProp).toBeDefined();
		const options = (resourceProp as any).options as { value: string }[];
		const values = options.map((o) => o.value);
		expect(values).toEqual(
			expect.arrayContaining(['file', 'search', 'backup', 'project', 'download']),
		);
		expect(values).toHaveLength(5);
	});

	it('is an action-only node (no trigger)', () => {
		expect(desc.group).toContain('transform');
		expect(desc.polling).toBeUndefined();
		expect(desc.inputs).toEqual(['main']);
		expect(desc.outputs).toEqual(['main']);
	});

	it('requestDefaults uses credentials URL', () => {
		expect(desc.requestDefaults?.baseURL).toBe('={{$credentials.url}}');
		expect(desc.requestDefaults?.headers?.Accept).toBe('application/json');
		expect(desc.requestDefaults?.headers?.['Content-Type']).toBe('application/json');
	});
});

// ---------------------------------------------------------------------------
// File operations
// ---------------------------------------------------------------------------
describe('File operations', () => {
	const ops = getOpsForResource('file');

	it('has 5 operations', () => {
		expect((ops as any).options).toHaveLength(5);
	});

	it('Create uses POST /api/file', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'create');
		expect(op.routing.request.method).toBe('POST');
		expect(op.routing.request.url).toBe('/api/file');
	});

	it('Get uses GET /api/file', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'get');
		expect(op.routing.request.method).toBe('GET');
		expect(op.routing.request.url).toBe('/api/file');
	});

	it('Update uses PUT /api/file', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'update');
		expect(op.routing.request.method).toBe('PUT');
		expect(op.routing.request.url).toBe('/api/file');
	});

	it('Delete uses DELETE /api/file', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'delete');
		expect(op.routing.request.method).toBe('DELETE');
		expect(op.routing.request.url).toBe('/api/file');
	});

	it('List uses GET /api/files', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'list');
		expect(op.routing.request.method).toBe('GET');
		expect(op.routing.request.url).toBe('/api/files');
	});

	it('has path query param for get/create/update/delete', () => {
		const pathProp = findProp('path', { resource: 'file' });
		expect(pathProp).toBeDefined();
		expect((pathProp as any).routing.send.type).toBe('query');
		expect((pathProp as any).routing.send.property).toBe('path');
	});

	it('has content body param for create/update', () => {
		const contentProp = findProp('content', { resource: 'file' });
		expect(contentProp).toBeDefined();
		expect((contentProp as any).routing.send.type).toBe('body');
		expect((contentProp as any).routing.send.property).toBe('content');
	});

	it('has pathBody hidden param for create/update', () => {
		const pathBody = findProp('pathBody', { resource: 'file' });
		expect(pathBody).toBeDefined();
		expect(pathBody!.type).toBe('hidden');
		expect((pathBody as any).routing.send.type).toBe('body');
		expect((pathBody as any).routing.send.property).toBe('path');
	});

	it('has listPath param for list operation', () => {
		const listPath = findProp('listPath', { operation: 'list' });
		expect(listPath).toBeDefined();
		expect((listPath as any).routing.send.type).toBe('query');
		expect((listPath as any).routing.send.property).toBe('path');
	});
});

// ---------------------------------------------------------------------------
// Search operations
// ---------------------------------------------------------------------------
describe('Search operations', () => {
	const ops = getOpsForResource('search');

	it('has 2 operations', () => {
		expect((ops as any).options).toHaveLength(2);
	});

	it('Search Files uses GET /api/search', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'searchFiles');
		expect(op.routing.request.method).toBe('GET');
		expect(op.routing.request.url).toBe('/api/search');
	});

	it('Search and Replace uses POST /api/search-replace', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'searchReplace');
		expect(op.routing.request.method).toBe('POST');
		expect(op.routing.request.url).toBe('/api/search-replace');
	});

	it('has query param for searchFiles', () => {
		const queryProp = findProp('query', { operation: 'searchFiles' });
		expect(queryProp).toBeDefined();
		expect((queryProp as any).routing.send.type).toBe('query');
		expect((queryProp as any).routing.send.property).toBe('query');
	});

	it('has searchPath param for searchFiles', () => {
		const searchPath = findProp('searchPath', { operation: 'searchFiles' });
		expect(searchPath).toBeDefined();
		expect((searchPath as any).routing.send.type).toBe('query');
		expect((searchPath as any).routing.send.property).toBe('path');
	});

	it('has search body param for searchReplace', () => {
		const searchProp = findProp('search', { operation: 'searchReplace' });
		expect(searchProp).toBeDefined();
		expect((searchProp as any).routing.send.type).toBe('body');
		expect((searchProp as any).routing.send.property).toBe('search');
	});

	it('has replace body param for searchReplace', () => {
		const replaceProp = findProp('replace', { operation: 'searchReplace' });
		expect(replaceProp).toBeDefined();
		expect((replaceProp as any).routing.send.type).toBe('body');
		expect((replaceProp as any).routing.send.property).toBe('replace');
	});

	it('has replacePath body param for searchReplace', () => {
		const replacePath = findProp('replacePath', { operation: 'searchReplace' });
		expect(replacePath).toBeDefined();
		expect((replacePath as any).routing.send.type).toBe('body');
		expect((replacePath as any).routing.send.property).toBe('path');
	});

	it('has preview boolean for searchReplace', () => {
		const preview = findProp('preview', { operation: 'searchReplace' });
		expect(preview).toBeDefined();
		expect(preview!.type).toBe('boolean');
		expect(preview!.default).toBe(true);
		expect((preview as any).routing.send.type).toBe('body');
		expect((preview as any).routing.send.property).toBe('preview');
	});
});

// ---------------------------------------------------------------------------
// Backup operations
// ---------------------------------------------------------------------------
describe('Backup operations', () => {
	const ops = getOpsForResource('backup');

	it('has 7 operations', () => {
		expect((ops as any).options).toHaveLength(7);
	});

	it('Create uses POST /api/create-backup', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'create');
		expect(op.routing.request.method).toBe('POST');
		expect(op.routing.request.url).toBe('/api/create-backup');
	});

	it('Create Folder uses POST /api/create-folder-backup', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'createFolder');
		expect(op.routing.request.method).toBe('POST');
		expect(op.routing.request.url).toBe('/api/create-folder-backup');
	});

	it('Delete uses DELETE /api/backup/{backupPath}', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'delete');
		expect(op.routing.request.method).toBe('DELETE');
		expect(op.routing.request.url).toContain('/api/backup/');
		expect(op.routing.request.url).toContain('backupPath');
	});

	it('List uses GET /api/backups', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'list');
		expect(op.routing.request.method).toBe('GET');
		expect(op.routing.request.url).toBe('/api/backups');
	});

	it('List Folder uses GET /api/folder-backups', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'listFolder');
		expect(op.routing.request.method).toBe('GET');
		expect(op.routing.request.url).toBe('/api/folder-backups');
	});

	it('Restore uses POST /api/restore-backup', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'restore');
		expect(op.routing.request.method).toBe('POST');
		expect(op.routing.request.url).toBe('/api/restore-backup');
	});

	it('Restore Folder uses POST /api/restore-folder-backup', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'restoreFolder');
		expect(op.routing.request.method).toBe('POST');
		expect(op.routing.request.url).toBe('/api/restore-folder-backup');
	});

	it('has backupPath body param for restore/delete', () => {
		const backupPath = findProp('backupPath', { resource: 'backup' });
		expect(backupPath).toBeDefined();
		expect((backupPath as any).routing.send.type).toBe('body');
		expect((backupPath as any).routing.send.property).toBe('path');
	});

	it('has folderPath body param for createFolder/restoreFolder', () => {
		const folderPath = findProp('folderPath', { resource: 'backup' });
		expect(folderPath).toBeDefined();
		expect((folderPath as any).routing.send.type).toBe('body');
		expect((folderPath as any).routing.send.property).toBe('path');
	});
});

// ---------------------------------------------------------------------------
// Project operations
// ---------------------------------------------------------------------------
describe('Project operations', () => {
	const ops = getOpsForResource('project');

	it('has 3 operations', () => {
		expect((ops as any).options).toHaveLength(3);
	});

	it('Get Config uses GET /api/config', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'getConfig');
		expect(op.routing.request.method).toBe('GET');
		expect(op.routing.request.url).toBe('/api/config');
	});

	it('List uses GET /api/my-projects', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'list');
		expect(op.routing.request.method).toBe('GET');
		expect(op.routing.request.url).toBe('/api/my-projects');
	});

	it('Switch uses POST /api/switch-project', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'switch');
		expect(op.routing.request.method).toBe('POST');
		expect(op.routing.request.url).toBe('/api/switch-project');
	});

	it('has projectName body param for switch', () => {
		const projectName = findProp('projectName', { operation: 'switch' });
		expect(projectName).toBeDefined();
		expect((projectName as any).routing.send.type).toBe('body');
		expect((projectName as any).routing.send.property).toBe('project');
	});
});

// ---------------------------------------------------------------------------
// Download operations
// ---------------------------------------------------------------------------
describe('Download operations', () => {
	const ops = getOpsForResource('download');

	it('has 3 operations', () => {
		expect((ops as any).options).toHaveLength(3);
	});

	it('Download File uses GET /api/download-file', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'downloadFile');
		expect(op.routing.request.method).toBe('GET');
		expect(op.routing.request.url).toBe('/api/download-file');
	});

	it('Download ZIP uses GET /api/download-zip with arraybuffer encoding', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'downloadZip');
		expect(op.routing.request.method).toBe('GET');
		expect(op.routing.request.url).toBe('/api/download-zip');
		expect(op.routing.request.encoding).toBe('arraybuffer');
	});

	it('Upload ZIP uses POST /api/upload-zip with application/zip Content-Type', () => {
		const op = (ops as any).options.find((o: any) => o.value === 'uploadZip');
		expect(op.routing.request.method).toBe('POST');
		expect(op.routing.request.url).toBe('/api/upload-zip');
		expect(op.routing.request.headers['Content-Type']).toBe('application/zip');
		expect(op.routing.send.type).toBe('body');
	});

	it('has downloadPath query param for downloadFile', () => {
		const dlPath = findProp('downloadPath', { operation: 'downloadFile' });
		expect(dlPath).toBeDefined();
		expect((dlPath as any).routing.send.type).toBe('query');
		expect((dlPath as any).routing.send.property).toBe('path');
	});
});
