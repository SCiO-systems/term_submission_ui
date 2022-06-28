import axios from 'axios';

export default class ProductService {
  getProducts = () => axios.get('assets/demo/data/products.json').then((res) => res.data.data);

  getProductsMixed = () => axios.get('assets/demo/data/products-mixed.json').then((res) => res.data.data);

  getProductsWithOrdersSmall = () => axios.get('assets/demo/data/products-orders-small.json').then((res) => res.data.data);

  getCustomersLarge = () => axios.get('assets/demo/data/customers-large.json').then((res) => res.data.data);

  getProductsSmall = () => axios.get('assets/demo/data/products-small.json').then((res) => res.data.data);
}
