import { describe, it, expect } from 'vitest';
import { WayCms } from '../nodes/WayCms/WayCms.node';

describe('WayCms Node', () => {
	const node = new WayCms();
	const desc = node.description;

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
			expect.arrayContaining([
				'file',
				'search',
				'backup',
				'project',
				'download',
			]),
		);
		expect(values).toHaveLength(5);
	});

	it('File Create uses POST /api/file with path and content body params', () => {
		const fileOps = desc.properties.find(
			(p) =>
				p.name === 'operation' &&
				p.displayOptions?.show?.resource?.includes('file'),
		);
		expect(fileOps).toBeDefined();
		const createOp = (fileOps as any).options.find(
			(o: any) => o.value === 'create',
		);
		expect(createOp).toBeDefined();
		expect(createOp.routing.request.method).toBe('POST');
		expect(createOp.routing.request.url).toBe('/api/file');

		// Verify path and content body params exist for create
		const pathProp = desc.properties.find(
			(p) =>
				p.name === 'path' &&
				p.displayOptions?.show?.operation?.includes('create'),
		);
		const contentProp = desc.properties.find(
			(p) =>
				p.name === 'content' &&
				p.displayOptions?.show?.operation?.includes('create'),
		);
		expect(pathProp).toBeDefined();
		expect(contentProp).toBeDefined();
	});

	it('Search and Replace uses POST /api/search-replace with search, replace, path, preview params', () => {
		const searchOps = desc.properties.find(
			(p) =>
				p.name === 'operation' &&
				p.displayOptions?.show?.resource?.includes('search'),
		);
		expect(searchOps).toBeDefined();
		const srOp = (searchOps as any).options.find(
			(o: any) => o.value === 'searchReplace',
		);
		expect(srOp).toBeDefined();
		expect(srOp.routing.request.method).toBe('POST');
		expect(srOp.routing.request.url).toBe('/api/search-replace');

		// Verify search, replace, path scope, and preview params
		const searchProp = desc.properties.find(
			(p) =>
				p.name === 'search' &&
				p.displayOptions?.show?.operation?.includes('searchReplace'),
		);
		const replaceProp = desc.properties.find(
			(p) =>
				p.name === 'replace' &&
				p.displayOptions?.show?.operation?.includes('searchReplace'),
		);
		const pathScopeProp = desc.properties.find(
			(p) =>
				p.name === 'replacePath' &&
				p.displayOptions?.show?.operation?.includes('searchReplace'),
		);
		const previewProp = desc.properties.find(
			(p) =>
				p.name === 'preview' &&
				p.displayOptions?.show?.operation?.includes('searchReplace'),
		);
		expect(searchProp).toBeDefined();
		expect(replaceProp).toBeDefined();
		expect(pathScopeProp).toBeDefined();
		expect(previewProp).toBeDefined();
	});

	it('Backup Create uses POST /api/create-backup', () => {
		const backupOps = desc.properties.find(
			(p) =>
				p.name === 'operation' &&
				p.displayOptions?.show?.resource?.includes('backup'),
		);
		expect(backupOps).toBeDefined();
		const createOp = (backupOps as any).options.find(
			(o: any) => o.value === 'create',
		);
		expect(createOp).toBeDefined();
		expect(createOp.routing.request.method).toBe('POST');
		expect(createOp.routing.request.url).toBe('/api/create-backup');
	});

	it('is an action-only node (no trigger)', () => {
		expect(desc.group).toContain('transform');
		expect(desc.polling).toBeUndefined();
		expect(desc.inputs).toEqual(['main']);
		expect(desc.outputs).toEqual(['main']);
	});

	it('Project List uses GET /api/my-projects', () => {
		const projectOps = desc.properties.find(
			(p) =>
				p.name === 'operation' &&
				p.displayOptions?.show?.resource?.includes('project'),
		);
		const listOp = (projectOps as any).options.find(
			(o: any) => o.value === 'list',
		);
		expect(listOp.routing.request.method).toBe('GET');
		expect(listOp.routing.request.url).toBe('/api/my-projects');
	});

	it('Download File uses GET /api/download-file', () => {
		const downloadOps = desc.properties.find(
			(p) =>
				p.name === 'operation' &&
				p.displayOptions?.show?.resource?.includes('download'),
		);
		const dlOp = (downloadOps as any).options.find(
			(o: any) => o.value === 'downloadFile',
		);
		expect(dlOp.routing.request.method).toBe('GET');
		expect(dlOp.routing.request.url).toBe('/api/download-file');
	});
});
