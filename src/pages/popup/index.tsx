import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'
import 'react-toastify/dist/ReactToastify.css';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);