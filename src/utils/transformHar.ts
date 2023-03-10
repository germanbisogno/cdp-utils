import { Har } from 'har-format';

import match from '@menadevs/objectron';
import { Request } from '../performance/interfaces/request';

const entryPattern = {
  pageref: /(?<pageRef>.*)/,
  startedDateTime: /(?<startedDateTime>.*)/,
  request: {
    method: /(?<requestMethod>GET|POST)/,
    url: /(?<requestUrl>[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*))/,
    httpVersion: /(?<requestHttpVersion>.*)/,
    headersSize: /^(?<requestHeaderSize>-?(\d+\.?\d*|\d*\.?\d+))$/,
    bodySize: /^(?<requestHeaderSize>-?(\d+\.?\d*|\d*\.?\d+))$/,
  },
  response: {
    status: /^(?<responseStatus>[0-9]{3})/,
    content: {
      size: /^(?<responseContentSize>-?(\d+\.?\d*|\d*\.?\d+))$/,
    },
    headers: [
      { name: /^content-type$/i, value: /(?<responseContentType>.*)/ },
      { name: /^content-length$/i, value: /(?<responseContentLength>.*)/ },
      { name: /^cache-control$/i, value: /(?<responseCacheControl>.*)/ },
    ],
  },
  timings: (val) => val,
  time: /^(?<time>-?(\d+\.?\d*|\d*\.?\d+))$/,
};

export class Utils {
  static transformHar(harFile: Har): Request[] {
    const flatEntries: Request[] = [];

    harFile.log.entries.forEach((entry) => {
      try {
        const currentEntry = match(entry, entryPattern);

        if (currentEntry.match) {
          const flatEntry = {
            ...currentEntry.groups,
            ...currentEntry.matches.timings,
          };

          flatEntries.push(flatEntry);
        }
      } catch (error) {
        console.log('error message: ', error.message);
        throw error;
      }
    });

    return flatEntries;
  }
}
