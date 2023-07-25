import { v4 as uuidv4 } from 'uuid';
import { describe, expect, test } from 'vitest';
import { HTMLTableRelatedElement, getClosestParentTableElement, getTableCaption, isTableRelatedElement } from '../src';

const expectTableRelatedElement = (elementName: string, truthy: boolean = true) => {
	const element = document.createElement(elementName);
	const expectation = expect(isTableRelatedElement(element));
	
	if (truthy) {
		expectation.toBeTruthy();
	} else {
		expectation.toBeFalsy();
	}
};

describe('isTableRelatedElement()', () => {
	describe('passes for a table-like element', () => {
		test('<table>', () => expectTableRelatedElement('table'));
		test('<caption>', () => expectTableRelatedElement('caption'));

		describe('table section element (HTMLTableSectionElement)', () => {
			test('<thead>', () => expectTableRelatedElement('thead'));
			test('<tbody>', () => expectTableRelatedElement('tbody'));
			test('<tfoot>', () => expectTableRelatedElement('tfoot'));
		});

		test('<tr>', () => expectTableRelatedElement('tr'));

		describe('table cell element (HTMLTableCellElement)', () => {
			test('<td>', () => expectTableRelatedElement('td'));
			test('<th>', () => expectTableRelatedElement('th'));
		});
	});

	describe('fails for a non-table element', () => {
		test('<div>', () => expectTableRelatedElement('div', false));
		test('<body>', () => expectTableRelatedElement('body', false));
	});
});

describe('getTableCaption()', () => {
	describe('retrieves a caption', () => {
		describe('where there is a child <caption> element', () => {
			test('as the first child', () => {
				document.body.innerHTML = 
	`<table>
		<caption>He-Man and Skeletor facts</caption>
		<tr>
			<td></td>
			<th scope="col" class="heman">He-Man</th>
			<th scope="col" class="skeletor">Skeletor</th>
		</tr>
		<tr>
			<th scope="row">Role</th>
			<td>Hero</td>
			<td>Villain</td>
		</tr>
		<tr>
			<th scope="row">Weapon</th>
			<td>Power Sword</td>
			<td>Havoc Staff</td>
		</tr>
		<tr>
			<th scope="row">Dark secret</th>
			<td>Expert florist</td>
			<td>Cries at romcoms</td>
		</tr>
	</table>`;
				const table = document.getElementsByTagName('table')[0] as HTMLTableElement;
				expect(getTableCaption(table)).toBe('He-Man and Skeletor facts');
			});

			test('as the last child', () => {
				document.body.innerHTML =
	`<table>
		<tr>
			<td></td>
			<th scope="col" class="heman">He-Man</th>
			<th scope="col" class="skeletor">Skeletor</th>
		</tr>
		<tr>
			<th scope="row">Role</th>
			<td>Hero</td>
			<td>Villain</td>
		</tr>
		<tr>
			<th scope="row">Weapon</th>
			<td>Power Sword</td>
			<td>Havoc Staff</td>
		</tr>
		<tr>
			<th scope="row">Dark secret</th>
			<td>Expert florist</td>
			<td>Cries at romcoms</td>
		</tr>
		<caption>He-Man and Skeletor facts</caption>
	</table>`;
				const table = document.getElementsByTagName('table')[0] as HTMLTableElement;
				expect(getTableCaption(table)).toBe('He-Man and Skeletor facts');
			});
		});

		describe('where this is a adjacent HTML heading element', () => {
			test('that is an <h1>', () => {
				const heading = document.createElement('h1');
				heading.textContent = 'Boo!';
				document.body.append(heading);

				const table = document.createElement('table');
				table.setAttribute('id', 'my-cool-table');
				document.body.append(table);

				
				expect(getTableCaption(table)).toBe('Boo!');
			});
		});
	});

	test('does not find a caption', () => {
		const table = document.createElement('table');
		document.body.append(table);

		expect(getTableCaption(table)).toBeFalsy();
	});
});


const expectClosestParentTable = <T extends HTMLTableRelatedElement>(
	childElementName: string,
	appendFn?: ((table: HTMLTableElement, child: T) => void)|undefined,
	truthy: boolean = true,
) => {
	const generatedId = uuidv4();
	const table = document.createElement('table');
	table.setAttribute('id', generatedId);

	const child = document.createElement(childElementName) as T;
	if(appendFn === undefined) {
		table.append(child);
	} else {
		appendFn(table, child);
	}

	const closestTable = getClosestParentTableElement(child);

	if (truthy) {
		expect(closestTable?.tagName).toBe('TABLE');
		expect(closestTable?.getAttribute('id')).toBe(generatedId);
	} else {
		expect(closestTable?.tagName).not.toBe('TABLE');
		expect(closestTable?.getAttribute('id')).not.toBe(generatedId);
	}
};

describe('getClosestParentTableElement()', () => {
	describe('given', () => {
		test('<table> (root element)', () => {
			const table = document.createElement('table');
			expect(getClosestParentTableElement(table)).toBeTruthy();
		});

		test('<caption>', () => expectClosestParentTable('caption'));
		test('<colgroup>', () => expectClosestParentTable('colgroup'));
		test('<thead>', () => expectClosestParentTable('thead'));
		test('<tbody>', () => expectClosestParentTable('tbody'));
		test('<tfoot>', () => expectClosestParentTable('tfoot'));

		describe('<col>', () => {
			test('passes when under <colgroup>', () => {
				expectClosestParentTable('col', (table, child) => {
					const colgroup = document.createElement('colgroup');
					table.append(colgroup);
					colgroup.append(child);
				});
			});

			test('fails when immediate child of <table>', () => {
				expectClosestParentTable('col', undefined, false);
			});
		});
	});
});
