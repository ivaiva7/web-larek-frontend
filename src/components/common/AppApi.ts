import { IProduct, IOrder, IOrderResult } from '../../types/types';
import { Api} from '../base/api';
import { List } from '../../types/types';


export interface IAppApi {
	getProducts(): Promise<List<IProduct>>;
	makeOrder(order: IOrder): Promise<IOrderResult>;
}

export class AppApi extends Api implements IAppApi {
	readonly cdn: string

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	getProducts(): Promise<List<IProduct>> {
		return this.get('/product') as Promise<List<IProduct>>;
	}

	makeOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order) as Promise<IOrderResult>;
	}
}