import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WayCmsApi implements ICredentialType {
	name = 'wayCmsApi';
	displayName = 'Way-CMS API';
	documentationUrl = 'https://github.com/nichochar/way-cms';
	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: 'http://localhost:5000',
			placeholder: 'https://your-way-cms-instance.com',
			description: 'Base URL of your Way-CMS instance (no trailing slash)',
		},
		{
			displayName: 'Auth Token',
			name: 'authToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Bearer token for Way-CMS API authentication',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.authToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/config',
			method: 'GET',
		},
	};
}
