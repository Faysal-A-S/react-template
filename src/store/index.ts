// #https://www.npmjs.com/package/jotai
import { atomWithStorage } from 'jotai/utils';

type Auth = {
	user: undefined;
	token: string;
};

export const authAtom = atomWithStorage<Auth | null>('auth', null, undefined, {
	getOnInit: true,
});
