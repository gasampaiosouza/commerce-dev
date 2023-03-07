import React from 'react';
import { PRODUCTS } from '../../../content';
import { formatPrice } from '../../helpers/format-price';
import styles from './shelf-item.module.scss';
import WishlistIcon from './wishlist-icon';

interface Props {
  product: typeof PRODUCTS[0];
}

const getFromDB = (label: string) => {
  return JSON.parse(localStorage.getItem(label) || '[]');
};

const ShelfItem: React.FC<Props> = ({ product }) => {
  const [currentCart, setCurrentCart] = React.useState<Props['product'][]>([]);
  const [wishlistIDS, setWishlistIDS] = React.useState<number[]>([]);

  React.useEffect(() => {
    const currentCart: Props['product'][] = getFromDB('cart');
    const currentWishlist: number[] = getFromDB('wishlist');

    setCurrentCart(currentCart);
    setWishlistIDS(currentWishlist);
  }, []);

  function handleAddToWishlist() {
    const updatedWishlist: number[] = getFromDB('wishlist');
    const productAlreadyInWishlist = updatedWishlist.find(
      (p) => p === product.id
    );

    if (productAlreadyInWishlist) {
      const newWishlist = updatedWishlist.filter((p) => p !== product.id);

      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setWishlistIDS(newWishlist);
      return;
    }

    const newWishlist = [...updatedWishlist, product.id];

    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setWishlistIDS(newWishlist);
  }

  function handleAddToCart() {
    const updatedCart: Props['product'][] = getFromDB('cart');
    const productAlreadyInCart = updatedCart.find((p) => p.id === product.id);

    if (productAlreadyInCart) {
      const newCart = updatedCart.filter((p) => p.id !== product.id);
      localStorage.setItem('cart', JSON.stringify(newCart));

      return setCurrentCart(newCart);
    }

    const newCart = [...updatedCart, product];

    localStorage.setItem('cart', JSON.stringify(newCart));
    setCurrentCart(newCart);
  }

  const isProductOnCart = currentCart.find((p) => p.id === product.id);
  const BUYING_PRICE = product.discountPrice
    ? product.discountPrice
    : product.price;

  return (
    <article className={styles.product}>
      <div className={styles['product-image']}>
        <div
          onClick={handleAddToWishlist}
          className={`${styles['product-wishlist']} ${
            wishlistIDS.includes(product.id) ? styles['active'] : ''
          }`}
        >
          <WishlistIcon />
        </div>

        <img src={product.imageUrl} alt={product.name} />
      </div>

      <div className={styles['product-info']}>
        <h3 className={styles['product-name']}>{product.name}</h3>

        <div className={styles['product-price']}>
          <span className={styles['product-price-discount']}>
            {product.discountPrice != 0 && formatPrice(product.price)}
          </span>

          <span className={styles['product-price-original']}>
            {formatPrice(BUYING_PRICE)}
          </span>

          <div className={styles['product-price-installments']}>
            em até <strong>10x de {formatPrice(BUYING_PRICE / 10)}</strong> sem
            juros
          </div>
        </div>
      </div>

      <button
        onClick={() => handleAddToCart()}
        className={`${styles['product-buy']} ${
          isProductOnCart ? styles['added'] : ''
        }`}
      >
        {isProductOnCart ? 'ADICIONADO' : 'ADICIONAR'}
      </button>
    </article>
  );
};

export default ShelfItem;
