import { useCallback, useEffect, useRef } from 'react'
import { useAppDispatch } from '../../store/store'
import { GenericActions } from '../../store/genericSlice'
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot, collection, deleteDoc, doc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
import { CollectionOptions } from './types'
import { getQuery } from './getQuery'

type ListnerState = {
    name?: string
    unsubscribe: () => void
}

export const useFireStore = <T extends DocumentData>(path: string) => {
    const listenersRef = useRef<ListnerState[]>([]);
    const lastDocRef = useRef<QueryDocumentSnapshot | null>(null);
    const hasMore = useRef(true);
    const ignore = useRef(false);

    useEffect(() => {
        let listenerRefValue: ListnerState[] | null = null;

        if (listenersRef.current) {
            listenerRefValue = listenersRef.current;
        }

        return () => {
            if (listenerRefValue) {
                listenerRefValue.forEach(listener => {
                    listener.unsubscribe();
                })
            }
        }
    }, [])

    const dispatch = useAppDispatch();

    const loadCollection = useCallback((actions: GenericActions<T>, options?: CollectionOptions) => {
        if (options?.reset) {
            lastDocRef.current = null;
            hasMore.current = true;
            dispatch(actions.reset())
        }

        dispatch(actions.loading());

        const query = getQuery(path, options, lastDocRef);
       
        
        const processQuery = (querySnapshot: QuerySnapshot<DocumentData, DocumentData>) => {
            const data: DocumentData[] = [];
            if (querySnapshot.empty) {
                hasMore.current = false;
                dispatch(actions.success([] as unknown as T));
                return;
            }
            querySnapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() })
            })
            if (options?.pagination && options.limit) {
                lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
                hasMore.current = !(querySnapshot.docs.length < options.limit);
            }

            dispatch(actions.success(data as unknown as T))
        }

        if (options?.get) {
            getDocs(query)
                .then(querySnapshot => {
                    processQuery(querySnapshot);
                })
        } else {
            const listener = onSnapshot(query, {
                next: querySnapshot => {
                    processQuery(querySnapshot);
                },
                error: error => {
                    dispatch(actions.error(error.message));
                    console.log('Collection error:', error.message);
                }
            })
            listenersRef.current.push({ name: path, unsubscribe: listener });
        }
    }, [dispatch, path])

    const loadDocument = useCallback((id: string, actions: GenericActions<T>) => {
        dispatch(actions.loading());
        const docRef = doc(db, path, id);

        const listener = onSnapshot(docRef, {
            next: doc => {
                if (!doc.exists) {
                    dispatch(actions.error('Document does not exist'));
                    return;
                }
                dispatch(actions.success({ id: doc.id, ...doc.data() } as unknown as T))
            }
        })
        listenersRef.current.push({ name: path + '/' + id, unsubscribe: listener })
    }, [dispatch, path])

    const create = async (data: T) => {
        const ref = doc(collection(db, path));
        await setDoc(ref, data);
        return ref;
    }

    const update = async (id: string, data: T) => {
        const docRef = doc(db, path, id);
        try {
            return await updateDoc(docRef, data);
        } catch (error: any) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const remove = async (id: string) => {
        try {
            return await deleteDoc(doc(db, path, id));
        } catch (error: any) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const set = async (id: string, data: any) => {
        try {
            return await setDoc(doc(db, path, id), data);
        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        }
    }

    return { loadCollection, loadDocument, create, update, remove, set, hasMore, ignore }
}