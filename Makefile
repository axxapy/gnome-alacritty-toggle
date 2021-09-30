.PHONY: gettext dist help schemas
.DEFAULT_GOAL=help
uuid:=$(shell cat metadata.json | jq -r .uuid)

help:  ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[\/a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dist: schemas ## Prepare zip file for extensions.gnome.org
	gnome-extensions pack --force --extra-source LICENSE --extra-source README.md .

schemas: ## Compile glib schemas
	glib-compile-schemas ./schemas/
