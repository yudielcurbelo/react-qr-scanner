import isObject from '../utilities/isObject';

import isDateObject from './isDateObject';
import isPrimitive from './isPrimitive';

export default function deepEqual(object1: unknown, object2: unknown) {
	if (isPrimitive(object1) || isPrimitive(object2)) return object1 === object2;

	if (isDateObject(object1) && isDateObject(object2))
		return object1.getTime() === object2.getTime();

	const obj1 = object1 as Record<string, unknown>;
	const obj2 = object2 as Record<string, unknown>;

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) return false;

	for (const key of keys1) {
		const val1 = obj1[key];

		if (!keys2.includes(key)) return false;

		if (key !== 'ref') {
			const val2 = obj2[key];

			if (
				(isDateObject(val1) && isDateObject(val2)) ||
				(isObject(val1) && isObject(val2)) ||
				(Array.isArray(val1) && Array.isArray(val2))
					? !deepEqual(val1, val2)
					: val1 !== val2
			)
				return false;
		}
	}

	return true;
}
