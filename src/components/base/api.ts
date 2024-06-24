export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers ?? {})
            },
            ...options
        };
    }

    protected async handleResponse(response: Response): Promise<object> {
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            const error = data.error ?? response.statusText;
            return Promise.reject(error);
        }
    }

    get<T>(uri: string): Promise<T> {
        return this._request<T>(uri, {
            ...this.options,
            method: 'GET'
        });
    }

    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        return this._request<T>(uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        });
    }

    protected async _request<T>(url: string, options: RequestInit): Promise<T> {
        const response = await fetch(this.baseUrl + url, options);
        return this.handleResponse(response) as Promise<T>;
    }
}
