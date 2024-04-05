import * as getPackages from '@manypkg/get-packages';
import * as Schema from 'json-schema-to-ts';

export const imported = Boolean(
	getPackages
	&& Schema
);

/**
 * 包描述文件
 * @typedef {getPackages.Package['packageJson']} PackageJSON
 */
/**
 * @typedef {getPackages.Package} Package
 */

/**
 * @typedef {string | number | bigint | boolean | Object | Function | Symbol} AllTypeJS
 */
/**
 * @template [T = any]
 * @typedef {readonly [T, ...T[]] | readonly T[]} AccurArray
 */
/**
 * @template [T = any]
 * @typedef {{ [n: keyof any]: T }} AccurObject
 */
/**
 * @template [T = any]
 * @typedef {(...args: AccurArray<T>) => T} AccurFunction
 */
/**
 * @template [T = any]
 * @typedef {AllTypeJS | AccurArray<T> | AccurObject<T> | AccurFunction<T>} Accur
 */
/**
 * 类型层面解析整个值
 * @template {Accur<T>} T
 * @param {T} x
 */
export const toConst = x => x;

export const branchMetaSchema = toConst({
	$schema: 'http://json-schema.org/draft-07/schema#',
	type: 'object',
	required: ['description', 'dependencies'],
	additionalProperties: false,
	properties: {
		description: { type: 'string' },
		dependencies: {
			type: 'array',
			items: {
				type: 'object',
				required: ['branch', 'path', 'packageJson'],
				additionalProperties: false,
				properties: {
					branch: { type: 'string' },
					path: { type: 'string' },
					packageJson: { $ref: 'https://json.schemastore.org/package' },
				},
			},
		},
	},
});
/**
 * @typedef {Schema.FromSchema<typeof branchMetaSchema, {
 *   references: [{
 *     '$id': 'https://json.schemastore.org/package';
 *     type: 'object';
 *     format: 'PackageJSON';
 *   }];
 *   deserialize: [{
 *     pattern: {
 *       '$id': 'https://json.schemastore.org/package';
 *       type: 'object';
 *       format: 'PackageJSON';
 *     };
 *     output: PackageJSON;
 *   }];
 * }>} BranchMeta
 */
