/**
 * Strongly typed instance of a table-related element.
 * 
 * This explicitly does not include any obsolete table element interfaces,
 * which currently include:
 *  - `HTMLTableDataCellElement`
 *  - `HTMLTableHeaderCellElement`
 * @see [Deprecation of `HTMLTableDataCellElement` and `HTMLTableHeaderCellElement` - whatwg/html issue #1115](https://github.com/whatwg/html/issues/1115)
 * @see [`HTMLTableElement` interface specification](https://html.spec.whatwg.org/multipage/tables.html#htmltableelement)
 * @see [`HTMLTableSectionElement` interface specification](https://html.spec.whatwg.org/multipage/tables.html#htmltablesectionelement)
 * @see [`HTMLTableCaptionElement` interface specification](https://html.spec.whatwg.org/multipage/tables.html#htmltablecaptionelement)
 * @see [`HTMLTableColElement` interface specification](https://html.spec.whatwg.org/multipage/tables.html#htmltablecolelement)
 * @see [`HTMLTableRowElement` interface specification](https://html.spec.whatwg.org/multipage/tables.html#htmltablerowelement)
 * @see [`HTMLTableCellElement` interface specification](https://html.spec.whatwg.org/multipage/tables.html#htmltablecellelement)
 */
export type HTMLTableLikeElement =
	| HTMLTableElement // <table>
	| HTMLTableCaptionElement // <caption>
	| HTMLTableSectionElement // <thead>, <tbody>, <tfoot>
	| HTMLTableColElement // <col>, <colgroup>
	| HTMLTableRowElement // <tr>
	| HTMLTableCellElement; // <td>, <th>

/**
 * Checks if the element is related to a table. It must be one of the following:
 * `<table>`, `<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`
 * or `<tfoot>`
 */
export function isTableLikeElement(element: any): element is HTMLTableLikeElement {
	return element instanceof HTMLTableElement
		|| element instanceof HTMLTableCaptionElement
		|| element instanceof HTMLTableSectionElement
		|| element instanceof HTMLTableColElement
		|| element instanceof HTMLTableRowElement
		|| element instanceof HTMLTableCellElement;
}

/**
* Tries to find a caption/description of the element by getting
* the closest element (listed by highest priority) that matches any of:
* - `HTMLTableCaptionElement`: table caption element (`<caption>`)
* - `HTMLHeadingElement`: heading element (`<h1>` - `<h6>`)
* - soon: checks if the previous element contains an child element
* that is an instance of an HTMLHeadingElement
*
* If it can't find either, it will return an empty string.
*/
export function getTableCaption(table: HTMLTableElement): string {
	if (table.caption !== null) {
		return table.caption.textContent ?? '';
	}

	if (table.previousElementSibling instanceof HTMLHeadingElement) {
		return table.previousElementSibling.textContent ?? '';
	}

	return '';
}

/**
 * This method tries to find the closest parent table element
 * of a table-related element by walking up the DOM tree of a table
 */
export function getClosestParentTable(element: HTMLTableLikeElement): HTMLTableElement|undefined {
	switch (element.tagName) {
	case 'TABLE':
		return element as HTMLTableElement;
	case 'CAPTION':
	case 'COLGROUP':
	case 'THEAD':
	case 'TBODY':
	case 'TFOOT':
		return element.parentElement as HTMLTableElement;
	case 'COL':
		return element.parentElement?.parentElement as HTMLTableElement;
	case 'TR':
		return getClosestParentTableByRow(element as HTMLTableRowElement);
	case 'TD':
	case 'TH':
		return getClosestParentTableByRow(element.parentElement as HTMLTableRowElement);
	default:
		return undefined;
	}
}

/**
 * Attempts to find the closest parent table element (`<table>`),
 * given an instance of a row element (`<tr>`)
 */
export function getClosestParentTableByRow(row: HTMLTableRowElement): HTMLTableElement {
	if (row.parentElement instanceof HTMLTableElement) {
		return row.parentElement;
	}

	return row.parentElement?.parentElement as HTMLTableElement;
}
