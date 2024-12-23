function isValueObject(object) {
	return object === undefined 
		|| object === null
		|| typeof object === 'string'
		|| typeof object === 'number'
		|| typeof object === 'boolean';
	

}

function createValueElement(object) {
	let value = 'null';

	if (typeof object === 'string') {
		value = `"${object}"`;
	} else if (typeof object === 'number' || typeof object === 'boolean') {
		value = `${object}`;
	}

	const valueElement = document.createElement('span');
	valueElement.classList.add('json-value');
	valueElement.innerText = value;

	return valueElement;
}

function createArrayElement(object) {
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
			itemsElement.classList.add('hidden');
			buttonElement.innerText = '+';
		} else {
			itemsElement.classList.remove('hidden');
			buttonElement.innerText = '-';
		}

	});

	var index = 1;
	const numberOfKeys = Object.keys(object).length;
	for (key in object) {
		const itemElement = document.createElement('div');
		itemElement.classList.add('json-array-item');

		const valueElement = createElement(object[key]);
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
			propertiesElement.classList.add('hidden');
			buttonElement.innerText = '+';
		} else {
			propertiesElement.classList.remove('hidden');
			buttonElement.innerText = '-';
		}

	});

	var index = 1;
	const numberOfKeys = Object.keys(object).length;
	for (key in object) {
		const propertyElement = document.createElement('div');
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
			const outputElement = document.getElementById(button.getAttribute('output'));

			outputElement.innerHTML = '';

			const object = JSON.parse(inputElement.value);
			const jsonElement = createElement(object);

			outputElement.appendChild(jsonElement);
		});
	});
});

