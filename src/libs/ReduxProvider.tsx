'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppStore, makeStore } from '@/redux/store';
import { persistStore } from 'redux-persist';
import { Spin } from 'antd';
import { authActions } from '@/redux/authSlice';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<any>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  useEffect(() => {
    // Sau khi persist restore xong, check token và fetch user
    if (storeRef.current) {
      storeRef.current.dispatch(authActions.logIn());
    }
  }, []);

  return (
    <Provider store={storeRef.current}>
      <PersistGate
        loading={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <Spin size="large" />
          </div>
        }
        persistor={persistorRef.current}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
