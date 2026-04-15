"use client";

export function trackGA4Event(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
    console.log('GA4 Event Fired: ', eventName, eventParams);
  } else {
    console.warn('GA4: dataLayer not available for event tracking');
  }
}
