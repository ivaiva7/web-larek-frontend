
export interface IProductCard {
	id: number;
	name: string;
	price: number;
	description: string;
	image: string;
}

export interface Product {
	id: string;
	title: string;
	price: number;
	description: string;
	image: HTMLImageElement;
	category: string;
}

export interface CartItem {
	product: Product;
	quantity: number;
}

export interface UserCheckoutData {
	email: string;
	phone: string;
	address: string;
	paymentMethod: string;
}

export interface APIClient {
	getProductById(id: number): Promise<Product>;
	getAllProducts(): Promise<Product[]>;
	addProductToCart(productId: number): Promise<void>;
	removeProductFromCart(productId: number): Promise<void>;
}

export interface ProductCardProps {
	product: Product;
	onOpenModal: (product: Product) => void;
}

export interface ProductModalProps {
	product: Product;
	onClose: () => void;
	onAddToCart: (product: Product) => void;
	onRemoveFromCart: (product: Product) => void;
}

export interface Screen {
	show: () => void;
	hide: () => void;
}
