import { describe, it, expect } from 'vitest';
import { WayCmsApi } from '../credentials/WayCmsApi.credentials';

describe('WayCmsApi Credentials', () => {
	const creds = new WayCmsApi();

	it('has the correct name', () => {
		expect(creds.name).toBe('wayCmsApi');
	});

	it('has the correct displayName', () => {
		expect(creds.displayName).toBe('Way-CMS API');
	});

	it('has documentationUrl', () => {
		expect(creds.documentationUrl).toContain('way-cms');
	});

	it('has url property with correct default', () => {
		const urlProp = creds.properties.find((p) => p.name === 'url');
		expect(urlProp).toBeDefined();
		expect(urlProp!.type).toBe('string');
		expect(urlProp!.default).toBe('http://localhost:5000');
	});

	it('has authToken property with password type', () => {
		const tokenProp = creds.properties.find((p) => p.name === 'authToken');
		expect(tokenProp).toBeDefined();
		expect(tokenProp!.type).toBe('string');
		expect(tokenProp!.typeOptions).toEqual({ password: true });
	});

	it('uses Bearer token via generic authentication', () => {
		expect(creds.authenticate).toBeDefined();
		expect(creds.authenticate.type).toBe('generic');
		const headers = (creds.authenticate as any).properties.headers;
		expect(headers.Authorization).toContain('Bearer');
		expect(headers.Authorization).toContain('authToken');
	});

	it('has credential test request to /api/config', () => {
		expect(creds.test).toBeDefined();
		expect(creds.test.request.url).toBe('/api/config');
		expect(creds.test.request.baseURL).toBe('={{$credentials.url}}');
		expect(creds.test.request.method).toBe('GET');
	});
});
