

publish:
	rsync -avz --delete --exclude=.git --exclude=Makefile ./public/ oscar:/opt/sites/light.wtf/public/



.PHONY: publish
