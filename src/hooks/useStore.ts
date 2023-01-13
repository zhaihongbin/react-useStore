import { useMemo, useRef, useState } from 'react';

function generateUniqID() {
  return Math.random().toString(36).slice(2);
}

const _Store: Record<string, any> = {};

const _setStore = <T>(name: string, value: T) => {
  _Store[name] = value;
};

const _listenerMap = new Map<
  string,
  React.Dispatch<React.SetStateAction<number>>
>();

const useStore = <T extends Record<string, any>>(name: string, value?: T) => {
  const selfRef = useRef<{
    initialized: boolean;
    modify: boolean;
    id: string;
  }>({
    initialized: false,
    modify: false,
    id: generateUniqID()
  });
  if (!selfRef.current.initialized) {
    if (value) {
      _setStore(name, value);
      selfRef.current.initialized = true;
    } else if (_Store[name]) {
      selfRef.current.initialized = true;
    }
  }

  const [, _setFlag] = useState(0);

  const store = useMemo(() => (_Store[name] ?? {}) as Partial<T>, [name]);

  return useMemo(() => {
    const state = new Proxy(store, {
      get: (target, propKey, receiver) => {
        if (!_listenerMap.has(selfRef.current.id)) {
          _listenerMap.set(selfRef.current.id, _setFlag);
        }
        return Reflect.get(target, propKey, receiver);
      },
      set: (target, propKey, value, receiver) => {
        if (selfRef.current.modify) {
          return Reflect.set(target, propKey, value, receiver);
        }
        throw new Error('Only setState funtion can be used to update state!');
      }
    });
    return {
      state,
      setState(fn: (draft: Partial<T>) => void) {
        selfRef.current.modify = true;
        fn(state);
        selfRef.current.modify = false;
        // TODO 浅比较状态是否更新
        [..._listenerMap.values()].map(update => update(pre => pre + 1));
      }
    };
  }, [store]);
};

export default useStore;
