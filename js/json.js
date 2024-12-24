class JsonCanvas extends HTMLElement {
	css = `
<style>
	* {
		color: #cdd6f4;
	}

	.json-container {
		background: #313244;
		display: block;
		min-height: 5rem;

		* {
			color: #cdd6f4;
		}
	}

	.json-array-item, .json-object-property {
		margin-left: 1rem;
		display: block;
	}

	.json-null {
		color: #f2cdcd;
	}

	.json-boolean {
		color: #fab387;
	}

	.json-number {
		color: #89b4fa;
	}

	.json-string {
		color: #a6e3a1;
	}

	.json-object-key {
		color: #b4befe;
	}

	button {
		background: transparent;
	}
</style>
`;
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		const shadow = this.shadowRoot;

		shadow.innerHTML = this.css;

		const container = document.createElement('span');
		container.classList.add('json-container');

		shadow.appendChild(container);
	}

	renderObject(object) {
		const shadow = this.shadowRoot;

		shadow.innerHTML = this.css;

		const container = document.createElement('span');
		container.classList.add('json-container');
		container.appendChild(createElement(object));

		shadow.appendChild(container);
	}
}
customElements.define('json-canvas', JsonCanvas);


function isValueObject(object) {
	return object === undefined
		|| object === null
		|| typeof object === 'string'
		|| typeof object === 'number'
		|| typeof object === 'boolean';


}

function createValueElement(object) {
	console.assert(isValueObject(object), '%o is not a value object', object);
	const valueElement = document.createElement('span');

	if (object == null || object == undefined) {
		valueElement.classList.add('json-null');
		valueElement.innerText = 'null';
	} else if (typeof object === 'boolean') {
		valueElement.classList.add('json-boolean');
		valueElement.innerText = object;
	} else if (typeof object === 'number') {
		valueElement.classList.add('json-number');
		valueElement.innerText = object;
	} else if (typeof object === 'string') {
		valueElement.classList.add('json-string');
		valueElement.innerText = `"${object}"`;
	}

	return valueElement;
}

function createArrayElement(array) {
	console.assert(Array.isArray(array), '%o is not an array', array);
	const arrayElement = document.createElement('span');
	arrayElement.classList.add('json-array');

	const openingElement = document.createElement('span');
	openingElement.innerText = '['
	arrayElement.appendChild(openingElement);

	const buttonElement = document.createElement('button');
	buttonElement.innerText = '-';
	arrayElement.appendChild(buttonElement);

	const itemsElement = document.createElement('span');
	itemsElement.classList.add('json-array-items');
	arrayElement.appendChild(itemsElement);

	buttonElement.addEventListener('click', () => {
		if (buttonElement.innerText === '-') {
			itemsElement.setAttribute('hidden', '');
			buttonElement.innerText = '+';
		} else {
			itemsElement.removeAttribute('hidden');
			buttonElement.innerText = '-';
		}

	});

	var index = 1;
	const numberOfKeys = Object.keys(array).length;
	for (key in array) {
		const itemElement = document.createElement('span');
		itemElement.classList.add('json-array-item');

		const valueElement = createElement(array[key]);
		itemElement.appendChild(valueElement);

		if (index < numberOfKeys) {
			const commaElement = document.createElement('span');
			commaElement.innerText = ','
			itemElement.appendChild(commaElement);
		}

		itemsElement.appendChild(itemElement);
		index++;
	}

	const closingElement = document.createElement('span');
	closingElement.innerText = ']'
	arrayElement.appendChild(closingElement);

	return arrayElement;
}


function createObjectElement(object) {
	console.assert(object != null && object != undefined && typeof object === 'object', '%o is not an object', object);
	const objectElement = document.createElement('span');
	objectElement.classList.add('json-object');

	const openingElement = document.createElement('span');
	openingElement.innerText = '{'
	objectElement.appendChild(openingElement);

	const buttonElement = document.createElement('button');
	buttonElement.innerText = '-';
	objectElement.appendChild(buttonElement);

	const propertiesElement = document.createElement('span');
	propertiesElement.classList.add('json-object-properties');
	objectElement.appendChild(propertiesElement);

	buttonElement.addEventListener('click', () => {
		if (buttonElement.innerText === '-') {
			propertiesElement.setAttribute('hidden', '');
			buttonElement.innerText = '+';
		} else {
			propertiesElement.classList.remove('hidden');
			propertiesElement.removeAttribute('hidden');
			buttonElement.innerText = '-';
		}

	});

	var index = 1;
	const numberOfKeys = Object.keys(object).length;
	for (key in object) {
		const propertyElement = document.createElement('span');
		propertyElement.classList.add('json-object-property');

		const keyElement = document.createElement('span');
		keyElement.classList.add('json-object-key')
		keyElement.innerText = `"${key}"`
		propertyElement.appendChild(keyElement);

		const colonElement = document.createElement('span');
		colonElement.innerText = ':'
		propertyElement.appendChild(colonElement);

		const valueElement = createElement(object[key]);
		propertyElement.appendChild(valueElement);


		if (index < numberOfKeys) {
			const commaElement = document.createElement('span');
			commaElement.innerText = ','
			propertyElement.appendChild(commaElement);
		}

		propertiesElement.appendChild(propertyElement);
		index++;
	}

	const closingElement = document.createElement('span');
	closingElement.innerText = '}'
	objectElement.appendChild(closingElement);

	return objectElement;
}

function createElement(object) {
	if (isValueObject(object)) {
		return createValueElement(object);
	} else if (Array.isArray(object)) {
		return createArrayElement(object);
	}

	return createObjectElement(object);
}

window.addEventListener('load', () => {
	document.querySelectorAll('.json-format-button[input][output]').forEach((button) => {
		button.addEventListener('click', () => {
			const inputElement = document.getElementById(button.getAttribute('input'));
			const outputElement = document.querySelector(`json-canvas#${button.getAttribute('output')}`);

			const object = JSON.parse(inputElement.value);

			outputElement.renderObject(object);
		});
	});
});

