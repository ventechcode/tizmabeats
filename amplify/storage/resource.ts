import { defineStorage } from '@aws-amplify/backend';

export const bucket = defineStorage({
    name: 'beats',
    isDefault: true,
  });