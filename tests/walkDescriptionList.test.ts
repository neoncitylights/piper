import { describe, expect, test } from 'vitest';

import { walkDescriptionList } from '../src';

describe('walkDescriptionList()', () => {
	test('works with simple description lists', () => {
		const dList = document.createElement('dl');
		dListKv(dList, 'Dog', 'woof');
		dListKv(dList, 'Cat', 'meow');
		dListKv(dList, 'Cow', 'moo');

		const walked = walkDescriptionList(dList, 
			(term) => term.textContent ?? '',
			(details) => details.textContent ?? '');
		
		expect(walked).toEqual(new Map([
			['Dog', 'woof'],
			['Cat', 'meow'],
			['Cow', 'moo'],
		]));
	});

	test('works with grouped key-values in a <div>', () => {
		const dList = document.createElement('dl');
		dListDivKv(dList, 'Dog', 'woof');
		dListDivKv(dList, 'Cat', 'meow');
		dListDivKv(dList, 'Cow', 'moo');

		const walked = walkDescriptionList(dList, 
			(term) => term.textContent ?? '',
			(details) => details.textContent ?? '');
		
		expect(walked).toEqual(new Map([
			['Dog', 'woof'],
			['Cat', 'meow'],
			['Cow', 'moo'],
		]));
	});

	test('returns an empty Map when the description list is empty', () => {
		const dList = document.createElement('dl');
		const walked = walkDescriptionList(dList,
			(term) => term.textContent ?? '',
			(details) => details.textContent ?? '');
		
		expect(walked).toEqual(new Map<string, string>([]));
	});

	test('throws error on invalid description list', () => {
		const dList = document.createElement('dl');
		dList.append(document.createElement('span'));

		expect(() => walkDescriptionList(dList,
			(term) => term.textContent ?? '',
			(details) => details.textContent ?? '')).toThrowError();
	});
});


const dListKv = <T extends HTMLElement>(
	dList: T,
	keyContent: string,
	valueContent: string,
	appendFn?: (dList: T, key: HTMLElement, value: HTMLElement) => void,
) => {
	const key = document.createElement('dt');
	key.textContent = keyContent;

	const value = document.createElement('dd');
	value.textContent = valueContent;

	if(appendFn === undefined) {
		dList.append(key);
		dList.append(value);
	} else {
		appendFn(dList, key, value);
	}
};

const dListDivKv = <T extends HTMLElement>(
	dList: T,
	keyContent: string,
	valueContent: string,
) => {
	dListKv(dList,
		keyContent,
		valueContent,
		(dList, key, value) => {
			const div = document.createElement('div');
			dList.append(div);
			div.append(key);
			div.append(value);
		},
	);
};
