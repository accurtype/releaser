import { Package } from '@manypkg/get-packages';
import { FromSchema } from 'json-schema-to-ts';

/**
 * 包描述文件
 */
export type PackageJSON = Package['packageJson'];

type AllTypeJS = string | number | bigint | boolean | Object | Function | Symbol;
type AccurArray<T = any> = readonly [T, ...T[]] | readonly T[];
type AccurObject<T = any> = Record<keyof any, T>;
type AccurFunction<T = any> = (...args: AccurArray<T>) => T;
export type Accur<T = any> = AllTypeJS | AccurArray<T> | AccurObject<T> | AccurFunction<T>;
/**类型层面解析整个值 */
export const toConst = <T extends Accur<T>>(x: T) => x;

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
export type BranchMeta = FromSchema<typeof branchMetaSchema, {
	references: [{
		$id: 'https://json.schemastore.org/package';
		type: 'object';
		format: 'PackageJSON';
	}];
	deserialize: [{
		pattern: {
			$id: 'https://json.schemastore.org/package';
			type: 'object';
			format: 'PackageJSON';
		};
		output: PackageJSON;
	}];
}>;
