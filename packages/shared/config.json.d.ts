declare module '@app/shared/config.json' {
	interface Config {
		FIELDS: {
			NAME_MAX_LENGTH: number
			EMAIL_MAX_LENGTH: number
			CELLPHONE_MAX_LENGTH: number
			DOCUMENT_MAX_LENGTH: number
		}
	}
	const config: Config
	export default config
}
