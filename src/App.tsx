import { useCallback } from 'react';
import './App.css';
import useStore from './hooks/useStore';
import Comp1 from './components/comp1';

export type User = {
  name: string;
  age: number;
};

function App() {
  console.log('App render');

  const { setState } = useStore<User>('user', { name: 'zhb', age: 26 });

  const modifyName = useCallback(() => {
    console.log('execute modifyName');
    setState(draft => {
      draft.name = '123';
    });
  }, [setState]);

  return (
    <div className='App'>
      <Comp1 />
      <button onClick={modifyName}>修改名字 </button>
    </div>
  );
}

export default App;
