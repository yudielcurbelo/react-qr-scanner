import isNullOrUndefined from './isNullOrUndefined';
import { isObjectType } from './isObject';

type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export default (value: unknown): value is Primitive => isNullOrUndefined(value) || !isObjectType(value);
