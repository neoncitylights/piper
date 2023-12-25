const ELEMENT_NAME_DIV = 'DIV';
const ELEMENT_NAME_DT = 'DT';
const ELEMENT_NAME_DD = 'DD';
export type DListFn<T> = (element: HTMLElement) => T;

/**
 * Extracts data from a description list into a map of key-value pairs,
 * where keys store data of a `<dt>`, and values store data of a `<dd>`.
 *
 * This implementation attempts to follow the HTML Standard by the WHATWG
 * as closely as possible.
 * @see https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element
 */
export function walkDescriptionList<K,V>(
	dList: HTMLDListElement|HTMLDivElement,
	termFn: DListFn<K>,
	detailsFn: DListFn<V>,
): Map<K, V> {
	const children: HTMLCollection = dList.children;
	if (children.length === 0) {
		return new Map<K, V>();
	}

	let descriptionList = new Map<K, V>();
	let terms: K[] = [];

	for (const child of children) {
		const elementTagName = child.tagName;
		switch (elementTagName) {
		case ELEMENT_NAME_DT:
			terms.push(termFn(child as HTMLElement));
			break;
		case ELEMENT_NAME_DD:
			if (child.previousElementSibling?.tagName === ELEMENT_NAME_DT) {
				terms.forEach(term => descriptionList.set(
					term,
					detailsFn(child as HTMLElement),
				));
				terms = [];
			}
			break;
		case ELEMENT_NAME_DIV:
			descriptionList = new Map([
				...descriptionList.entries(),
				...walkDescriptionList(
					child as HTMLDivElement,
					termFn,
					detailsFn,
				),
			]);
			break;
		default:
			throw new TypeError(`Expected a <dt>, <dd>, or <div> element; found <${elementTagName}> instead`);
		}
	}

	return descriptionList;
}
