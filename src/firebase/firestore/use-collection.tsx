
'use client';

import {
  collection,
  onSnapshot,
  query,
  Query,
  QueryConstraint,
  where,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

import { useFirestore } from '../';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError, SecurityRuleContext } from '../errors';

type UseCollectionOptions<T> = {
  deps?: any[];
  query?: (
    | QueryConstraint
    // This is a hack to allow for a tuple of [string, string, any] to be passed to where()
    | [string, any, any]
  )[];
};

export function useCollection<T>(
  path: string,
  options?: UseCollectionOptions<T>
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  const memoizedQuery = useMemo(() => {
    if (!firestore) {
      return null;
    }

    let q: Query;
    if (options?.query) {
      const queryArgs = options.query.map((arg) => {
        if (Array.isArray(arg)) {
          return where(arg[0], arg[1], arg[2]);
        }
        return arg;
      });
      q = query(collection(firestore, path), ...queryArgs);
    } else {
      q = query(collection(firestore, path));
    }
    return q;
  }, [firestore, path, ...(options?.deps || [])]);

  useEffect(() => {
    if (!memoizedQuery) {
      return;
    }

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return { ...docData, id: doc.id } as T;
        });
        setData(data);
        setLoading(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path,
          operation: 'list',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, path]);

  return { data, loading };
}

    