
'use client';

import {
  doc,
  DocumentReference,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useFirestore } from '../';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError, SecurityRuleContext } from '../errors';

export function useDoc<T>(path: string, options?: { deps?: any[] }) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const docRef = useMemo(() => {
    if (!firestore) {
      return null;
    }
    return doc(firestore, path);
  }, [firestore, path, ...(options?.deps || [])]);

  useEffect(() => {
    if (!docRef) {
      return;
    }
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setData({ ...data, id: snapshot.id } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path,
          operation: 'get',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef, path]);

  const update = async (data: Partial<T>) => {
    if (!docRef) {
      return;
    }
    return setDoc(docRef as DocumentReference<T>, data, { merge: true }).catch(
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      }
    );
  };

  const set = async (data: T) => {
    if (!docRef) {
      return;
    }
    return setDoc(docRef as DocumentReference<T>, data).catch((error) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: data,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return { data, loading, set, update };
}

    