interface Product {
	id: number;
	name: string;
	price: number;
	description: string;
	image: string;
}
interface CartItem {
	product: Product;
	quantity: number;
}
interface UserCheckoutData {
	email: string;
	phone: string;
	address: string;
	paymentMethod: string;
}
interface APIClient {
	getProductById(id: number): Promise<Product>;
	getAllProducts(): Promise<Product[]>;
	addProductToCart(productId: number): Promise<void>;
	removeProductFromCart(productId: number): Promise<void>;
}
interface ProductCardProps {
	product: Product;
	onOpenModal: (product: Product) => void;
}

interface ProductModalProps {
	product: Product;
	onClose: () => void;
	onAddToCart: (product: Product) => void;
	onRemoveFromCart: (product: Product) => void;
}
