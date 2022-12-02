# HQCasanova - Portfolio

Vue 3 mobile-first app using pure-CSS parallax to provide a brochure-like experience within the routing constraints of GitHub's environment. A learning experiment of sorts, the emphasis is on optimal rendering path, animation performance (Chrome is the baseline) and usability.

For example, routed views are all pre-emptively rendered and stacked so that reflows/repaints are minimised. This in turn means disabling interactions through the relatively new `inert` attribute for all views, except the "current" one.

All without using any component or CSS library. The only plugins used are for adding swipe, intersection observer, inert and clipboard support. Not even for internationalisation, for which I made my own rudimentary JSON-based system: [`en.json`](/docs/en.json) and [`es.json`](/docs/es.json).
Among many others, the most significant limitation of the approach taken is the removal of body scrolling. Further research is required ;D