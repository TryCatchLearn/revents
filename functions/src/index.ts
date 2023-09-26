import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { AppEvent, Attendee } from './types/event';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const eventWritten = onDocumentWritten("events/{docId}", async (event) => {
  logger.info("===EVENT WRITTEN START===");
  const beforeData = event.data?.before.data() as AppEvent;
  const afterData = event.data?.after.data() as AppEvent;
  const eventId = event.params.docId;

  let status: Status;
  let attendee = {} as Attendee;

  if (beforeData && beforeData.attendees.length < afterData.attendees.length) {
    logger.info("Someone joined an event");
    attendee = afterData.attendees.filter(a => !beforeData.attendees.some(b => b.id === a.id))[0];
    status = 'attending';
    logger.info(attendee, status, event.time);
  }

  if (beforeData && afterData.attendees.length < beforeData.attendees.length) {
    logger.info("Someone left event");
    attendee = beforeData.attendees.filter(a => !afterData.attendees.some(b => b.id === a.id))[0];
    status = 'removed';
    logger.info(attendee, status, event.time);
  }

  if (!beforeData) {
    logger.info("Someone created an event");
    attendee = afterData.attendees[0];
    status = 'created'
    logger.info(attendee, status, event.time);
  }

  if (attendee) {
    try {
      const followerDocs = await db.collection(`profiles/${attendee.id}/followers`).get();
      followerDocs.docs.forEach(async doc => {
        logger.info(doc);
        await db.doc(`profiles/${doc.id}/newsfeed/${eventId}-${event.time}`).set({
          photoURL: attendee.photoURL,
          date: event.time,
          status,
          displayName: attendee.displayName,
          eventId,
          userUid: attendee.id,
          title: afterData.title
        })
      })
    } catch (error) {
      logger.error(error);
    }
  }

  return console.log("=== EVENT WRITTEN END===")

})

type Status = 'attending' | 'created' | 'removed'