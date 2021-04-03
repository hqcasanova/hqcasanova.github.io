let serialised = '';
for (let envVar in process.env) {
	if (/VUE_APP_SCSS_/i.test(envVar)) {
		serialised += `$${envVar}: ${process.env[envVar]};`;
	}
}

module.exports = {
	css: {
		loaderOptions: {
			sass: {
				prependData: `
          ${serialised}
          @import "@/scss/variables.scss";
          @import "@/scss/functions.scss";
          @import "@/scss/mixins.scss";
        `,
			},
		},
	},
  outputDir : 'docs'
};