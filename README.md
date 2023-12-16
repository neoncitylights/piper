# @neoncitylights/piper
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm (scoped)](https://img.shields.io/npm/v/@neoncitylights/piper)](https://www.npmjs.com/package/@neoncitylights/piper)
[![GitHub deployments](https://img.shields.io/github/deployments/wandering-app/piper/github-pages?label=deploy)](https://github.com/wandering-app/piper/deployments/activity_log?environment=github-pages)
[![Node.js workflow](https://github.com/wandering-app/piper/actions/workflows/main.yml/badge.svg)](https://github.com/wandering-app/piper/actions/workflows/main.yml)

This library provides some utilities for walking through specific HTML elements and turning into machine-readable data.

## Install
```
npm install @neoncitylights/piper
```

## Documentation
[Auto-generated API documentation is available](https://neoncitylights.github.io/ts-piper/).

### API Reference
#### Walker functions
 * `fn`: <a href="#walkDescriptionList">#</a> walkDescriptionList.**walkDescriptionList**<*K*, *V*>(*element*, *termCallback*, *detailsCallback*): *Map<K, V>* • [source](./src/walkDescriptionList.ts)
 * `fn`: <a href="#walkTable">#</a> walkTable.**walkTable**(*table*): *TableRow[][]* • [source](./src/walkTable.ts)

#### Walker helper utilities
 * `T`: <a href="#TableBodies">#</a> walkTable.**TableBodies** • [source](./src/walkTable.ts)
 * `T`: <a href="#TableRow">#</a> walkTable.**TableRow** • [source](./src/walkTable.ts)
 * `C`: <a href="#TableModelError">#</a> walkTable.**TableModelError** • [source](./src/walkTable.ts)
 * `fn`: <a href="#collectProperties">#</a> walkTable.**collectProperties**(*table*): *string*[] • [source](./src/walkTable.ts)
 * `fn`: <a href="#collectTableBodies">#</a> walkTable.**collectTableBodies**(*table*): [*TableBodies*](./src/walkTable.ts) • [source](./src/walkTable.ts)
 * `fn`: <a href="#collectTableRows">#</a> walkTable.**collectTableRows**(*table*): [*TableRow*](src/walkTable.ts) • [source](./src/walkTable.ts)

#### Table utilities
 * `T`: <a href="#HTMLTableRelatedElement">#</a> tableUtils.**HTMLTableRelatedElement** • [source](./src/tableUtils.ts)
 * `fn`: <a href="#isTableRelatedElement">#</a> tableUtils.**isTableRelatedElement**(*element*): *element* is *HTMLTableRelatedElement* • [source](./src/tableUtils.ts)
 * `fn`: <a href="#getTableCaption">#</a> tableUtils.**getTableCaption**(*table*): *string* • [source](./src/tableUtils.ts)
 * `fn`: <a href="#getClosestParentTableElement">#</a> tableUtils.**getClosestParentTableElement**(*element*): *HTMLTableElement*|*undefiend* • [source](./src/tableUtils.ts)
 * `fn`: <a href="#getClosestParentTableElementFromRow">#</a> tableUtils.**getClosestParentTableElementFromRow**(*row*): *HTMLTableElement* • [source](./src/tableUtils.ts)

## Usage
```ts
import { walkDescriptionList, walkTable } from '@neoncitylights/piper';

// walking through a description list
let descListElement = document.querySelector('dl#my-description-list') as HTMLDListElement;
let descList = walkDescriptionList(
	descListElement,
	(term) => term.textContent,
	(details) => details.textContent);

// walking through a table
let timezonesTable = document.querySelector('table') as HTMLTableElement;
let timezones = walkTable(timezonesTable);
```

## Full examples
### Walking through a description list (`<dl>`)
```html
<dl id="prefs">
	<div>
		<dt>Extensions</dt>
		<dd>Remove, install, and change settings of extensions</dd>
	</div>
	<div>
		<dt>Site activity</dt>
		<dd>Learn how visitors are using your site</dd>
	</div>
	<div>
		<dt>Layout and appearance</dt>
		<dd>Change how your site appears to viewers</dd>
	</div>
	<div>
		<dt>Privacy</dt>
		<dd>Decide who is able to access your site</dd>
	</div>
	<div>
		<dt>Security and storage</dt>
		<dd>Backup, update, and protect your site</dd>
	</div>
</dl>
```

```ts
import { walkDescriptionList } from '@neoncitylights/piper';

const prefsElement = document.getElementById('prefs') as HTMLDListElement;
const prefs = walkDescriptionList(prefsElement,
	(term) => term.textContent,
	(details) => details.textContent);
```

```json
{
	"Extensions": "Remove, install, and change settings of extensions",
	"Site activity": "Learn how visitors are using your site",
	"Layout and appearance": "Change how your site appears to viewers",
	"Privacy": "Decide who is able to access your site",
	"Security and storage": "Backup, update, and protect your site."
}
```

### Walking through a table (`<table>`)
```html
<table class="wikitable" id="timezone-examples">
	<thead>
		<tr>
			<th>Name</th>
			<th>Explanation</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><a href="/wiki/America/Costa_Rica">America/Costa_Rica</a></td>
			<td>name of country used because the name of the largest city (and capital city) <a href="/wiki/San_Jos%C3%A9,_Costa_Rica" >San José</a> is <a href="/wiki/San_Jos%C3%A9_(disambiguation)#Places">ambiguous</a></td>
		</tr>
		<tr>
			<td><a href="/wiki/America/New_York">America/New_York</a></td>
			<td>Space replaced with underscore</td>
		</tr>
		<tr>
			<td><a href="/wiki/Asia/Kolkata">Asia/Kolkata</a></td>
			<td>name of city of <a href="/wiki/Kolkata">Kolkata</a> used, because it was the most populous city in the zone at the time the zone was set up, though this is no longer true<sup><a href="#cite_note-17">[17]</a></sup></td>
		</tr>
		<tr>
			<td><a href="/wiki/Asia/Sakhalin">Asia/Sakhalin</a></td>
			<td>name of island used, because largest city, <a href="/wiki/Yuzhno-Sakhalinsk">Yuzhno-Sakhalinsk</a>, has more than 14 characters</td>
		</tr>
		<tr>
			<td><a href="/wiki/America/Bahia_Banderas">America/Bahia_Banderas</a></td>
			<td>"de" removed from <a href="/wiki/Bahia_de_Banderas">Bahia de Banderas</a>, because correct name has more than 14 characters</td>
		</tr>
		<tr>
			<td><a href="/wiki/Antarctica/DumontDUrville">Antarctica/DumontDUrville</a></td>
			<td>the apostrophe is removed. The space would normally be replaced with "_", but the name would then exceed 14 characters.</td>
		</tr>
	</tbody>
</table>
```

```ts
import { walkTable } from '@neoncitylights/piper';

let timezoneTableElement = document.getElementById('timezone-examples') as HTMLTableElement;
let timezoneExamples = walkTable(timezoneTableElement);
```

```json
[
	[
		{
			"Name": "America/Costa_Rica",
			"Explanation": "name of country used because the name of the largest city (and capital city) San José is ambiguous"
		},
		{
			"Name": "America/New_York",
			"Explanation": "Space replaced with underscore"
		},
		{
			"Name": "Asia/Kolkata",
			"Explanation": "name of city of Kolkata used, because it was the most populous city in the zone at the time the zone was set up, though this is no longer true[17]"
		},
		{
			"Name": "Asia/Sakhalin",
			"Explanation": "name of island used, because largest city, Yuzhno-Sakhalinsk, has more than 14 characters"
		},
		{
			"Name": "America/Bahia_Banderas",
			"Explanation": "de removed from Bahia de Banderas, because correct name has more than 14 characters"
		},
		{
			"Name": "Antarctica/DumontDUrville",
			"Explanation": "the apostrophe is removed. The space would normally be replaced with \"_\", but the name would then exceed 14 characters."
		}
	]
]
```

## License
This library is licensed under the [MIT License](./LICENSE).
