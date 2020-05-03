import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import produce from 'immer';
import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    setProducts(state =>
      produce(state, draft => {
        const cartIndex = draft.findIndex(
          cartProduct => cartProduct.id === product.id,
        );

        if (cartIndex >= 0) {
          draft[cartIndex].quantity += 1;

          return;
        }

        draft.push(product);
      }),
    );
  }, []);

  const increment = useCallback(async id => {
    setProducts(state =>
      produce(state, draft => {
        const cartIndex = draft.findIndex(cartProduct => cartProduct.id === id);

        if (cartIndex >= 0) {
          draft[cartIndex].quantity += 1;
        }
      }),
    );
  }, []);

  const decrement = useCallback(async id => {
    setProducts(state =>
      produce(state, draft => {
        const cartIndex = draft.findIndex(cartProduct => cartProduct.id === id);

        if (cartIndex >= 0) {
          draft[cartIndex].quantity -= 1;
        }

        if (draft[cartIndex].quantity < 1) {
          draft.splice(cartIndex, 1);
        }
      }),
    );
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
