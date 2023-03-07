import './styles/index.scss';

import ShelfItem from './components/ShelfItem';
import { PRODUCTS } from '../content';

function App() {
  return (
    <div className="App">
      {PRODUCTS.map((product) => (
        <ShelfItem key={product.id} product={product} />
      ))}
    </div>
  );
}

export default App;
