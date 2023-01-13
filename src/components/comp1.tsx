import { useEffect } from 'react';
import { User } from '../App';
import useStore from '../hooks/useStore';

export default function Comp1() {
  console.log('Comp1 render');
  const { state } = useStore<User>('user');
  useEffect(() => {
    // @ts-ignore
    window.state = state;
  }, [state]);
  return <div>{state.name}</div>;
}
