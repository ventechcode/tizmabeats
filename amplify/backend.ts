import { defineBackend } from '@aws-amplify/backend';

import { bucket } from './storage/resource';

defineBackend({
  bucket
});