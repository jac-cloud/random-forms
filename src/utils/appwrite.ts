import { Account, Client, Functions } from 'appwrite';

export const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('6710ef3b003a2dd7daf6');
client.setProject('6710ef3b003a2dd7daf6');

export const account = new Account(client);
export const functions = new Functions(client);
