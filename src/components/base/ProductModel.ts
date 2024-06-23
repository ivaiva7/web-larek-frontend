import { Api, ApiListResponse } from './api';
import { Product } from '../../types/types';

export class ProductModel {
	api: Api;
	products: Product[] = [];

	constructor(api: Api) {
		this.api = api;
	}

	async loadProducts(): Promise<void> {
		try {
			const result = await this.api.get('/product/') as ApiListResponse<Product>;
			this.products = result.items;
			console.log(this.products);
		} catch (error) {
			console.error("Не загружено:", error);
			alert(`Ошибка загрузки продуктов: ${error.message}`);
		}
	}

	getProducts(): Product[] {
		return this.products;
	}
}
