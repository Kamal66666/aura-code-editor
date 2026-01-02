import { Provider } from 'react-redux';
import { store } from './store';
import EditorLayout from './components/Layout/EditorLayout';
import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <div className="h-screen overflow-hidden bg-gray-100">
        <EditorLayout />
      </div>
    </Provider>
  );
};

export default App;
