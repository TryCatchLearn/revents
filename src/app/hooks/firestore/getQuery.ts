import { Query, QueryDocumentSnapshot, collection, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { CollectionOptions } from './types';
import { db } from '../../config/firebase';
import { MutableRefObject } from 'react';

export const getQuery = (path: string, options?: CollectionOptions,
    lastDocRef?: MutableRefObject<QueryDocumentSnapshot | null>): Query => {

    let q = collection(db, path) as Query;

    if (options && options.queries) {
        options.queries.forEach(({ attribute, operator, value }) => {
            q = query(q, where(attribute, operator, value))
        })
    }

    if (options && options.sort) {
        const { attribute, order } = options.sort;
        q = query(q, orderBy(attribute, order))
    }

    if (options && options.limit) {
        q = query(q, limit(options.limit))
    }

    if (options && options.pagination) {
        q = query(q, startAfter(lastDocRef?.current));
    }

    return q;
}